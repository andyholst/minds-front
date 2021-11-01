import { Component, OnInit } from '@angular/core';
import { DiscoveryFeedsService } from '../feeds/feeds.service';

@Component({
  selector: 'm-discovery__trendingTags',
  templateUrl: './trending-tags.component.html',
  styleUrls: ['./trending-tags.component.scss'],
})
export class DiscoveryTrendingTagsComponent implements OnInit {
  constructor(private service: DiscoveryFeedsService) {}

  ngOnInit(): void {
    this.service.setFilter('trending');
    this.service.setPeriod('12h');
  }
}
