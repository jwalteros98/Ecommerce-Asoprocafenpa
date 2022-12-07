import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { GuestService } from 'src/app/services/guest.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public token: any;
  public id: any;
  public user: any = undefined;
  public user_lc : any = {};
  public config_global : any = {};
  public op_cart = false;
  public url : any;

  //constructor() { }

  constructor(
    private _clienteService : ClienteService,
    private _router : Router,
    private _guestService : GuestService,
  ) {
    //INICIALIZACIONES 
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');
    this.url = GLOBAL.url;
    
    //listar mis categorias
    this._clienteService.obtener_config_publico().subscribe(
      response =>{
        this.config_global = response.data;                
      }
    );
    
    //validar si esta logeado
    if(localStorage.getItem('user_data')){
      this.user_lc = JSON.parse(localStorage.getItem('user_data')!); //CORREGIR
    }else{
      this.user_lc = undefined;
    }

    //loguear si existe un token
    if(this.token){
      this._clienteService.obtener_cliente_guest(this.id, this.token).subscribe(
        response => {
  
          this.user = response.data;
          localStorage.setItem('user_data', JSON.stringify(this.user));
          if(localStorage.getItem('user_data')){
            this.user_lc = JSON.parse(localStorage.getItem('user_data')!);

            //obtener el listado del carrito
            
            
          }else{
            this.user_lc = undefined;
          }
        },
        error => {
          this.user = undefined;
        }
      );
    }
  }

  ngOnInit(): void {
  }

  logout(){
    window.location.reload();
    localStorage.clear();
    this._router.navigate(['/']);
  }


}
