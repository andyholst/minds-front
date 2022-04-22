import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FeedNoticeService } from '../services/feed-notice.service';
import { NoticePosition, NoticeIdentifier } from '../feed-notice.types';
import { Subscription } from 'rxjs';

/**
 * Outlet for feed notices - use this component to show a relevant
 * notice in or on-top of a feed. Component will use service to sync
 * state and ensure no duplicate notices are shown.
 */
@Component({
  selector: 'm-feedNotice__outlet',
  template: `
    <ng-container [ngSwitch]="activeNotice">
      <m-feedNotice--verifyEmail
        *ngSwitchCase="'verify-email'"
      ></m-feedNotice--verifyEmail>
      <m-feedNotice--buildYourAlgorithm
        *ngSwitchCase="'build-your-algorithm'"
      ></m-feedNotice--buildYourAlgorithm>
      <m-feedNotice--enablePushNotifications
        *ngSwitchCase="'enable-push-notifications'"
      ></m-feedNotice--enablePushNotifications>
    </ng-container>
  `,
})
export class FeedNoticeOutletComponent implements OnInit, OnDestroy {
  // array of subscriptions destroyed if still present in onDestroy.
  private subscriptions: Subscription[] = [];

  // name of currently active notice.
  public activeNotice: NoticeIdentifier = null;

  // positioning of component - where should it show 'top' or feed, or 'inline' in the feed.
  @Input() position: NoticePosition = 'top';

  // should show new notices even when service identifies another notice has already been shown for this position.
  @Input() showMultiple: boolean = false;

  constructor(private service: FeedNoticeService) {}

  ngOnInit(): void {
    this.initSubscription();
  }

  ngOnDestroy(): void {
    if (this.activeNotice) {
      this.service.setShown(this.activeNotice, false);
    }

    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Gets next active notice from service, sets it to local state to be shown
   * and informs the service that this instance is showing that notice.
   * @returns { void }
   */
  private async initSubscription(): Promise<void> {
    await this.service.checkNoticeState();

    this.subscriptions.push(
      this.service.updatedState$.subscribe(val => {
        // if we're not showing multiple and this position already has shown notices.
        if (!this.showMultiple && this.service.hasShownANotice()) {
          return;
        }

        const notice = this.service.getNextShowableNotice(this.position);

        if (!notice) {
          this.activeNotice = null;
          return;
        }

        this.activeNotice = notice;
        this.service.setShown(notice, true);
      })
    );
  }
}
