import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent implements OnInit {

  public producto : any = {
    categoria: ''
  };
  public file : any = undefined;
  public imgSelect : any | ArrayBuffer = 'assets/img/01.jpg';
  public config : any = {};
  public token : any;
  public load_btn = false;
  public config_global : any = {};

  constructor(
    private _productoService : ProductoService,
    private _adminService: AdminService,
    private _router : Router
  ) {
    this.config = {
      height: 500
    }
    this.token = this._adminService.getToken();
    this._adminService.obtener_config_publico().subscribe(
      response =>{
        this.config_global = response.data;
        
      }
    );
   }

  ngOnInit(): void {
  }

  registro(registroForm: any){
    if(registroForm.valid){
      if(this.file == undefined){
        iziToast.show({ 
          title: 'ERROR',
          titleColor: '#ff0000',
          class: 'text-danger',
          position: 'topRight',
          transitionIn: 'bounceInDown',
          message: 'Debe seleccionar una imagen'
        });
      }else{
        /*console.log(this.producto);
        console.log(this.file);*/
        this.load_btn = true; // disable patch
        this._productoService.registro_producto_admin(this.producto, this.file, this.token).subscribe(
          response => {
            iziToast.show({
              message: 'Se ha registrado el producto.', 
              messageColor: '#ffffff',
              class: 'text-success',
              position: 'topRight',
              transitionIn: 'bounceInDown',
              transitionOut: 'fadeOutUp',
              backgroundColor: '#008259',             
            });
            this.load_btn = false;

            this._router.navigate(['/panel/productos'])

          },
          error => {
            /*console.log(error);*/
            this.load_btn = false;
          }
          
        );
      }

      
    }else{
      iziToast.show({
        message: 'Debe completar todos los campos',
        messageColor: '#ffffff',         
        class: 'text-danger',
        position: 'topRight',
        transitionIn: 'bounceInDown',
        transitionOut: 'fadeOutUp',
        backgroundColor: '#eb3f69',
        timeout: 2500      
      });
      this.load_btn = false;

      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;
    }
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

        const reader = new FileReader();
        reader.onload = e => this.imgSelect = reader.result;
        /*console.log(this.imgSelect);*/

        reader.readAsDataURL(file);

        $('#input-portada').text(file.name);
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

        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect = 'assets/img/01.jpg';
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

      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;
    }

    /*console.log(this.file);*/
  }
}
