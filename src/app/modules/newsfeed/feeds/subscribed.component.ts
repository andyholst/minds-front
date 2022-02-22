import { FeedAlgorithmHistoryService } from './../services/feed-algorithm-history.service';
import {
  Component,
  ElementRef,
  Inject,
  Injectable,
  Injector,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  Self,
  SkipSelf,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { Client, Upload } from '../../../services/api';
import { Navigation as NavigationService } from '../../../services/navigation';
import { ContextService } from '../../../services/context.service';
import { FeedsService } from '../../../common/services/feeds.service';
import { NewsfeedService } from '../services/newsfeed.service';
import { isPlatformServer } from '@angular/common';
import { ComposerComponent } from '../../composer/composer.component';
import { FeedsUpdateService } from '../../../common/services/feeds-update.service';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { ExperimentsService } from '../../experiments/experiments.service';

export type FeedAlgorithm = 'top' | 'latest';

@Injectable()
export class LatestFeedService extends FeedsService {}

@Injectable()
export class TopFeedService extends FeedsService {}

@Component({
  selector: 'm-newsfeed--subscribed',
  providers: [LatestFeedService, TopFeedService],
  templateUrl: 'subscribed.component.html',
})
export class NewsfeedSubscribedComponent implements OnInit, OnDestroy {
  prepended: Array<any> = [];
  offset: string | number = '';
  showBoostRotator: boolean = true;
  inProgress: boolean = false;
  moreData: boolean = true;
  algorithm: FeedAlgorithm;
  message: string = '';
  newUserPromo: boolean = false;
  postMeta: any = {
    title: '',
    description: '',
    thumbnail: '',
    url: '',
    active: false,
    attachment_guid: null,
  };
  paramsSubscription: Subscription;
  reloadFeedSubscription: Subscription;
  routerSubscription: Subscription;
  topFeedExperimentActive: boolean = this.experiments.hasVariation(
    'top-feed-2',
    true
  );

  /**
   * Listening for new posts.
   */
  private feedsUpdatedSubscription: Subscription;

  @ViewChild('composer') private composer: ComposerComponent;
  @ViewChildren('feedViewChildren', { read: ElementRef })
  feedViewChildren: QueryList<ElementRef>;

  constructor(
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    private feedAlgorithmHistory: FeedAlgorithmHistoryService,
    private context: ContextService,
    @Self() public latestFeedService: LatestFeedService,
    @Self() public topFeedService: TopFeedService,
    protected newsfeedService: NewsfeedService,
    protected clientMetaService: ClientMetaService,
    public feedsUpdate: FeedsUpdateService,
    private toast: FormToastService,
    private experiments: ExperimentsService,
    @SkipSelf() injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformServer(this.platformId)) return;

    if (this.topFeedExperimentActive) {
      const storedfeedAlgorithm = this.feedAlgorithmHistory.lastAlorithm;
      if (storedfeedAlgorithm) {
        this.algorithm = storedfeedAlgorithm;
      }
    }
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showBoostRotator = false;
        this.load();
        setTimeout(() => {
          this.showBoostRotator = true;
        }, 100);
      });

    this.reloadFeedSubscription = this.newsfeedService.onReloadFeed.subscribe(
      () => {
        this.load();
      }
    );

    this.load();

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['algorithm']) {
        this.changeFeedAlgorithm(params['algorithm']);
      }

      if (params['message']) {
        this.message = params['message'];
      }

      this.newUserPromo = !!params['newUser'];
    });

    // catch Zendesk errors and make them domain specific.
    this.route.queryParams.subscribe(params => {
      if (params.kind === 'error') {
        if (
          /User is invalid: External minds-guid:\d+ has already been taken/.test(
            params.message
          )
        ) {
          this.toast.error('Your email is already linked to a support account');
          return;
        }

        if (
          params.message ===
          'Please use one of the options below to sign in to Zendesk.'
        ) {
          this.toast.error('Authentication method invalid');
          return;
        }

        this.toast.error(params.message ?? 'An unknown error has occurred');
      }
    });

    this.feedsUpdatedSubscription = this.feedsUpdate.postEmitter.subscribe(
      newPost => {
        this.prepend(newPost);
      }
    );

    this.context.set('activity');
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.reloadFeedSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
    this.feedsUpdatedSubscription.unsubscribe();
  }

  /**
   * returns feedService based on algorithm
   **/
  get feedService(): FeedsService {
    if (this.algorithm === 'top') {
      return this.topFeedService;
    }

    return this.latestFeedService;
  }

  async load() {
    if (isPlatformServer(this.platformId)) return;

    this.moreData = true;
    this.offset = 0;
    this.showBoostRotator = false;
    this.inProgress = true;

    let queryParams = {
      algorithm: this.algorithm,
    };

    if (this.experiments.hasVariation('newsfeed-group-posts', true)) {
      queryParams['include_group_posts'] = true;
    }

    try {
      switch (this.algorithm) {
        case 'top':
          this.topFeedService.clear(true);
          await this.topFeedService
            .setEndpoint(`api/v3/newsfeed/feed/unseen-top`)
            .setLimit(12)
            .fetch(true);
          break;
        case 'latest':
          this.latestFeedService.clear(true);
          this.topFeedService.clear(true);
          this.prepended = [];
          await Promise.all([
            this.topFeedService
              .setEndpoint(`api/v3/newsfeed/feed/unseen-top`)
              .setLimit(3)
              .fetch(true),
            this.latestFeedService
              .setEndpoint(`api/v2/feeds/subscribed/activities`)
              .setLimit(12)
              .fetch(true),
          ]);
          break;
      }
    } catch (e) {
      console.error('Load Feed', e);
    }

    this.inProgress = false;
    this.showBoostRotator = true;
  }

  loadNext() {
    if (
      this.feedService.canFetchMore &&
      !this.feedService.inProgress.getValue() &&
      this.feedService.offset.getValue()
    ) {
      this.feedService.fetch(); // load the next 150 in the background
    }
    this.feedService.loadMore();
  }

  prepend(activity: any) {
    if (this.newUserPromo) {
      this.autoBoost(activity);
      activity.boostToggle = false;
      activity.boosted = true;
    }
    this.prepended.unshift(activity);

    this.newUserPromo = false;
  }

  autoBoost(activity: any) {
    this.client.post(
      'api/v2/boost/activity/' + activity.guid + '/' + activity.owner_guid,
      {
        newUserPromo: true,
        impressions: 200,
        destination: 'Newsfeed',
      }
    );
  }

  delete(activity) {
    let i: any;

    for (i in this.prepended) {
      if (this.prepended[i] === activity) {
        this.prepended.splice(i, 1);
        return;
      }
    }

    this.feedService.deleteItem(activity, (item, obj) => {
      return item.urn === obj.urn;
    });
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (this.composer) {
      return this.composer.canDeactivate();
    }
  }

  /**
   * change feed algorithm
   **/
  changeFeedAlgorithm(algo: FeedAlgorithm) {
    this.algorithm = algo;
    this.feedAlgorithmHistory.lastAlorithm = algo;
    this.load();
  }

  /**
   * smooth scrolls to top and changes feed algorithm
   **/
  onShowMoreTopFeed() {
    if (isPlatformServer(this.platformId)) return;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setTimeout(() => {
      this.changeFeedAlgorithm('top');
    }, 500);
  }

  /**
   * determines whether to show top feed highlights or not
   * @param { number } index the index of the feed
   */
  shouldShowTopHighlights(index: number) {
    if (!this.topFeedExperimentActive) {
      return false;
    }

    // only on latest
    if (this.algorithm !== 'latest') {
      return false;
    }

    // before 4th post
    return index === 3;
  }
}
