import { Component, Input, HostBinding } from '@angular/core';
import { Session } from '../../../services/session';
import { Client } from '../../api/client.service';

@Component({
  selector: 'm-sidebarWidget',
  templateUrl: './sidebar-widget.component.html',
})
export class SidebarWidgetComponent {
  @Input() title: string;
  @Input() headerLevel = 2; // whether title should be h1 or h2 - defaults to h2
  @Input() dismissibleId: string;
  @HostBinding('hidden') hidden: boolean = false;

  constructor(private session: Session, private client: Client) {}

  ngOnInit() {
    const user = this.session.getLoggedInUser();
    const dismissedWidgets = user ? user.dismissed_widgets : [];

    if (
      this.dismissibleId &&
      dismissedWidgets &&
      dismissedWidgets.indexOf(this.dismissibleId) > -1
    ) {
      this.hidden = true;
    }
  }

  onDismissClick(e: MouseEvent): void {
    this.hidden = true;
    this.client.put(`api/v3/dismissible-widgets/${this.dismissibleId}`);
  }
}
