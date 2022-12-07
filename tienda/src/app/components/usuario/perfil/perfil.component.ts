import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

declare var jQuery: any;
declare var $: any;
declare var iziToast: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public cliente : any = {};
  public id : any;
  public token : any;

  constructor(
    private _clienteService : ClienteService
  ) {
    this.id = localStorage.getItem('_id');
    this.token = localStorage.getItem('token');

    if(this.id){
      this._clienteService.obtener_cliente_guest(this.id, this.token).subscribe(
        response => {
          this.cliente = response.data;
        }
      );
    }
   }

  ngOnInit(): void {
  }

  actualizar(actualizarForm: any){
    if(actualizarForm.valid){
      this.cliente.password = $('#input_password').val();
      this._clienteService.actualizar_perfil_cliente_guest(this.id, this.cliente, this.token).subscribe(
        response =>{
          iziToast.show({ 
            messageColor: '#ffffff',
            class: 'text-success',
            position: 'topRight',
            transitionIn: 'bounceInDown',
            transitionOut: 'fadeOutUp',
            backgroundColor: '#008259',
            message: 'Se actualizó correctamente los datos.'
          });
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

}
