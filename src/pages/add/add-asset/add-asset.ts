import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
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

  constructor(
    public alertCtrl: AlertController,
    public logger: Logger,
    public navCtrl: NavController,
    private navParams: NavParams
  ) {
    this.wallet = this.navParams.data.wallet;
    this.wallet.getKeokenAssets(
      function(err, assets) {
        if (err) {
          this.logger.error('Failed to retrieve assets from backend: ' + err);
          return;
        }
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
          let msg =
            'Successfully bound asset ' +
            assetId +
            ' to wallet ' +
            this.wallet.id;
          this.logger.info(msg);
          let opts = {
            // TODO translate message
            title: msg,
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.navCtrl.pop();
                  this.wallet.assets.push(assetId);
                }
              }
            ]
          };
          this.alertCtrl.create(opts).present();
        }
      }.bind(this)
    );
  }
}
