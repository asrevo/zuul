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
        url: 'https://df30el3rzhrdb.cloudfront.net/' + this.id + '_1.png',
        showOnVideoEnd: false
      },
      scrubThumbnails: {
        backdropHeight: 64,
        spotlightHeight: 84
      }
    });

    this._tubeService.findOne(this.id)
      .subscribe(it => {
        var thumbnailsPlugin = player.getPlugin("scrub-thumbnails");
        for (var i = 0; i < (it.time / 2); i++) {
          thumbnailsPlugin.addThumbnail({
            url: "https://df30el3rzhrdb.cloudfront.net/_" + this.id + (i + 1) + ".png",
            time: 1 + (i * 2)
          }).then(function () {
            console.log("Thumbnail added.");
          })
        }
      })
  }
}
