import { Component, OnInit } from '@angular/core';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css']
})
export class IndexCuponComponent implements OnInit {

  public cupones : Array<any> = [];
  public load_data = true;
  public page = 1;
  public pageSize = 20;
  public filtro = '';
  public token;

  constructor(
    private _cuponService: CuponService
  ) { 
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
      response => {
        this.cupones = response.data;
        this.load_data = false;
      }
    );
  }

  filtrar(){
    this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
      response => {
        this.cupones = response.data;
        this.load_data = false;
      }
    );
  }

  eliminar(id: any){
    this._cuponService.eliminar_cupon_admin(id, this.token).subscribe(
      response => {
        iziToast.show({  
          messageColor: '#ffffff',
          class: 'text-success',
          position: 'topRight',
          transitionIn: 'bounceInDown',
          transitionOut: 'fadeOutUp',
          backgroundColor: '#008259',
          message: 'Se ha eliminado el cupón.'
        });
        
        $('#delete-'+id).modal('hide'); //ocultar modal
        $('.modal-backdrop').removeClass('show'); //ocultar modal

        this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
          response => {
            this.cupones = response.data;
            this.load_data = false;
          }
        );
      },
      error => {
        /*console.log(error);*/
      }
    );
  }

}
