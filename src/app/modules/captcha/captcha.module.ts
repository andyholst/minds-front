import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CaptchaComponent } from './captcha.component';
import { FormsModule } from '@angular/forms';
import { CaptchaModalComponent } from './captcha-modal/captcha-modal.component';
import { CommonModule } from '../../common/common.module';
import { FriendlyCaptchaComponent } from './friendly-catpcha/friendly-captcha.component';

@NgModule({
  imports: [NgCommonModule, CommonModule, FormsModule],
  declarations: [
    CaptchaComponent,
    CaptchaModalComponent,
    FriendlyCaptchaComponent,
  ],
  exports: [CaptchaComponent, FriendlyCaptchaComponent],
})
export class CaptchaModule {}
