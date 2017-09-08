import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HutProvider } from '../../providers/hut/hut';
import * as firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take'

/**
 * Generated class for the BookingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {

  myDate = new Date().toISOString();
  key: string = '';
  currentUser;
  enableBookButton:boolean = false

  constructor(public navCtrl: NavController, public navParams: NavParams, public hs: HutProvider, public us: UserProvider, public alertCtrl: AlertController) {
    this.key = this.navParams.get("key");
    console.log('userrr', this.us.currentUser);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingPage');
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Already Booked',
      subTitle: 'Sorry! your selected date is not available',
      buttons: ['OK']
    });
    alert.present();
  }

  checkAvailability(){
    let bookedDates = [];
    let selectedDate = this.myDate.split("T");  
    // console.log('faddu',selectedDate)
    this.hs.checkAvailability(this.key, selectedDate[0]).take(1).subscribe(bookingInfo=>{
      if(bookingInfo.length >= 1){
        this.showAlert();
        this.enableBookButton = false;
      }
      else{
        console.log('not booked')
        this.enableBookButton = true;
      }
    });
  }

  bookMe(){
    let selectedDate = this.myDate.split("T");      
    this.hs.reservation(selectedDate[0], this.key);
  }

}
