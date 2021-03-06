import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';

import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';

@Component({
  selector: 'minds-button-subscribe',
  templateUrl: './subscribe.html',
})
export class SubscribeButton {
  _user: any = {
    subscribed: false,
  };
  _inprogress: boolean = false;
  _content: any;
  _listener: Function;
  @Output('subscribed') onSubscribed: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.m-subscribeButton--iconsOnly')
  @Input()
  iconsOnly: boolean = false;

  @Input() preventSubscription: boolean = false;

  constructor(
    public session: Session,
    public client: Client,
    public authModal: AuthModalService,
    protected toasterService: FormToastService
  ) {}

  @Input('user')
  set user(value: any) {
    this._user = value;
  }

  async subscribe(e): Promise<void> {
    e.preventDefault();
    e.stopPropagation();

    if (this.preventSubscription) {
      this.toasterService.warn('Unable to subscribe from here.');
      return;
    }

    if (!this.session.isLoggedIn()) {
      const user = await this.authModal.open();
      if (!user) return;
    }

    this._user.subscribed = true;
    this.onSubscribed.next();

    this.client
      .post('api/v1/subscribe/' + this._user.guid, {})
      .then((response: any) => {
        if (response && response.error) {
          throw 'error';
        }

        this._user.subscribed = true;
      })
      .catch(e => {
        this._user.subscribed = false;
        this.toasterService.error(
          e.message || "You can't subscribe to this user"
        );
      });
  }

  unSubscribe(e) {
    e.preventDefault();
    e.stopPropagation();
    this._user.subscribed = false;
    this.client
      .delete('api/v1/subscribe/' + this._user.guid, {})
      .then((response: any) => {
        this._user.subscribed = false;
      })
      .catch(e => {
        this._user.subscribed = true;
      });
  }
}
