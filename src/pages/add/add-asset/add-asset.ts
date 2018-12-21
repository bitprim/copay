import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';

@Component({
  selector: 'add-asset',
  templateUrl: 'add-asset.html'
})
export class AddAssetPage {
  public assets;
  public readonly KEOS_ASSET_ID = 1;
  private wallet;

  constructor(public logger: Logger, private navParams: NavParams) {
    this.wallet = this.navParams.data.wallet;
    this.wallet.getKeokenAssets(
      function(err, assets) {
        if (err) {
          this.logger.error('Failed to retrieve assets from backend: ' + err);
          return;
        }
        this.assets = assets.filter(
          asset => asset.asset_id !== this.KEOS_ASSET_ID
        );
      }.bind(this)
    );
  }
}
