import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { HutsPage } from '../huts/huts';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../../pages/login/login';
import { AddhutPage } from '../../pages/addhut/addhut';
import { UserProvider } from '../../providers/user/user';
import { HutProvider } from '../../providers/hut/hut';
import { GooglemapPage } from '../../pages/googlemap/googlemap';
import { ProfilePage } from '../../pages/profile/profile';
import { MyHutsPage } from '../../pages/my-huts/my-huts'

/**
 * Generated class for the MenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  rootPage: any = {};

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth, private us: UserProvider, private hs: HutProvider) {
    us.isUserAuthenticated();
    us.getCurrentUser();
    if(localStorage.getItem("userObj")){
      this.rootPage = HutsPage 
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  ionViewCanEnter(){
    // console.log('ionviewcanenter', this.us.getCurrentUser());    
    if(!this.us.isAuthenticated){
      setTimeout(()=> {
        this.platform.ready().then(()=>{
          this.platform.registerBackButtonAction(()=>{
            navigator['app'].exitApp();
          })
        })       
      }, 2000);

      return false
    }
    else{
      return true;
    }
  }

  openPage(screenInfo){
    if(screenInfo == "All Huts"){
      this.navCtrl.push(HutsPage);
    }
    if(screenInfo == "logout"){
      this.us.logout();
      this.afAuth.auth.signOut().then(()=> {
        console.log('successfully logged out');
        this.navCtrl.push(LoginPage,{
          logoutFlag: true
        });
        localStorage.removeItem("userObj");
      }).catch(function(error) {
        alert('Something wrong');
      });
    }

    if(screenInfo == "Add New Hut"){
      this.navCtrl.push(AddhutPage)
    }

    if(screenInfo == "Google Map"){
      this.navCtrl.push(GooglemapPage)
    }

    if(screenInfo == "Profile Settings"){
      this.navCtrl.push(ProfilePage);
    }

    if(screenInfo == 'My Huts'){
      this.navCtrl.push(MyHutsPage)
    }
  }

}