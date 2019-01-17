import { Injectable } from '@angular/core';

import { Logger } from '../logger/logger';

import * as KWC from 'keoken-wallet-client';

@Injectable()
export class KwcProvider {
  public buildTx = KWC.buildTx;
  public parseSecret = KWC.parseSecret;
  public Client = KWC;
  constructor(private logger: Logger) {
    this.logger.info('KwcProvider initialized.');
  }
  public getBitcore() {
    return KWC.Bitcore;
  }

  public getBitcoreCash() {
    return KWC.BitcoreCash;
  }

  public getErrors() {
    return KWC.errors;
  }

  public getSJCL() {
    return KWC.sjcl;
  }

  public getUtils() {
    return KWC.Utils;
  }

  public getClient(walletData?, opts?) {
    opts = opts || {};

    // note opts use `bwsurl` all lowercase;
    let kwc = new KWC({
      baseUrl: opts.bwsurl || '__BWS_URL_PLACEHOLDER__',
      verbose: opts.verbose,
      timeout: 100000,
      transports: ['polling']
    });
    if (walletData) kwc.import(walletData, opts);
    return kwc;
  }
}
