import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';

@Component({
  selector: 'add-asset',
  templateUrl: 'add-asset.html'
})
export class AddAssetPage {
  public assets;
  private wallet;

  constructor(public logger: Logger, private navParams: NavParams) {
    this.wallet = this.navParams.data.wallet;
    this.wallet.getKeokenAssets(
      function(err, assets) {
        if (err) {
          // log error
          return;
        }
        this.assets = assets;
        this.logger.info(JSON.stringify(assets));
      }.bind(this)
    );
  }
}
