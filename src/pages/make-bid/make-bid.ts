import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { /*Events,*/ App, NavController, Platform } from 'ionic-angular';
import { /*Observable,*/ Subscription } from 'rxjs';

// Native
// import { SocialSharing } from '@ionic-native/social-sharing';

// Pages
import { BackupWarningPage } from '../backup/backup-warning/backup-warning';
import { TabsPage } from '../tabs/tabs';
// import { AmountPage } from '../send/amount/amount';

// Providers
import { ActionSheetProvider } from '../../providers/action-sheet/action-sheet';
import { ConfigProvider } from '../../providers/config/config';
// import { AddressProvider } from '../../providers/address/address';
// import { BwcErrorProvider } from '../../providers/bwc-error/bwc-error';
import { ExternalLinkProvider } from '../../providers/external-link/external-link';
import { FeeProvider } from '../../providers/fee/fee';
import { KwcErrorProvider } from '../../providers/kwc-error/kwc-error';
import { KwcProvider } from '../../providers/kwc/kwc';
import { Logger } from '../../providers/logger/logger';
// import { PlatformProvider } from '../../providers/platform/platform';
import { OnGoingProcessProvider } from '../../providers/on-going-process/on-going-process';
import { PlatformProvider } from '../../providers/platform/platform';
import { PopupProvider } from '../../providers/popup/popup';
import { ProfileProvider } from '../../providers/profile/profile';
import { ReplaceParametersProvider } from '../../providers/replace-parameters/replace-parameters';
import { TouchIdErrors } from '../../providers/touchid/touchid';
import { TxConfirmNotificationProvider } from '../../providers/tx-confirm-notification/tx-confirm-notification';
import { TxFormatProvider } from '../../providers/tx-format/tx-format';
import { Coin, MakeBidOptions, TransactionProposal, WalletProvider } from '../../providers/wallet/wallet';


