import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs'
import * as fs from "file-saver";

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  public load_data = true;
  public filtro = '';
  public token;
  public productos : Array<any> =[];
  public arr_productos : Array<any> =[];
  public url;
  public page = 1;
  public pageSize = 20;

  public load_btn = false;

  constructor(
    private _productoService : ProductoService
  ) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data(){
    this._productoService.listar_productos_admin(this.filtro, this.token).subscribe(
      response => {
        /*console.log(response);*/
        this.productos = response.data;
        this.productos.forEach(element =>{
          this.arr_productos.push({
            titulo: element.titulo,
            stock: element.stock,
            precio: element.precio,
            categoria: element.categoria,
            nventas: element.nventas
          })
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
      this._productoService.listar_productos_admin(this.filtro, this.token).subscribe(
        response => {
          /*console.log(response);*/
          this.productos = response.data;
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
    this._productoService.eliminar_producto_admin(id, this.token).subscribe(
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

  donwload_excel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de productos");

    worksheet.addRow(undefined);
    for (let x1 of this.arr_productos){
      let x2 = Object.keys(x1);

      let temp = []
      for (let y of x2){
        temp.push(x1[y])
      }
      worksheet.addRow(temp)
    }

    let fname = 'REP01- ';

    worksheet.columns = [
      { header: 'Producto', key: 'col1', width: 30},
      { header: 'Stock', key: 'col2', width: 15},
      { header: 'Precio', key: 'col3', width: 15},
      { header: 'Categoria', key: 'col4', width: 25},
      { header: 'N. Ventas', key: 'col5', width: 15},
    ] as any;

    workbook.xlsx.writeBuffer().then((data) =>{
      let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');
    });

  }


}
