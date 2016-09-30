import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Content, Events} from 'ionic-angular';
import { ThreadComponent } from '../../shared/thread-component/thread-component';

import { RegistrarPage } from '../../pages/registrar/registrar';
import { IReceta } from '../../shared/interfaces';
import { ItemsService } from '../../shared/services/items.service';
import { MappingsService } from '../../shared/services/mappings.service';

@Component({
  templateUrl: 'build/pages/thread/thread.html',
  directives: [ThreadComponent],
  providers: [MappingsService, ItemsService],
})
export class ThreadPage {
  @ViewChild(Content) content: Content;
  segment: string = 'all';
  selectedSegment: string = this.segment;
  queryText: string = '';
  private start: number;
  private pageSize: number = 3;
  private internetConnected: boolean = true;
  private loading: boolean = false;

  public threads: Array<IReceta> = [];
  constructor(private navCtrl: NavController, private mappingsService: MappingsService,
    private itemsService: ItemsService) {
    this.loadThreads(true);
  }

  loadThreads(fromStart: boolean) {
    var self = this;

    if (fromStart) {
      self.threads = [];
      if (self.segment === 'all') {
        firebase.database().ref('statistics').child('threads').once('value').then(function (snapshot) {
          self.start = snapshot.val();

          self.getThreads();
        });
      }
    } else {
      self.getThreads();
    }
  }
  getThreads() {
    var self = this;

    let startFrom: number = self.start - self.pageSize;


    if (startFrom < 0)
      startFrom = 0;
    if (self.segment === 'all') {
      //firebase.database().ref('receta').orderByPriority().startAt(startFrom).endAt(self.start).once('value', function (snapshot) {
      firebase.database().ref('receta').orderByPriority().once('value', function (snapshot) {

        self.itemsService.reversedItems<IReceta>(self.mappingsService.getThreads(snapshot)).forEach(function (thread) {

          self.threads.push(thread);
        });
        self.start -= (self.pageSize + 1);

      });
    }
  }

  reloadThreads(refresher) {
    this.queryText = '';
    if (this.internetConnected) {
      this.loadThreads(true);
      
      refresher.complete();
    } else {
      refresher.complete();
    }
  }

  fetchNextThreads(infiniteScroll) {

    this.loadThreads(false);
    infiniteScroll.complete();

  }

}
