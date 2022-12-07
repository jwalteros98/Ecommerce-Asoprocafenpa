import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import { v4 as uuidv4 } from 'uuid';


declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-galeria-producto',
  templateUrl: './galeria-producto.component.html',
  styleUrls: ['./galeria-producto.component.css']
})
export class GaleriaProductoComponent implements OnInit {

  public producto : any = {};
  public id : any;
  public token : any;

  public file : File | any = undefined;
  public load_btn = false;
  public url;
  public load_btn_eliminar = false;

  constructor(
    private _route : ActivatedRoute,
    private _productoService : ProductoService
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params =>{
        this.id = params['id'];
        
        this.init_data();

      }
    );
   }

  init_data() {
    this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
      response => {
        if(response.data == undefined){
          this.producto = undefined;
        }else{
          this.producto = response.data;          
          
        }
      },
      error => {
        
      }
    );
  }

  ngOnInit(): void {
  }


  fileChangeEvent(event: any): void {
    var file : any;

    if (event.target.files && event.target.files[0]) {
      file = <File>event.target.files[0];
      
    } else {
      iziToast.show({ 
        messageColor: '#ffffff',         
        class: 'text-danger',
        position: 'topRight',
        transitionIn: 'bounceInDown',
        transitionOut: 'fadeOutUp',
        backgroundColor: '#eb3f69',
        timeout: 2500,
        message: 'Debe seleccionar una imagen.'
      });
    }

    if (file.size <= 4000000) {
      if(file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/gif'){


        this.file = file;

      }else{
        iziToast.show({ 
          messageColor: '#ffffff',         
          class: 'text-danger',
          position: 'topRight',
          transitionIn: 'bounceInDown',
          transitionOut: 'fadeOutUp',
          backgroundColor: '#eb3f69',
          timeout: 2500,
          message: 'El archivo debe ser una imagen.'
        });
        $('#input-img').val('');
        /*$('#input-portada').text('Seleccionar imagen');*/
        this.file = undefined;
      }
    } else {
      iziToast.show({ 
        messageColor: '#ffffff',         
        class: 'text-danger',
        position: 'topRight',
        transitionIn: 'bounceInDown',
        transitionOut: 'fadeOutUp',
        backgroundColor: '#eb3f69',
        timeout: 2500,
        message: 'La imagen debe pesar menos de 4MB.'
      });

      $('#input-img').val('');
      /*$('#input-portada').text('Seleccionar imagen');*/
      this.file = undefined;
    }

    /*console.log(this.file);*/
  }

  subir_imagen(){
    if(this.file != undefined){
      let data = {
        imagen: this.file,
        _id: uuidv4()
      }
      
      this._productoService.agregar_imagen_galeria_admin(this.id, data, this.token).subscribe(
        response =>{
          this.init_data();
          $('#input-img').val('');
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
        message: 'Debe seleccionar una imagen'
      });
    }
  }

  eliminar(id: any){
    this.load_btn_eliminar = true; // disable patch
    this._productoService.eliminar_imagen_galeria_admin(this.id, {_id:id}, this.token).subscribe(
      response => {
        iziToast.show({  
          messageColor: '#ffffff',
          class: 'text-success',
          position: 'topRight',
          transitionIn: 'bounceInDown',
          transitionOut: 'fadeOutUp',
          backgroundColor: '#008259',
          message: 'Se eliminó correctamente la imagen.'
        });

        $('#delete-'+id).modal('hide'); //ocultar modal
        $('.modal-backdrop').removeClass('show'); //ocultar modal

        this.load_btn_eliminar = false;

        this.init_data(); //aqui es para que se actualice el listado
      },
      error => {
        /*console.log(error);*/
        iziToast.show({
          message: 'ha ocurrido un error con el servidor', 
          messageColor: '#ffffff',         
          class: 'text-danger',
          position: 'topRight',
          transitionIn: 'bounceInDown',
          transitionOut: 'fadeOutUp',
          backgroundColor: '#eb3f69',
          timeout: 2500, 
        });

        this.load_btn = false;
      }
    );
  }

}
