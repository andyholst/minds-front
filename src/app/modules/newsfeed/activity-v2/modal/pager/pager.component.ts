import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  Optional,
} from '@angular/core';
import { ActivityV2ModalService } from '../modal.service';
import { ActivityService } from '../../../activity/activity.service';
import { RelatedContentService } from '../../../../../common/services/related-content.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MediumFadeAnimation } from '../../../../../animations';
import { AutoProgressVideoService } from '../../../../../modules/media/components/video/auto-progress-overlay/auto-progress-video.service';

@Component({
  selector: 'm-activityV2__modalPager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.ng.scss'],
  animations: [MediumFadeAnimation],
})
export class ActivityV2ModalPagerComponent implements OnInit, OnDestroy {
  protected modalPagerSubscription: Subscription;
  protected asyncEntitySubscription: Subscription;
  protected autoProgressSubscription: Subscription;

  modalPager = {
    hasPrev: false,
    hasNext: false,
  };

  constructor(
    public service: ActivityV2ModalService,
    public activityService: ActivityService,
    @Optional() private autoProgress: AutoProgressVideoService,
    private relatedContent: RelatedContentService
  ) {}

  ngOnInit(): void {
    /**
     * Whenever user clicks a pager button,
     * recalculate whether or not to display pager buttons
     */
    this.modalPagerSubscription = this.relatedContent
      .onChange()
      .subscribe(async change => {
        this.modalPager = {
          hasNext: await this.relatedContent.hasNext(),
          hasPrev: await this.relatedContent.hasPrev(),
        };
      });

    if (this.autoProgress) {
      /** Trigger next video */
      this.autoProgressSubscription = this.autoProgress.goNext$.subscribe(
        (val: boolean) => {
          this.goToNext();
        }
      );

      if (this.relatedContent.getBaseEntity().custom_type === 'video') {
        this.relatedContent.setFilter('videos');
      }
    }

    this.relatedContent.setContext('container');
  }

  ngOnDestroy(): void {
    this.clearAsyncEntity();

    if (this.modalPagerSubscription) {
      this.modalPagerSubscription.unsubscribe();
    }
    if (this.asyncEntitySubscription) {
      this.asyncEntitySubscription.unsubscribe();
    }
    if (this.autoProgressSubscription) {
      this.autoProgressSubscription.unsubscribe();
    }
  }

  setAsyncEntity(asyncEntity: BehaviorSubject<any>): void {
    this.clearAsyncEntity();

    this.asyncEntitySubscription = asyncEntity.subscribe(entity => {
      if (entity) {
        this.service.setEntity(entity);
        this.service.loading$.next(false);
      }
    });
  }

  clearAsyncEntity(): void {
    if (this.asyncEntitySubscription) {
      this.asyncEntitySubscription.unsubscribe();
      this.asyncEntitySubscription = void 0;
    }
  }

  /**
   * Go to next entity in horizontal feed
   * and reset entity in activity service
   */
  async goToNext(): Promise<void> {
    if (!this.modalPager.hasNext) {
      return;
    }

    if (this.autoProgress) {
      this.autoProgress.cancel();
    }

    this.service.loading$.next(true);

    const response = await this.relatedContent.next();

    if (response && response.entity) {
      this.setAsyncEntity(response.entity);
    } else {
      this.service.loading$.next(false);
    }

    if (this.autoProgress) {
      this.autoProgress.updateNextEntity();
    }
  }

  /**
   * Go to next entity in horizontal feed
   * and reset entity in activity service
   */
  async goToPrev(): Promise<void> {
    if (!this.modalPager.hasPrev) {
      return;
    }

    if (this.autoProgress) {
      this.autoProgress.cancel();
    }

    this.service.loading$.next(true);

    const response = await this.relatedContent.prev();

    if (response && response.entity) {
      this.setAsyncEntity(response.entity);
    } else {
      this.service.loading$.next(false);
    }

    if (this.autoProgress) {
      this.autoProgress.updateNextEntity();
    }
  }

  /////////////////////////////////////////////////////////////////
  // KEYBOARD SHORTCUTS
  /////////////////////////////////////////////////////////////////
  @HostListener('window:keydown', ['$event']) onWindowKeyDown(
    $event: KeyboardEvent
  ): Boolean {
    if (!this.service.shouldFilterOutKeyDownEvent($event)) {
      switch ($event.key) {
        case 'ArrowLeft':
          this.goToPrev();
          break;
        case 'ArrowRight':
          this.goToNext();
          break;
      }
    }

    return true;
  }
}
