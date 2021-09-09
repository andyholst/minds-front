import {
  Component,
  Input,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
  TemplateRef,
  AfterViewChecked,
} from '@angular/core';
import { AnchorPosition } from '../../../services/ux/anchor-position';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'm-link-button',
  templateUrl: './link-button.component.html',
  styleUrls: ['./link-button.component.ng.scss'],
})
export class LinkButtonComponent {
  /**
   * Button type
   */
  @Input() type: string = 'submit';

  @Input() disabled: boolean = false;
  @Input() color: 'blue' | 'grey' | 'red' | 'primary' | 'secondary' = 'grey';
  @Input() size: 'xsmall' | 'small' | 'medium' | 'large' = 'medium';

  @Input() url: string = '#';

  /**
   * Disabled setter, it will set this.disabled and close the menu, if open
   * @param disabled
   * @private
   */
  @Input('disabled') set _disabled(disabled: boolean) {
    this.disabled = disabled;
  }
}
