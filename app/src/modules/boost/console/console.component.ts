import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Session, SessionFactory } from '../../../services/session';
import { Client } from '../../../services/api/client';

export type BoostConsoleType = 'newsfeed' | 'content' | 'peer' | 'publisher';
export type BoostConsoleFilter = 'create' | 'history' | 'earnings' | 'payouts' | 'settings' | 'inbox' | 'outbox';

@Component({
  moduleId: module.id,
  selector: 'm-boost-console',
  templateUrl: 'console.component.html'
})
export class BoostConsoleComponent {

  type: BoostConsoleType;
  minds: Minds = window.Minds;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
  
    this.route.firstChild.url.subscribe(segments => {
      console.log(segments);
      this.type = <BoostConsoleType>segments[0].path;
    });

  }
}
