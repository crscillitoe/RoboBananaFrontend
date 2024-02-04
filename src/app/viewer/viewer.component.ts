import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiscordService } from '../services/discord.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  message: string = "";

  constructor(private route: ActivatedRoute, private discord: DiscordService) {}

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      const params = new URLSearchParams(fragment!);
      // let tokenType = params.get('token_type');
      // let expiresIn = params.get('expires_in');
      // let scope = params.get('scope');
      // let state = params.get('state');
      let accessToken = params.get('access_token');

      this.discord.setAccessToken(accessToken!);
    });
  }

  sendMessage() {
    this.discord.sendMessage(this.message);
    this.message = "";
  }
}
