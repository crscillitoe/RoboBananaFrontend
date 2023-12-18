import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-overlay-title',
  templateUrl: './overlay-title.component.html',
  styleUrls: ['./overlay-title.component.scss']
})
export class OverlayTitleComponent implements OnInit {

  constructor(public themeService: ThemeService) { }

  ngOnInit(): void {
  }

}
