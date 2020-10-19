import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { OnboardingV3WidgetComponent } from './widget/onboarding-widget.component';
import { OnboardingV3Service } from './onboarding-v3.service';

/**
 * Module definition
 */
@NgModule({
  imports: [NgCommonModule, CommonModule],
  declarations: [OnboardingV3WidgetComponent],
  exports: [OnboardingV3WidgetComponent],
  providers: [OnboardingV3Service],
})
export class OnboardingV3Module {}
