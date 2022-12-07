import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClientesService } from 'src/app/services/clientes.service';

declare var iziToast: any;

@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html',
  styleUrls: ['./create-cliente.component.css']
})
export class CreateClienteComponent implements OnInit {

  public cliente : any = {
    genero: ''
  };
  public token: any;
  public load_btn = false;

  constructor(
    private _clientesService: ClientesService,
    private _adminService: AdminService,
    private _router: Router
  ) { 
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
  }

  registro(registroForm: any){
    if(registroForm.valid){
      /*console.log(this.cliente);*/
      this.load_btn = true; // disable patch
      this._clientesService.registro_cliente_admin(this.cliente, this.token).subscribe(
        response => {
          /*console.log(response);*/
          iziToast.show({ 
            messageColor: '#ffffff',
            class: 'text-success',
            position: 'topRight',
            transitionIn: 'bounceInDown',
            transitionOut: 'fadeOutUp',
            backgroundColor: '#008259',
            message: 'Se ha registrado el cliente.'
          });
          this.cliente = {
            genero: '',
            nombre: '',
            apellido: '',
            f_nacimiento: '',
            telefono: '',
            dni: '',
            email: '',
          }

          this.load_btn = false; // enable patch
          
          this._router.navigate(['/panel/clientes']);
        },
        error => {
          /*console.log(error);*/
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
        message: 'Debe completar todos los campos'
      });
    }
  }

}
