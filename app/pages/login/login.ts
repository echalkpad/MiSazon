import { Component } from '@angular/core';
import { NavController, ToastController, Platform, LoadingController, AlertController} from 'ionic-angular';
import {Facebook} from 'ionic-native';
import * as firebase from 'firebase';

import { TabsPage } from '../tabs/tabs';
import { RegistrarPage } from '../registrar/registrar';
import {
  FIREBASE_PROVIDERS, defaultFirebase,
  AngularFire, firebaseAuthConfig, AuthProviders,
  AuthMethods
} from 'angularfire2';

@Component({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
  loginCreds: any = {}
  userProfile: any
  fbProfile: any

  email: string;
  password: string;

  constructor(private navController: NavController, public alerCtrl: AlertController,
    private platform: Platform, private loadingCtrl: LoadingController,
    private toastCtrl: ToastController, public af: AngularFire) {
    platform.ready().then(() => {
      this.af = af;
    });

    this.email = "gian411@gmail.com";
    this.password = "jossie";
  }

  ngOnInit() {
    this.af.auth.subscribe((data) => {
      if (data) {
        this.userProfile = this.af.database.object('chef/' + data.uid);
      } else {
        this.userProfile = null;
      }
    })
  }

  doLogout() {
    this.af.auth.logout();
  }

  _setUpUser(_credentials: any, _authData) {
    var ref = firebase.database().ref('chef/' + _authData.uid)
    var data = {
      "provider": _authData.providerData[0],
      "avatar": (_credentials.imageUri || "missing"),
      "displayName": (_authData.email || _authData.providerData[0].email),
    };

    return ref.set(data).then(function () {
      return data
    }).catch(function (_error) {
      return _error
    })
  }

  loginEmail() {
    var self = this;

    if (this.email != null && this.password != null) {
      var autent = firebase.auth().signInWithEmailAndPassword(this.email, this.password);

      let loader = this.loadingCtrl.create({
        content: 'Inicio de sesión..',
        dismissOnPageChange: true
      });
      loader.present();

      autent.then(function (result) {
        var cred = {
          imageUri: null
        }
        var ref = firebase.database().ref('chef/' + result.uid);
        var data = {
          "provider": result.providerData[0],
          "avatar": ("missing"),
          "displayName": (result.email),
        };
        ref.set(data).then(function () {
          self.navController.setRoot(TabsPage);
        }).catch(function (_error) {
          this.showAlert("Login Email", _error);
        })

      }).catch(function (error) {
        this.showAlert("Login Email", error);
      });
    } else {
      let toast = self.toastCtrl.create({
        message: "Existen campos vacíos...",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }
  doEmailLogin(_creds) {
    let providerConfig = {
      provider: AuthProviders.Password,
      method: AuthMethods.Password
    };

    this.af.auth.login(_creds, providerConfig)
      .then((success) => {
        console.log("Firebase success: " + JSON.stringify(success));
        alert(JSON.stringify(success))
        this.navController.push(TabsPage);
        return this._setUpUser(_creds, success.auth);
      })
      .catch((error) => {
        console.log("Firebase failure: " + JSON.stringify(error));
        alert(JSON.stringify(error))
      });
  }

  _FBUserProfile() {
    return new Promise((resolve, reject) => {
      Facebook.api('me?fields=id,name,email,first_name,last_name,picture.width(100).height(100).as(picture_small),picture.width(720).height(720).as(picture_large)', [])
        .then((profileData) => {

          return resolve(profileData);
        }, (err) => {

          return reject(err);
        });
    });
  }

  doFacebookLogin() {
    var _authInfo

    Facebook.login(['email'])
      .then((_response) => {
        let loader = this.loadingCtrl.create({
          content: 'Inicio de sesión..',
          dismissOnPageChange: true
        });
        loader.present();
        _authInfo = _response
        return this._FBUserProfile();

      }).then((success) => {
        this.fbProfile = success;
        let creds = (firebase.auth.FacebookAuthProvider as any).credential(_authInfo.authResponse.accessToken);
        let providerConfig = {
          provider: AuthProviders.Facebook,
          method: AuthMethods.OAuthToken,
          remember: 'default',
          scope: ['email'],
        };

        this.af.auth.login(creds, { provider: AuthProviders.Facebook, method: AuthMethods.OAuthToken })
          .then((success) => {
            this.navController.setRoot(TabsPage);
            //this.navController.push(TabsPage);
            return this._setUpUser(creds, success.auth)
          })
          .catch((error) => {
            this.showAlert("Login Facebook", error);
          });
      })
      .catch((_error) => { this.showAlert("Login Facebook", _error); })
  }

  showAlert(title, message) {
    let alert = this.alerCtrl.create({
      title: title,
      message: message,
      buttons: ['Ok']
    });
    alert.present()
  }
  register() {
    this.navController.push(RegistrarPage);
    var self = this;
    //firebase.auth().onAuthStateChanged(function (user) {
    //   if (user === null) {
    //self.navController.setRoot(RegistrarPage);
  }
}
