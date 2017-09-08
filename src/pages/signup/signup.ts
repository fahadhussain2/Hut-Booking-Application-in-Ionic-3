import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserProvider} from '../../providers/user/user';
import {LoginPage} from '../../pages/login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database'
/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  newUserObj = {
    email: '',
    password: '',
    confirmPassword: '',
    // role: 'client'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public us: UserProvider, public afAuth:AngularFireAuth, public afDB:AngularFireDatabase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  backToLogin(){
    this.navCtrl.pop()
  }

  enableSignup(){
    return this.newUserObj.email.trim() != '' && (this.newUserObj.password.trim() != '' && this.newUserObj.confirmPassword.trim() != '' ) &&
      (this.newUserObj.password.trim() == this.newUserObj.confirmPassword.trim());
  }

  createUser(){
    console.log('page')
    let userObj = {
      email: this.newUserObj.email,
      password: this.newUserObj.password,
      confirmPassword: this.newUserObj.confirmPassword,
      profilePicURL: ''
    }
    this.afAuth.auth.createUserWithEmailAndPassword(userObj.email,userObj.password).then(user =>{
      let username = userObj.email.split("@")[0];
      console.log('userObj', user, username);
      user.updateProfile({
        displayName: username,
        photoURL: ''
      })
      // user.displayName = username;
      
      this.afDB.object('/users/' + user.uid).set(userObj);
      alert("user has been created successfully")
    }).catch(function(error:any){
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage) 
    });
    this.newUserObj = {
        email: '',
        password: '',
        confirmPassword: '',
      };

      this.navCtrl.push(LoginPage);
  }

}
