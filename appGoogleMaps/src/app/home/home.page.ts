import { Component, OnInit } from '@angular/core';
import { HomeService } from '../services/home.service';
import { ProductoService } from '../services/producto.service';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingController, NavController } from '@ionic/angular';
//import { Camera} from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import {Chooser, ChooserResult} from '@ionic-native/chooser/ngx';
//import {ImagePicker,ImagePickerOptions} from '@ionic-native/image-picker/ngx';
import {Geolocation, Geoposition} from  '@ionic-native/geolocation/ngx';
import * as L from 'leaflet';
import 'leaflet-control-geocoder';
//import * as ELG from "esri-leaflet-geocoder";
import {PopoverController} from '@ionic/angular';
import {PopovercomponentPage} from '../popovercomponent/popovercomponent.page';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  seleccionarEntrega = "biff";
  seleccionarPago = "biff";
  banderaCargaPantalla:boolean = false;
  mostrarVISA:string = "*********";
  titularTarjeta:string;
  numeroTarjetaVISA:string;
  ciudadSeleccionada:string;
  numeroPiso:number = null;
  numeroDepartamento:string = " ";
  referenciaIngresada:string="";
  nombreCalle:string;
  numeroCalle:string;
  vuelto:number=0;
  modoPago:string = "Efectivo";
  limpiarValore:string = "";
  banderaMonto:boolean = false;
  fecha: Date = new Date();
  fechaSeleccionada:Date = this.fecha;
  montoIngresado:number = 0;
  horaParcial: Date = new Date();
  horaSeleccionada:Date=new Date();
  corregirHora: boolean = false;
  diaSeleccionada:Date=new Date();
  horaModificada:Date = new Date();
  minutosModificados = this.horaModificada.getMinutes()+30;
  horaLoAntesPosible:Date;
  hora:Date;
  horaProgramada:Date;
  selectorFechaVisible: boolean = false;
  selectorTarjetaVisible: boolean = false;
  precio:number = 0;
  producto = [];
  comercio;
  FormReg: FormGroup;
  productoB: String;
  imgURL;
  archivos:any=[];
  previsualizar:string;
  imgValidation:boolean = false;
  validacionImg:string;
  fileObj:ChooserResult;
  mostrarImg:string="";
  images:any[]=[];
  map:L.Map;
  marker;
  latLong=[];
  latInicial:any;
  logInicial:any;
  geocoder = L.Control.Geocoder.nominatim();

  //Formulario del domicilio
  createFormGroupDomicilio() {
    return new FormGroup({
      ciudad: new FormControl('', [Validators.required]),
      calle: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[-a-zA-Z0-9' 'ñÑ]{1,100}$/)]),
      numero: new FormControl('', [Validators.required, Validators.min(1), Validators.max(99999)]),
      piso: new FormControl('', [Validators.min(-2),Validators.max(99)]),
      departamento: new FormControl('', [Validators.min(1) ,Validators.maxLength(2), Validators.pattern(/^[-a-zA-Z0-9' 'ñÑ]{1,2}$/)]),
      referencia: new FormControl('')
    });
  }
  domicilio: FormGroup;
  //Metodo de pago efectivo
  createFormGroupMetodoPagoEfectivo() {
    return new FormGroup({
      efectivo: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9' ']*$/)])
    });
  }
  metodoPagoEfectivo: FormGroup;

  createFormGroupProducto(){
    return new FormGroup({
      nombreProducto: new FormControl('',[Validators.required,Validators.maxLength(50), Validators.minLength(5),Validators.pattern(/^[-a-zA-Z0-9' 'ñÑ]{1,100}$/)])
    });
  }
  productoBuscar: FormGroup;

  //Metodo de pago tarjeta
  createFormGroupMetodoPagoTarjeta() {
    return new FormGroup({
      //numero tarjeta solo empieza en 4 / expiracion MMAA / codSeguridad 3 
      numeroTarjeta: new FormControl('', [Validators.required, Validators.maxLength(16), Validators.minLength(16), Validators.pattern(/^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/)]),
      nombreTarjeta: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[-a-zA-Z' 'ñÑ]{1,100}$/)]),
      expiracion: new FormControl('', [Validators.required, Validators.maxLength(7), Validators.minLength(7), Validators.pattern(/^((0[1-9]|1[0-2])\/?(20[2-9][1-9]|[0-9]{2})|(09|10|11|12)\/?2020)$/)]),
      codSeguridad: new FormControl('', [Validators.required, Validators.max(999), Validators.min(0), Validators.pattern(/^[0-9]{3}$/)]),
    });
  }
  metodoPagoTarjeta: FormGroup;

  constructor(
    private homeService: HomeService,
    private loadingCtrl:LoadingController,
    private productoService: ProductoService,
    private navCtc: NavController,
    private sanitizer:DomSanitizer,
    private chooser:Chooser,
    private geolaction: Geolocation,
    private popover:PopoverController
    //private picker:ImagePicker
    ) {
    this.domicilio = this.createFormGroupDomicilio();
    this.metodoPagoEfectivo = this.createFormGroupMetodoPagoEfectivo();
    this.metodoPagoTarjeta = this.createFormGroupMetodoPagoTarjeta();
    this.productoBuscar = this.createFormGroupProducto();
  }

  CreatePopover(){
    this.popover.create({component:PopovercomponentPage,showBackdrop:true, backdropDismiss:false,componentProps:{tipoError:this.validacionImg}}).then((popoverElement)=>{
      popoverElement.present();
    })
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      spinner:'bubbles',
      message: 'Por favor espere...',
      duration: 2000
    });
    await loading.present();
  }
  resetearFormularioDomicilio(){
    this.domicilio.reset();
  }

  resetearFormularioProducto(){
    this.productoBuscar.reset();
  }

  //Domicilio - metodo de pago
  resetearFormularioPago() {
    this.metodoPagoEfectivo.reset();
    this.metodoPagoTarjeta.reset();
    this.limpiarValore = "";
  }
  get ciudad() {
    return this.domicilio.get('ciudad');
  }
  get calle() {
    return this.domicilio.get('calle');
  }
  get numero() {
    return this.domicilio.get('numero');
  }
  get piso() {
    return this.domicilio.get('piso');
  }
  get departamento() {
    return this.domicilio.get('departamento');
  }

  get referencia() {
    return this.referencia.get('referencia');
  }

  get efectivo() {
    return this.metodoPagoEfectivo.get('efectivo');
  }

  get numeroTarjeta() {
    return this.metodoPagoTarjeta.get('numeroTarjeta');
  }
  get nombreTarjeta() {
    return this.metodoPagoTarjeta.get('nombreTarjeta');
  }
  get expiracion() {
    return this.metodoPagoTarjeta.get('expiracion');
  }
  get codSeguridad() {
    return this.metodoPagoTarjeta.get('codSeguridad');
  }

  get nombreProducto(){
    return this.productoBuscar.get('nombreProducto');
  }


  //Mensajes de error 
  public errorMessages = {
    ciudad: [
      { type: 'required', message: 'Se requiere el nombre de la ciudad' }
    ],
    calle: [
      { type: 'required', message: 'Se requiere el nombre de la calle' },
      { type: 'maxlength', message: 'El nombre de la calle no puede ser mayor a 50 caracteres' },
      { type: 'minlength', message: 'El nombre de la calle debe tener como mínimo 3 caracteres' },
      { type: 'pattern', message: 'El nombre de la calle ingresado no es valido' }
    ],
    numero: [
      { type: 'required', message: 'Se requiere el número del domicilio' },
      { type: 'max', message: 'El número del domicilio no puede ser mayor a 5 caracteres' },
      { type: 'min', message: 'El número del domicilio debe ser mayor a 1' }
    ],
    piso: [
      { type: 'maxlength', message: 'El número de piso no puede ser mayor a 3 caracteres' },
      { type: 'min', message: 'El número de piso debe ser mayor a -2' },
      { type: 'max', message: 'El número de piso debe ser menor a 99' }
    ],
    departamento: [
      { type: 'maxlength', message: 'El número de departamento no puede ser mayor a 2 caracteres' },
      { type: 'min', message: 'El número de departamento debe ser mayor a 0' }
    ],
    efectivo: [
      { type: 'min', message: 'El monto debe ser mayor a 0' },
      { type: 'required', message: 'El monto es requerido' },
      {type:'pattern', message:'Solo se pueden ingresar números'}
    ],

    numeroTarjeta: [
      { type: 'required', message: 'Se requiere el número de tarjeta' },
      { type: 'maxlength', message: 'El número de tarjeta debe ser de 16 caracteres' },
      { type: 'minlength', message: 'El número de tarjeta debe ser de 16 caracteres' },
      { type: 'pattern', message: 'El número de la tarjeta no es valido' }
    ],
    nombreTarjeta: [
      { type: 'required', message: 'Se requiere el nombre del titular de la tarjeta' },
      { type: 'maxlength', message: 'El nombre del titular de la tarjeta debe tener como máximo 50 caracteres' },
      { type: 'minlength', message: 'El nombre del titular de la tarjeta debe tener como mínimo 3 caracteres' },
      { type: 'pattern', message: 'El nombre del titular de la tarjeta ingresado no es valido' }
    ],
    expiracion: [
      { type: 'required', message: 'Se requiere la fecha de expiración de la tarjeta' },
      { type: 'pattern', message: 'Ingrese una fecha valida' }
    ],
    codSeguridad: [
      { type: 'required', message: 'Se requiere el código de seguridad de la tarjeta' },
      { type: 'pattern', message: 'El patron del codigo de la tarjeta es de 3 caracteres' }
    ],
    nombreProducto:[
      { type: 'required', message: 'Se requiere el nombre del producto' },
      { type: 'maxlength', message: 'El nombre del producto no puede ser mayor a 50 caracteres' },
      { type: 'minlength', message: 'El nombre del producto debe tener como mínimo 5 caracteres' },
      { type: 'pattern', message: 'El nombre del producto ingresado no es valido' }
    ]

  };


  //Aca se obtiene el comercio de forma dinamica, llamando a getComercios de "homeService"
  ngOnInit() {
    if (this.banderaCargaPantalla === false) {
      this.recargarPagina();
      this.banderaCargaPantalla = true;
    }
    /*this.picker.hasReadPermission().then((val)=>{
      if(val === false){
        this.picker.requestReadPermission();
      }
    },(err)=>{
      this.picker.requestReadPermission();
    })*/
  }

  /*getCamera(){
    this.camera.getPicture({
      sourceType:this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI
    }).then((res)=>{
      this.imgURL  = res;
    }).catch(e =>{
      console.log(e)
    })
  }*/

  /*getGallery(){
    this.camera.getPicture({
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((res)=>{
      this.imgURL  = 'data:image/jpeg;base64,' + res;
    }).catch(e =>{
      console.log(e)
    })
  }*/

  capturarFoto(evento):any{
    this.previsualizar = "";
    const extensionArchivo = evento.target.files[0].type;
    const sizeArchivo = evento.target.files[0].size;
    const archivoCapturado =  evento.target.files[0];
    if (extensionArchivo === "image/jpeg" ||extensionArchivo === "image/jpg") {
      this.imgValidation = false;
      if (sizeArchivo <= 5000000) {
        this.imgValidation = false;
        this.extraerBase4(archivoCapturado).then((imagen:any) =>{
          this.previsualizar = imagen.base;
          console.log(imagen);
        })
        //this.archivos.push(archivoCapturado);
        console.log(evento.target.files);
        //console.log(evento.target.files.type);
        console.log(extensionArchivo);
      } else {
        this.imgValidation = true;
        this.validacionImg = "El tamaño del archivo supera los 5 mb";
      }
    }
    else{
      this.imgValidation = true;
      this.validacionImg = "Debe seleccionar un archivo '.jpg'";
    }
  }

  extraerBase4 = async ($event:any) => new Promise((resolve, reject)=>{
    try{
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () =>{
        resolve({
          base:reader.result
        });
      };
      reader.onerror = error =>{
        resolve({
          base:null
        });
      };
      
    } catch(e){
      return null;
    }
  })

  pickFile(){
    this.chooser.getFile("image/jpeg").then((value:ChooserResult)=>{
      this.fileObj = value;
      this.mostrarImg = "";
      const text3 = JSON.stringify(this.fileObj.mediaType);
      const text4 = JSON.stringify(this.fileObj.name);
      const text5 = JSON.stringify(this.fileObj.uri);
      let blob = new Blob([this.fileObj.data],{type:"image/jpeg"});
      const text6 = "blob size=" + blob.size;
      
      console.log(text3+text4+text5,text6);
      alert(text3+text4+text5+text6);
      if (blob.type === "image/jpeg" || blob.type === "image/jpg") {
        this.imgValidation = false;
        if (blob.size < 5000000) {
          this.imgValidation = false;
          this.mostrarImg = this.fileObj.dataURI;
        }else{
          this.imgValidation = true;
          this.validacionImg = "El tamaño del archivo supera los 5 mb";
        }
      }else{
        this.imgValidation = true;
        this.validacionImg = "Debe seleccionar un archivo '.jpg'";
      }
    }),(err) =>{
      console.log("error");
    }
  }

  getGeolaction(){
    this.geolaction.getCurrentPosition({
      enableHighAccuracy:true,
      maximumAge:0
    }).then((res:Geoposition)=>{
      console.log(res);
      this.latInicial = res.coords.latitude;
      this.logInicial = res.coords.longitude;
      alert(res.coords.latitude + res.coords.longitude)
    })
  }
  
  getPosition(){
    this.geolaction.getCurrentPosition({
      enableHighAccuracy:true
    }).then((res)=>{
      return this.latLong = [
        res.coords.latitude,
        res.coords.longitude
      ]
    }).then((latLong)=>{
      this.showMarker(latLong);
    })
  }

  showMarker(latLog){
    if(this.marker){
      this.marker.setLatLng(this.latLong,{draggable:true,bubblingMouseEvents:true});
      this.map.setView(latLog);
    }else{
      this.marker = L.marker(latLog,{draggable:true,bubblingMouseEvents:true});
      this.marker.addTo(this.map).bindPopup('Im Here' + this.marker.getLatLng()).openPopup();
      this.map.setView(latLog);
      console.log(this.marker);
    }
  }
  

  capturedPosition(){
    this.marker.addTo(this.map).bindPopup('Im Here' + this.marker.getLatLng()).openPopup();
    const markerJson = this.marker.toGeoJSON();
    console.log(markerJson);
  }
  
  ionViewDidEnter(){
    this.showMap();
   /* var control = L.Control.geocoder({
      placeholder: 'Search here...',
      geocoder: this.geocoder
    }).addTo(this.map);
    this.map.on('click', function(e) {
      control.geocoder.reverse(e.latlng, this.map.options.crs.scale(this.map.getZoom()), function(results) {
        var r = results[0];
        console.log(r);
        if (r) {
          if (this.marker) {
            this.marker
              .setLatLng(r.center)
              .setPopupContent(r.html || r.name)
              .openPopup();
          } else {
            this.marker = L.marker(r.center)
              .bindPopup(r.name)
              .addTo(this.map)
              .openPopup();
          }
        }
      });
    });*/
    /*const searchControl = L.esri.Geocoding.geosearch({providers: [
      L.esri.Geocoding.arcgisOnlineProvider({
        // API Key to be passed to the ArcGIS Online Geocoding Service
        apikey: 'AAPKae6f9ad40725483db012eca25c4e9edbWQWTyM50hrQAqb9KR7GsOPEcvfTXIkTybCIa5NnZSDkjl3FH3YDXDbsTYhQGtUOZ'
      })
    ]});
    const results = new L.LayerGroup().addTo(this.map);
    searchControl
      .on("results", function (data) {
        results.clearLayers();
        for (let i = data.results.length - 1; i >= 0; i--) {
          results.addLayer(L.marker(data.results[i].latlng));
        }
      })
      .addTo(this.map);
      console.log(new ELG.ReverseGeocode());
      this.map.on("click", (e) => {
        new ELG.ReverseGeocode().latlng(e.latlng).run((error, result) => {
          if (error) {
            return;
          }
          if (this.marker && this.map.hasLayer(this.marker))
            this.map.removeLayer(this.marker);
  
          this.marker = L.marker(result.latlng)
            .addTo(this.map)
            .bindPopup(result.address.Match_addr)
            .openPopup();
        });
      });*/
      var _geocoderType = L.Control.Geocoder.nominatim();
      var geocoder = L.Control.geocoder({
        geocoder: _geocoderType
      }).addTo(this.map);
      geocoder.on('markgeocode', function(event) {
        var center = event.geocode.center;
        console.log(center);
        L.marker(center).addTo(this.map);
        this.map.setView(center, this.map.getZoom());
      });
      
  }
  
  showMap(){
    this.getGeolaction();
    this.map = new L.Map('myMap').setView([-31.4172235,-64.1891788],10);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    //L.Control.geocoder().addTo(this.map);
    
  }

  