import * as _ from 'lodash';
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

  public config;
  public configFeeLevel: string;

  public FEE_TOO_HIGH_LIMIT_PER: number;
  public CONFIRM_LIMIT_USD: number;

  public tx;

  public isCordova: boolean;

  private onResumeSubscription: Subscription;

  private bitcore;
  private bitcoreCash;

  constructor(
    private actionSheetProvider: ActionSheetProvider,
    private app: App,
    navCtrl: NavController,
    profileProvider: ProfileProvider,
    private kwcProvider: KwcProvider,
    // private walletProvider: WalletProvider,
    // private platformProvider: PlatformProvider,
    private logger: Logger,
    private popupProvider: PopupProvider,
    private onGoingProcessProvider: OnGoingProcessProvider,
    private configProvider: ConfigProvider,
    private feeProvider: FeeProvider,
    private platformProvider: PlatformProvider,
    private kwcErrorProvider: KwcErrorProvider,
    private txConfirmNotificationProvider: TxConfirmNotificationProvider,
    private txFormatProvider: TxFormatProvider,
    private replaceParametersProvider: ReplaceParametersProvider,
    // private events: Events,
    // private socialSharing: SocialSharing,
    // private bwcErrorProvider: BwcErrorProvider,
    private translate: TranslateService,
    private externalLinkProvider: ExternalLinkProvider,
    // private addressProvider: AddressProvider,
    walletTabsProvider: WalletTabsProvider,
    private walletProvider: WalletProvider,
    private platform: Platform,
    private fb: FormBuilder
  ) {
    super(navCtrl, profileProvider, walletTabsProvider);

    // this.showShareButton = this.platformProvider.isCordova;

    this.config = this.configProvider.get();
    this.bitcore = this.kwcProvider.getBitcore();
    this.bitcoreCash = this.kwcProvider.getBitcoreCash();

    this.configFeeLevel = this.config.wallet.settings.feeLevel
      ? this.config.wallet.settings.feeLevel
      : 'normal';

    this.showAdvOpts = false;

    this.FEE_TOO_HIGH_LIMIT_PER = 15;

    this.CONFIRM_LIMIT_USD = 20;

    this.isCordova = this.platformProvider.isCordova;

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

    this.createMakeBid(opts);

  }

  private showErrorInfoSheet(
    error: Error | string,
    title?: string,
    exit?: boolean
  ): void {
    if (!error)
      return;
    this.logger.warn('ERROR:', error);

    if ((error as Error).message === TouchIdErrors.fingerprintCancelled) return;

    let infoSheetTitle = title ? title : this.translate.instant('Error');

    const errorInfoSheet = this.actionSheetProvider.createInfoSheet(
      'default-error',
      { msg: this.kwcErrorProvider.msg(error), title: infoSheetTitle }
    );
    errorInfoSheet.present();
    errorInfoSheet.onDidDismiss(() => {
      if (exit) {
        this.isWithinWalletTabs()
          ? this.navCtrl.popToRoot()
          : this.app.getRootNavs()[0].setRoot(TabsPage);
      }
    });
  }


  private createMakeBid(opts): void {
    this.onGoingProcessProvider.set('creatingMakeBid');

    this.onGoingProcessProvider.clear();

    let walletAddr;
    let networkName;

    this.walletProvider.getAddress(this.wallet, false)
      .then((addr: string) => {
        if (!addr) {
          // Error is already formated
          this.popupProvider.ionicAlert('Error - no address');
          return;
        }
        this.logger.debug('Got address:' + addr + ' | ' + this.wallet.name);
        walletAddr = addr;

        let B = this.wallet.coin == 'bch' ? this.bitcoreCash : this.bitcore;

        try {
          networkName = new B.Address(walletAddr).network.name;
        } catch (e) {
          this.logger.error(e);
          var message = this.translate.instant(
            'Keoken only supports Bitcoin Cash using new version numbers addresses'
          );
          var backText = this.translate.instant('Go back');
          var learnText = this.translate.instant('Learn more');
          this.popupProvider
            .ionicConfirm(null, message, backText, learnText)
            .then(back => {
              if (!back) {
                var url =
                  'https://support.bitpay.com/hc/en-us/articles/115004671663';
                this.externalLinkProvider.open(url);
              }

            });
          return;
        }

        let tx = {
          toAddress: walletAddr,
          sendMax: false,
          amount: parseInt(opts.amount, 10),
          description: '',
          // paypro: this.navParams.data.paypro,
          spendUnconfirmed: this.config.wallet.spendUnconfirmed,
          keokenAmount: opts.amount,
          // Vanity tx info (not in the real tx)
          recipientType: this.wallet.recipientType,
          name: this.wallet.name,
          email: this.wallet.email,
          color: this.wallet.color,
          network: networkName,
          coin: this.wallet.coin,
          origToAddress: walletAddr,
          feeLevel: this.wallet.coin && this.wallet.coin == 'bch' ? 'normal' : this.configFeeLevel,
          txp: {}
        };

        this.tx = tx;

        if (this.wallet.coin && this.wallet.coin == 'bch') {
          // Use legacy address
          tx.toAddress = this.bitcoreCash
            .Address(this.tx.toAddress)
            .toString();
        }


        const feeOpts = this.feeProvider.getFeeOpts();
        this.tx.feeLevelName = feeOpts[this.tx.feeLevel];

        this.logger.debug(tx);

      })
      .then(() => {

        this.updateTx(this.tx, this.wallet, { dryRun: true }).catch(err => {

          switch (err) {
            case 'insufficient_funds':

              this.showErrorInfoSheet(
                this.translate.instant('Insufficient funds'),
                null,
                true
              );

              break;
            default:
              this.showErrorInfoSheet(err);
              break;
          }
        });

      })
      .then(() => {
        this.approve(this.tx, this.wallet);
      })
      .catch(err => {
        this.logger.error('Send: could not getAddress', err);
      });

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

  private updateTx(tx, wallet, opts): Promise<any> {
    return new Promise((resolve, reject) => {
      if (opts.clearCache) {
        tx.txp = {};
      }

      this.tx = tx;

      // End of quick refresh, before wallet is selected.
      if (!wallet) {
        return resolve();
      }


      this.onGoingProcessProvider.set('calculatingFee');
      this.feeProvider
        .getFeeRate(
          wallet.coin,
          tx.network,
          this.tx.feeLevel
        )
        .then(feeRate => {

          const feeOpts = this.feeProvider.getFeeOpts();
          tx.feeLevelName = feeOpts[tx.feeLevel];
          tx.feeRate = feeRate;

          // txp already generated for this wallet?
          if (tx.txp[wallet.id]) {
            this.onGoingProcessProvider.clear();
            return resolve();
          }

          this.buildTxp(tx, wallet, opts)
            .then(() => {
              this.onGoingProcessProvider.clear();
              return resolve();
            })
            .catch(err => {
              this.onGoingProcessProvider.clear();
              return reject(err);
            });

        })
        .catch(err => {
          this.logger.warn('Error getting fee rate', err);
          this.onGoingProcessProvider.clear();
          return reject(this.translate.instant('Error getting fee rate'));
        });
    });
  }

  private getTxp(tx, wallet, dryRun: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      // ToDo: use a credential's (or fc's) function for this
      if (tx.description && !wallet.credentials.sharedEncryptingKey) {
        let msg = this.translate.instant(
          'Could not add message to imported wallet without shared encrypting key'
        );
        return reject(msg);
      }

      if (tx.amount > Number.MAX_SAFE_INTEGER) {
        let msg = this.translate.instant('Amount too big');
        return reject(msg);
      }

      let txp: Partial<TransactionProposal> = {};

      txp.outputs = [
        {
          toAddress: tx.toAddress,
          amount: tx.amount,
          message: tx.description
        }
      ];

      if (tx.sendMaxInfo) {
        txp.inputs = tx.sendMaxInfo.inputs;
        txp.fee = tx.sendMaxInfo.fee;
      } else {
        txp.feeLevel = tx.feeLevel;
      }

      txp.message = tx.description;
      var pad = '0000000000000000';
      var amountToSend = (pad + tx.keokenAmount.toString(16)).slice(
        -pad.length
      );

      // TODO Make bid Transaction
      // Add op_return data
      var script_raw = '6a0400004b50'; // op_return + keoken prefix
      script_raw = script_raw + '1000000001'; // 10hex = 16 bytes lenght + version (0) + simple send (1)
      script_raw = script_raw + '00000001'; // asset_id = KEO (1)
      script_raw = script_raw + amountToSend; // amount to send (1)

      txp.outputs.push({ amount: 0, script: script_raw });
      txp.keoken = { keoken_id: 1, keoken_amount: tx.keokenAmount };

      if (tx.paypro) {
        txp.payProUrl = tx.paypro.url;
      }
      txp.excludeUnconfirmedUtxos = !tx.spendUnconfirmed;
      txp.dryRun = dryRun;

      if (tx.recipientType == 'wallet') {
        txp.customData = {
          toWalletName: tx.name ? tx.name : null
        };
      }

      this.walletProvider
        .createTx(wallet, txp)
        .then(ctxp => {
          return resolve(ctxp);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  private buildTxp(tx, wallet, opts): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getTxp(_.clone(tx), wallet, opts.dryRun)
        .then(txp => {
          let per = (txp.fee / (txp.amount + txp.fee)) * 100;
          txp.feeRatePerStr = per.toFixed(2) + '%';
          txp.feeTooHigh = per > this.FEE_TOO_HIGH_LIMIT_PER;

          if (txp.feeTooHigh) {
            const coinName =
              this.wallet.coin === Coin.BTC ? 'Bitcoin' : 'Bitcoin Cash';
            const minerFeeInfoSheet = this.actionSheetProvider.createInfoSheet(
              'miner-fee',
              { coinName }
            );
            minerFeeInfoSheet.present();
          }

          tx.txp[wallet.id] = txp;
          this.tx = tx;
          this.logger.debug(
            'Confirm. TX Fully Updated for wallet:' + wallet.id,
            JSON.stringify(tx)
          );
          return resolve();
        })
        .catch(err => {
          if (err.message == 'Insufficient funds') {
            return reject('insufficient_funds');
          } else {
            return reject(err);
          }
        });
    });
  }

  private approve(tx, wallet): Promise<void> {
    if (!tx || !wallet) return undefined;

    this.onGoingProcessProvider.set('creatingTx');
    return this.getTxp(_.clone(tx), wallet, false)
      .then(txp => {
        return this.confirmTx(tx, txp, wallet).then((nok: boolean) => {
          if (nok) {
            this.onGoingProcessProvider.clear();
            return;
          }
          this.publishAndSign(txp, wallet);
        });
      })
      .catch(err => {
        this.onGoingProcessProvider.clear();
        this.logger.warn('Error getting transaction proposal', err);
      });
  }

  private confirmTx(_, txp, wallet) {
    return new Promise(resolve => {
      if (this.walletProvider.isEncrypted(wallet)) return resolve();
      this.txFormatProvider.formatToUSD(wallet.coin, txp.amount).then(val => {
        let amountUsd = parseFloat(val);
        if (amountUsd <= this.CONFIRM_LIMIT_USD) return resolve();

        let amount = (this.tx.amount / 1e8).toFixed(8);
        let unit = txp.coin.toUpperCase();
        let name = wallet.name;
        let message = this.replaceParametersProvider.replace(
          this.translate.instant(
            'Sending {{amount}} {{unit}} from your {{name}} wallet'
          ),
          { amount, unit, name }
        );
        let okText = this.translate.instant('Confirm');
        let cancelText = this.translate.instant('Cancel');
        this.popupProvider
          .ionicConfirm(null, message, okText, cancelText)
          .then((ok: boolean) => {
            return resolve(!ok);
          });
      });
    });
  }

  private publishAndSign = (txp, wallet): void => {
    if (!wallet.canSign() && !wallet.isPrivKeyExternal()) {
      this.onlyPublish(txp, wallet);
      return;
    }

    this.walletProvider
      .publishAndSign(wallet, txp)
      .then(txp => {
        this.onGoingProcessProvider.clear();
        if (
          this.config.confirmedTxsNotifications &&
          this.config.confirmedTxsNotifications.enabled
        ) {
          this.txConfirmNotificationProvider.subscribe(wallet, {
            txid: txp.txid
          });
        }
        // TODO 
        // this.openFinishModal();
      })
      .catch(err => {
        this.onGoingProcessProvider.clear();
        this.showErrorInfoSheet(err);
      });
  };

  private onlyPublish(txp, wallet): Promise<void> {
    this.logger.info('No signing proposal: No private key');
    this.onGoingProcessProvider.set('sendingTx');
    return this.walletProvider
      .onlyPublish(wallet, txp)
      .then(() => {
        this.onGoingProcessProvider.clear();
        // TODO
        // this.openFinishModal(true);
      })
      .catch(err => {
        this.onGoingProcessProvider.clear();
        this.showErrorInfoSheet(err);
      });
  }
}
