import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'add-asset',
  templateUrl: 'add-asset.html'
})
export class AddAssetPage {
  constructor(private platform: Platform, private statusBar: StatusBar) {}

  ionViewWillEnter() {
    if (this.platform.is('ios')) {
      this.statusBar.styleDefault();
    }
  }

  ionViewWillLeave() {
    if (this.platform.is('ios')) {
      this.statusBar.styleLightContent();
    }
  }
}
