import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { io } from "socket.io-client";
import { GuestService } from 'src/app/services/guest.service';


declare var $: any;
declare var noUiSlider: any;
declare var iziToast: any;


@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  public token: any;
  public config_global: any = {};
  public filter_categoria = '';
  public productos : Array<any> = [];
  public filter_producto = '';
  public load_data = true;
  public url : any;
  public filter_cat_productos = 'todos';
  public route_categoria : any;
  public page = 1;
  public pageSize = 20;
  public sort_by = 'Defecto';
  public carrito_data : any = {
    variedad : '',
    cantidad : 1
  };
  public btn_cart = false;
  public socket = io('http://localhost:4201');

  public descuento_activo : any = undefined;

  public user_lc : any = {};
  public user: any = undefined;
  public id: any;
  

  constructor(
    private _clienteService : ClienteService,
    private _route : ActivatedRoute,
    private _guestService : GuestService,
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._clienteService.obtener_config_publico().subscribe(
      response =>{
        this.config_global = response.data;                
      }
    )

    this._route.params.subscribe(
      params => {
        this.route_categoria = params['categoria'];
        
        if(this.route_categoria){
          this._clienteService.listar_productos_publico('').subscribe(
            response => {
              this.productos = response.data;
              this.productos = this.productos.filter(item => item.categoria.toLowerCase() == this.route_categoria);   
              this.load_data = false;              
            }
          );
        }else{
          this._clienteService.listar_productos_publico('').subscribe(
            response => {
              
              this.productos = response.data;
              this.load_data = false;              
            }
          );
        }
      }
    );

    /*this._clienteService.listar_productos_publico(this.filter_producto).subscribe(
      response => {
        this.productos = response.data;
        this.load_data = false;        
      }
    );*/

    //validar si esta logeado
    if(localStorage.getItem('user_data')){
      this.user_lc = JSON.parse(localStorage.getItem('user_data')!); //CORREGIR
    }else{
      this.user_lc = undefined;
    }

    //loguear si existe un token
    if(this.token){
      this._clienteService.obtener_cliente_guest(this.id, this.token).subscribe(
        response => {
  
          this.user = response.data;
          localStorage.setItem('user_data', JSON.stringify(this.user));
          if(localStorage.getItem('user_data')){
            this.user_lc = JSON.parse(localStorage.getItem('user_data')!);

            //obtener el listado del carrito
            
          }else{
            this.user_lc = undefined;
          }
        },
        error => {
          this.user = undefined;
        }
      );
    }
  

   }

  ngOnInit(): void {
    var slider : any = document.getElementById('slider');
    noUiSlider.create(slider, {
        start: [0, 50000],
        connect: true,
        range: {
            'min': 0,
            'max': 50000
        },
        tooltips: [true,true],
        pips: {
          mode: 'count', 
          values: 6,
          
        }
    })

    slider.noUiSlider.on('update', function (values: any) {      
        $('.cs-range-slider-value-min').val(values[0]);
        $('.cs-range-slider-value-max').val(values[1]);
    });
    $('.noUi-tooltip').css('font-size','11px');


    this._guestService.obtener_descuento_activo().subscribe(
      response => { 
        if(response.data != undefined){
          this.descuento_activo = response.data[0];    
        }else{
          this.descuento_activo = undefined;
        }
        
      }
    );
  }

  buscar_categorias(){

    this._clienteService.listar_productos_publico(this.filter_producto).subscribe(
      response => {
        this.productos = response.data;
        this.load_data = false;
        
      }
    );
    
    if(this.filter_categoria){
      var search = new RegExp(this.filter_categoria, 'i');
      this.config_global.categorias = this.config_global.categorias.filter(
        (item: any ) => search.test(item.titulo)
      );
    }else{
      this._clienteService.obtener_config_publico().subscribe(
        response =>{
          this.config_global = response.data;
                    
        }
      );
    }
    
  }

  buscar_producto(){
    this._clienteService.listar_productos_publico(this.filter_producto).subscribe(
      response => {
        this.productos = response.data;
        this.load_data = false;
      }
    );
  }

  buscar_precios(){
    this._clienteService.listar_productos_publico(this.filter_producto).subscribe(
      response => {
        this.productos = response.data;
        
        let min = parseInt($('.cs-range-slider-value-min').val());
        let max = parseInt($('.cs-range-slider-value-max').val());

        console.log(min);
        console.log(max);
        
        this.productos = this.productos.filter((item)=>{
          return item.precio >= min && item.precio <= max
        });
      }
    );  
  }

  buscar_por_categoria(){
    if (this.filter_cat_productos == 'todos') {
      this._clienteService.listar_productos_publico(this.filter_producto).subscribe(
        response => {
          this.productos = response.data;
          this.load_data = false;
          
        }
      );
    } else {
      this._clienteService.listar_productos_publico(this.filter_producto).subscribe(
        response => {
          this.productos = response.data;
          this.productos = this.productos.filter(item => item.categoria == this.filter_cat_productos);
          this.load_data = false;           
        }
      );
      
    }
    
  }

  reset_productos(){
    this.filter_producto = '';
    this._clienteService.listar_productos_publico('').subscribe(
      response => {
        
        this.productos = response.data;
        this.load_data = false;              
      }
    );
  }

  orden_por(){
    if(this.sort_by == 'Defecto'){
      this._clienteService.listar_productos_publico('').subscribe(
        response => {
          
          this.productos = response.data;
          this.load_data = false;              
        }
      );
    }else if(this.sort_by == 'Popularidad'){
      this.productos.sort(function(a, b){
        if(a.nventas < b.nventas){
          return 1;
        }
        if(a.nventas > b.nventas){
          return -1;
        }
        return 0;
      });
    }else if(this.sort_by == '+-Precio'){
      this.productos.sort(function(a, b){
        if(a.precio < b.precio){
          return 1;
        }
        if(a.precio > b.precio){
          return -1;
        }
        return 0;
      });
    }else if(this.sort_by == '-+Precio'){
      this.productos.sort(function(a, b){
        if(a.precio > b.precio){
          return 1;
        }
        if(a.precio < b.precio){
          return -1;
        }
        return 0;
      });
    }else if(this.sort_by == 'azTitulo'){
      this.productos.sort(function(a, b){
        if(a.titulo > b.titulo){
          return 1;
        }
        if(a.titulo < b.titulo){
          return -1;
        }
        return 0;
      });
    }else if(this.sort_by == 'zaTitulo'){
      this.productos.sort(function(a, b){
        if(a.titulo < b.titulo){
          return 1;
        }
        if(a.titulo > b.titulo){
          return -1;
        }
        return 0;
      });
    }
  }

  agregar_producto(producto:any){
    let data = {
      producto: producto._id,
      cliente: localStorage.getItem('_id'),
      cantidad: 1,
      variedad: this.carrito_data.variedad,
    }
    this.btn_cart = true;
    this._clienteService.agregar_carrito_cliente(data, this.token).subscribe(
      response => {
        if(response.data == undefined){
          iziToast.show({ 
            messageColor: '#ffffff',         
            class: 'text-danger',
            position: 'topRight',
            transitionIn: 'bounceInDown',
            transitionOut: 'fadeOutUp',
            backgroundColor: '#eb3f69',
            timeout: 2500,
            message: 'El producto ya existe en el carrito'
          });
          this.btn_cart = false;
        }else{          
          iziToast.show({ 
            messageColor: '#ffffff',
            class: 'text-success',
            position: 'topRight',
            transitionIn: 'bounceInDown',
            transitionOut: 'fadeOutUp',
            backgroundColor: '#008259',
            message: 'Se agrego el producto al carrito.'
          });
          this.socket.emit('add-carrito-add', {data:true})
          this.btn_cart = false;
        }
      }
    );

    
  }

  

}
