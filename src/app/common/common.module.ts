import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MINDS_PIPES } from './pipes/pipes';

import { TopbarComponent } from './layout/topbar/topbar.component';
import { TopbarNavigationComponent } from './layout/topbar/navigation.component';
import { SidebarNavigationComponent } from './layout/sidebar/navigation.component';
import { TopbarOptionsComponent } from './layout/topbar/options.component';
import { TopbarWalletBalance } from './layout/topbar/topbar-wallet-balance/topbar-wallet-balance.component';

import { TooltipComponent } from './components/tooltip/tooltip.component';
import { QualityScoreComponent } from './components/quality-score/quality-score.component';
import { SizeableLoadingSpinnerComponent } from './components/sizeable-loading-spinner/sizeable-loading-spinner.component';
import { FooterComponent } from './components/footer/footer.component';
import { InfiniteScroll } from './components/infinite-scroll/infinite-scroll';
import { CountryInputComponent } from './components/forms/country-input/country-input.component';
import { DateInputComponent } from './components/forms/date-input/date-input.component';
import { CityFinderComponent } from './components/forms/city-finder/city-finder.component';
import { StateInputComponent } from './components/forms/state-input/state-input.component';
import { ReadMoreDirective } from './read-more/read-more.directive';
import { ReadMoreButtonComponent } from './read-more/button.component';
import { ChannelBadgesComponent } from './components/badges/badges.component';
import { NSFWSelectorComponent } from './components/nsfw-selector/nsfw-selector.component';
import {
  NSFWSelectorConsumerService,
  NSFWSelectorCreatorService,
} from './components/nsfw-selector/nsfw-selector.service';

import { Scheduler } from './components/scheduler/scheduler';
import { Modal } from './components/modal/modal.component';
import { MindsRichEmbed } from './components/rich-embed/rich-embed';
import { QRCodeComponent } from './components/qr-code/qr-code.component';

import { MDL_DIRECTIVES } from './directives/material';
import { AutoGrow } from './directives/autogrow';
import { InlineAutoGrow } from './directives/inline-autogrow';
import { Emoji } from './directives/emoji';
import { ScrollLock } from './directives/scroll-lock';
import { TagsLinks } from './directives/tags';
import { Tooltip } from './directives/tooltip';
import { MindsAvatar } from './components/avatar/avatar';
import { Textarea } from './components/editors/textarea.component';
import { TagcloudComponent } from './components/tagcloud/tagcloud.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';

import { DynamicHostDirective } from './directives/dynamic-host.directive';
import { MindsCard } from './components/card/card.component';
import { MindsButton } from './components/button-v1/button-v1.component';

import { ChartComponent } from './components/chart/chart.component';
import { DateSelectorComponent } from './components/date-selector/date-selector.component';
import { AdminActionsButtonComponent } from './components/button-v1/admin-actions/admin-actions.component';
import { InlineEditorComponent } from './components/editors/inline-editor.component';
import { AttachmentService } from '../services/attachment';
import { MaterialBoundSwitchComponent } from './components/material/bound-switch.component';
import { IfFeatureDirective } from './directives/if-feature.directive';
import { IfBrowserDirective } from './directives/if-browser.directive';
import { MindsEmoji } from './components/emoji/emoji';
import { CategoriesSelectorComponent } from './components/categories/selector/selector.component';
import { CategoriesSelectedComponent } from './components/categories/selected/selected.component';
import { TreeComponent } from './components/tree/tree.component';
import { AnnouncementComponent } from './components/announcements/announcement.component';
import { MindsTokenSymbolComponent } from './components/cypto/token-symbol.component';
import { PhoneInputComponent } from './components/phone-input/phone-input.component';
import { PhoneInputCountryComponent } from './components/phone-input/country.component';
import { Session } from '../services/session';
import { MindsHttpClient } from './api/client.service';
import { SafeToggleComponent } from './components/safe-toggle/safe-toggle.component';
import { ThumbsUpButton } from './components/thumbs/thumbs-up.component';
import { ThumbsDownButton } from './components/thumbs/thumbs-down.component';
import { DismissableNoticeComponent } from './components/notice/notice.component';
import { AnalyticsImpressions } from './components/analytics/impressions';
import { LineGraph } from './components/graphs/line-graph';
import { PieGraph } from './components/graphs/pie-graph';
import { GraphSVG } from './components/graphs/svg';
import { GraphPoints } from './components/graphs/points';
import { DynamicFormComponent } from './components/forms/dynamic-form/dynamic-form.component';
import { SortSelectorComponent } from './components/sort-selector/sort-selector.component';

