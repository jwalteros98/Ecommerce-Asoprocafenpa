import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ClientesService } from 'src/app/services/clientes.service';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrls: ['./index-cliente.component.css']
})
export class IndexClienteComponent implements OnInit {

  public clientes : Array <any> = [];
  public filtro_apellidos : string = '';
  public filtro_correo : string = '';

  public page = 1;
  public pageSize = 20;
  public token;
  public load_data = true;

  constructor(
    private _clienteService: ClientesService,
    private _adminService: AdminService
  ) { 
    this.token = this._adminService.getToken();
    
  }

  ngOnInit(): void {
    this.init_Data();
  }

  init_Data(){
    this._clienteService.listar_clientes_filtro_admin(null, null, this.token).subscribe(
      response => {

        this.clientes = response.data;
        this.load_data = false;

      },
      error => {
        /*console.log(error);*/
      }
    );
  }


  filtro(tipo: any){
      
      if (tipo == 'apellidos') {
        this.load_data = true; // disable patch
        if (this.filtro_apellidos) {
          this._clienteService.listar_clientes_filtro_admin(tipo, this.filtro_apellidos, this.token).subscribe(
            response => {
              this.clientes = response.data; 
              this.load_data = false;   
            },
            error => {
              /*console.log(error);*/
              
            }
          );
        }else{
          this.init_Data();
        }
      }else if (tipo == 'correo') {
        if (this.filtro_correo){
          this.load_data = true; // disable patch
          this._clienteService.listar_clientes_filtro_admin(tipo, this.filtro_correo, this.token).subscribe(
            response => {
      
              this.clientes = response.data;
              this.load_data = false;
              
      
            },
            error => {
              /*console.log(error);*/

            }
          );
        }else{
          this.init_Data();
        }
      }

    
    
  }

  eliminar(id: any){
    this._clienteService.eliminar_cliente_admin(id, this.token).subscribe(
      response => {
        iziToast.show({  
          messageColor: '#ffffff',
          class: 'text-success',
          position: 'topRight',
          transitionIn: 'bounceInDown',
          transitionOut: 'fadeOutUp',
          backgroundColor: '#008259',
          message: 'Se ha eliminado el cliente.'
        });
        
        $('#delete-'+id).modal('hide'); //ocultar modal
        $('.modal-backdrop').removeClass('show'); //ocultar modal

        this.init_Data(); //aqui es para que se actualice el listado
      },
      error => {
        /*console.log(error);*/
      }
    );
  }

}
