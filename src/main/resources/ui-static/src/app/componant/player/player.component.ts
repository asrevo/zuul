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
    jwplayer('player').setup({
        "playlist": [
          {
            "sources": [
              {
                "default": false,
                "file": '/tube/api/' + this.id + '.m3u8/',
                "label": "0",
                "type": "hls",
                "preload": "metadata"
              }
            ]
          }
        ],
        "primary": "html5",
        "hlshtml": true
      }
    );
  }

}
