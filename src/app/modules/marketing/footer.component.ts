import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
  OnInit,
  HostListener,
  Injector,
  SkipSelf,
  Input,
} from '@angular/core';
import { ConfigsService } from '../../common/services/configs.service';

@Component({
  selector: 'm-marketing__footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.ng.scss'],
})
export class MarketingFooterComponent {
  readonly year: number = new Date().getFullYear();
  @Input()
  readonly slogan = $localize`:@@TAKE_BACK_CONTROL:Take back control of your social media`;

  readonly cdnAssetsUrl: string;

  constructor(
    private configs: ConfigsService,
    protected cd: ChangeDetectorRef,
    @SkipSelf() private injector: Injector
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }
}
