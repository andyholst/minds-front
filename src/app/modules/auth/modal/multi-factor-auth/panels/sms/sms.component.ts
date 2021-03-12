import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, throttleTime } from 'rxjs/operators';
import {
  MultiFactorAuthService,
  MultiFactorPanel,
} from '../../multi-factor-auth-service';
import { AbstractMFAFormComponent } from '../abstract/abstract-mfa-form.component';

/**
 * MFA input form for SMS.
 */
@Component({
  selector: 'm-multiFactorAuth__sms',
  templateUrl: './sms.component.html',
  styleUrls: ['../mfa-panel.component.ng.scss'],
})
export class MultiFactorAuthSMSComponent extends AbstractMFAFormComponent {
  constructor(private service: MultiFactorAuthService) {
    super();
  }

  /**
   * Active panel from service.
   * @returns { BehaviorSubject<MultiFactorPanel> } - currently active panel.
   */
  get activePanel$(): BehaviorSubject<MultiFactorPanel> {
    return this.service.activePanel$;
  }

  /**
   * On verify clicked.
   * @returns { void }
   */
  public onVerifyClick(): void {
    this.inProgress$.next(true);

    this.subscriptions.push(
      this.code$.pipe(take(1), throttleTime(1000)).subscribe((code: string) => {
        this.service.validateSMSCode(code);
        this.inProgress$.next(false);
        this.onVerify.next(true); // TODO: Conditional
      })
    );
  }

  /**
   * On user request for recovery code.
   * @returns { void }
   */
  public onRecoveryCodeClick(): void {
    this.activePanel$.next('totp-recovery');
  }

  /**
   * On not received click.
   * @returns { void }
   */
  public onNotReceivedClick(): void {
    throw Error('NOT YET IMPLEMENTED');
  }
}
