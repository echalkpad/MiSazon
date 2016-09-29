import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import {FirebaseListObservable, FirebaseDatabase, AngularFire, FirebaseObjectObservable} from 'angularfire2';

@Component({
  templateUrl: 'build/pages/ver-receta/ver-receta.html',
})
export class VerRecetaPage {
  key;
  recetas: FirebaseListObservable<any>;
  constructor(private navCtrl: NavController, public params: NavParams, private database: FirebaseDatabase) {
    var self = this;
    self.key = params.data.key;

  }

  ngOnInit() {
    var self = this;
    self.recetas = this.database.list('/receta', {
      query: {
        orderByChild: 'key',
        equalTo: self.key
      }
    });
    console.log(this.recetas);
  }

}
