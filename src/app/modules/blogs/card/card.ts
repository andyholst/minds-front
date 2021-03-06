import { Component, HostBinding, OnInit } from '@angular/core';
import { Session } from '../../../services/session';
import { AttachmentService } from '../../../services/attachment';
import { ACCESS } from '../../../services/list-options';
import { ExperimentsService } from '../../experiments/experiments.service';

@Component({
  selector: 'minds-card-blog',
  inputs: ['_blog : object'],
  templateUrl: 'card.html',
  styleUrls: ['card.ng.scss'],
})
export class BlogCard implements OnInit {
  minds;
  blog;
  access = ACCESS;

  @HostBinding('class.m-blogCard--activityV2')
  activityV2Feature: boolean = false;

  constructor(
    public session: Session,
    public attachment: AttachmentService,
    private experiments: ExperimentsService
  ) {}

  set _blog(value: any) {
    if (!value.thumbnail_src || !value.header_bg)
      value.thumbnail_src = 'assets/videos/earth-1/earth-1.png';
    this.blog = value;
  }

  ngOnInit(): void {
    this.activityV2Feature = this.experiments.hasVariation(
      'front-5229-activities',
      true
    );
  }
}
