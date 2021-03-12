import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { Session } from '../../../../../services/session';
import { StackableModalService } from '../../../../../services/ux/stackable-modal.service';
import { SettingsV2Service } from '../../../settings-v2.service';
import { SettingsTwoFactorV2Service } from '../two-factor-v2.service';
import { SettingsTwoFactorCodePopupComponent } from './code-popup/code-popup.component';

/**
 * Connect app panel - used so the user can scan their QR and verify the code given
 * by their auth app.
 */
@Component({
  selector: 'm-twoFactor__connectApp',
  templateUrl: './connect-app.component.html',
  styleUrls: ['./connect-app.component.ng.scss'],
})
export class SettingsTwoFactorConnectAppComponent
  extends AbstractSubscriberComponent
  implements OnInit {
  /**
   * User entered code from auth app.
   */
  public code$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Recovery code from service.
   * @returns { BehaviorSubject<string> } - recovery code.
   */
  get recoveryCode$(): BehaviorSubject<string> {
    return this.service.recoveryCode$;
  }

  get recoveryCodeObject$(): Observable<string> {
    const username = this.session.getLoggedInUser().username;

    return this.service.recoveryCode$.pipe(
      map((code: string) => {
        return `otpauth://totp/Minds:${username}?secret=${code}&issuer=Minds`;
      })
    );
  }

  get inProgress$(): BehaviorSubject<boolean> {
    return this.service.inProgress$;
  }

  /**
   * Disable progress if the length of the user inputted code is not 6.
   * @returns { Observable<boolean> } - true if progress should be blocked.
   */
  get disabled$(): Observable<boolean> {
    return this.code$.pipe(
      map((code: string) => {
        return code.length !== 6;
      })
    );
  }

  constructor(
    private service: SettingsTwoFactorV2Service,
    private session: Session,
    private stackableModal: StackableModalService,
    private toast: FormToastService,
    private settings: SettingsV2Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.service.fetchNewSecret();
  }

  /**
   * Called on 'Enable' button click.
   * @returns { void }
   */
  public enableButtonClick(): void {
    this.inProgress$.next(true);
    this.subscriptions.push(
      combineLatest([this.service.passwordConfirmed$, this.code$])
        .pipe(
          take(1),
          map(([passwordConfirmed, code]) => {
            if (!passwordConfirmed) {
              this.toast.error('You must go back and provide your password.');
              return;
            }
            this.service.submitCode(code);
          })
        )
        .subscribe()
    );
  }

  /**
   * Called on 'Back' button click. Goes back to recovery code panel.
   * @returns { void }
   */
  public backButtonClick(): void {
    this.service.activePanel$.next({ panel: 'recovery-code' });
  }

  /**
   * Called on code value change.
   * @param { string } $event - the new value for code.
   * @returns { void }
   */
  public codeValueChanged($event: string) {
    this.code$.next($event);
  }

  /**
   * Called on enter text code clicked.
   *
   * TODO: Pass correct code.
   */
  public async onEnterTextCodeClick(): Promise<void> {
    this.subscriptions.push(
      this.recoveryCode$.pipe(take(1)).subscribe(async (value: string) => {
        await this.stackableModal
          .present(SettingsTwoFactorCodePopupComponent, null, {
            code: value,
          })
          .toPromise();
      })
    );
  }
}
