import { Injectable } from '@angular/core';
import{Producto} from '../models/producto.models';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  productoDevolver:Producto[]
  private productosMC:Producto[] =[
    {
      nombre:'Mac Papas',
      precio: 50
    },
    {
      nombre: 'Hamburguesa Triple con Queso',
      precio:70
    },
    {
      nombre: 'Cajita Feliz',
      precio:92
    },
    {
      nombre: 'Big Mac',
      precio:171
    },
    {
      nombre: 'Mac Trio Grande Cuarto de Libra Lechuga Tomate y Tocino',
      precio:125
    },
    {
      nombre: 'Mac Pollo',
      precio:55
    },
    {
      nombre: 'Promo Hamburguesa de Queso x 4',
      precio:94
    }
  ];

  private productosJacinto:Producto[] =[
    {
      nombre:'Pizza Muzzarella',
      precio: 120
    },
    {
      nombre: 'Pizza 4 Queso',
      precio:130
    },
    {
      nombre: 'Pizza Cantimpalo',
      precio:150
    },
    {
      nombre: 'Pizza de Matambre',
      precio: 30
    },
    {
      nombre: 'Lasagna de Pollo y Verdura',
      precio: 200
    },
    {
      nombre: 'Lasagna de Carne y Verdura',
      precio: 250
    },
    {
      nombre: '6 Empanadas de Carne Picante',
      precio: 270
    },
    {
      nombre: '6 Empanadas de Jamon y Queso',
      precio: 200
    },
    {
      nombre: '6 Empanadas de Pollo',
      precio: 215
    },
    {
      nombre: '6 Empanadas de Matambre',
      precio: 240
    },
    {
      nombre: '6 Empanadas de Palmitos',
      precio: 210
    },
    {
      nombre: 'Lasagna de Carne y Verdura',
      precio: 250
    },
    {
      nombre: '12 Empanadas de Carne Cortada a Cuchillo',
      precio: 470
    },
    {
      nombre: '12 Empanadas de Jamon y Tomate',
      precio: 400
    },
    {
      nombre: '12 Empanadas de Pollo y Champignones',
      precio: 415
    },
    {
      nombre: '12 Empanadas de Verduras',
      precio: 340
    },
    {
      nombre: '12 Empanadas de Berenjena y Queso',
      precio: 410
    },
    {
      nombre: 'Gaseosa Pepsi 1.5 L',
      precio: 130
    },
    {
      nombre: 'Jugo Baggio',
      precio: 50
    },
    {
      nombre: 'Agua sin Gas 500 ml',
      precio: 80
    }
  ];
  private productosCandil:Producto[] =[
    {
      nombre:'Lomito Super con Huevo',
      precio: 250
    },
    {
      nombre: 'Lomito de Pollo completo',
      precio: 200
    },
    {
      nombre: 'Lomito Vegetariano',
      precio: 220
    },
    {
      nombre: 'Lomito Vegetariano con Huevo',
      precio: 200
    },
    {
      nombre: 'Hamburguesa Candil',
      precio: 230
    },
    {
      nombre: 'Lomito Vegetariano al Plato',
      precio: 200
    },
    {
      nombre: 'Lomito Super con Huevo al Plato',
      precio: 230
    },
    {
      nombre: 'Bife al Plato',
      precio: 180
    },
    {
      nombre: 'Papas Fritas',
      precio: 70
    },
    {
      nombre: 'Papas con Huevo',
      precio: 100
    },
    {
      nombre: 'Papas con Cheddar',
      precio: 100
    },
    {
      nombre: 'Gaseosa linea Coca Cola 1.5 L',
      precio: 130
    },
    {
      nombre: 'Jugo Cepita',
      precio: 50
    },
    {
      nombre: 'Agua Saborizada 500 ml',
      precio: 80
    }
  ];

  private productosBK:Producto[] =[
    {
        nombre: 'Combo BK Staker Triple',
        precio: 540
    },
    {
        nombre: 'Combo BK Staker Cuadruple',
        precio: 600
    },
    {
        nombre: 'Combo Extra Burger',
        precio: 500
    },
    {
        nombre: 'Combo Extra Burger XL',
        precio: 580
    },
    {
        nombre: 'Combo BK Nugggets (10 piezas)',
        precio: 450
    },
    {
        nombre: 'Cajita mágica con hamburgesa con queso',
        precio: 430
    },
    {
        nombre: 'Cajita mágica con BK Nuggets (4 unidades)',
        precio: 430
    },
    {
        nombre: 'Hamburgesa con queso',
        precio: 150
    },
    {
        nombre: 'Papas con cheddar',
        precio: 130
    },
    {
        nombre: 'Papas fritas regulares',
        precio: 150
    },
    {
        nombre: 'Papas fritas medianas',
        precio: 170
    },
    {
        nombre: 'Papas fritas King',
        precio: 190
    },
    {
        nombre: 'Aros de cebolla regulares',
        precio: 160
    },
    {
        nombre: 'Muffin dulce de leche',
        precio: 100
    },
    {
        nombre: 'King Mix Rocklets XL',
        precio: 190
    }
    ]
  constructor() { }

  //Se recibe como parametro el ID del comercio seleccionado previamente y en base a eso se selecciona un array de productos
  getProductos(id:string){
    if (id=='1') {
      this.productoDevolver = this.productosMC
    };
    if (id=='2') {
      this.productoDevolver = this.productosBK
    };
    if (id =='3') {
      this.productoDevolver = this.productosCandil
    };
    if (id=='4') {
      this.productoDevolver = this.productosJacinto
    };
    return this.productoDevolver
  }
}
