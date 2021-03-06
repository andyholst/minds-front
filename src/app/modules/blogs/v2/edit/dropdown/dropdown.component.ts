/**
 * Dropdown menu for blogs v2
 */
import { Component } from '@angular/core';
import {
  ACCESS,
  LICENSES,
  LicensesEntry,
} from '../../../../../services/list-options';
import { BlogsEditService } from '../blog-edit.service';
import { NSFW_REASONS } from '../../../../../common/components/nsfw-selector/nsfw-selector.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'm-blogEditor__dropdown',
  host: {
    class: 'm-blogEditor__dropdown',
  },
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.ng.scss'],
})
export class BlogEditorDropdownComponent {
  /**
   * nsfw reasons
   */
  public reasons: typeof NSFW_REASONS = NSFW_REASONS;

  constructor(private editService: BlogsEditService) {}

  /**
   * Gets nsfw value from service.
   */
  getNSFW() {
    return this.editService.nsfw$;
  }

  /**
   * Calls service to toggle NSFW.
   * @param { number } - number to toggle
   */
  toggleNSFW(value: number): void {
    this.editService.toggleNSFW(value);
  }
}
