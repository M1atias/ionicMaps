import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-pantalla-confirmacion',
  templateUrl: './pantalla-confirmacion.page.html',
  styleUrls: ['./pantalla-confirmacion.page.scss'],
})
export class PantallaConfirmacionPage implements OnInit {

  constructor(public navCtrl:NavController) { }

  ngOnInit() {
    console.log('aca toy')
  }
  presentAlert() {
    const alert = document.createElement('ion-alert');
    alert.message = "Esta user todavia no esta desarrollada !!!";
    alert.buttons = ["Ok"];
    document.body.appendChild(alert);
    return alert.present();
  }

  pedirNuevamente(){
    this.navCtrl.navigateBack('/home');
  }
}
