import { DescuentoService } from './../../../services/descuento.service';
import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-descuento',
  templateUrl: './index-descuento.component.html',
  styleUrls: ['./index-descuento.component.css']
})
export class IndexDescuentoComponent implements OnInit {

  
  public load_data = true;
  public filtro = '';
  public token;
  public descuentos : Array<any> =[];
  public url;
  public page = 1;
  public pageSize = 20;

  public load_btn = false;

  constructor(
    private _descuentoService : DescuentoService
  ) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data(){
    this._descuentoService.listar_descuento_admin(this.filtro, this.token).subscribe(
      response => {
        /*console.log(response);*/
        this.descuentos = response.data;
        
        this.descuentos.forEach(element => {
          var tt_inicio = Date.parse(element.fecha_inicio+"T00:00:00")/1000;
          var tt_fin = Date.parse(element.fecha_fin+"T00:00:00")/1000;

          var today = Date.parse(new Date().toString())/1000;
          
          if(today >=tt_inicio){
            element.estado = 'Expirado'
          }
          if(today <tt_inicio){
            element.estado = 'Proximamente'
          }
          if(today >= tt_inicio && today <= tt_fin){
            element.estado = 'En progreso'
          }

          
          
        });

        this.load_data = false;
      },
      error => {
        /*console.log(error);*/
      }
      
    )
  }

  filtrar(){
    if(this.filtro){
      this._descuentoService.listar_descuento_admin(this.filtro, this.token).subscribe(
        response => {
          /*console.log(response);*/
          this.descuentos = response.data;
          this.load_data = false;
        },
        error => {
          /*console.log(error);*/
        }
        
      )
    }else{
      iziToast.show({ 
        title: 'Error',
        titleColor: '#ff0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Ingrese un valor para filtrar.'
      });
    }
  }

  resetear(){
    this.filtro = '';
    this.init_data();
  }

  eliminar(id: any){
    this.load_btn = true; // disable patch
    this._descuentoService.eliminar_descuento_admin(id, this.token).subscribe(
      response => {
        iziToast.show({  
          messageColor: '#ffffff',
          class: 'text-success',
          position: 'topRight',
          transitionIn: 'bounceInDown',
          transitionOut: 'fadeOutUp',
          backgroundColor: '#008259',
          message: 'Se ha eliminado el producto.'
        });

        $('#delete-'+id).modal('hide'); //ocultar modal
        $('.modal-backdrop').removeClass('show'); //ocultar modal

        this.load_btn = false;

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
