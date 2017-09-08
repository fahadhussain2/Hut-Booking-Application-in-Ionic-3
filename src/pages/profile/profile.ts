import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions} from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { HutProvider } from '../../providers/hut/hut';
import * as firebase from 'firebase';


/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profilePhoto;
  username:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController,private imagePicker: ImagePicker, private camera: Camera, public loadingCtrl: LoadingController, public hs: HutProvider) {
    this.hs.profilePic = firebase.auth().currentUser.photoURL;
    this.username = firebase.auth().currentUser.displayName;
    console.log('sss',firebase.auth().currentUser)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
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
            this.hs.uploadProfilePic(imageData);           
             
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
              this.hs.uploadProfilePic(imageData)
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

}
