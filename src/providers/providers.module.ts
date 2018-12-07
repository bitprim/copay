import { NgModule } from '@angular/core';

import { DecimalPipe } from '@angular/common';

import {
  ActionSheetProvider,
  AddressBookProvider,
  AddressProvider,
  AmazonProvider,
  AndroidFingerprintAuth,
  AppIdentityProvider,
  AppProvider,
  BackupProvider,
  BitPayAccountProvider,
  BitPayCardProvider,
  BitPayProvider,
  BwcErrorProvider,
  BwcProvider,
  Clipboard,
  ClipboardProvider,
  CoinbaseProvider,
  ConfigProvider,
  DerivationPathHelperProvider,
  Device,
  DomProvider,
  EmailNotificationsProvider,
  ExplorerProvider,
  ExternalLinkProvider,
  FaucetProvider,
  FCM,
  FeedbackProvider,
  FeeProvider,
  File,
  FilterProvider,
  GlideraProvider,
  HomeIntegrationsProvider,
  IncomingDataProvider,
  LanguageProvider,
  LaunchReview,
  Logger,
  MercadoLibreProvider,
  NodeWebkitProvider,
  OnGoingProcessProvider,
  PayproProvider,
  PersistenceProvider,
  PlatformProvider,
  PopupProvider,
  ProfileProvider,
  PushNotificationsProvider,
  QRScanner,
  RateProvider,
  ReleaseProvider,
  ReplaceParametersProvider,
  ScanProvider,
  ScreenOrientation,
  ShapeshiftProvider,
  SocialSharing,
  SplashScreen,
  StatusBar,
  TimeProvider,
  Toast,
  TouchID,
  TouchIdProvider,
  TxConfirmNotificationProvider,
  TxFormatProvider,
  UserAgent,
  Vibration,
  WalletProvider,
  WalletTabsProvider
} from './index';

@NgModule({
  providers: [
    ActionSheetProvider,
    AddressProvider,
    AddressBookProvider,
    AndroidFingerprintAuth,
    AppProvider,
    AppIdentityProvider,
    AmazonProvider,
    BackupProvider,
    BitPayProvider,
    BitPayCardProvider,
    BitPayAccountProvider,
    BwcProvider,
    BwcErrorProvider,
    ConfigProvider,
    CoinbaseProvider,
    Clipboard,
    ClipboardProvider,
    DerivationPathHelperProvider,
    Device,
    DomProvider,
    ExternalLinkProvider,
    FaucetProvider,
    ExplorerProvider,
    FeedbackProvider,
    FCM,
    HomeIntegrationsProvider,
    FeeProvider,
    GlideraProvider,
    IncomingDataProvider,
    LanguageProvider,
    LaunchReview,
    Logger,
    MercadoLibreProvider,
    NodeWebkitProvider,
    OnGoingProcessProvider,
    PayproProvider,
    PlatformProvider,
    ProfileProvider,
    PopupProvider,
    QRScanner,
    PushNotificationsProvider,
    RateProvider,
    ReleaseProvider,
    ReplaceParametersProvider,
    ShapeshiftProvider,
    StatusBar,
    SplashScreen,
    ScanProvider,
    ScreenOrientation,
    SocialSharing,
    Toast,
    TouchID,
    Vibration,
    TimeProvider,
    TouchIdProvider,
    TxConfirmNotificationProvider,
    FilterProvider,
    TxFormatProvider,
    UserAgent,
    WalletProvider,
    EmailNotificationsProvider,
    DecimalPipe,
    PersistenceProvider,
    File,
    WalletTabsProvider
  ]
})
export class ProvidersModule {}