import { UpdateMarkersService } from './services/update-markers.service';
import { SocketsService } from '../services/sockets';
import { HttpClient } from '@angular/common/http';
import { AndroidAppDownloadComponent } from './components/android-app-download-button/button.component';
import { SwitchComponent } from './components/switch/switch.component';
import { FeaturedContentComponent } from './components/featured-content/featured-content.component';
import { FeaturedContentService } from './components/featured-content/featured-content.service';
import { FeedsService } from './services/feeds.service';
import { HorizontalInfiniteScroll } from './components/infinite-scroll/horizontal-infinite-scroll.component';
import { PosterDateSelectorComponent } from './components/poster-date-selector/selector.component';
import { ChannelModeSelectorComponent } from './components/channel-mode-selector/channel-mode-selector.component';
import { RouterHistoryService } from './services/router-history.service';
import { DraggableListComponent } from './components/draggable-list/list.component';
import { DndModule } from 'ngx-drag-drop';
import { SiteService } from './services/site.service';
import { ToggleComponent } from './components/toggle/toggle.component';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { ShadowboxLayoutComponent } from './components/shadowbox-layout/shadowbox-layout.component';
import { ShadowboxHeaderComponent } from './components/shadowbox-header/shadowbox-header.component';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';
import { DropdownSelectorComponent } from './components/dropdown-selector/dropdown-selector.component';
import { ButtonComponent } from './components/button/button.component';
import { FormDescriptorComponent } from './components/form-descriptor/form-descriptor.component';
import { FormToastComponent } from './components/form-toast/form-toast.component';
import { SsoService } from './services/sso.service';
import { ShadowboxHeaderTabsComponent } from './components/shadowbox-header-tabs/shadowbox-header-tabs.component';
import { TimespanFilterComponent } from './components/timespan-filter/timespan-filter.component';
import { PagesService } from './services/pages.service';
import { DateDropdownsComponent } from './components/date-dropdowns/date-dropdowns.component';
import { EmailConfirmationComponent } from './components/email-confirmation/email-confirmation.component';
import { CookieService } from './services/cookie.service';
import { MediaProxyService } from './services/media-proxy.service';
import { RelatedContentService } from './services/related-content.service';
import { FormInputCheckboxComponent } from './components/forms/checkbox/checkbox.component';
import { AttachmentPasteDirective } from './directives/paste/attachment-paste.directive';
import { PhoneInputV2Component } from './components/phone-input-v2/phone-input-v2.component';
import { PhoneInputCountryV2Component } from './components/phone-input-v2/country.component';
import { RegexService } from './services/regex.service';
import { ExplicitOverlayComponent } from './components/explicit-overlay/overlay.component';
import { V3TopbarComponent } from './layout/v3-topbar/v3-topbar.component';
import { SidebarNavigationService } from './layout/sidebar/navigation.service';
import { TopbarService } from './layout/topbar.service';
import { UserMenuV3Component } from './layout/v3-topbar/user-menu/user-menu.component';
import { NestedMenuComponent } from './layout/nested-menu/nested-menu.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { IconComponent } from './components/icon/icon.component';
import { OverlayComponent } from './components/overlay/overlay.component';
import { AttachmentApiService } from './api/attachment-api.service';
import { ApiService } from './api/api.service';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import {
  PageLayoutContainerDirective,
  PageLayoutPaneDirective,
} from './layout/page-layout.directive';
import { FriendlyTimePipe } from './pipes/friendlytime.pipe';
import { SidebarWidgetComponent } from './components/sidebar-widget/sidebar-widget.component';
import { SidebarNavigationSubnavDirective } from './layout/sidebar/subnav.directive';
import { FeedFilterComponent } from './components/feed-filter/feed-filter.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { AccordionPaneComponent } from './components/accordion/accordion-pane.component';
import { StickySidebarDirective } from './components/sticky-sidebar/sticky-sidebar.directive';
import { PaywallBadgeComponent } from './components/paywall-badge/paywall-badge.component';
import { ClientMetaDirective } from './directives/client-meta.directive';
import { ClientMetaService } from './services/client-meta.service';
import { CarouselComponent } from './components/carousel/carousel.component';
import { UserMenuService } from './layout/v3-topbar/user-menu/user-menu.service';
import { PoweredByComponent } from './components/powered-by/powered-by.component';
import { LoadingEllipsisComponent } from './components/loading-ellipsis/loading-ellipsis.component';
import { MarkedDirective } from './directives/marked.directive';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import { ConfirmV2Component } from '../modules/modals/confirm-v2/confirm';
import { EnvironmentFlagComponent } from '../common/components/environment-flag/environment-flag.component';
import { ErrorSplashComponent } from './components/error-splash/error-splash.component';
import { LaunchButtonComponent } from './components/launch-button/launch-button.component';
import { PublisherCardComponent } from './components/publisher-card/publisher-card.component';
import { SubscribeButtonComponent } from './components/subscribe-button/subscribe-button.component';
import { DownloadActivityMediaService } from './services/download-activity-media.service';
import { HotkeyScrollDirective } from './directives/hotkey-scroll.directive';
import { ChatIconComponent } from './components/chat-icon/chat-icon.component';
import { PublisherSearchModalComponent } from './components/publisher-search-modal/publisher-search-modal.component';
import { PublisherSearchModalService } from './services/publisher-search-modal.service';
import { DateRangeModalComponent } from './components/date-range-modal/date-range-modal.component';
import { DateRangeModalService } from './components/date-range-modal/date-range-modal.services';
import { NgxPopperjsModule } from 'ngx-popperjs';
import { HovercardComponent } from './components/hovercard/hovercard.component';
import { QRCodeModule } from 'angularx-qrcode';
import { BoostRecommendationService } from './services/boost-recommendation.service';
import { JsonLdService } from './services/jsonld.service';
import { FormInputSliderComponent } from './components/slider/slider.component';
import { JoinBannerComponent } from './components/join-banner/join-banner.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { SidebarMoreComponent } from './layout/sidebar-more/sidebar-more.component';
import { SidebarMoreTriggerComponent } from './layout/sidebar-more/sidebar-more-trigger/sidebar-more-trigger.component';
import { TagSelectorComponent } from './components/tag-selector/tag-selector.component';

