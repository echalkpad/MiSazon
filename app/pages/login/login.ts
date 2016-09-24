import { Component } from '@angular/core';
import { NavController, ToastController, Platform } from 'ionic-angular';
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

  constructor(private navController: NavController, platform: Platform, private toastCtrl: ToastController, public af: AngularFire) {
    platform.ready().then(() => {
      this.af = af;
    });
  }

  ngOnInit() {
    this.af.auth.subscribe((data) => {
      if (data) {
        this.userProfile = this.af.database.object('usuario/' + data.uid);
      } else {
        this.userProfile = null;
      }
    })
  }

  doLogout() {
    this.af.auth.logout();
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

        return this._setUpUser(_creds, success.auth);
      })
      .catch((error) => {
        console.log("Firebase failure: " + JSON.stringify(error));
        alert(JSON.stringify(error))
      });
  }

  _setUpUser(_credentials, _authData) {
    var ref = firebase.database().ref('usuario/' + _authData.uid)
    var data = {
      "provider": _authData.providerData[0],
      "avatar": (_credentials.imageUri || "missing"),
      "displayName": _authData.email,
    };

    return ref.set(data).then(function () {
      return data
    }).catch(function (_error) {
      return _error
    })
  }

  _FBUserProfile() {

    return new Promise((resolve, reject) => {
      Facebook.api('me?fields=id,name,email,first_name,last_name,picture.width(100).height(100).as(picture_small),picture.width(720).height(720).as(picture_large)', [])
        .then((profileData) => {
          console.log(JSON.stringify(profileData));

          return resolve(profileData);
        }, (err) => {
          console.log(JSON.stringify(err));


          return reject(err);
        });
    });
  }

  doFacebookLogin() {
    var _authInfo

    Facebook.login(['email'])
      .then((_response) => {
        console.log(_response)

        _authInfo = _response
/*
        let toast = this.toastCtrl.create({
          message: _response.status,
          duration: 10000,
          position: 'top'
        });
        toast.present();
*/

        return this._FBUserProfile();

      }).then((success) => {
        //let p: any = firebase.auth.FacebookAuthProvider as firebase.auth.FacebookAuthProvider_Instance
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
            this.navController.push(TabsPage);
            return this._setUpUser(creds, success.auth)
          })
          .catch((error) => {
            alert(AuthProviders.Facebook + " --- " + error);
          });


      })
      .catch((_error) => { alert(_error) })
  }
  register() {
    this.navController.push(RegistrarPage);
  }
}
