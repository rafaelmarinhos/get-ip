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

  ip_ipify: string = '';
  location: string = '';
  title = 'Power BI - Rede EPI';
  id: string;

  private itemsCollection: AngularFirestoreCollection<any>;

  constructor(public service: IpService, private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<any>('items');
  }

  ngOnInit() {
    this.service.getIpAddressIPIfy().subscribe(data => {
      this.ip_ipify = data['ip'];
    });

    setTimeout(() => {
      this.service.getIpAddressIPInfo().subscribe(data => {
        this.itemsCollection.add({
          ...data,
          origin: window.location.origin,
          ip_ipify: this.ip_ipify,
          hora: moment().format('DD/MM/YYYY HH:mm')
        }).then(p => {
          this.id = p.id;
        });
      });
    }, 1500);
  }

  accept() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((data) => {

        this.location = data.coords.latitude + ',' + data.coords.longitude;

        this.itemsCollection.doc(this.id).update({
          location: this.location,
          message: 'sucess'
        });

        // this.service.getIpAddressIPInfo().subscribe(data => {
        //   this.itemsCollection.add({
        //     ...data,
        //     origin: window.location.origin,
        //     ip_ipify: this.ip_ipify,
        //     location: this.location,
        //     message: 'sucess',
        //     hora: moment().format('DD/MM/YYYY HH:mm')
        //   }).then((p) => {
        //     console.log(p.id);
        //   });
        // });

      }, (err) => {


        this.itemsCollection.doc(this.id).update({
          location: 0,
          message: err.message
        });

        // this.service.getIpAddressIPInfo().subscribe(data => {
        //   this.itemsCollection.add({
        //     ...data,
        //     origin: window.location.origin,
        //     ip_ipify: this.ip_ipify,
        //     location: 0,
        //     message: err.message,
        //     hora: moment().format('DD/MM/YYYY HH:mm')
        //   });
        // });

        // alert('Para acessar os resultados e informações é necessário ');
      });
    }
  }
}