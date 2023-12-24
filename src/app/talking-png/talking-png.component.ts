import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-talking-png',
  templateUrl: './talking-png.component.html',
  styleUrls: ['./talking-png.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TalkingPngComponent {
  @Input()
  talkingImages: string[] = [];

  @Input()
  quietImages: string[] = [];

  @Input()
  isTalking!: BehaviorSubject<boolean>;
}
