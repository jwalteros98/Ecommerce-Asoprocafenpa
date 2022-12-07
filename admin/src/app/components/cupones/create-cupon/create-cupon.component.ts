import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast: any;

@Component({
  selector: 'app-create-cupon',
  templateUrl: './create-cupon.component.html',
  styleUrls: ['./create-cupon.component.css']
})
export class CreateCuponComponent implements OnInit {

  public token : any;
  public cupon : any = {
    tipo: ''
  };
  public load_btn = false;

  constructor(
    private _cuponService : CuponService,
    private _router: Router
  ) { 
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
  }


  registro(registroForm : any){
    if(registroForm.valid){
      this.load_btn = true;
      this._cuponService.registro_cupon_admin(this.cupon, this.token).subscribe(
        response => {
          /*console.log(response);*/
          iziToast.show({ 
            messageColor: '#ffffff',
            class: 'text-success',
            position: 'topRight',
            transitionIn: 'bounceInDown',
            transitionOut: 'fadeOutUp',
            backgroundColor: '#008259',
            message: 'Se ha registrado el cupón.'
          });
          this.load_btn = false;

          this._router.navigate(['/panel/cupones']);
          

        },
        error => {
          /*console.log(error);*/
          this.load_btn = false;
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
