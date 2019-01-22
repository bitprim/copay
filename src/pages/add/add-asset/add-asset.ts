import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import * as _ from 'lodash';
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
        this.logger.debug('---> TOPI: ' + JSON.stringify(this.wallet.assets));
        this.assets = assets.filter(
          asset =>
            asset.asset_id !== this.KEOS_ASSET_ID &&
            !_.includes(this.wallet.assets, asset.asset_id)
        );
      }.bind(this)
    );
  }

  public bindAssetToWallet(assetId: number) {
    this.wallet.bindAssetToWallet(
      this.wallet.id,
      assetId,
      function(err) {
        if (err) {
          this.logger.warn('Error binding asset to wallet: ' + err);
        } else {
          this.logger.info(
            'Successfully bound asset ' +
              assetId +
              ' to wallet ' +
              this.wallet.id
          );
        }
      }.bind(this)
    );
  }
}
