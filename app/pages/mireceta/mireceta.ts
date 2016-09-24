import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the MirecetaPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
import { AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/mireceta/mireceta.html',
})
export class MirecetaPage {


  constructor(public alertCtrl: AlertController) {
  }

   showAlert() {
    let alert = this.alertCtrl.create({
      title: 'New Friend!',
      subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
      buttons: ['OK']
    });
    alert.present();
  }

}
