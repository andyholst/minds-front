import { Injectable, Compiler, Injector } from '@angular/core';
import { AuthModalComponent } from './auth-modal.component';
import { Subject, combineLatest, Observable, concat, merge } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';
import { FeaturesService } from '../../../services/features.service';
import { OnboardingV3Service } from '../../onboarding-v3/onboarding-v3.service';
import { Session } from '../../../services/session';
import { ModalService } from '../../../services/ux/modal.service';

@Injectable()
export class AuthModalService {
  constructor(
    private compiler: Compiler,
    private injector: Injector,
    private modalService: ModalService,
    private features: FeaturesService,
    private onboardingV3: OnboardingV3Service,
    private session: Session
  ) {}

  async open(
    opts: { formDisplay: string } = { formDisplay: 'register' }
  ): Promise<MindsUser> {
    if (this.session.isLoggedIn()) {
      return this.session.getLoggedInUser();
    }

    const { AuthModalModule } = await import('./auth-modal.module');
    const onSuccess$: Subject<MindsUser> = new Subject();

    const modal = this.modalService.present(AuthModalComponent, {
      data: {
        formDisplay: opts.formDisplay,
        onComplete: async (user: MindsUser) => {
          onSuccess$.next(user);
          onSuccess$.complete(); // Ensures promise can be called below
          modal.close(user);

          if (
            this.features.has('onboarding-october-2020') &&
            opts.formDisplay === 'register'
          ) {
            try {
              await this.onboardingV3.open();
            } catch (e) {
              if (e === 'DismissedModalException') {
                // reload so that widget updates with save.
                this.onboardingV3.load();
                return; // modal dismissed, do nothing
              }
            }
          }
        },
      },
      keyboard: false,
      injector: this.injector,
      lazyModule: AuthModalModule,
    });

    const result = await modal.result;

    // Modal was closed before login completed
    if (!result) {
      throw 'DismissedModalException';
    }

    return onSuccess$.toPromise();
  }
}
