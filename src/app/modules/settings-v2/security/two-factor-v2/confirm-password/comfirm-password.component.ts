import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, throttleTime } from 'rxjs/operators';
import { ApiService } from '../../../../../common/api/api.service';
import { AbstractSubscriberComponent } from '../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { SettingsTwoFactorV2Service } from '../two-factor-v2.service';

/**
 * Password confirm component - force a user to verify their password before enabling or removing 2fa
 *
 * TODO: Remove 2FA logic - may need to pass in an intent to decide what the next panel is.
 */
@Component({
  selector: 'm-twoFactor__passwordConfirm',
  template: `
    <form class="m-twoFactor_passwordConfirmationForm" [formGroup]="form">
      <label>Password</label>
      <input
        type="password"
        name="password"
        formControlName="password"
        [ngModel]="password$ | async"
        (ngModelChange)="passwordValueChanged($event)"
      />

      <m-button
        [color]="'blue'"
        (onAction)="onConfirmClick()"
        [disabled]="disabled$ | async"
      >
        <ng-container>Confirm</ng-container>
      </m-button>
    </form>
  `,
  styleUrls: ['./confirm-password.component.ng.scss'],
})
export class SettingsTwoFactorPasswordComponent
  extends AbstractSubscriberComponent
  implements OnInit {
  // amount input form
  public form: FormGroup;

  // password string from user
  public password$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Should progress be disabled?
   * @returns { Observable<boolean> } - true if should be disabled.
   */
  get disabled$(): Observable<boolean> {
    return this.password$.pipe(
      map((password: string) => !password || password.length < 6)
    );
  }

  constructor(
    private service: SettingsTwoFactorV2Service,
    private api: ApiService,
    private toast: FormToastService
  ) {
    super();
  }

  ngOnInit(): void {
    // init form group.
    this.form = new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required],
      }),
    });
  }

  /**
   * Called on confirm click.
   * @returns { void }
   */
  public onConfirmClick(): void {
    this.subscriptions.push(
      this.password$
        .pipe(
          take(1), // call once
          throttleTime(2000), // disallow more than 1 request every 2s
          switchMap((password: string) => {
            // switch outer observable to api req.
            return this.api.post('api/v2/settings/password/validate', {
              password: password,
            });
          }),
          catchError(e => {
            console.error(e);
            this.toast.error('Sorry, an error has occurred. Please try again.');
            return of(null);
          })
        )
        .subscribe(response => {
          if (response && response.status === 'success') {
            this.service.activePanel$.next('recovery-code');
            return;
          }
          this.password$.next(''); // clear password
          this.toast.error('Incorrect password. Please try again.');
        })
    );
  }

  /**
   * Called on password change - updates password value.
   * @param { string } $event - new password value.
   */
  public passwordValueChanged($event: string) {
    this.password$.next($event);
  }
}
