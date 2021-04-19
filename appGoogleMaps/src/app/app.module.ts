import { environment } from './../environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
//import { Camera} from '@ionic-native/camera/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BackendModule } from './backend/backend.module';
import {Chooser} from '@ionic-native/chooser/ngx';
//import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {Geolocation} from  '@ionic-native/geolocation/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,BackendModule],
  providers: [
    StatusBar,
    SplashScreen,
    //Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Chooser,
    Geolocation
    //ImagePicker
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
