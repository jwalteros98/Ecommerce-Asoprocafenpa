import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GuestService } from 'src/app/services/guest.service';

declare var jQuery: any;
declare var $: any;
declare var iziToast: any;

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css']
})
export class DireccionesComponent implements OnInit {

  public token: any;
  public direccion : any = {
    pais: 'Colombia',
    region: '',
    provincia: '',
    distrito: '',
    principal: false
  };

  public direcciones : Array<any> = [];
  public load_data = true;

  public regiones : Array<any> = [];
  public provincias : Array<any> = [];
  public distritos : Array<any> = [];
  

  constructor(
    private _guestService : GuestService,
    private _clienteService : ClienteService
  ) { 
    this.token = localStorage.getItem('token');    
  }

  ngOnInit(): void {
    this.obtener_direccion();    
  }

  /*select_pais(){
    if(this.direccion.pais == 'Colombia'){
      $('#sl-region').prop('disabled', false);
      this._guestService.get_Regiones().subscribe(
        response =>{
          console.log(response);          
          response.forEach((element:any) => {
            this.regiones.push({
              id: element.id,
              name: element.name,
            })
          });
          console.log(this.regiones); 
        }
      );
    }else{
      $('#sl-region').prop('disabled', true);
      this.regiones = [];
    }
  }*/

  /*select_region(){
    $('#sl-provincia').prop('disabled', false);
    this._guestService.get_Regiones().subscribe(
      response =>{               
        response.forEach((element:any) => {
          this.provincias.push({
            ciudades: element.ciudades,            
          })
        });
        console.log(this.provincias);
         
      }
    );
  }*/

  obtener_direccion(){
    this._clienteService.obtener_direccion_todos_cliente(localStorage.getItem('_id'), this.token).subscribe(
      response => {
        this.direcciones = response.data;
        this.load_data = false;        
      }
    );
  }

  registrar(registroForm:any){
    if(registroForm.valid){
      let data = {
        destinatario: this.direccion.destinatario,
        dni: this.direccion.dni,
        zip: this.direccion.zip,
        direccion: this.direccion.direccion,
        telefono: this.direccion.telefono,
        pais: this.direccion.pais,
        region: this.direccion.region,
        provincia: this.direccion.provincia,        
        principal: this.direccion.principal,
        cliente: localStorage.getItem('_id')
      }
      this._clienteService.registro_direccion_cliente(data, this.token).subscribe(
        response => {          
          this.direccion = {
            pais: 'Colombia',
            region: '',
            provincia: '',
            distrito: '',
            principal: false
          };
          iziToast.show({ 
            messageColor: '#ffffff',
            class: 'text-success',
            position: 'topRight',
            transitionIn: 'bounceInDown',
            transitionOut: 'fadeOutUp',
            backgroundColor: '#008259',
            message: 'La nueva dirección se agrego correctamente.'
          });
          this.obtener_direccion();
        }
      );   
    }else{
      iziToast.show({ 
        messageColor: '#ffffff',         
        class: 'text-danger',
        position: 'topRight',
        transitionIn: 'bounceInDown',
        transitionOut: 'fadeOutUp',
        backgroundColor: '#eb3f69',
        timeout: 2500,
        message: 'Complete todos los campos!'
      });
    }
  }

  establecer_principal(id:any){
    this._clienteService.cambiar_direccion_principal_cliente(id,localStorage.getItem('_id'),this.token).subscribe(
      response =>{        
        iziToast.show({ 
          messageColor: '#ffffff',
          class: 'text-success',
          position: 'topRight',
          transitionIn: 'bounceInDown',
          transitionOut: 'fadeOutUp',
          backgroundColor: '#008259',
          message: 'Se actualizó la dirección principal'
        });
        this.obtener_direccion();
      }
    );
  }

}
