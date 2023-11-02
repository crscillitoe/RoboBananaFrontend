import { Component } from '@angular/core';
import { HideableComponent } from '../hideable/hideable.component';

@Component({
  selector: 'dynamic-overlay-chat-wrapper',
  templateUrl: './chat-wrapper.component.html',
  styleUrls: ['./chat-wrapper.component.scss']
})
export class ChatWrapperComponent extends HideableComponent {

}
