import {Component, OnInit} from '@angular/core';
import {TubeService} from '../../services/tube.service';
import {Media} from '../../domain/media';
import {map} from 'rxjs/internal/operators';

@Component({
  selector: 'as-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.css']
})
export class TrendingComponent implements OnInit {
  public media: Media[] = [];

  constructor(private _tubeService: TubeService) {
  }

  ngOnInit() {
    this._tubeService.trending()
      .pipe(map(it => it.sort((it1, it2) => it2.mediaInfo.viewsCount - it1.mediaInfo.viewsCount)))
      .subscribe(it => this.media = it);
  }

}
