import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public dataBase:AngularFirestore) { }
  
  createDoc(data:any, path: string, id:string){
    const collection = this.dataBase.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc(path:string, id:string){
    const collection = this.dataBase.collection(path);
    return collection.doc(id).valueChanges();
  }

  deleteDoc(path:string, id:string){
    const collection = this.dataBase.collection(path);
    return collection.doc(id).delete();
  }

  updateDoc(path:string, id:string,data:any){
    const collection = this.dataBase.collection(path);
    return collection.doc(id).update(data);
  }
}
