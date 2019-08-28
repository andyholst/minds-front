import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MediaModalComponent } from "../../../../media/modal/modal.component";
import { FeaturesService } from "../../../../../services/features.service";
import { OverlayModalService } from "../../../../../services/ux/overlay-modal";
import { Router } from "@angular/router";
import toMockActivity from "../../util/mock-activity";

@Component({
  selector: 'm-pro--channel-tile',
  templateUrl: 'tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProTileComponent {
  @Input() entity: any;
  @ViewChild('img', { static: false }) img: ElementRef;

  videoDimensions: Array<any> = null;

  constructor(
    protected featuresService: FeaturesService,
    protected modalService: OverlayModalService,
    protected router: Router,
  ) {
  }

  getType(entity: any) {
    return entity.type === 'object' ? `${entity.type}:${entity.subtype}` : entity.type;
  }

  getTitle() {
    switch (this.getType(this.entity)) {
      case 'object:blog':
        return this.entity.title;
      case 'object:image':
      case 'object:video':
        return this.entity.title && this.entity.title.trim() !== '' ? this.entity.title : this.entity.message;
      default:
        return '';
    }
  }

  getText() {
    switch (this.getType(this.entity)) {
      case 'object:blog':
        return this.entity.excerpt;
      case 'object:image':
      case 'object:video':
        return this.entity.description;
      default:
        return '';
    }
  }

  setVideoDimensions($event) {
    this.videoDimensions = $event.dimensions;
  }

  showMediaModal() {
    const activity = toMockActivity(this.entity);
    if (this.featuresService.has('media-modal')) {
      // Mobile (not tablet) users go to media page instead of modal
      // if (isMobile() && Math.min(screen.width, screen.height) < 768) {
      // this.router.navigate([`/media/${this.entity.guid}`]);
      // }

      if (activity.custom_type === 'video') {
        activity.custom_data.dimensions = this.videoDimensions;
      } else { // Image
        // Set image dimensions if they're not already there
        const img: HTMLImageElement = this.img.nativeElement;
        activity.custom_data[0].width = img.naturalWidth;
        activity.custom_data[0].height = img.naturalHeight;
      }

      activity.modal_source_url = this.router.url;

      this.modalService.create(MediaModalComponent, activity, {
        class: 'm-overlayModal--media'
      }).present();
    } else {
      this.router.navigate([`/media/${activity.entity_guid}`]);
    }
  }
}
