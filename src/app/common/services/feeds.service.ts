import { Injectable, OnDestroy } from '@angular/core';

import { Client } from '../../services/api/client';
import { Session } from '../../services/session';

import { EntitiesService } from './entities.service';
import { BlockListService } from './block-list.service';

import { BehaviorSubject, Observable, combineLatest, Subscription } from 'rxjs';
import { switchMap, map, tap, first } from 'rxjs/operators';

//ojm temp
import * as moment from 'moment';

/**
 * Enables the grabbing of data through observable feeds.
 */
@Injectable()
export class FeedsService implements OnDestroy {
  limit: BehaviorSubject<number> = new BehaviorSubject(12);
  offset: BehaviorSubject<number> = new BehaviorSubject(0);
  fallbackAt: number | null = null;
  fallbackAtIndex: BehaviorSubject<number | null> = new BehaviorSubject(null);
  pageSize: Observable<number>;
  pagingToken: string = '';
  canFetchMore: boolean = true;
  endpoint: string = '';
  params: any = { sync: 1 };
  castToActivities: boolean = false;
  exportUserCounts: boolean = false;
  fromTimestamp: string = '';

  rawFeed: BehaviorSubject<Object[]> = new BehaviorSubject([]);
  feed: Observable<BehaviorSubject<Object>[]>;
  inProgress: BehaviorSubject<boolean> = new BehaviorSubject(true);
  hasMore: Observable<boolean>;
  blockListSubscription: Subscription;

  constructor(
    protected client: Client,
    protected session: Session,
    protected entitiesService: EntitiesService,
    protected blockListService: BlockListService
  ) {
    this.pageSize = this.offset.pipe(
      map((offset) => this.limit.getValue() + offset)
    );

    this.feed = this.rawFeed.pipe(
      tap((feed) => {
        if (feed.length) this.inProgress.next(true);
      }),
      switchMap(async (feed) => {
        return feed.slice(0, await this.pageSize.pipe(first()).toPromise());
      }),
      switchMap((feed) =>
        this.entitiesService
          .setCastToActivities(this.castToActivities)
          .setExportUserCounts(this.exportUserCounts)
          .getFromFeed(feed)
      ),
      tap((feed) => {
        if (feed.length && this.fallbackAt) {
          for (let i = 0; i < feed.length; i++) {
            const entity: any = feed[i].getValue();

            if (
              entity &&
              entity.time_created &&
              entity.time_created < this.fallbackAt
            ) {
              this.fallbackAtIndex.next(i);
              break;
            }
          }
        }
      }),
      tap((feed) => {
        if (feed.length)
          // We should have skipped but..
          this.inProgress.next(false);
      })
    );

    // Trigger a re-run of the above pipe on blockedList emission.
    this.blockListSubscription = blockListService.blocked.subscribe((block) => {
      this.rawFeed.next(this.rawFeed.getValue());
    });

    this.hasMore = combineLatest(
      this.rawFeed,
      this.inProgress,
      this.offset
    ).pipe(
      map((values) => {
        const feed = values[0];
        const inProgress = values[1];
        const offset = values[2];
        return inProgress || feed.length > offset;
      })
    );
  }

  ngOnDestroy(): void {
    if (this.blockListSubscription) {
      this.blockListSubscription.unsubscribe();
    }
  }

  /**
   * Sets the endpoint for this instance.
   * @param { string } endpoint - the endpoint for this instance. For example `api/v1/entities/owner`.
   */
  setEndpoint(endpoint: string): FeedsService {
    this.endpoint = endpoint;
    return this;
  }

  /**
   * Sets the limit to be returned per next() call.
   * @param { number } limit - the limit to retrieve.
   */
  setLimit(limit: number): FeedsService {
    this.limit.next(limit);
    return this;
  }

  /**
   * Sets parameters to be used.
   * @param { Object } params - parameters to be used.
   */
  setParams(params): FeedsService {
    this.params = params;
    if (!params.sync) {
      this.params.sync = 1;
    }
    return this;
  }

  /**
   * Sets the offset of the request
   * @param { number } offset - the offset of the request.
   */
  setOffset(offset: number): FeedsService {
    this.offset.next(offset);
    return this;
  }

  /**
   * Sets castToActivities
   * @param { boolean } cast - whether or not to set as_activities to true.
   */
  setCastToActivities(cast: boolean): FeedsService {
    this.castToActivities = cast;
    return this;
  }

  /**
   * Sets exportUserCounts
   * @param { boolean } export - whether or not to export user's subscribers_count and subscriptions_count.
   */
  setExportUserCounts(value: boolean): FeedsService {
    this.exportUserCounts = value;
    return this;
  }

