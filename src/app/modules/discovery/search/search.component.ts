import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfigsService } from '../../../common/services/configs.service';
import {
  DiscoveryFeedsService,
  DiscoveryFeedsContentType,
  DiscoveryFeedsContentFilter,
} from '../feeds/feeds.service';
import { FeedsService } from '../../../common/services/feeds.service';

import { combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { MetaService } from '../../../common/services/meta.service';
import { CardCarouselService } from '../card-carousel/card-carousel.service';
import { Session } from '../../../services/session';
import { ExperimentsService } from '../../experiments/experiments.service';

@Component({
  selector: 'm-discovery__search',
  templateUrl: './search.component.html',
  styleUrls: ['search.component.ng.scss'],
  providers: [DiscoveryFeedsService, FeedsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverySearchComponent {
  q: string;
  filter: DiscoveryFeedsContentFilter;
  type$ = this.service.type$;
  entities$ = this.service.entities$;
  entities: any[] = [];
  inProgress$ = this.service.inProgress$;
  hasMoreData$ = this.service.hasMoreData$;
  cardCarouselInProgress$ = this.cardCarouselService.inProgress$;
  subscriptions: Subscription[];
  readonly cdnUrl: string;

  showSuggestedChannels$: Observable<boolean> = combineLatest([
    this.inProgress$,
    this.cardCarouselInProgress$,
    this.cardCarouselService.searchCards$,
  ]).pipe(
    map(([inProgress, cardCarouselInProgress, searchCards]) => {
      return (
        searchCards?.length > 0 || (!inProgress && !cardCarouselInProgress)
      );
    })
  );

  @HostBinding('class.m-discovery__search--activityV2')
  get activityV2Feature(): boolean {
    return this.experiments.hasVariation('front-5229-activities', true);
  }

  constructor(
    private route: ActivatedRoute,
    public service: DiscoveryFeedsService,
    private router: Router,
    configs: ConfigsService,
    private metaService: MetaService,
    private cd: ChangeDetectorRef,
    private session: Session,
    public cardCarouselService: CardCarouselService,
    private experiments: ExperimentsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit() {
    this.subscriptions = [
      this.route.queryParamMap
        .pipe(distinctUntilChanged())
        .subscribe((params: ParamMap) => {
          this.q = params.get('q');
          this.filter = <DiscoveryFeedsContentFilter>params.get('f');
          this.service.setFilter(this.filter);
          this.service.setType(
            <DiscoveryFeedsContentType>params.get('t') || 'all'
          );
          this.setSeo();
        }),
      combineLatest(
        this.service.nsfw$,
        this.service.period$,
        this.service.type$,
        this.service.filter$,
        this.route.paramMap
      )
        .pipe(distinctUntilChanged(), debounceTime(300))
        .subscribe(([nsfw, period, type, filter, paramMap]) => {
          // if (filter !== paramMap.get('f') || type !== paramMap.get('t')) {
          //   this.router.navigate([], {
          //     relativeTo: this.route,
          //     queryParams: { q: this.q, f: filter, t: type },
          //     queryParamsHandling: 'merge',
          //   });
          // } else {
          this.service.search(this.q);
          this.cardCarouselService.search(this.q);
          // }
        }),
      this.entities$.subscribe(entities => {
        this.setSeo();

        this.entities = entities;

        this.detectChanges();
      }),
      this.inProgress$.subscribe(() => {
        this.detectChanges();
      }),
      this.cardCarouselInProgress$.subscribe(() => {
        this.detectChanges();
      }),
    ];
  }

  setSeo() {
    this.metaService.setTitle(`${this.q} - Minds Search`);
    this.metaService.setDescription(`Discover ${this.q} posts on Minds.`);
    this.metaService.setCanonicalUrl(
      `/discovery/search?q=${this.q}&f=${this.filter}&t=${this.type$.value}`
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  loadMore() {
    if (this.service.inProgress$.getValue()) {
      return;
    }
    this.service.loadMore();
  }

  /**
   * Whether user is logged in.
   * @returns { boolean } - True if user is logged in.
   */
  public isLoggedIn(): boolean {
    return !!this.session.getLoggedInUser();
  }

  detectChanges(): void {
    this.cd.detectChanges();
    this.cd.markForCheck();
  }
}
