import { ClienteService } from './../../services/cliente.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { io } from "socket.io-client";
import { GuestService } from 'src/app/services/guest.service';
import { ElementRef } from '@angular/core';
import { Router } from '@angular/router';

declare var iziToast: any;
declare var Cleave:any;
declare var StickySidebar:any;
declare var paypal:any;
declare var $ : any;

//pasarela de pago Paypal
interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  
  @ViewChild('paypalButton', { static: true }) paypalElement!: ElementRef;
  public idcliente : any;
  public token : any;

  public carrito_arr : Array<any> = [];
  public url : any;
  public subtotal = 0;
  public total_pagar : any = 0;
  public socket = io('http://localhost:4201');

  public direccion_principal : any = {};
  public envios : Array<any> = [];
  public precio_envio = "0";

  public venta : any = {};
  public dventa : Array<any> = [];

  public error_cupon = '';
  public descuento = 0;

  public descuento_activo : any = undefined;

  public card_data : any = {};
  public btn_load = false;
  public carrito_load = true;
  public user : any = {};

  //conversion de moneda
  public paypal_conv = 0;
  public paypal_conv_rounded = 0; // "S/"
  public paypal_conv_paypal = 0; // "USD"
  public dolar = 4848; //Dolar actual
 

  constructor(
    private _clienteService : ClienteService,
    private _guestService : GuestService,
    private _router : Router
  ) {
    //inicializaciones
    this.idcliente = localStorage.getItem('_id');
    this.venta.cliente = this.idcliente;
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;    

    this._guestService.get_Envios().subscribe(
      response => {  
        this.envios = response;
      }
    );

    this.user = JSON.parse(localStorage.getItem('user_data')!);
  }

  ngOnInit(): void {

    this._guestService.obtener_descuento_activo().subscribe(
      response => { 
        if(response.data != undefined){
          this.descuento_activo = response.data[0];    
        }else{
          this.descuento_activo = undefined;
        }
        
      }
    );

    this.init_Data();
    setTimeout(() =>{
        new Cleave('#cc-number', {
          creditCard: true,
          onCreditCardTypeChanged: function (type: any) {
              // update UI ...
          }
        });

        new Cleave('#cc-exp-date', {
          date: true,
          datePattern: ['m', 'Y']
        });

        var sidebar = new StickySidebar('.sidebar-sticky', {topSpacing: 20});
    });

    this.get_direccion_principal();

    //Inicializando pasarela de pago Paypal
    paypal.Buttons({
      style: {
          layout: 'horizontal'
      },
      createOrder: (data: any,actions:any)=>{
          
          return actions.order.create({
            purchase_units : [{
              description : 'Pago en Asoprocafenpa',
              amount : {
                currency_code : 'USD',
                value: this.paypal_conv_paypal,
              },
            }]
          });        
      },
      onApprove : async (data:any,actions:any)=>{
        const order = await actions.order.capture();
               
        this.venta.transaccion = order.purchase_units[0].payments.captures[0].id;

        this.venta.detalles = this.dventa;
        this._clienteService.registro_compra_cliente(this.venta, this.token).subscribe(
          response => {
            //console.log(response);
            this._clienteService.enviar_correo_compra_cliente(response.venta._id, this.token).subscribe(
              response => {
                this._router.navigate(['/pago-exitoso']);
              }
            );
                    
          }
        );        

      },
      onError : (err: any) =>{
       
      },
      onCancel: function (data:any, actions:any) {
        
      }
    }).render(this.paypalElement.nativeElement);

    //Inicializando pasarela de pago PayU

  }

  init_Data(){
    //obtener el listado del carrito
    this._clienteService.obtener_carrito_cliente(this.idcliente, this.token).subscribe(
      response => {
        this.carrito_arr = response.data;

        this.carrito_arr.forEach(element => {
          this.dventa.push({
            producto: element.producto._id,
            subtotal: element.producto.precio,
            variedad: element.variedad,
            cantidad: element.cantidad,
            cliente: localStorage.getItem('_id')
          });
        });
        
        this.carrito_load = false;       

        this.calcular_carrito();
        this.calcular_total('Envio Gratis');       
      }
    );
  }

  calcular_carrito(){
    this.subtotal = 0;
    if(this.descuento_activo == undefined){
        this.carrito_arr.forEach(element =>{
        this.subtotal = this.subtotal + (parseInt(element.producto.precio) * element.cantidad);
      });
    }else if(this.descuento_activo != undefined){
        this.carrito_arr.forEach(element =>{
          let new_precio = Math.round(parseInt(element.producto.precio) - (parseInt(element.producto.precio) * this.descuento_activo.descuento)/100)  * element.cantidad;
          this.subtotal = this.subtotal  + new_precio;
      });
    }
  }

  eliminar_item(id : any){
    this._clienteService.eliminar_carrito_cliente(id, this.token).subscribe(
      response => {
        iziToast.show({ 
          messageColor: '#ffffff',
          class: 'text-success',
          position: 'topRight',
          transitionIn: 'bounceInDown',
          transitionOut: 'fadeOutUp',
          backgroundColor: '#008259',
          message: 'Se eliminó el producto de tu carrito.'
        });
        this.socket.emit('delete-carrito', {data:response.data});
        this.init_Data();
        
      }
    );
  }

  get_direccion_principal() {
    this._clienteService.obtener_direccion_principal_cliente(localStorage.getItem('_id'), this.token).subscribe(
      response => {
        if (response.data == undefined){
          this.direccion_principal = undefined;
        } else {
          this.direccion_principal = response.data;
          this.venta.direccion = this.direccion_principal._id;
        }
        
      }
    );
  }

  calcular_total(envio_titulo:any){
    
    this.total_pagar = parseInt(this.subtotal.toString()) + parseInt(this.precio_envio);
    this.venta.subtotal = this.total_pagar;
    this.venta.envio_precio = parseInt(this.precio_envio);
    this.venta.envio_titulo = envio_titulo;
    //cambios dolar
    this.paypal_conv = parseInt(this.total_pagar) / parseInt(this.dolar.toString());
    this.paypal_conv_paypal = parseFloat(this.paypal_conv.toFixed(2)); //usd/cop
    this.paypal_conv_rounded = Math.round(this.paypal_conv); //para redondear s/cop
  }

  validar_cupon(){
    if(this.venta.cupon){
      if(this.venta.cupon.toString().length <= 25){
        //si es valido
        
        this._clienteService.validar_cupon_admin(this.venta.cupon, this.token).subscribe(
          response => {
            if(response.data != undefined){
              //si hay descuento
              this.error_cupon = '';
              if(response.data.tipo == 'valor fijo'){
                this.descuento = response.data.valor;
                this.total_pagar = this.total_pagar - this.descuento;
              }else if (response.data.tipo == 'Porcentaje') {
                this.descuento = (this.total_pagar * response.data.valor)/100;
                this.total_pagar = this.total_pagar - this.descuento;
              }
              $(document).ready(function(){
                $("#button-js").click(function(){
                  $('#button-js').addClass('aplicarcupon');
                });
                $("#button-js").click(function(){
                  $('#tituloap').removeClass('testing');
                });
              });
             
            }else{
              this.error_cupon = 'El cupon no se pudo canjear';
            }
          }
        );
      }else{
        //no es valido
        this.error_cupon = 'El cupon debe ser menos de 25 caracteres';
      }
    }else{
      this.error_cupon = 'El cupon no es valido';
    }
  }

  get_token_culqui(){
    
    let month;
    let year;
    let exp_arr = this.card_data.exp.toString().split('/');
    //recibir los datos de la tarjeta
    let data = {
      "card_number": this.card_data.ncard.toString().replace(/ /g, ''),
      "cvv": this.card_data.cvc,
      "expiration_month": exp_arr[0],
      "expiration_year": exp_arr[1].toString().substr(0,4),
      "email": this.user.email,
      /*"metadata": {
        "dni": this.user.dni,
        }*/
    }
    this.btn_load = true;
    this._clienteService.get_token_culqui(data).subscribe(
      response => {

        //emitimos los cargos de la compra
        let charge = {
          "amount": this.paypal_conv_rounded+'00',
          "currency_code": "USD",
          "email": this.user.email,
          "source_id": response.id,
        }
        this._clienteService.get_charge_culqui(charge).subscribe(
          response => {
            this.venta.transaccion = response.id;

            this.venta.detalles = this.dventa;
            this._clienteService.registro_compra_cliente(this.venta, this.token).subscribe(
              response => {
                //console.log(response);
                this._clienteService.enviar_correo_compra_cliente(response.venta._id, this.token).subscribe(
                  response => {
                    this._router.navigate(['/pago-exitoso']);
                  }
                );
                        
              }
            );       
            this.btn_load = false;
          }
        );
        
      }
    );
  }
  



}
