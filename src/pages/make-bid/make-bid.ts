import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { /*Events,*/ NavController, Platform } from 'ionic-angular';
import { /*Observable,*/ Subscription } from 'rxjs';

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
// import { Logger } from '../../providers/logger/logger';
// import { PlatformProvider } from '../../providers/platform/platform';
import { OnGoingProcessProvider } from '../../providers/on-going-process/on-going-process';
import { PopupProvider } from '../../providers/popup/popup';
import { ProfileProvider } from '../../providers/profile/profile';
import { MakeBidOptions } from '../../providers/wallet/wallet';

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
  // public showShareButton: boolean;
  public loading: boolean;
  public playAnimation: boolean;

  public makeBidForm: FormGroup;
  public showAdvOpts: boolean;

  private onResumeSubscription: Subscription;

  constructor(
    // private actionSheetProvider: ActionSheetProvider,
    navCtrl: NavController,
    profileProvider: ProfileProvider,
    // private walletProvider: WalletProvider,
    // private platformProvider: PlatformProvider,
    // private logger: Logger,
    private popupProvider: PopupProvider,
    private onGoingProcessProvider: OnGoingProcessProvider,
    // private events: Events,
    // private socialSharing: SocialSharing,
    // private bwcErrorProvider: BwcErrorProvider,
    private translate: TranslateService,
    private externalLinkProvider: ExternalLinkProvider,
    // private addressProvider: AddressProvider,
    walletTabsProvider: WalletTabsProvider,
    private platform: Platform,
    private fb: FormBuilder
  ) {
    super(navCtrl, profileProvider, walletTabsProvider);

    // this.showShareButton = this.platformProvider.isCordova;

    this.showAdvOpts = false;

    this.makeBidForm = this.fb.group({
      amount: [null, Validators.required],
      price: [null, Validators.required],
      minAmount: [1, Validators.required],
      minAdvPayment: [1.30, Validators.required],
      period: [144, Validators.required],
      immutability: [6, Validators.required],
      paymentWindow: [50, Validators.required]
    });

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


  private showError(message): void {
    let title = this.translate.instant('Error');
    let subtitle = this.translate.instant(message);
    this.popupProvider.ionicAlert(title, subtitle);
  }

  public makeBid(): void {

    let opts: Partial<MakeBidOptions> = {
      amount: this.makeBidForm.value.amount,
      price: this.makeBidForm.value.price,
      minAmount: this.makeBidForm.value.minAmount,
      minAdvPayment: this.makeBidForm.value.minAdvPayment,
      period: this.makeBidForm.value.period,
      immutability: this.makeBidForm.value.immutability,
      paymentWindow: this.makeBidForm.value.paymentWindow
    };

    if (opts.amount <= 0) {
      this.showError('Amount must be greater than 0');
      return;
    }

    if (opts.minAmount <= 0 || opts.minAmount > opts.amount) {
      this.showError('Minimum amount must be greater than 0 and lower or equal than Amount');
      return;
    }

    if (opts.price <= 0) {
      this.showError('Price must be greater than 0');
      return;
    }

    if (opts.minAdvPayment < 0) {
      this.showError('Minimum Advance Payment must be greater than or equal to 0');
      return;
    }

    if (opts.period < 0) {
      this.showError('Period must be greater than or equal to 0');
      return;
    }

    if (opts.paymentWindow <= 0) {
      this.showError('Payment Window must be greater than 0');
      return;
    }

    if (opts.immutability < 0) {
      this.showError('Immutability must be greater than or equal to 0');
      return;
    }


    // opts.assetId = this.wallet.assetId;
    // opts.wallet = this.wallet;

    this.createMakeBid(/*opts*/);

  }

  private createMakeBid(/*opts*/): void {
    this.onGoingProcessProvider.set('creatingMakeBid');

    this.onGoingProcessProvider.clear();


    /*
    this.profileProvider
      .createWallet(opts)
      .then(wallet => {
        this.onGoingProcessProvider.clear();
        this.events.publish('status:updated');
        this.walletProvider.updateRemotePreferences(wallet);
        this.pushNotificationsProvider.updateSubscription(wallet);

        if (this.createForm.value.selectedSeed == 'set') {
          this.profileProvider.setBackupFlag(wallet.credentials.walletId);
        }
        this.navCtrl.popToRoot();
        this.events.publish('OpenWallet', wallet);
      })
      .catch(err => {
        this.onGoingProcessProvider.clear();
        this.logger.error('Create: could not create wallet', err);
        let title = this.translate.instant('Error');
        this.popupProvider.ionicAlert(title, err);
        return;
      });*/
  }
}
