import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { REASONS } from '../../../services/list-options';
import { FormToastService } from '../../../common/services/form-toast.service';
import { ModalService } from '../../../services/ux/modal.service';
import { MindsUser } from '../../../interfaces/entities';

@Component({
  moduleId: module.id,
  selector: 'm-report--creator',
  templateUrl: 'creator.component.html',
})
export class ReportCreatorComponent implements AfterViewInit {
  subject = {
    value: null,
    hasMore: false,
  };
  subReason = {
    value: null,
  };

  note: string = '';
  guid: string = '';

  initialized: boolean = false;
  inProgress: boolean = false;

  success: boolean = false;
  error: string = '';
  subjects = REASONS;

  next: boolean = false;

  _opts: any;

  constructor(
    public session: Session,
    private _changeDetectorRef: ChangeDetectorRef,
    private modalService: ModalService,
    private client: Client,
    protected toasterService: FormToastService
  ) {}

  setModalData(opts: {
    entity: MindsUser;
    onReported?: (guid: number, reason?: number, subreason?: number) => void;
  }) {
    this._opts = opts;
    this.guid = opts.entity ? opts.entity.guid : null;
  }

  ngAfterViewInit() {
    this._changeDetectorRef.detectChanges();
  }

  /**
   * Validates if the report can be submitted using the current settings
   */
  validate() {
    if (!this.subject) {
      return false;
      //throw new Error('You cannot report this.');
    }
    if (this.subject.hasMore && this.next && !this.subReason.value) {
      return false;
    }
    return true;
  }

  /**
   * Checks if the user can submit using the current settings
   */
  canSubmit() {
    try {
      return this.validate();
    } catch (e) {
      return false;
    }
  }

  /**
   * Shows visible report errors
   */
  showErrors() {
    this.error = '';

    try {
      this.validate();
    } catch (e) {
      this.error = e.message;
      if (!this.inProgress) {
        this.toasterService.error(this.error);
      }
    }
  }

  setSubject(subject) {
    this.subject = subject;
  }

  setSubReason(reason) {
    this.subReason = reason;
  }

  //onSelectionChange(item) {
  //  this.subject = item.value;
  //}

  close() {
    this.modalService.dismissAll();
  }

  /**
   * Submits the report to the appropiate server endpoint using the current settings
   */
  async submit() {
    if (
      this.isAdmin &&
      !confirm('Warning: This action is being run as admin - proceed?')
    ) {
      this.toasterService.inform('Action cancelled');
      return;
    }

    this.inProgress = true;

    try {
      let response: any = await this.client.post(`api/v2/moderation/report`, {
        entity_guid: this.guid,
        reason_code: this.subject.value,
        note: this.note,
        sub_reason_code: this.subReason.value,
      });

      this.inProgress = false;
      this.success = true;

      if (this.session.isAdmin()) {
        this.close();
      }

      this._opts?.onReported?.(
        this.guid,
        this.subject.value,
        this.subReason.value
      );
    } catch (e) {
      this.inProgress = false;
      //this.overlayModal.dismiss();\
      this.toasterService.error('There was an error sending your report.');
      this.toasterService.error(e.message ? e.message : e);
    }
  }

  /**
   * Whether or not user is logged in via an admin session.
   * @returns { boolean } - true if logged in user is admin.
   */
  get isAdmin(): boolean {
    return this.session.isAdmin();
  }
}
