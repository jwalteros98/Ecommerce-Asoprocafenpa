import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';


declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-contacto',
  templateUrl: './index-contacto.component.html',
  styleUrls: ['./index-contacto.component.css']
})
export class IndexContactoComponent implements OnInit {

  public mensajes : Array<any> = [];
  public load_data = true;
  public page = 1;
  public pageSize = 20;
  public filtro = '';
  public token;

  public load_btn = false;

  constructor(
    private _adminService : AdminService
  ) { 
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.init_Data();
  }

  init_Data(){
    this._adminService.obtener_mensajes_admin(this.token).subscribe(
      response => {        
          this.mensajes = response.data;
          this.load_data = false;             
      }
    );
  }

  cerrar(id:any){
    this.load_btn = true;
    this._adminService.cerrar_mensaje_admin(id,{data:undefined}, this.token).subscribe(
      response => {
        iziToast.show({  
          messageColor: '#ffffff',
          class: 'text-success',
          position: 'topRight',
          transitionIn: 'bounceInDown',
          transitionOut: 'fadeOutUp',
          backgroundColor: '#008259',
          message: 'El mensaje se marco como leido.'
        });
        
        $('#estadoModal-'+id).modal('hide'); //ocultar modal
        $('.modal-backdrop').removeClass('show'); //ocultar modal

        this.init_Data();
        this.load_btn = false;
        
      },
      error => {
        /*console.log(error);*/
      }
    );
  }

}
