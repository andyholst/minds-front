import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';

import { Client } from '../../common/api/client.service';
import { Web3WalletService } from '../blockchain/web3-wallet.service';
import { TokenContractService } from '../blockchain/contracts/token-contract.service';
import { WireService } from '../wire/wire.service';
import { WireStruc } from '../wire/creator/creator.component';
import { OverlayModalService } from '../../services/ux/overlay-modal';
import { SignupModalService } from '../modals/signup/service';
import { Session } from '../../services/session';
import { WirePaymentsCreatorComponent } from '../wire/creator/payments/payments.creator.component';
import { WirePaymentHandlersService } from '../wire/wire-payment-handlers.service';

@Component({
  selector: 'm-plus--subscription',
  templateUrl: 'subscription.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusSubscriptionComponent {
  user = window.Minds.user;
  blockchain = window.Minds.blockchain;
  source: string;
  error: string;
  inProgress: boolean = true;
  completed: boolean = false;
  active: boolean = false;
  @Output('completed') completed$: EventEmitter<any> = new EventEmitter();
  @Input('showSubscription') showSubscription: boolean;
  payment: any = {};
  payload: any;
  minds = window.Minds;

  constructor(
    private client: Client,
    private tokenContract: TokenContractService,
    private wireService: WireService,
    private web3Wallet: Web3WalletService,
    private overlayModal: OverlayModalService,
    private modal: SignupModalService,
    private wirePaymentHandlers: WirePaymentHandlersService,
    public session: Session,
    private cd: ChangeDetectorRef
  ) {}

  load(): Promise<any> {
    return this.client
      .get('api/v1/plus')
      .then(({ active }) => {
        if (active) this.active = true;
        return active;
      })
      .catch(e => {
        throw e;
      });
  }

  isPlus() {
    if (this.active || (this.user && this.user.plus)) return true;
    return false;
  }

  setSource(source: string) {
    this.source = source;
    this.purchase();
  }

  async purchase(amount: number = 20, period: 'month' | 'year' = 'month') {
    if (!this.session.isLoggedIn()) {
      this.modal.open();
      return;
    }

    const creator = this.overlayModal.create(
      WirePaymentsCreatorComponent,
      await this.wirePaymentHandlers.get('plus'),
      {
        default: this.payment,
        onComplete: wire => {
          this.completed = true;
          this.user.plus = true;
          this.active = true;
          this.detectChanges();
          this.completed$.next(true);
        },
      }
    );
    creator.present();
  }

  cancel() {
    this.inProgress = true;
    this.error = '';
    this.detectChanges();
    return this.client
      .delete('api/v1/plus/subscription')
      .then((response: any) => {
        this.inProgress = false;
        this.user.plus = false;
        this.active = false;
        this.detectChanges();
      });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
