import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'm-blockchainMarketing__rewards',
  templateUrl: 'rewards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockchainMarketingRewardsComponent {
  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;

  readonly contributionValues: { [key: string]: number } =
    window.Minds.contribution_values;

  @ViewChild('topAnchor', { static: false })
  readonly topAnchor: ElementRef;

  constructor(protected cd: ChangeDetectorRef) {}

  scrollToTop() {
    if (this.topAnchor.nativeElement) {
      this.topAnchor.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
