/**
 * SettingsV2 component for messenger settings.
 */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Session } from '../../../../services/session';
import { Subscription } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';
import { SettingsV2Service } from '../../settings-v2.service';

@Component({
  selector: 'm-settingsV2__messenger',
  templateUrl: './messenger.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2MessengerComponent implements OnInit, OnDestroy {
  /**
   * Output for when form is submitted.
   */
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();

  init: boolean = false;
  inProgress: boolean = false;
  user: MindsUser;
  settingsSubscription: Subscription;
  form: FormGroup;

  constructor(
    protected cd: ChangeDetectorRef,
    private session: Session,
    protected settingsService: SettingsV2Service
  ) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    this.form = new FormGroup({
      allowUnsubscribedContact: new FormControl(''),
    });

    this.settingsSubscription = this.settingsService.settings$.subscribe(
      (settings: any) => {
        this.allowUnsubscribedContact.setValue(
          settings.allow_unsubscribed_contact
        );
        this.detectChanges();
      }
    );

    this.init = true;
    this.detectChanges();
  }

  ngOnDestroy() {
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
  }

  /**
   * Submit settings update.
   * @param { Promise<void> } - Awaitable.
   */
  async submit(): Promise<void> {
    if (!this.canSubmit()) {
      return;
    }
    try {
      this.inProgress = true;
      this.detectChanges();

      const formValue = {
        allow_unsubscribed_contact: this.allowUnsubscribedContact.value,
      };

      const response: any = await this.settingsService.updateSettings(
        this.user.guid,
        formValue
      );
      if (response.status === 'success') {
        this.formSubmitted.emit({ formSubmitted: true });
        this.form.markAsPristine();
      }
    } catch (e) {
      this.formSubmitted.emit({ formSubmitted: false, error: e });
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  /**
   * Determine whether form can be submitted.
   * @returns { boolean } - true if form can be submitted.
   */
  canSubmit(): boolean {
    return this.form.valid && !this.inProgress && !this.form.pristine;
  }

  /**
   * gets allowUnsubscribedContact from form.
   */
  get allowUnsubscribedContact() {
    return this.form.get('allowUnsubscribedContact');
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}