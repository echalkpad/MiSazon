import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CUSTOM_ICON_DIRECTIVES} from 'ionic2-custom-icons';

import { ThreadPage } from '../thread/thread';
import { MirecetaPage } from '../mireceta/mireceta';
import { MedalPage } from '../medal/medal';

/*
  Generated class for the TabsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/tabs/tabs.html',
  directives: [CUSTOM_ICON_DIRECTIVES]
})
export class TabsPage {
  private threadsPage: any;
  private mirecetaPage: any;
  private medalPage: any;

  private newThreads: string = '';
  private selectedTab: number = -1;
  constructor(private navCtrl: NavController) {
    this.threadsPage = ThreadPage;
    this.mirecetaPage = MirecetaPage;
    this.medalPage = MedalPage;
  }
}
