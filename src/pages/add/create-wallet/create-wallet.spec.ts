import { async, ComponentFixture } from '@angular/core/testing';
import { TestUtils } from '../../../test';
import { CreateWalletPage } from './create-wallet';

describe('CreateWalletPage', () => {
  let fixture: ComponentFixture<CreateWalletPage>;
  let instance;

  beforeEach(async(() => {
    return TestUtils.configurePageTestingModule([CreateWalletPage]).then(
      testEnv => {
        fixture = testEnv.fixture;
        instance = testEnv.instance;
        fixture.detectChanges();
      }
    );
  }));
  afterEach(() => {
    fixture.destroy();
  });

  describe('setTotalCopayers function', () => {
    it('should call updateRCSelect and updateSeedSourceSelect functions', () => {
      const n = 3;
      const spy = spyOn(instance, 'updateRCSelect');
      const secondSpy = spyOn(instance, 'updateSeedSourceSelect');
      instance.setTotalCopayers(n);
      expect(spy).toHaveBeenCalledWith(n);
      expect(secondSpy).toHaveBeenCalled();
    });
  });

  describe('setOptsAndCreate function', () => {
    it('should call create function with options', () => {
      const spy = spyOn(instance, 'create');
      const opts = {
        name: 'test',
        m: 2,
        n: 3,
        myName: 'test',
        networkName: 'livenet',
        bwsurl: '__BWS_URL_PLACEHOLDER__',
        singleAddress: true,
        coin: 'btc',
        mnemonic: 'mom mom mom mom mom mom mom mom mom mom mom mom',
        derivationStrategy: 'BIP44'
      };

      instance.createForm.value.walletName = 'test';
      instance.createForm.value.myName = 'test';
      instance.createForm.value.requiredCopayers = 2;
      instance.createForm.value.totalCopayers = 3;
      instance.createForm.value.testnetEnabled = 'livenet';
      instance.createForm.value.bwsURL = '__BWS_URL_PLACEHOLDER__';
      instance.createForm.value.singleAddress = true;
      instance.createForm.value.coin = 'btc';
      instance.createForm.value.selectedSeed = 'set';
      instance.createForm.value.recoveryPhrase =
        'mom mom mom mom mom mom mom mom mom mom mom mom';

      instance.setOptsAndCreate();
      expect(spy).toHaveBeenCalledWith(opts);
    });
  });
});
