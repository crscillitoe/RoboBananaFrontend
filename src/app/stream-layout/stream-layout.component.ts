import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { BotConnectorService } from '../services/bot-connector.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stream-layout',
  templateUrl: './stream-layout.component.html',
  styleUrls: ['./stream-layout.component.scss']
})
export class StreamLayoutComponent implements OnInit {
  enabled: boolean = false;

  constructor(private route: ActivatedRoute, public themeService: ThemeService, private botService: BotConnectorService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // print keys of params
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          const element = params[key];
          localStorage.setItem(key, element);
        }
      }
    });

    this.botService.getStream("streamdeck").subscribe((data: any) => {
      if (data.type === "enable") {
        if (data.name === localStorage.getItem("name")) {
          this.enabled = data.value;

          if (!this.enabled) {
            window.location.reload();
          }
        }
      }
    });
  }

  getName() {
    return localStorage.getItem("name");
  }

}