import { ModalCloseButtonComponent } from './components/modal-close-button/modal-close-button.component';
import { BlurhashDirective } from './directives/blurhash/blurhash.directive';
import { ExperimentsService } from '../modules/experiments/experiments.service';
import { AuthRedirectService } from './services/auth-redirect.service';
import { RelativeTimeSpanComponent } from './components/relative-time-span/relative-time-span.component';
import { SubscriptionService } from './services/subscription.service';
import { RecentSubscriptionsService } from './services/recent-subscriptions.service';
import { ResizedDirective } from './directives/resized.directive';

const routes: Routes = [
  {
    path: 'email-confirmation',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    DndModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxPopperjsModule,
    QRCodeModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    MINDS_PIPES,

    TopbarComponent,
    TopbarNavigationComponent,
    SidebarNavigationComponent,
    TopbarOptionsComponent,
    TopbarWalletBalance,

    // V2 Layout
    V3TopbarComponent,
    UserMenuV3Component,

    //

    TooltipComponent,
    QualityScoreComponent,
    SizeableLoadingSpinnerComponent,
    FooterComponent,
    InfiniteScroll,
    HorizontalInfiniteScroll,
    CountryInputComponent,
    DateInputComponent,
    StateInputComponent,
    CityFinderComponent,
    Scheduler,
    Modal,
    ReadMoreDirective,
    ReadMoreButtonComponent,
    ChannelBadgesComponent,
    MindsRichEmbed,
    TagcloudComponent,
    DropdownComponent,
    QRCodeComponent,

    AutoGrow,
    InlineAutoGrow,
    Emoji,
    MindsEmoji,
    ScrollLock,
    TagsLinks,
    Tooltip,
    MDL_DIRECTIVES,
    DateSelectorComponent,
    MindsAvatar,
    Textarea,
    InlineEditorComponent,

    DynamicHostDirective,
    MindsCard,
    MindsButton,

    ChartComponent,

    AdminActionsButtonComponent,

    MaterialBoundSwitchComponent,

    IfFeatureDirective,
    IfBrowserDirective,

    CategoriesSelectorComponent,
    CategoriesSelectedComponent,
    TreeComponent,

    AnnouncementComponent,
    MindsTokenSymbolComponent,
    PhoneInputComponent,
    PhoneInputCountryComponent,
    SafeToggleComponent,
    ThumbsUpButton,
    ThumbsDownButton,
    DismissableNoticeComponent,
    AnalyticsImpressions,
    LineGraph,
    PieGraph,
    GraphSVG,
    GraphPoints,
    DynamicFormComponent,
    AndroidAppDownloadComponent,
    SortSelectorComponent,
    ChannelModeSelectorComponent,
    NSFWSelectorComponent,

    SwitchComponent,

    FeaturedContentComponent,
    AttachmentPasteDirective,
    PosterDateSelectorComponent,
    DraggableListComponent,
    ToggleComponent,
    SidebarMenuComponent,
    PageLayoutComponent,
    DashboardLayoutComponent,
    ShadowboxLayoutComponent,
    ShadowboxHeaderComponent,
    DropdownSelectorComponent,
    FormDescriptorComponent,
    FormToastComponent,
    ButtonComponent,
    ShadowboxHeaderTabsComponent,
    TimespanFilterComponent,
    EmailConfirmationComponent,
    DateDropdownsComponent,
    PhoneInputV2Component,
    PhoneInputCountryV2Component,
    FormInputCheckboxComponent,
    ExplicitOverlayComponent,
    NestedMenuComponent,
    FileUploadComponent,
    IconComponent,
    OverlayComponent,
    DropdownMenuComponent,
    CalendarComponent,
    LoadingSpinnerComponent,
    PageLayoutPaneDirective,
    PageLayoutContainerDirective,
    FriendlyTimePipe,
    SidebarWidgetComponent,
    SidebarNavigationSubnavDirective,
    FeedFilterComponent,
    AccordionComponent,
    AccordionPaneComponent,
    StickySidebarDirective,
    PaywallBadgeComponent,
    ClientMetaDirective,
    CarouselComponent,
    PoweredByComponent,
    LoadingEllipsisComponent,
    MarkedDirective,
    DragAndDropDirective,
    ConfirmV2Component,
    EnvironmentFlagComponent,
    ErrorSplashComponent,
    LaunchButtonComponent,
    PublisherCardComponent,
    SubscribeButtonComponent,
    HotkeyScrollDirective,
    ChatIconComponent,
    PublisherSearchModalComponent,
    DateRangeModalComponent,
    HovercardComponent,
    FormInputSliderComponent,
    JoinBannerComponent,
    AutofocusDirective,
    SidebarMoreComponent,
    SidebarMoreTriggerComponent,
    TagSelectorComponent,
    ModalCloseButtonComponent,
    BlurhashDirective,
    RelativeTimeSpanComponent,
    ResizedDirective,
  ],
  exports: [
    MINDS_PIPES,

    TopbarComponent,
    SidebarNavigationComponent,
    TopbarOptionsComponent,
    TopbarWalletBalance,

    // V3 Layout
    V3TopbarComponent,
    UserMenuV3Component,

    //

    TooltipComponent,
    QualityScoreComponent,
    SizeableLoadingSpinnerComponent,
    FooterComponent,
    InfiniteScroll,
    HorizontalInfiniteScroll,
    CountryInputComponent,
    DateInputComponent,
    CityFinderComponent,
    StateInputComponent,
    Scheduler,
    Modal,
    ReadMoreDirective,
    ReadMoreButtonComponent,
    ChannelBadgesComponent,
    MindsRichEmbed,
    TagcloudComponent,
    DropdownComponent,
    QRCodeComponent,

    AutoGrow,
    InlineAutoGrow,
    MindsEmoji,
    Emoji,
    ScrollLock,
    TagsLinks,
    Tooltip,
    MDL_DIRECTIVES,
    DateSelectorComponent,
    MindsAvatar,
    Textarea,
    InlineEditorComponent,

    DynamicHostDirective,
    MindsCard,
    MindsButton,

    ChartComponent,

    AdminActionsButtonComponent,

    MaterialBoundSwitchComponent,

    IfFeatureDirective,
    IfBrowserDirective,

    CategoriesSelectorComponent,
    CategoriesSelectedComponent,
    TreeComponent,

    AnnouncementComponent,
    MindsTokenSymbolComponent,
    PhoneInputComponent,
    SafeToggleComponent,
    ThumbsUpButton,
    ThumbsDownButton,
    DismissableNoticeComponent,
    AnalyticsImpressions,
    GraphSVG,
    GraphPoints,
    LineGraph,
    PieGraph,
    DynamicFormComponent,
    AndroidAppDownloadComponent,
    SortSelectorComponent,
    SwitchComponent,
    NSFWSelectorComponent,
    FeaturedContentComponent,
    AttachmentPasteDirective,
    PosterDateSelectorComponent,
    ChannelModeSelectorComponent,
    DraggableListComponent,
    ToggleComponent,
    SidebarMenuComponent,
    PageLayoutComponent,
    DashboardLayoutComponent,
    ShadowboxLayoutComponent,
    DropdownSelectorComponent,
    FormDescriptorComponent,
    FormToastComponent,
    ButtonComponent,
    ShadowboxHeaderComponent,
    ShadowboxHeaderTabsComponent,
    TimespanFilterComponent,
    EmailConfirmationComponent,
    DateDropdownsComponent,
    PhoneInputV2Component,
    PhoneInputCountryV2Component,
    FormInputCheckboxComponent,
    ExplicitOverlayComponent,
    NestedMenuComponent,
    FileUploadComponent,
    IconComponent,
    OverlayComponent,
    DropdownMenuComponent,
    CalendarComponent,
    LoadingSpinnerComponent,
    PageLayoutPaneDirective,
    PageLayoutContainerDirective,
    FriendlyTimePipe,
    SidebarWidgetComponent,
    FeedFilterComponent,
    AccordionComponent,
    AccordionPaneComponent,
    StickySidebarDirective,
    PaywallBadgeComponent,
    ClientMetaDirective,
    CarouselComponent,
    PoweredByComponent,
    LoadingEllipsisComponent,
    MarkedDirective,
    DragAndDropDirective,
    ConfirmV2Component,
    ErrorSplashComponent,
    LaunchButtonComponent,
    PublisherCardComponent,
    SubscribeButtonComponent,
    HotkeyScrollDirective,
    ChatIconComponent,
    PublisherSearchModalComponent,
    DateRangeModalComponent,
    NgxPopperjsModule,
    HovercardComponent,
    FormInputSliderComponent,
    JoinBannerComponent,
    AutofocusDirective,
    SidebarMoreComponent,
    SidebarMoreTriggerComponent,
    TagSelectorComponent,
    ModalCloseButtonComponent,
    BlurhashDirective,
    RelativeTimeSpanComponent,
    ResizedDirective,
  ],
  providers: [
    SiteService,
    SsoService,
    AttachmentService,
    CookieService,
    PagesService,
    AttachmentService,
    {
      provide: UpdateMarkersService,
      useFactory: (_http, _session, _sockets) => {
        return new UpdateMarkersService(_http, _session, _sockets);
      },
      deps: [MindsHttpClient, Session, SocketsService],
    },
    {
      provide: MindsHttpClient,
      useFactory: MindsHttpClient._,
      deps: [HttpClient, CookieService],
    },
    NSFWSelectorCreatorService,
    NSFWSelectorConsumerService,
    {
      provide: FeaturedContentService,
      useFactory: (
        boostedContentService: FeedsService,
        experimentsService: ExperimentsService
      ): FeaturedContentService =>
        new FeaturedContentService(boostedContentService, experimentsService),
      deps: [FeedsService, ExperimentsService],
    },
    {
      provide: RouterHistoryService,
      useFactory: router => new RouterHistoryService(router),
      deps: [Router],
    },
    MediaProxyService,
    SidebarNavigationService,
    TopbarService,
    RelatedContentService,
    RegexService,
    ApiService,
    AttachmentApiService,
    ClientMetaService,
    UserMenuService,
    DownloadActivityMediaService,
    PublisherSearchModalService,
    DateRangeModalService,
    JsonLdService,
    BoostRecommendationService,
    AuthRedirectService,
    SubscriptionService,
    RecentSubscriptionsService,
  ],
})
export class CommonModule {}
