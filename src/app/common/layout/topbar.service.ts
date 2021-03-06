import { V3TopbarComponent } from './v3-topbar/v3-topbar.component';
import { Injectable } from '@angular/core';

type TopbarComponentT = V3TopbarComponent;

@Injectable()
export class TopbarService {
  private container: TopbarComponentT;

  setContainer(container: TopbarComponentT) {
    this.container = container;
    return this;
  }

  toggleMarketingPages(
    value: boolean,
    showBottombar: boolean = true,
    forceBackground: boolean = true
  ): void {}

  toggleVisibility(visible: boolean): void {
    if (this.container) {
      this.container.toggleVisibility(visible);
    }
  }

  toggleSearchBar(visible: boolean): void {
    if (this.container) {
      (<V3TopbarComponent>this.container).toggleSearchBar(visible);
    }
  }
}
