import { Component, Input, OnInit } from '@angular/core';
import { Session } from '../../../services/session';
import { Client } from '../../api/client.service';

@Component({
  selector: 'm-chatIcon',
  templateUrl: './chat-icon.component.html',
  styleUrls: ['./chat-icon.component.ng.scss'],
})
export class ChatIconComponent implements OnInit {
  inProgress = false;
  unread: number = 0;

  @Input() floating: boolean = false;

  constructor(protected client: Client, protected session: Session) {}

  ngOnInit(): void {
    if (this.session.getLoggedInUser()) {
      this.getTotalUnread();
    }
  }

  async getTotalUnread() {
    this.inProgress = true;

    try {
      const response: any = await this.client.get('api/v3/matrix/total-unread');
      this.unread = response.total_unread;
    } catch (e) {}

    this.inProgress = false;
  }
}
