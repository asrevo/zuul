import {Component, Input, OnInit} from '@angular/core';

declare var jwplayer: any;

@Component({
  selector: 'as-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  @Input()
  id: string;

  constructor() {
  }

  ngOnInit() {
    jwplayer('player').setup(
      {
        "image": 'https://df30el3rzhrdb.cloudfront.net/' + this.id + '.png',
        "file": '/tube/api/' + this.id + '.m3u8/',
      }
    );
  }
}
