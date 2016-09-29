import { Component, Input, Output } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {CUSTOM_ICON_DIRECTIVES} from 'ionic2-custom-icons';

import { IReceta } from '../interfaces';
import { VerRecetaPage } from '../../pages/ver-receta/ver-receta';

@Component({
  selector: 'forum-thread',
  templateUrl: 'build/shared/thread-component/thread-component.html',
  directives: [CUSTOM_ICON_DIRECTIVES]
})
export class ThreadComponent {
  @Input() thread: IReceta;
  constructor(private navCtrl: NavController,public params: NavParams) {

  }
  ngOnInit() {
    var self = this;
    firebase.database().ref('recetas').child(self.thread.key).on('child_changed', self.onCommentAdded);
  }
  ngOnDestroy() {
    console.log('destroying..');
    var self = this;
    firebase.database().ref('recetas').child(self.thread.key).off('child_changed', self.onCommentAdded);
  }

  // Notice function declarion to keep the right this reference
  public onCommentAdded = (childSnapshot, prevChildKey) => {
    console.log(childSnapshot.val());
    var self = this;
    // Attention: only number of comments is supposed to changed.
    // Otherwise you should run some checks..
    //self.thread.comments = childSnapshot.val();
  }

  viewComments(key: string) {
    //this.onViewComments.emit(key);
  }

  verReceta(key: any) {
    var self = this;
    console.log(key);
    this.navCtrl.push(VerRecetaPage,{key:key.target.id});
  }

}
