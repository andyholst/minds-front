import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Router } from '@angular/router';
import {
  ActivityService,
  ActivityEntity,
} from '../../activity/activity.service';
import { Client } from '../../../../services/api/client';
import { ComposerService } from '../../../composer/services/composer.service';
import { ComposerModalService } from '../../../composer/components/modal/modal.service';
import { FeaturesService } from '../../../../services/features.service';
import { TranslationService } from '../../../../services/translation';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { DownloadActivityMediaService } from '../../../../common/services/download-activity-media.service';

@Component({
  selector: 'm-activityV2__menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.ng.scss'],
})
export class ActivityV2MenuComponent implements OnInit, OnDestroy {
  @Output() deleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() translate: EventEmitter<any> = new EventEmitter<any>();
  private entitySubscription: Subscription;

  entity: ActivityEntity;

  constructor(
    public service: ActivityService,
    public client: Client,
    private router: Router,
    private features: FeaturesService,
    private composer: ComposerService,
    private composerModal: ComposerModalService,
    private injector: Injector,
    public translationService: TranslationService,
    private toasterService: FormToastService,
    public downloadActivityMediaService: DownloadActivityMediaService
  ) {}

  ngOnInit() {
    this.entitySubscription = this.service.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;
        this.entity.url = this.service.buildCanonicalUrl(this.entity, true);
      }
    );
  }

  ngOnDestroy() {
    this.entitySubscription.unsubscribe();
  }

  get menuOptions(): Array<string> {
    if (!this.entity || !this.entity.ephemeral) {
      if (this.service.displayOptions.showBoostMenuOptions) {
        return [
          'edit',
          'translate',
          'share',
          'follow',
          'feature',
          'delete',
          'report',
          'set-explicit',
          'block',
          'rating',
          'allow-comments',
          'download',
        ];
      } else {
        return [
          'edit',
          'pin',
          'translate',
          'share',
          'follow',
          'feature',
          'delete',
          'report',
          'set-explicit',
          'block',
          'rating',
          'allow-comments',
          'download',
        ];
      }
    } else {
      return [
        'view',
        'translate',
        'share',
        'follow',
        'feature',
        'report',
        'set-explicit',
        'block',
        'rating',
        'allow-comments',
        'download',
      ];
    }
  }

  async onOptionSelected(option) {
    switch (option) {
      case 'edit':
        this.composer.load(this.entity);

        this.composerModal
          .setInjector(this.injector)
          .present()
          .then(activity => {
            if (activity) {
              this.service.setEntity(activity);
            }
          });

        break;
      case 'undo-remind':
        try {
          await this.client.delete(`api/v3/newsfeed/${this.entity.urn}`);
          this.deleted.emit();
        } catch (e) {
          this.toasterService.error(e.message);
        }

        break;
      case 'delete':
        try {
          await this.client.delete(`api/v1/newsfeed/${this.entity.guid}`);
          this.deleted.emit();
        } catch (e) {
          console.error(e);
        }
        break;
      case 'translate':
        this.service.displayOptions.showTranslation = true;
        break;
      case 'download':
        this.downloadActivityMediaService.download(this.entity);
        break;
    }
  }
}
