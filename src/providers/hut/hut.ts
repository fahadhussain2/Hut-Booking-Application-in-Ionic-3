import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireModule } from 'angularfire2';
import { Upload } from '../../app/Model/uploadModel'
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import * as firebase from 'firebase';
import { LoadingController } from 'ionic-angular';
import { UserProvider } from '../user/user' 

/*
  Generated class for the HutProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class HutProvider {

  private basePath:string = '/uploads';
  private uploadTask: firebase.storage.UploadTask;
  private uploadTask2: firebase.storage.UploadTask;  
  uploads: FirebaseListObservable<Upload>;
  progress: string;
  loading: any={};
  bookingInfo = {
    bookingDate: '',
    bookedBy: ''
  }
  url: Array<string>=[];
  currentUser:any = '';
  profilePic: any;
  username: any;

  constructor(public http: Http, public afDB: AngularFireDatabase, private af: AngularFireModule, private loadingCtrl: LoadingController, private us: UserProvider) {
    console.log('Hello HutProvider Provider');
  }

  addHut(hutObj){

    var user = firebase.auth().currentUser;

      if(user){
      this.afDB.list('/Huts/').push({
      name: hutObj.name,
      unitNo: hutObj.unitNo,
      address: hutObj.address,
      location: hutObj.location,
      noOfRooms: hutObj.noOfRooms,
      noOfPersons: hutObj.noOfPersons,
      description: hutObj.description,
      lat: hutObj.lat,
      lng: hutObj.lng,
      images: this.url,
      uid: user.uid,
    })
    this.url = [];
      }
    

    // if(this.url.length != 0){
    //   for(var i=0 ; i<this.url.length ; i++){
    //   this.afDB.object('/Huts/Images').set({
    //     url : this.url[i]
    //   })
    // }
    // }
  }

  pushUpload(upload: any) {
    this.loading = this.loadingCtrl.create({
          content: 'Uploading ...',
          spinner: 'dots'
        })
    var dateTime = new Date().getTime();
    var r = (dateTime + Math.random() * 16) % 16 | 0;
    dateTime = Math.floor(dateTime / 16);
    this.loading.present();
    let storageRef = firebase.storage().ref();
    this.uploadTask = storageRef.child('images/' + dateTime).putString(upload, 'base64');
    this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        let progress = (this.uploadTask.snapshot.bytesTransferred / this.uploadTask.snapshot.totalBytes) * 100
        this.progress = Math.round(progress).toFixed(0);
        if(this.progress == '100'){
          this.loading.dismiss();
        }
      },
      (error) => {
        console.log(error)
      },
      ():any => {
        // upload success
        this.url.push(this.uploadTask.snapshot.downloadURL);        
        // let name = upload.file.name
        console.log('download success',this.url);
        // this.saveFileData(upload)
      }
    );
  }
  // private saveFileData(upload: Upload) {
  //   this.afDB.list('Huts/').push(upload);
  // }

  uploadProfilePic(photo){
    this.loading = this.loadingCtrl.create({
      content: 'Uploading ...',
      spinner: 'dots'
    })
var dateTime = new Date().getTime();
var r = (dateTime + Math.random() * 16) % 16 | 0;
dateTime = Math.floor(dateTime / 16);
this.loading.present();
let storageRef = firebase.storage().ref();
this.uploadTask2 = storageRef.child('profilepic/' + dateTime).putString(photo, 'base64');
this.uploadTask2.on(firebase.storage.TaskEvent.STATE_CHANGED,
  (snapshot) =>  {
    let progress = (this.uploadTask2.snapshot.bytesTransferred / this.uploadTask2.snapshot.totalBytes) * 100
    this.progress = Math.round(progress).toFixed(0);
    if(this.progress == '100'){
      this.loading.dismiss();
    }
  },
  (error) => {
    console.log(error)
  },
  ():any => {
    // upload success
    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: user.displayName,
      photoURL: this.uploadTask2.snapshot.downloadURL
    })
    this.profilePic = this.uploadTask2.snapshot.downloadURL; 
    this.username = user.displayName; 
    this.afDB.object('/users/' + user.uid + '/profilePicURL').set(this.profilePic); 
    console.log('download success',this.profilePic);
    // this.saveFileData(upload)
  }
);
  }

  retrieveHuts(){
    return this.afDB.list('/Huts');
  }

  checkAvailability(key, selectedDate){
    return this.afDB.list('/Huts/' + key + '/bookingInfo' , {
      query:{
        orderByChild: 'date',
        equalTo: selectedDate
      }
    });
  }

  reservation(date, key){

      // let bookingInfo = {
      //   bookingDate: date
      // }
       this.afDB.list('/Huts/' + key + '/bookingInfo').push({
        date: date
      });
  }

  sendReviews(key, comment){

    let user = firebase.auth().currentUser;
    if(user){
      console.log('current user', user.uid);
      this.currentUser = user.uid;
    }
    else{
      console.log("not logged in");
    }
    
   return this.afDB.list('/Huts/' + key + '/reviews/').push({
      comment: comment,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      uid: this.currentUser
    })
  }

  retrieveReviews(key){
    return this.afDB.list('/Huts/' + key + '/reviews');
  }

  retrieveReviewsBySpecificUser(key){
    return this.afDB.list('/users/' , {
      query:{
        orderByKey: key,
        equalTo: key
      }
    })
  }

  searchQuery(query){
   return this.afDB.list('Huts',{
      query:{
        orderByChild: 'name',
        startAt: query.target.value,
        endAt: `${query.target.value}\uf8ff`
      }
    })
  }

  retrieveUserSpecificHuts(key){
    let uid = `${key}`;
    return this.afDB.list('/Huts',{
      query:{
        orderByChild: 'uid',
        equalTo: uid
      }
    })
  }

  edit(hutObj, indices, key){
    // if(indices.length){
    //   for(let i=0 ; i<indices.length ; i++){
    //     this.afDB.list('/Huts/' + key + '/images').remove(`${indices[i]}`)
    //   }
    // }

    if(hutObj){
      this.afDB.list('/Huts').update(key,{
        name: hutObj.name,
        address: hutObj.address,
        location: hutObj.location,
        noOfPersons: hutObj.noOfPersons,
        noOfRooms: hutObj.noOfRooms,
        lat: hutObj.lat,
        lng: hutObj.lng,
        rent: hutObj.rent,
        description: hutObj.description
      })
    }
    
  }

  validateHut(unit){
    return this.afDB.list('/Huts',{
      query:{
        orderByChild: 'unitNo',
        equalTo: unit
      }
    })
  }
}
