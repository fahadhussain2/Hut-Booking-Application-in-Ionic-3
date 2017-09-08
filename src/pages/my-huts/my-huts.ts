import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase'; 
import { AngularFireDatabase } from 'angularfire2/database';
import { HutProvider } from '../../providers/hut/hut';
import { FirebaseListObservable} from 'angularfire2/database';
import { AddhutPage } from '../../pages/addhut/addhut'


/**
 * Generated class for the MyHutsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-huts',
  templateUrl: 'my-huts.html',
})
export class MyHutsPage {

  huts:FirebaseListObservable<any>;
  showComments: boolean = false;
  reviews:any ;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afDb: AngularFireDatabase, public hs: HutProvider) {
    let user = firebase.auth().currentUser;
    this.huts = hs.retrieveUserSpecificHuts(user.uid)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyHutsPage');
  }

  toggleComments(){
    if(this.showComments){
      this.showComments = false
    }
    else{
    this.showComments = true;    
    }
  }

  getComments(key){
    console.log(key);
    if(this.showComments){
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
            this.afDb.object('/users/' + reviews[i].uid ).subscribe(URL =>{
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
    else{
      console.log('no')
    }
  }

  edit(hutObj){
    console.log('hut obj',hutObj);
    this.navCtrl.push(AddhutPage,{
      hutObj: hutObj,
      route: 'edit'
    })
  }

}