  /**
   * Sets fromTimestamp
   * NOTE: "from" refers to the starting point (top) of the feed,
   * not chronological time. Since by default feeds start with the most recent activity,
   * "from" should be the most recent date
   * @param {string } export - whether or not to export user's subscribers_count and subscriptions_count.
   */
  setFromTimestamp(value: string): FeedsService {
    console.log('ojm setFromTimestamp', value);
    this.fromTimestamp = value;
    return this;
  }

  /**
   * Fetches the data.
   */
  fetch(): Promise<any> {
    if (!this.offset.getValue()) {
      this.inProgress.next(true);
    }

    const endpoint = this.endpoint;

    let fromTimestamp = this.pagingToken
      ? this.pagingToken
      : this.fromTimestamp;
    // ojm
    // if (this.pagingToken) {
    //   if (!this.fromTimestamp || this.pagingToken >= this.fromTimestamp) {
    //     fromTimestamp = this.pagingToken;
    //   }
    // }

    // ojm stop feed if paging token is earlier than to_timestamp?
    console.log('ojm FEEDS FETCH()', {
      fromTimestamp: fromTimestamp,
      pagingToken: this.pagingToken,
      toTimestamp: this.params.to_timestamp,
      offset: this.offset.getValue(),
      canFetchMore: this.canFetchMore,
      hasMore: this.hasMore,
    });
    console.log(
      'ojmFEEDS FETCH() pagingToken',
      this.pagingToken,
      moment(parseInt(this.pagingToken)).format('MMM DD YYYY, HH:')
    );
    console.log(
      'ojmFEEDS FETCH() fromTimestamp',
      this.fromTimestamp,

      moment(parseInt(this.fromTimestamp)).format('MMM DD YYYY, HH:')
    );
    console.log(
      'ojmFEEDS FETCH() toTimestamp',
      this.params.to_timestamp,
      moment(parseInt(this.params.to_timestamp)).format('MMM DD YYYY, HH:')
    );

    return this.client
      .get(this.endpoint, {
        ...this.params,
        ...{
          // ojm uncomment/remove
          // limit: 13,
          limit: 150, // Over 12 scrolls
          as_activities: this.castToActivities ? 1 : 0,
          export_user_counts: this.exportUserCounts ? 1 : 0,
          // ojm from_timestamp: this.pagingToken ?? this.fromTimestamp,
          from_timestamp: fromTimestamp,
        },
      })
      .then((response: any) => {
        if (this.endpoint !== endpoint) {
          // Avoid race conditions if endpoint changes
          return;
        }

        if (!this.offset.getValue()) {
          this.inProgress.next(false);
        }

        if (!response.entities && response.activity) {
          response.entities = response.activity;
        } else if (!response.entities && response.users) {
          response.entities = response.users;
        }

        if (response.entities?.length) {
          this.fallbackAt = response['fallback_at'];
          this.fallbackAtIndex.next(null);
          this.rawFeed.next(this.rawFeed.getValue().concat(response.entities));
          this.pagingToken = response['load-next'];
          // ojm solution:??
          // this.setFromTimestamp(this.pagingToken);

          console.log(
            'ojmFEEDS RESPONSE.load-next',
            this.pagingToken,
            moment(parseInt(this.pagingToken)).format('MMM DD YYYY, HH:')
          );
          if (!this.pagingToken) {
            this.canFetchMore = false;
          }
        } else {
          this.canFetchMore = false;
        }
      })
      .catch((e) => console.log(e));
  }

  /**
   * To be called upload loading more data
   */
  loadMore(): FeedsService {
    if (!this.inProgress.getValue()) {
      console.log('ojm feed loadMore');
      this.setOffset(this.limit.getValue() + this.offset.getValue());
      this.rawFeed.next(this.rawFeed.getValue());
    }
    return this;
  }

  /**
   * Loads next batch. Used by infinite scroll component
   */
  loadNext() {
    if (
      this.canFetchMore &&
      !this.inProgress.getValue() &&
      this.offset.getValue()
    ) {
      console.log('ojm feed loadnext->fetch');
      this.fetch(); // load the next 150 in the background
    }
    console.log('ojm feed loadnext->loadmore');

    this.loadMore();
  }

  deleteItem(obj: any, comparatorFn: (item, obj) => boolean): FeedsService {
    const feed: any[] = this.rawFeed.getValue();
    feed.forEach((item, index) => {
      if (comparatorFn(item, obj)) {
        feed.splice(index, 1);
      }
    });
    this.rawFeed.next(feed);
    return this;
  }

  /**
   * To clear data.
   */
  clear(): FeedsService {
    this.fallbackAt = null;
    this.fallbackAtIndex.next(null);
    this.offset.next(0);
    this.pagingToken = '';
    this.rawFeed.next([]);
    return this;
  }

  async destroy() {}

  static _(
    client: Client,
    session: Session,
    entitiesService: EntitiesService,
    blockListService: BlockListService
  ) {
    return new FeedsService(client, session, entitiesService, blockListService);
  }
}
