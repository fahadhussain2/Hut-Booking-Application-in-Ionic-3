import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { hut } from '../../app/Model/hutModel';
import { HutProvider } from '../../providers/hut/hut';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions} from '@ionic-native/camera';  
import * as firebase from 'firebase';
import { LoadingController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';

declare var google;
/**
 * Generated class for the AddhutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addhut',
  templateUrl: 'addhut.html',
})
export class AddhutPage {

  mapMarker;
  name: String;

  hutObj: hut = {
    name: '',
    unitNo: '',
    address: '',
    location: '',
    noOfRooms: 0,
    noOfPersons: 0,
    description: '',
    lat: 0,
    lng: 0,
    rent: 0

  }

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  location: string = "hawk'sbay";
  loading: any ={};
  // editHutObj:hut ={};
  images:Array<any> = [];
  route = '';
  deletingIndexes = [];
  key;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toast: Toast, public actionSheetCtrl: ActionSheetController, public hs: HutProvider, private imagePicker: ImagePicker, private camera: Camera, public loadingCtrl: LoadingController) {
    let hutInfo = this.navParams.get("hutObj");
    this.route = this.navParams.get("route");
    if(this.route == 'edit'){
      this.key = hutInfo.$key;
      this.hutObj.name = hutInfo.name;
      this.hutObj.unitNo = hutInfo.unitNo;
      this.hutObj.address = hutInfo.address;
      this.hutObj.location = hutInfo.location;
      this.hutObj.noOfPersons = hutInfo.noOfPersons;
      this.hutObj.noOfRooms = hutInfo.noOfRooms;
      this.hutObj.description = hutInfo.description;
      this.hutObj.lat = hutInfo.lat;
      this.hutObj.lng = hutInfo.lng;
      this.hutObj.rent = hutInfo.rent;
      this.images = hutInfo.images
    }

  }

  ionViewDidLoad() {
    this.initMap();
    console.log('ionViewDidLoad AddhutPage');
  }

  initMap(){
 
    let latLng = new google.maps.LatLng(24.860170, 66.863662);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


    this.map.addListener('click', (event)=> {

          if(!this.mapMarker){
            var newMarker={
            name: this.name,
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            draggable: true
          }
            this.mapMarker =newMarker ;
            this.hutObj.lat = newMarker.lat;
            this.hutObj.lng = newMarker.lng;
            var marker = new google.maps.Marker({    
            position: event.latLng,    
            map: this.map,
            animation: google.maps.Animation.DROP,
            draggable:true    
          });   
          marker.addListener('dragend', (event)=> {
            var updMarker = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            draggable: true
    }       
    this.mapMarker = updMarker;
    this.hutObj.lat = this.mapMarker.lat;
    this.hutObj.lng = this.mapMarker.lng;
    console.log(this.mapMarker)
    
  });
      }
  
  else{
    // console.log('you already have a marker')
    alert('you already have a marker');
  }

  
    
            
});
 
  }
  
  

  presentActionSheet() {
   let actionSheet = this.actionSheetCtrl.create({
     title: 'Upload Pictures',
     buttons: [
       {
         text: 'Open Camera',
         role: 'camera',
         handler: () => {
           const options: CameraOptions = {
           quality: 75,
           destinationType: this.camera.DestinationType.DATA_URL,
           encodingType: this.camera.EncodingType.JPEG,
           sourceType: this.camera.PictureSourceType.CAMERA,
           targetHeight: 400,
           targetWidth: 300,
           saveToPhotoAlbum: false

          }
           this.camera.getPicture(options).then((imageData) => {
           let base64Image = 'data:image/jpeg;base64,' + imageData;
           this.hs.pushUpload(imageData);           
            
           console.log('woah!!',base64Image)
           }, (err) => {
           console.log('error occured')
           });
         }
       },
       {
         text: 'Open Gallery',
         role: 'gallery',
         handler: () => {
           this.camera.getPicture({
             quality: 100,
             sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
             destinationType: this.camera.DestinationType.DATA_URL
           }).then((imageData) => {
             let base64Image = 'data:image/jpeg;base64,' + imageData;
             let storageRef = firebase.storage().ref();
             this.hs.pushUpload(imageData)
              // let metadata = {
              // contentType: 'image/jpeg'
              // }
            // for (var i = 0; i < images.length; i++) {
            //   console.log('Image URI: ' + images[i]);
            //   let imgName = images[i].split("/tmp_"); 
            //   console.log('imgName', imgName);
            //   let uploadTask = storageRef.child('images/' + imgName[1]).put(imgName[1], metadata);  
            //   storageRef.getDownloadURL().then(url => {
            //     console.log('URL', url);
            //   })            
            // }
          }, (err) => {
            alert(err);
          });
         }
       }
     ]
   });

   actionSheet.present();
 }

 addHut(){
   console.log('data', this.hutObj);
   this.hs.addHut(this.hutObj);
   this.hutObj = {
    name: '',
    unitNo: '',
    address: '',
    location: '',
    noOfRooms: 0,
    noOfPersons: 0,
    description: '',
    lat: 0,
    lng: 0,
    rent: 0
   }
 }

 deleteImg(index){
   this.images.splice(index, 1);
   this.deletingIndexes.push(index);
 }

 save(){
   this.hs.edit(this.hutObj, this.deletingIndexes, this.key);
   this.deletingIndexes = [];
   this.toast.show('your hut has been saved successfully', '4000', 'bottom').subscribe(toast=>{
     console.log(toast);
   })
 }

 validate(){
  //  console.log(this.hutObj.unitNo);
   this.hs.validateHut(this.hutObj.unitNo).subscribe(unitNo=>{
     console.log('this unit is already taken',unitNo);
   });
 }

}