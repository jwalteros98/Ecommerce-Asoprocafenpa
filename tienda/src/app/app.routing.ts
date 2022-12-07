import { RegistroComponent } from './components/registro/registro.component';
import { DetalleOrdenComponent } from './components/usuario/ordenes/detalle-orden/detalle-orden.component';
import { IndexOrdenesComponent } from './components/usuario/ordenes/index-ordenes/index-ordenes.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { DireccionesComponent } from './components/usuario/direcciones/direcciones.component';
import { Routes, RouterModule} from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { InicioComponent } from "./components/inicio/inicio.component";
import { LoginComponent } from "./components/login/login.component";
import { PerfilComponent } from "./components/usuario/perfil/perfil.component";

import { AuthGuard } from "./guards/auth.guard";
import { IndexProductoComponent } from "./components/productos/index-producto/index-producto.component";
import { ShowProductoComponent } from "./components/productos/show-producto/show-producto.component";
import { CarritoComponent } from "./components/carrito/carrito.component";
import { PagadoComponent } from './components/pagado/pagado.component';


const appRoute : Routes = [ 
    { path: '', component: InicioComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },

    { path: 'cuenta/perfil', component: PerfilComponent, canActivate: [AuthGuard] },
    { path: 'cuenta/direcciones', component: DireccionesComponent, canActivate: [AuthGuard] },
    { path: 'cuenta/ordenes', component: IndexOrdenesComponent, canActivate: [AuthGuard] },
    { path: 'cuenta/ordenes/:id', component: DetalleOrdenComponent, canActivate: [AuthGuard] },
    { path: 'carrito', component: CarritoComponent, canActivate: [AuthGuard] },

    { path: 'productos', component: IndexProductoComponent },
    { path: 'productos/categoria/:categoria', component: IndexProductoComponent },
    { path: 'productos/:slug', component: ShowProductoComponent },

    { path: 'contacto', component: ContactoComponent },
    { path: 'pago-exitoso', component: PagadoComponent, canActivate: [AuthGuard]},
]

export const appRoutingPorviders : any[]=[];
export const routing : ModuleWithProviders<any>= RouterModule.forRoot(appRoute);