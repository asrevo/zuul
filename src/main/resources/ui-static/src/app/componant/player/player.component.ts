import {Component, Input, OnInit} from '@angular/core';

declare var Clappr: any;
declare var LevelSelector: any;

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
    var player = new Clappr.Player({
      source: "/tube/api/" + this.id + ".m3u8", parentId: "#player",
      plugins: [Clappr.FlasHLS, LevelSelector],
      height: 340,
      width: 528,
      levelSelectorConfig: {
        title: 'Quality',
        labelCallback: function (playbackLevel, customLabel) {
          return playbackLevel.level.height + 'p'; // High 720p
        }
      }
      , poster: {
        url: 'https://df30el3rzhrdb.cloudfront.net/' + this.id + '.png',
        showOnVideoEnd: false
      }
    });

  }
}
