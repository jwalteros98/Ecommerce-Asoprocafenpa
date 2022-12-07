import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { DescuentoService } from 'src/app/services/descuento.service';
import { GLOBAL } from 'src/app/services/GLOBAL';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-edit-descuento',
  templateUrl: './edit-descuento.component.html',
  styleUrls: ['./edit-descuento.component.css']
})
export class EditDescuentoComponent implements OnInit {

  public descuento : any = {};
  public file : any = undefined;
  public imgSelect : any | ArrayBuffer = 'assets/img/01.jpg';
  public token : any;
  public load_btn = false;

  public id : any;
  public url : any;

  constructor(
    private _adminService : AdminService,
    private _descuentoService : DescuentoService,
    private _router: Router,
    private _route : ActivatedRoute
  ) {
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url;
   }

  ngOnInit(): void {
    this._route.params.subscribe(
      params =>{
        this.id = params['id'];
        /*console.log(this.id);*/
        
        this._descuentoService.obtener_descuento_admin(this.id, this.token).subscribe(
          response => {
            if(response.data == undefined){
              this.descuento = undefined;
            }else{
              this.descuento = response.data;
              this.imgSelect = this.url+'obtener_banner_descuento/'+this.descuento.banner;
              
            }

          },
          error => {
            /*console.log(error);*/
          }
        );

      }
    );
  }

  actualizar(actualizarForm:any){
    if(actualizarForm.valid){

      if(this.descuento.descuento >= 1 && this.descuento.descuento <= 100){
        var data : any= {};

        if (this.file != undefined) {
          data.banner = this.file;
        }

        data.titulo = this.descuento.titulo;
        data.fecha_inicio = this.descuento.fecha_inicio;
        data.fecha_fin = this.descuento.fecha_fin;
        data.descuento = this.descuento.descuento;

        this.load_btn = true; // disable patch
        this._descuentoService.actualizar_descuento_admin(data, this.id, this.token, ).subscribe(
          response => {
            /*console.log(response);*/
            iziToast.show({ 
              messageColor: '#ffffff',
              class: 'text-success',
              position: 'topRight',
              transitionIn: 'bounceInDown',
              transitionOut: 'fadeOutUp',
              backgroundColor: '#008259',
              message: 'Descuento actualizado correctamente'
            });

            this.load_btn = false;
            this._router.navigate(['/panel/descuento'])

          },
          error =>{
            /*console.log(error);*/
            this.load_btn = false;
          } 
        );
      }else{
        iziToast.show({
          message: 'El descuento debe ser entre 0% a 100%',
          messageColor: '#ffffff',         
          class: 'text-danger',
          position: 'topRight',
          transitionIn: 'bounceInDown',
          transitionOut: 'fadeOutUp',
          backgroundColor: '#eb3f69',
          timeout: 2500      
        });
        this.load_btn = false;
      }

    }else{
      iziToast.show({ 
        messageColor: '#ffffff',         
        class: 'text-danger',
        position: 'topRight',
        transitionIn: 'bounceInDown',
        transitionOut: 'fadeOutUp',
        backgroundColor: '#eb3f69',
        timeout: 2500,
        message: 'Complete todos los campos',
      });
      this.load_btn = false;
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
        message: 'Debe seleccionar una imagen'
      });
    }

    if (file.size <= 4000000) {
      if(file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/gif'){

        const reader = new FileReader();
        reader.onload = e => this.imgSelect = reader.result;
        console.log(this.imgSelect);

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
          message: 'El archivo debe ser una imagen'
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
        message: 'La imagen debe pesar menos de 4MB'
      });

      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;
    }

    /*console.log(this.file);*/
  }

}
