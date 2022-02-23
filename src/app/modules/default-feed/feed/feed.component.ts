import { Component, Input, OnInit } from '@angular/core';
import { FeedsService } from '../../../common/services/feeds.service';
import { ExperimentsService } from '../../experiments/experiments.service';

/**
 * A default recommendations feed - can be accessed by logged-out users.
 * Users subscribers of a recommendations user on the backend.
 */
@Component({
  selector: 'm-defaultFeed',
  providers: [FeedsService],
  templateUrl: 'feed.component.html',
  styleUrls: ['./feed.component.ng.scss'],
})
export class DefaultFeedComponent implements OnInit {
  /**
   * the location in which this feed appears. Used for
   * recommendations widget
   */
  @Input()
  location: string;

  constructor(
    public feedsService: FeedsService,
    public experiments: ExperimentsService
  ) {}

  public ngOnInit(): void {
    this.load(true);
  }

  /**
   * Loads more content to the feed.
   * @returns { void }
   */
  public loadNext(): void {
    if (
      this.feedsService.canFetchMore &&
      !this.feedsService.inProgress.getValue() &&
      this.feedsService.offset.getValue()
    ) {
      this.feedsService.fetch();
    }
    this.feedsService.loadMore();
  }

  /**
   * Loads the feed.
   * @param { boolean } - are we refreshing?
   * @returns { void }
   */
  private load(refresh: boolean = false): void {
    if (refresh) {
      this.feedsService.clear(true);
    }

    try {
      this.feedsService
        .setEndpoint(`api/v3/newsfeed/default-feed`)
        .setLimit(12)
        .fetch(refresh);
    } catch (e) {
      console.error('DefaultFeedComponent', e);
    }
  }

  /**
   * whether channel recommendation should be shown
   * @param { number } index the index of the feed
   * @returns { boolean }
   */
  shouldShowChannelRecommendation(index: number) {
    if (!this.location) {
      return false;
    }

    if (!this.experiments.hasVariation('channel-recommendations', true)) {
      return false;
    }

    if (this.feedsService.feedLength <= 3) {
      // if the newsfeed length was less than equal to 3,
      // show the widget after last item
      return this.feedsService.feedLength - 1;
    }

    // show after the 3rd post
    return index === 2;
  }
}
