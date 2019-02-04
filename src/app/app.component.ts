import { Component, OnInit } from '@angular/core';
import { IpService } from './ip.service';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Power BI - Rede EPI';

  private itemsCollection: AngularFirestoreCollection<any>;

  constructor(public service: IpService, private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<any>('items');
  }

  ngOnInit() {
    this.service.getIpAddress().subscribe(data => {
      console.log({
        ...data,
        hora: moment().format('DD/MM/YYYY HH:mm')
      });

      this.itemsCollection.add({
        ...data,
        hora: moment().format('DD/MM/YYYY HH:mm')
      });
    });
  }
}
