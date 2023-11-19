import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-stream-layout',
  templateUrl: './stream-layout.component.html',
  styleUrls: ['./stream-layout.component.scss']
})
export class StreamLayoutComponent implements OnInit {

  constructor(public themeService: ThemeService) { }

  ngOnInit(): void {
  }

}
