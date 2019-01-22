import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { /*Events,*/ NavController, Platform } from 'ionic-angular';
import { /*Observable,*/ Subscription } from 'rxjs';
import { Logger } from '../../providers/logger/logger';

// import { Logger } from '../../providers/logger/logger';

// Native
// import { SocialSharing } from '@ionic-native/social-sharing';

// Pages
import { BackupWarningPage } from '../backup/backup-warning/backup-warning';
// import { AmountPage } from '../send/amount/amount';

// Providers
// import { ActionSheetProvider } from '../../providers/action-sheet/action-sheet';
// import { AddressProvider } from '../../providers/address/address';
// import { BwcErrorProvider } from '../../providers/bwc-error/bwc-error';
import { ExternalLinkProvider } from '../../providers/external-link/external-link';
import { PlatformProvider } from '../../providers/platform/platform';
import { ProfileProvider } from '../../providers/profile/profile';
// import { WalletProvider } from '../../providers/wallet/wallet';

// import * as _ from 'lodash';
import { WalletTabsChild } from '../wallet-tabs/wallet-tabs-child';
import { WalletTabsProvider } from '../wallet-tabs/wallet-tabs.provider';

@Component({
  selector: 'page-make-bid',
  templateUrl: 'make-bid.html'
})
export class MakeBidPage extends WalletTabsChild {
  public protocolHandler: string;
  // public address: string;
  // public qrAddress: string;
  public wallets = [];
  public wallet;
  public showShareButton: boolean;
  public loading: boolean;
  public playAnimation: boolean;

  // public makeBidForm: FormGroup;
  // public showAdvOpts: boolean;

  private onResumeSubscription: Subscription;

  constructor(
    // private actionSheetProvider: ActionSheetProvider,
    navCtrl: NavController,
    profileProvider: ProfileProvider,
    // private walletProvider: WalletProvider,
    private platformProvider: PlatformProvider,
    private logger: Logger,
    // private events: Events,
    // private socialSharing: SocialSharing,
    // private bwcErrorProvider: BwcErrorProvider,
    private translate: TranslateService,
    private externalLinkProvider: ExternalLinkProvider,
    // private addressProvider: AddressProvider,
    walletTabsProvider: WalletTabsProvider,
    private platform: Platform // private fb: FormBuilder
  ) {
    super(navCtrl, profileProvider, walletTabsProvider);
    this.showShareButton = this.platformProvider.isCordova;

    // this.showAdvOpts = false;

    /* this.makeBidForm = this.fb.group({
      amount: [null, Validators.required],
      price: [null]
    }); */

    this.logger.debug('testttt22222');
  }

  ngOnInit() {
    super.ngOnInit();
    // this.createForm.get('amount').setValidators([Validators.required]);
  }

  ionViewWillEnter() {
    this.onResumeSubscription = this.platform.resume.subscribe(() => {
      /*
      this.events.subscribe('Wallet/setAddress', (newAddr?: boolean) => {
        
      });*/
    });
  }

  ionViewWillLeave() {
    this.onResumeSubscription.unsubscribe();
  }

  ionViewDidLoad() {
    /*
    this.events.subscribe('Wallet/setAddress', (newAddr?: boolean) => {
      
    });*/
  }

  public goToBackup(): void {
    this.navCtrl.push(BackupWarningPage, {
      walletId: this.wallet.credentials.walletId
    });
  }

  public openWikiBackupNeeded(): void {
    let url =
      'https://support.bitpay.com/hc/en-us/articles/115002989283-Why-don-t-I-have-an-online-account-for-my-BitPay-wallet-';
    let optIn = true;
    let title = null;
    let message = this.translate.instant('Read more in our Wiki');
    let okText = this.translate.instant('Open');
    let cancelText = this.translate.instant('Go Back');
    this.externalLinkProvider.open(
      url,
      optIn,
      title,
      message,
      okText,
      cancelText
    );
  }

  public makeBid(): void {}
}
