import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  ACCESS,
  LICENSES,
  LicensesEntry,
} from '../../../../services/list-options';
import {
  AccessIdSubjectValue,
  ComposerService,
  LicenseSubjectValue,
} from '../../services/composer.service';
import { BehaviorSubject } from 'rxjs';
import { MetaComponent } from '../popup/meta/meta.component';
import { PopupService } from '../popup/popup.service';
import { ComposerBlogsService } from '../../services/blogs.service';
import { Router } from '@angular/router';

/**
 * Composer title bar component. It features a label and a dropdown menu
 * with not-that-important options.
 */
@Component({
  selector: 'm-composer__titleBar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'title-bar.component.html',
})
export class TitleBarComponent {
  /**
   * Composer textarea ID
   */
  @Input() inputId: string;

  /**
   * Create blog intent
   */
  @Output('onCreateBlog') onCreateBlogEmitter: EventEmitter<
    void
  > = new EventEmitter<void>();

  /**
   * Create post intent
   */
  @Output('onCreatePost') onCreatePostEmitter: EventEmitter<
    void
  > = new EventEmitter<void>();

  /**
   * Visibility items list
   */
  visibilityItems: Array<{ text: string; value: string }> = ACCESS.map(
    ({ text, value }) => ({
      text,
      value: `${value}`,
    })
  );

  /**
   * License items list
   */
  licenseItems: Array<LicensesEntry> = LICENSES.filter(
    license => license.selectable
  );

  constructor(
    public service: ComposerService,
    public blogsService: ComposerBlogsService,
    protected popup: PopupService,
    protected router: Router
  ) {}

  /**
   * Access ID subject from service
   */
  get accessId$(): BehaviorSubject<AccessIdSubjectValue> {
    if (this.service.contentType$.getValue() === 'post') {
      return this.service.accessId$;
    } else {
      return this.blogsService.accessId$;
    }
  }

  /**
   * License subject from service
   */
  get license$(): BehaviorSubject<LicenseSubjectValue> {
    if (this.service.contentType$.getValue() === 'post') {
      return this.service.license$;
    } else {
      return this.blogsService.license$;
    }
  }

  /**
   * Attachment subject value from service
   */
  get attachment$() {
    return this.service.attachment$;
  }

  /**
   * Is editing? subject value from service
   */
  get isEditing$() {
    return this.service.isEditing$;
  }

  /**
   * Is posting? subject value from service
   */
  get isPosting$() {
    return this.service.isPosting$;
  }

  /**
   * Can the actor change visibility? (disabled when there's a container)
   */
  get canChangeVisibility(): boolean {
    return !this.service.getContainerGuid();
  }

  /**
   * Clicked Create Blog trigger
   */
  onCreateBlogClick() {
    this.onCreateBlogEmitter.emit();
  }

  /**
   * Clicked Create Post trigger
   */
  onCreatePostClick() {
    this.onCreatePostEmitter.emit();
  }

  /**
   * Emits the new visibility (access ID)
   * @param $event
   */
  onVisibilityClick($event) {
    if (!this.canChangeVisibility) {
      return;
    }

    this.accessId$.next($event);
  }

  /**
   * Emits the new license
   * @param $event
   */
  onLicenseClick($event) {
    this.license$.next($event);
  }

  /**
   * Saves draft blog and navigates to blog edit page for fullscreen.
   * @returns { Promise<void> }
   */
  async onFullscreenClick($event): Promise<void> {
    const response = await this.blogsService.saveDraft();
    this.router.navigate(['/blog/edit/' + response.guid]);
  }
  /**
   * Shows meta-data popup
   */
  async onMetaClick($event?: MouseEvent): Promise<void> {
    try {
      await this.popup
        .create(MetaComponent)
        .present()
        .toPromise(/* Promise is needed to boot-up the Observable */);
    } catch (e) {
      console.error(e);
    }
  }
}
