import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HutProvider } from '../../providers/hut/hut';
import { ImageGalleryPage } from '../../pages/image-gallery/image-gallery';
import { BookingPage } from '../../pages/booking/booking';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
declare var google;

/**
 * Generated class for the GooglemapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-googlemap',
  templateUrl: 'googlemap.html',
})
export class GooglemapPage {

  mapMarker;
  name: String;
  huts: Array<any>;
  currentDateTime = new Date();

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  lat: number = 24.860170;
  lng: number = 66.863662;
  zoom: number = 15;
  reviewsObj ={
    comment: '',
  }
  reviews: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public hs: HutProvider, public afDB: AngularFireDatabase) {
    this.hs.retrieveHuts().subscribe(huts=>{
      // console.log(huts)
      this.huts = huts
      let tmp = [];
      for(var i=0; i<huts.length ; i++){
        
        tmp.push({
          key: huts[i].$key,
          name: huts[i].name,
          unitNo: huts[i].unitNo,
          address: huts[i].address,
          location: huts[i].location,
          noOfRooms: huts[i].noOfRooms,
          description: huts[i].description,
          rent: huts[i].rent,
          lat: huts[i].lat,
          lng: huts[i].lng,
          isOpen: false,
          images: huts[i].images,
          reviews: huts[i].reviews
        })
      }

      this.huts = tmp
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GooglemapPage');
    // this.initMap();
  }

  clickedMarker(key, index){
    this.huts[index].isOpen = true
    this.huts.forEach((value, i) => {
      if(i != index){
        value.isOpen = false;
      }
    });

    this.hs.retrieveReviews(key).subscribe(reviews=>{
      let tmp = [];
      let tmpUser = [];
      var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
      for(let i=0; i<reviews.length ; i++){
        let timeStamp = reviews[i].createdAt;
        let dateObj = new Date(timeStamp);
        let day = dateObj.getDate();
        let month = monthNames[dateObj.getMonth()];
        let year = dateObj.getFullYear();
        let hours = dateObj.getHours();
        let minutes:any = dateObj.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0'+ minutes : minutes;
        let formatedDate = `${day} ${month} ${year} ${hours}` + ':' + `${minutes} ${ampm}`;
        this.hs.retrieveReviewsBySpecificUser(reviews[i].uid).subscribe(username =>{
          let name = username[0].email.split("@")[0];
          console.log('split', username[0])
          this.afDB.object('/users/' + reviews[i].uid ).subscribe(URL =>{
            tmp.push({
              comment: reviews[i].comment,
              createdAt: formatedDate,
              username: name,
              profilePic: URL.profilePicURL
            })
          })
          
        })
        
        
      }
      this.reviews = tmp;
    })

    
  }
  mapClick(){
    console.log('map clicked');
    let flag:boolean = false 
    for(var i=0; i<this.huts.length; i++){
      if(this.huts[i].isOpen){
        this.huts[i].isOpen = false;
      }

    }
  }
  reservation(key){
    this.navCtrl.push(BookingPage,{
      key: key
    })
  }

  viewImageGallery(images){
     this.navCtrl.push(ImageGalleryPage,{
       imageArr: images
     })
  }

  submitReviews(key, index){
    this.hs.sendReviews(key, this.reviewsObj.comment).then(()=>{
      this.huts[index].isOpen = true;
      this.reviewsObj.comment = '';
    });
    this.huts[index].isOpen = true;
    
    // console.log('reviews', index, this.huts[index].isOpen);    
    
  }

}
