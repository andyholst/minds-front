import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule as NgFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { DefaultFeedComponent } from './feed/feed.component';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { DefaultFeedContainerComponent } from './container.component';
import { DiscoveryDisclaimerModule } from '../discovery/disclaimer/disclaimer.module';
import { SuggestionsModule } from '../suggestions/suggestions.module';

@NgModule({
  imports: [
    NgCommonModule,
    NgFormsModule,
    CommonModule,
    ActivityModule,
    DiscoveryDisclaimerModule,
    SuggestionsModule,
  ],
  declarations: [DefaultFeedComponent, DefaultFeedContainerComponent],
  exports: [DefaultFeedContainerComponent],
})
export class DefaultFeedModule {}
