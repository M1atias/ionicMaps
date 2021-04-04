import { Injectable } from '@angular/core';
import {Home} from '../models/home.models';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private comercios:Home[] =[
    {
      id: '1',
      title: "McDonald's",
      imgURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/McDonald%27s_logo.svg/220px-McDonald%27s_logo.svg.png'
    },
    {
      id: '2',
      title: "Burger King",
      imgURL: 'https://i.pinimg.com/474x/2d/ba/41/2dba41339b86291b5c11a25cd5342125.jpg'
    },
    {
      id: '3',
      title: "El Candil",
      imgURL: 'https://ubp.beclub.com.ar/content/uploads/business/2/pOfE_Lomitos-El-Candil.jpg'
    },
    {
      id: '4',
      title: "Lo De Jacinto",
      imgURL: 'https://cdn.lavoz.com.ar/sites/default/files/styles/width_1072/public/nota_periodistica/jacinto.jpg'
    }
  ]
  constructor() { }

  //Del array de comercios adheridos se elije 1 de forma dinamica y se retorna el seleccionado
  getComercios(){
    let indice = Math.floor(Math.random() * this.comercios.length);
    return this.comercios[indice]
  }
}
