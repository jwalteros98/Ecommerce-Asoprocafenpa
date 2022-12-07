import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClientesService } from 'src/app/services/clientes.service';

declare var iziToast: any;

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css']
})
export class EditClienteComponent implements OnInit {

  public cliente : any = {};
  public id: any;
  public token:any;
  public load_btn = false;
  public load_data = true;


  constructor(
    private _route : ActivatedRoute,
    private _clienteService : ClientesService,
    private _adminService : AdminService,
    private _router : Router
  ) { 
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        
        this._clienteService.obtener_cliente_admin(this.id, this.token ).subscribe(
          response => {
            /*console.log(response);*/
            if(response.data == undefined){
              this.cliente = undefined;
              this.load_data = false;
              
              
            }else{
              this.cliente = response.data;
              this.load_data = false;              
            }
            
          }, 
          (error) => {

          }
        );
      }
    )
  }

  actualizar(updateForm:any){
    if (updateForm.valid) {
      this.load_btn = true; // disable patch
      this._clienteService.actualizar_cliente_admin(this.id, this.cliente, this.token).subscribe(
        response => {
          iziToast.show({ 
            messageColor: '#ffffff',
            class: 'text-success',
            position: 'topRight',
            transitionIn: 'bounceInDown',
            transitionOut: 'fadeOutUp',
            backgroundColor: '#008259',
            message: 'Se actualizó el cliente.'
          });

          this.load_btn = false;
      
          //this._router.navigate(['/panel/clientes']); // Redirigir a la lista de clientes
        }, error => {
          /*console.log(error);*/
        }
      );
    } else {
      
      iziToast.show({ 
        messageColor: '#ffffff',         
        class: 'text-danger',
        position: 'topRight',
        transitionIn: 'bounceInDown',
        transitionOut: 'fadeOutUp',
        backgroundColor: '#eb3f69',
        timeout: 2500,
        message: 'los datos del formulario no son validos.'
      });

      
    }
  }

}
