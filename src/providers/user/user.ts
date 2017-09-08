import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database'
import * as firebase from 'firebase/app';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserProvider {

  private userRole: any = {};
  public isAuthenticated: boolean = false;
  private userObj: any = {};
  private tempUserObj ={
  }
  currentUser: any = '';

  constructor(public http: Http, public afAuth: AngularFireAuth, public afDB: AngularFireDatabase) {
    console.log('Hello UserProvider Provider');
    // this.getCurrentUser();
  }

  login(){
    this.isAuthenticated = true;
  }

  logout(){
    this.isAuthenticated = false;
  }

  isAlreadyAuthenticated():boolean{
    return this.isAuthenticated? true : false;
  }

  isUserAuthenticated(){
    if(localStorage.getItem("userObj")){
      this.isAuthenticated = true;
      return true
    }
    else{
      this.isAuthenticated = false;
      return false  
    }
  }

  getCurrentUser(){
    let user = firebase.auth().currentUser;
    if(user){
      console.log('current user', user.uid);
      return user.uid
    }
    else{
      console.log("not logged in");
    }
  }

}
