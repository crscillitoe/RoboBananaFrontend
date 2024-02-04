import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiscordService } from '../services/discord.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  streamSource!: SafeResourceUrl;

  message: string = "";

  constructor(
    private route: ActivatedRoute,
    private discord: DiscordService,
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      const params = new URLSearchParams(fragment!);
      let accessToken = params.get('access_token');
      this.discord.setAccessToken(accessToken!);
    });

    this.switchStream("woohoojin");
  }

  switchStream(source: string) {
    const parent = environment.hostURL;
    this.streamSource = this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.twitch.tv/?channel=${source}&parent=${parent}`);
  }

  isFullscreenEnabled() {
    // Return true if the browser is currently in fullscreen mode
    return document.fullscreenElement !== null;
  }

  fullscreen() {
    document.getElementById("viewer")?.requestFullscreen();
    this.changeDetectorRef.detectChanges();
  }

  sendMessage() {
    this.discord.sendMessage(this.message);
    this.message = "";
  }
}
