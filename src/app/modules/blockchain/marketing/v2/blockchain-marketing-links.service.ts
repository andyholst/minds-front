import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Injector } from '@angular/core';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ComposerModalService } from '../../../composer/components/modal/modal.service';
import { OnchainTransferModalService } from '../../../wallet/components/components/onchain-transfer/onchain-transfer.service';
import { EarnModalService } from '../../earn/earn-modal.service';
import { BuyTokensModalService } from '../../token-purchase/v2/buy-tokens-modal.service';
import { UniswapModalService } from '../../token-purchase/v2/uniswap/uniswap-modal.service';
import { Web3WalletService } from '../../web3-wallet.service';

/**
 * Manages the opening of various modals and links on blockchain marketing pages.
 */
@Injectable({ providedIn: 'root' })
export class BlockchainMarketingLinksService {
  // site url
  private siteUrl: string;

  constructor(
    private composerModal: ComposerModalService,
    private injector: Injector,
    private web3WalletService: Web3WalletService,
    private buyTokensModalService: BuyTokensModalService,
    private earnModalService: EarnModalService,
    private uniswapModal: UniswapModalService,
    private onchainTransferModal: OnchainTransferModalService,
    @Inject(DOCUMENT) private document: Document,
    configs: ConfigsService
  ) {
    this.siteUrl = configs.get('site_url');
  }

  /**
   * Open buy tokens modal
   * @returns { Promise<BlockchainMarketingLinksService> }
   */
  public async openBuyTokensModal(): Promise<BlockchainMarketingLinksService> {
    try {
      await this.web3WalletService.getCurrentWallet(true);
      await this.buyTokensModalService.open();
    } catch (e) {
      if (e === 'Dismissed modal') {
        return this; // do nothing, intentionally thrown.
      }
      console.error(e); // do nothing
    }
    return this;
  }

  /**
   * Open earn modal.
   * @returns { Promise<BlockchainMarketingLinksService> }
   */
  public async openEarnModal(): Promise<BlockchainMarketingLinksService> {
    try {
      await this.earnModalService.open();
    } catch (e) {
      if (e === 'Dismissed modal') {
        return this; // do nothing, intentionally thrown.
      }
      console.error(e);
    }
    return this;
  }

  /**
   * Opens composer modal.
   * @returns { BlockchainMarketingLinksService } - Chainable.
   */
  public openComposerModal(): BlockchainMarketingLinksService {
    try {
      this.composerModal.setInjector(this.injector).present();
    } catch (e) {
      // do nothing
    }
    return this;
  }

  /**
   * Opens transfer onchain modal.
   * @returns { BlockchainMarketingLinksService } - Chainable.
   */
  public openTransferOnchainModal(): BlockchainMarketingLinksService {
    try {
      this.onchainTransferModal
        .setInjector(this.injector)
        .present()
        .toPromise();
    } catch (e) {
      // do nothing
    }
    return this;
  }

  /**
   * Opens airdrop modal.
   * @returns { BlockchainMarketingLinksService } - Chainable.
   */
  public openAirdropModal(): BlockchainMarketingLinksService {
    return this;
  }

  /**
   * Opens liquidity provision modal.
   * @returns { BlockchainMarketingLinksService } - Chainable.
   */
  public openLiquidityProvisionModal(): BlockchainMarketingLinksService {
    this.uniswapModal.open('add');
    return this;
  }

  /**
   * Opens navigate to referrals modal.
   * @returns { BlockchainMarketingLinksService } - Chainable.
   */
  public navigateToReferrals(): BlockchainMarketingLinksService {
    this.openInNewWindow(`${this.siteUrl}settings/other/referrals`);
    return this;
  }

  /**
   * Opens whitepaper.
   * @returns { BlockchainMarketingLinksService } - Chainable.
   */
  public navigateToWhitepaper(): BlockchainMarketingLinksService {
    this.openInNewWindow(
      'https://cdn-assets.minds.com/front/dist/en/assets/documents/Whitepaper-v0.5.pdf'
    );
    return this;
  }

  /**
   * Opens token analtics.
   * @returns { BlockchainMarketingLinksService } - Chainable.
   */
  public navigateToTokenAnalytics(): BlockchainMarketingLinksService {
    this.openInNewWindow('/analytics/dashboard/token/supply');
    return this;
  }

  /**
   * Opens explanatory blog.
   * @returns { BlockchainMarketingLinksService } - Chainable.
   */
  public navigateToBlog(): BlockchainMarketingLinksService {
    this.openInNewWindow(`${this.siteUrl}minds/blogs`);
    return this;
  }

  /**
   * Navigates to join rewards.
   * @returns { BlockchainMarketingLinksService } - Chainable.
   */
  public navigateToJoinRewards(): BlockchainMarketingLinksService {
    this.openInNewWindow(`${this.siteUrl}wallet/tokens/balance`);
    return this;
  }

  /**
   * Open a href in a new window by creating a new anchor tag and clicking it.
   * @param { string } - url to navigate to.
   * @returns { BlockchainMarketingLinksService } - Chainable.
   */
  private openInNewWindow(href: string): BlockchainMarketingLinksService {
    const link = this.document.createElement('a');
    link.target = '_blank';
    link.href = href;
    link.click();
    link.remove();
    return this;
  }
}
