import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignupPage } from '../../pages/signup/signup';
import { UserProvider } from '../../providers/user/user';
import { LoadingController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { ListPage } from '../../pages/list/list';
import { MenuPage } from '../../pages/menu/menu'
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database'

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

   loginObj = {
    email: '',
    password: ''
  };
  loading:any ={};
  splash = true;
  flag;

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,public us: UserProvider, public afAuth: AngularFireAuth, public afDB:AngularFireDatabase) {
    this.flag = this.navParams.get("logoutFlag")
  }

  gotoSignup(){
    console.log('go to signup')
    this.navCtrl.push(SignupPage)
  }

  login(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait ...',
      spinner: 'dots'
    })

    if(this.loginObj.email.trim() != "" && this.loginObj.password.trim() != ""){
      this.us.login();
      this.loading.present();
      this.afAuth.auth.signInWithEmailAndPassword(this.loginObj.email, this.loginObj.password).then(auth =>{
        console.log('you are logged in', auth);
        this.afDB.object("/users/" + auth.uid).subscribe(data=>{
          this.loading.dismiss();
          let userData: any = data;
          localStorage.setItem("userObj", JSON.stringify(userData));
          this.navCtrl.setRoot(MenuPage);
        })
        
        
      }).catch(error =>{
        alert(error.message);
        this.loading.dismiss();
      })
    }
  }

  ionViewDidLoad() {
    setTimeout(() => this.splash = false, 4000);
  }

}
