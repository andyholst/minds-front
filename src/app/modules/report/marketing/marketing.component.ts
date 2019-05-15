import { 
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef, 
} from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../common/api/client.service';
import { MindsTitle } from '../../../services/ux/title';
import { REASONS as REASONS_LIST } from '../../../services/list-options';


@Component({
  selector: 'm-reports__marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReportsMarketingComponent {

  user = window.Minds.user;
  minds = window.Minds;
  stats = {
    reported: 0,
    reportedPct: 0,
    appealedPct: 0,
    upheldPct: 0,
  };
  reasons = REASONS_LIST;

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
    private router: Router,
    private title: MindsTitle,
  ) {
    title.setTitle('Community Moderation');
  }

  ngOnInit() {
    this.loadStats();
  }

  startJuryDuty() {
    this.router.navigate(['/moderation/juryduty/appeal']);
  }

  async loadStats() {
    let response: any = await this.client.get('api/v2/moderation/stats');
    this.stats = response.stats;
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
