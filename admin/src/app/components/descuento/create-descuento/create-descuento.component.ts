import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { DescuentoService } from 'src/app/services/descuento.service';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-create-descuento',
  templateUrl: './create-descuento.component.html',
  styleUrls: ['./create-descuento.component.css']
})
export class CreateDescuentoComponent implements OnInit {

  public descuento : any = {};
  public file : any = undefined;
  public imgSelect : any | ArrayBuffer = 'assets/img/01.jpg';
  public token : any;
  public load_btn = false;

  constructor(
    private _adminService : AdminService,
    private _descuentoService : DescuentoService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
   }

  ngOnInit(): void {
  }

  registro(registroForm:any){
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
        if(this.descuento.descuento >= 1 && this.descuento.descuento <= 100){
          this.load_btn = true; // disable patch
          this._descuentoService.registro_descuento_admin(this.descuento, this.file, this.token).subscribe(
            response => {
              iziToast.show({
                message: 'Se ha registrado el descuento.', 
                messageColor: '#ffffff',
                class: 'text-success',
                position: 'topRight',
                transitionIn: 'bounceInDown',
                transitionOut: 'fadeOutUp',
                backgroundColor: '#008259',             
              });
              this.load_btn = false;

              this._router.navigate(['/panel/descuento'])

            },
            error => {
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
