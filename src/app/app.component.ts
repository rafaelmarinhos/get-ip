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

    var ip_ipify;
    var lat = 0;
    var lon = 0;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((p) => {
        lat = p.coords.latitude;
        lon = p.coords.longitude;
      })
    }

    this.service.getIpAddressIPIfy().subscribe(data => {
      ip_ipify = data['ip'];
    });

    setTimeout(() => {
      this.service.getIpAddressIPInfo().subscribe(data => {

        console.log({
          ...data,
          origin: window.location.origin,
          ip_ipify: ip_ipify,
          coords_lat: lat,
          coords_lon: lon,
          hora: moment().format('DD/MM/YYYY HH:mm')
        });

        this.itemsCollection.add({
          ...data,
          origin: window.location.origin,
          ip_ipify: ip_ipify,
          coords_lat: lat,
          coords_lon: lon,
          hora: moment().format('DD/MM/YYYY HH:mm')
        });
      });
    }, 6000);

  }
}
