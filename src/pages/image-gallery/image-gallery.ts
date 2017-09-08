import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ImageGalleryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-image-gallery',
  templateUrl: 'image-gallery.html',
})
export class ImageGalleryPage {

  images: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.images = this.navParams.get('imageArr');
    // console.log('imagesddddd', this.navParams.get('imageArr'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageGalleryPage');
  }

}
