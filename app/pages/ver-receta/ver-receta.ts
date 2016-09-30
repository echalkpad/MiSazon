import { Component, Pipe, PipeTransform } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import {FirebaseListObservable, FirebaseDatabase, AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {KeysPipe} from './pipe.ts'
@Component({
  templateUrl: 'build/pages/ver-receta/ver-receta.html',
  pipes: [KeysPipe]
})
export class VerRecetaPage {
  key;
  recetas: FirebaseListObservable<any>;
  titulo: any;
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
    })

    self.recetas.subscribe(uid => {
      self.titulo = uid[0].titulo;
    });

    //firebase.database().ref('receta').child(self.key).on('value', function (snapshot) {
    //  self.titulo = snapshot.val().titulo;
    //});

  }

}