/*
  pickImage(){
    let options:ImagePickerOptions={
      maximumImagesCount:1,
      outputType:1,
      quality:5
    }
    this.picker.getPictures(options).then((res)=>{
      for(var i = 0;i<res.length;i++){
        let base64OfImage = "data:image/jpeg;base64," + res[i];
        this.images.push(base64OfImage);
      }
    },(err)=>{
        alert(JSON.stringify(err));
    })
  }
*/

  recargarPagina(){
    this.comercio = this.homeService.getComercios();
    this.producto = this.productoService.getProductos(this.comercio.id);
    if (this.minutosModificados > 60) {
      let horaFinal = this.horaModificada.getHours() + 1;
      this.minutosModificados = this.minutosModificados - 60;
      this.hora = new Date(this.fecha.getFullYear(),this.fecha.getMonth(),this.fecha.getDate(),horaFinal,this.minutosModificados,0);
      this.horaLoAntesPosible = this.hora;
      this.horaProgramada = this.hora;
    }
    else{
      this.hora = new Date(this.fecha.getFullYear(),this.fecha.getMonth(),this.fecha.getDate(),this.horaModificada.getHours(),this.minutosModificados,0);
      this.horaLoAntesPosible = this.hora;
      this.horaProgramada = this.hora;
    }
    this.banderaCargaPantalla = false;
  }

  /*recargarComerio(){
    this.presentLoading();
    this.comercio = this.homeService.getComercios();
    this.producto = this.productoService.getProductos(this.comercio.id);
  }*/

  buscarFuncionClick() {
    let buttonPedido = document.querySelector('#mostrarPedido').getAttribute('name');
    let buttonRecargar = document.querySelector('#recargarComercio');
    if (buttonPedido == "mostrarPedido") {
      this.cargarPedido();
    }
    if (buttonPedido == "borrarPedido") {
      this.borrarPedido();
    }
  }
  //Esto sirve para cargar el pedido de forma dinamica en base al comercio que se eligio previamente
  cargarPedido() {
    let vueltas = Math.floor(Math.random() * 5);
    for (let index = 0; index < vueltas; index++) {
      let indice = Math.floor(Math.random() * 7);
      let cantidadPedida = Math.floor(Math.random() * 4);
      if (cantidadPedida == 0) {
        cantidadPedida = 1
      }
      //Por cada producto que pertenece al pedido generado se crea un ion-card
      const ionCard = document.createElement('ion-card');
      const nuevoProducto = document.createElement('ion-card-content');
      nuevoProducto.textContent = "(" + "X " + cantidadPedida + ")  " + this.producto[indice].nombre + ": " + "$" + this.producto[indice].precio;
      ionCard.appendChild(nuevoProducto);
      ionCard.setAttribute("class","animate__animated animate__pulse");
      //Ademas se bloquea el botón para agregar pedidos y se habilita el botón para eliminar el pedido cargado previamente
      let buttonCargarPedido = document.querySelector('#mostrarPedido');
      let iconoButton = document.querySelector('#icono');
      iconoButton.setAttribute("name", "trash-outline");
      iconoButton.setAttribute("color", "danger");
      buttonCargarPedido.setAttribute("name", "borrarPedido");
      let productList = document.querySelector('#productList');
      productList.appendChild(ionCard);
      this.precio += cantidadPedida * this.producto[indice].precio;
    }
    this.calcularCostoTotal(this.precio);
  }

  calcularCostoTotal(costo:number){
    let productList = document.querySelector('#productList');
    if (productList.hasChildNodes()) {
      const ionCard = document.createElement('ion-card');
      const costoDelProducto = document.createElement('ion-card-content');
      const texto = document.createElement('ion-text');
      texto.textContent ="El costo total de su pedido es: $" + costo;
      costoDelProducto.appendChild(texto);
      ionCard.appendChild(costoDelProducto);
      ionCard.setAttribute("class","animate__animated animate__pulse");
      ionCard.setAttribute("color","naranjita");
      productList.appendChild(ionCard);
    }
    
  }

  //Esto sirve para eliminar el pedido cargado previamente y se habilita el botón "para agregar un nuevo pedido" y se bloquea el botón para eliminar pedidos
  borrarPedido() {
    let productList = document.querySelector('#productList');
    while (productList.hasChildNodes()) {
      productList.removeChild(productList.firstChild);
    }
    let buttonCargarPedido = document.querySelector('#mostrarPedido');
    let iconoButton = document.querySelector('#icono');
    iconoButton.setAttribute("name", "add-circle-outline");
    iconoButton.setAttribute("color", "primary");
    buttonCargarPedido.setAttribute("name", "mostrarPedido");
    this.precio = 0;
  }

  ocultarSelectorFecha() {
    this.selectorFechaVisible = false;
  }

  mostrarSelectorFecha() {
    this.selectorFechaVisible = true;
  }

  ocultarSelectorTarjeta() {
    this.selectorTarjetaVisible = false;
    this.resetearFormularioPago();
    this.modoPago = "Efectivo";
    let iconoPago = document.querySelector('#iconoPago');
    iconoPago.setAttribute("name","cash-outline");
  }

  mostrarSelectorTarjeta() {
    this.selectorTarjetaVisible = true;
    this.resetearFormularioPago();
    this.modoPago = "Tarjeta";
    let iconoPago = document.querySelector('#iconoPago');
    iconoPago.setAttribute("name","card-outline");
  }


  cambioFecha(event) {
    let date = new Date(event.detail.value);
    this.diaSeleccionada = new Date(event.detail.value);
    this.fechaSeleccionada = this.diaSeleccionada;
    this.verificarHora(this.horaSeleccionada);
  }

  cambioHora(event) {
    let hourIngresada = new Date(event.detail.value);
    let hourActual = new Date();
    this.horaSeleccionada = hourIngresada;
    if (this.diaSeleccionada.getDate() == this.fecha.getDate()) {
    // esto se tiene q ejecutar nomas cuando diaIngresado==DiaHoy
    if (this.corregirHora == false) {

      if (hourIngresada.getHours() < hourActual.getHours()) {
        this.presentAlertHourInvalid();
        this.corregirHora = true;

      } else {

        if (hourIngresada.getHours() == hourActual.getHours()) {
          if (hourActual.getMinutes() + 31 < hourIngresada.getMinutes()) {
          }
          //todo bien        
          else {
            this.presentAlertMinuteInvalid();
            this.corregirHora = true;
          }
        }else{if (hourActual.getHours()+1==hourIngresada.getHours() && hourActual.getMinutes()>=30 ){
            if(hourIngresada.getMinutes()<hourActual.getMinutes()-30){
              this.presentAlertMinuteInvalid();
              this.corregirHora = true;
            }
          }
        }
      }
    }//aca termina el else grande
    if (this.corregirHora) {
      this.reestablecerValorCampoHora();
    }else{
      this.horaProgramada = event.detail.value;
    }
  }else{
    this.horaProgramada = event.detail.value;
  }
}
verificarHora(hora:Date) {
  let hourIngresada = new Date(hora);
  let hourActual = new Date();
  this.horaSeleccionada = hourIngresada;
  if (this.diaSeleccionada.getDate() == this.fecha.getDate()) {
  // esto se tiene q ejecutar nomas cuando diaIngresado==DiaHoy
  if (this.corregirHora == false) {

    if (hourIngresada.getHours() < hourActual.getHours()) {
      this.presentAlertHourInvalid();
      this.corregirHora = true;

    } else {

      if (hourIngresada.getHours() == hourActual.getHours()) {
        if (hourActual.getMinutes() + 31 < hourIngresada.getMinutes()) {
        }
        //todo bien        
        else {
          this.presentAlertMinuteInvalid();
          this.corregirHora = true;
        }
      }else{if (hourActual.getHours()+1==hourIngresada.getHours() && hourActual.getMinutes()>=30 ){
          if(hourIngresada.getMinutes()<hourActual.getMinutes()-30){
            this.presentAlertMinuteInvalid();
            this.corregirHora = true;
          }
        }
      }
    }
  }//aca termina el else grande
  if (this.corregirHora) {
    this.reestablecerValorCampoHora();
  }else{
  }
}else{
  this.horaProgramada = hora;
}
}
  reestablecerValorCampoHora() {
    let campoHora = document.querySelector('#hora');
    campoHora.setAttribute("value", this.hora.toString());
    this.corregirHora = false;
    this.horaProgramada = this.hora;

  }

  submit() {
    return false
  }
  presentAlertHourInvalid() {
    const alert = document.createElement('ion-alert');
    alert.header = "Hora incorrecta !!";
    alert.subHeader = "Seleccione nuevamente la hora";
    alert.message = "La hora que fue seleccionada es menor a la hora actual";
    alert.buttons = ["Ok"];
    document.body.appendChild(alert);
    return alert.present();
  }
  presentAlertMinuteInvalid() {
    const alert = document.createElement('ion-alert');
    alert.header = "Hora incorrecta !!";
    alert.subHeader = "Seleccione nuevamente la hora";
    alert.message = "No se puede hacer la entrega antes de los 30 min";
    alert.buttons = ["Ok"];
    document.body.appendChild(alert);
    return alert.present();
  }

  validarMonto(event){
    this.montoIngresado = event.detail.value;
    if (this.precio > 0 && this.montoIngresado > 0) {
      if (this.montoIngresado >= this.precio) {
        this.borrarMensajeDeError();
        this.banderaMonto = false;
        this.vuelto=Math.round((this.montoIngresado - this.precio)*100)/100;
      }else{
        if (this.montoIngresado.toString() == '') {
          this.borrarMensajeDeError();
          this.banderaMonto = false;
        }else{
          if (this.banderaMonto == false) {
            const mensaje = document.createElement('label');
            mensaje.textContent = "El monto ingresado es menor al costo del pedido";
            document.querySelector('.error-message2').appendChild(mensaje);
            this.banderaMonto = true;
          }
        }
      }
    }else{
      this.borrarMensajeDeError();
      this.banderaMonto = false;
      this.vuelto = 0;
    }
  }

  borrarMensajeDeError(){
    let mensajeError = document.querySelector('.error-message2');
    while (mensajeError.hasChildNodes()) {
      mensajeError.removeChild(mensajeError.firstChild);
    }
  }
  validarTarjeta(event){
    let numeroTarjetap = event.detail.value;
    if (numeroTarjetap.length == 16) {
      this.recorrerTarjeta();
    }else{
      this.mostrarVISA = "*********";
    }
  }
  recorrerTarjeta(){
    this.mostrarVISA = '*****'+this.numeroTarjetaVISA[12]+this.numeroTarjetaVISA[13]+this.numeroTarjetaVISA[14]+this.numeroTarjetaVISA[15]
  }

  obtenerCiudad(event){
    this.ciudadSeleccionada = event.detail.value;
  }

  confirmarPedido(){
    this.navCtc.navigateBack('/pantalla-confirmacion');
  }

  limpiarCampos(){
    this.ciudadSeleccionada = "  ";   
    this.nombreCalle = "     ";
    this.numeroCalle = "   ";
    this.numeroPiso = null;
    this.numeroDepartamento = " ";
    this.referenciaIngresada = "";
    this.selectorFechaVisible = false;
    this.seleccionarEntrega = "biff";
    this.seleccionarPago = "biff";
    this.selectorTarjetaVisible = false; 
    this.numeroTarjetaVISA=null;
    this.titularTarjeta = null;
    this.productoB= "     ";
  }
  validarRecarga(){
    if (this.precio > 0 && (this.limpiarValore >= this.precio.toString() || this.selectorTarjetaVisible) &&(this.metodoPagoTarjeta.valid || this.metodoPagoEfectivo.valid) && this.domicilio.valid && this.ciudadSeleccionada !== "  " && this.nombreCalle !== "     " && this.numeroCalle !== "   "  && this.limpiarValore !== " ") {
      return true
    }else{
      return false
    }
    
  }

  refrescar(event){
    setTimeout(()=>{
      this.limpiarCampos();
      this.borrarPedido();
      this.presentLoading();
      this.recargarPagina();
      this.domicilio.reset();
      this.metodoPagoEfectivo.reset();
      this.metodoPagoTarjeta.reset();
      this.limpiarValore = " ";
      this.referenciaIngresada = "";
      event.target.complete();
    },1500);
  }
}

