import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { GuestService } from 'src/app/services/guest.service';

declare var iziToast: any;

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  public user: any = {};
  public usuario: any = {};

  public token: any;
  public new_user : any = {};

  constructor(
    private _clienteService: ClienteService,
    private _router: Router,
    private _guestService:GuestService,
  ) { 
    this.token = localStorage.getItem('token');
    if(this.token){
      this._router.navigate(['/']);
    }
  }

  ngOnInit(): void {
  }

  registro(registroForm:any){
    if(registroForm.valid){
     
      if(this.new_user.password.length <=5){
        iziToast.show({ 
          messageColor: '#ffffff',         
          class: 'text-danger',
          position: 'topRight',
          transitionIn: 'bounceInDown',
          transitionOut: 'fadeOutUp',
          backgroundColor: '#eb3f69',
          timeout: 2500,
          message: 'La contraseña debe tener mas de 5 caracteres'
        });
      }else{
        console.log(this.new_user);
        
        this._guestService.registro_cliente(this.new_user).subscribe(
          response=>{
            console.log(response);
            
            if(response.data != undefined){
              iziToast.show({
                  messageColor: '#ffffff',
                  class: 'text-success',
                  position: 'topRight',
                  transitionIn: 'bounceInDown',
                  transitionOut: 'fadeOutUp',
                  backgroundColor: '#008259',
                  message: 'Se registro correctamente en Asoprocafenpa.'
              });
              this.user.email = this.new_user.email;
              this.user.password = this.new_user.password;
              //this.login(this.user.email);
              //this.login(this.user.password);
            }else{
              iziToast.show({
                messageColor: '#ffffff',         
                class: 'text-danger',
                position: 'topRight',
                transitionIn: 'bounceInDown',
                transitionOut: 'fadeOutUp',
                backgroundColor: '#eb3f69',
                timeout: 2500,
                message: response.message
            });
            }
          }
        );
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
        message: 'Los datos del formulario no son validos'
      });
    }
  }

}
