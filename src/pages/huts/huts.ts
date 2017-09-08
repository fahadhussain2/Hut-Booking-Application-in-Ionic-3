import { Component, ViewChild, } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { HutProvider } from '../../providers/hut/hut';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { ImageGalleryPage } from '../../pages/image-gallery/image-gallery';
import { BookingPage } from '../../pages/booking/booking';
import { UserProvider } from '../../providers/user/user';
import { Http } from '@angular/http'

/**
 * Generated class for the HutsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-huts',
  templateUrl: 'huts.html',
})
export class HutsPage {

  @ViewChild(Slides) slides: Slides;

  huts: FirebaseListObservable<any>
  // huts: Array<any>= [];
  myInput: '';
  shouldShowCancel: true;

  constructor(public navCtrl: NavController, public navParams: NavParams,public us: UserProvider, public hs: HutProvider, public afDB: AngularFireDatabase, public http: Http) {
    // hs.retrieveHuts().subscribe(allHuts =>{
    //   this.huts = allHuts
    // })
    this.huts = this.hs.retrieveHuts();
    // setTimeout(()=> {
    //   console.log(this.huts)
    // }, 4000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HutsPage');
  }

  // goToSlide() {
  //   this.slides.slideTo(2, 500);
  // }

  // slideChanged() {
  //   let currentIndex = this.slides.isEnd();
  //   console.log('Current index is', currentIndex);
  // }

  goToImageGallery(images){
    // console.log('images', images);
    this.navCtrl.push(ImageGalleryPage,{imageArr: images});
  }

  checkAvailability(key){
    this.navCtrl.push(BookingPage, {
      key: key
    });
    // this.hs.reservation(key).set({
    //   BookedBy: 
    // })
    // console.log('key', key);
  }

  onInput(event){

  
    console.log('search', event);
    // this.huts = this.hs.searchQuery(event.data);
    this.huts = this.hs.searchQuery(event);
  }

  onCancel(event){
    console.log('cancel', event)
  }
  

}
