import { Component, ViewChild, PLATFORM_DIRECTIVES} from '@angular/core';
import { ionicBootstrap, Platform, Nav, MenuController, ViewController, Events} from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import {FIREBASE_PROVIDERS, defaultFirebase, AngularFire, FirebaseObjectObservable} from 'angularfire2';
import * as firebase from 'firebase'

import { Page1 } from './pages/page1/page1';
import { Page2 } from './pages/page2/page2';
import { LoginPage } from './pages/login/login';
import { TabsPage } from './pages/tabs/tabs';
import { RegistrarPage } from './pages/registrar/registrar';
import { MirecetaPage } from './pages/mireceta/mireceta';

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, private menu: MenuController) {
    var self = this;
    self.rootPage = LoginPage;

    /*   this.initializeApp();
   
       // used for an example of ngFor and navigation
       this.pages = [
         { title: 'Page uno', component: Page1 },
         { title: 'Page dos', component: Page2 }
       ];*/

  }

  /*ngOnInit() {
    var self = this;
    firebase.auth().onAuthStateChanged(function (user) {
       if (user === null) {
    self.nav.setRoot(LoginPage);// inicializacion de la pagina de inicio jhon
      }
     });
  }
*/
  openPage(page) {
    let viewCtrl: ViewController = this.nav.getActive();
    // close the menu when clicking a link from the menu
    this.menu.close();

    if (page === 'signup') {
      if (!(viewCtrl.instance instanceof RegistrarPage))
        this.nav.push(RegistrarPage);
    }
  }

  isUserLoggedIn() {
    return true;
  }

  signout() {
    var self = this;
    firebase.auth().signOut().then(function () {
      self.menu.close();
      self.nav.setRoot(LoginPage);
    }, function (error) {
      console.log(error);
    });
  }
}

ionicBootstrap(MyApp, [
  FIREBASE_PROVIDERS,
  defaultFirebase({
    apiKey: "AIzaSyCibIeMkCkW5JbKQv2voc55VvdMeLC7-5s",
    authDomain: "misazon-1eadd.firebaseapp.com",
    databaseURL: "https://misazon-1eadd.firebaseio.com",
    storageBucket: "misazon-1eadd.appspot.com",
  }),
]);
