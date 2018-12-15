import {Component, Input, OnInit} from '@angular/core';
import {TubeService} from "../../services/tube.service";

declare var Clappr: any;
declare var LevelSelector: any;
declare var ClapprThumbnailsPlugin: any;

@Component({
  selector: 'as-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  @Input()
  id: string;

  constructor(private _tubeService: TubeService) {
  }

  ngOnInit() {


    var player = new Clappr.Player({
      source: "/tube/api/" + this.id + ".m3u8", parentId: "#player",
      plugins: [Clappr.FlasHLS, LevelSelector, ClapprThumbnailsPlugin],
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
      },
      scrubThumbnails: {
        backdropHeight: 64,
        spotlightHeight: 84,
        thumbs: []
      },
      playbackRateConfig: {
        defaultValue: '1.0',
        options: [
          {value: '0.5', label: '0.5x'},
          {value: '1.0', label: '1x'},
          {value: '2.0', label: '2x'},
        ]
      }
    });

    this._tubeService.findOne(this.id)
      .subscribe(it => {
        var thumbnailsPlugin = player.getPlugin("scrub-thumbnails");
        for (var i = 0; i < Math.floor(it.time / 2); i++) {
          thumbnailsPlugin.addThumbnail({
            url: it.image + "/" + this.id + "_" + (i + 1) + ".jpeg",
            time: 1 + (i * 2)
          }).then(function () {
            console.log("Thumbnail added.");
          })
        }
      })
  }
}
