import {Component, OnInit} from '@angular/core';
import {TubeService} from '../../services/tube.service';
import {Media} from '../../domain/media';

@Component({
  selector: 'as-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public media: Media[] = [];
  private lastid = '0';
  public canLoad = true;

  constructor(private _tubeService: TubeService) {
  }

  ngOnInit() {
    this.load();
  }

  load() {
    if (this.canLoad) {
      this.canLoad = false;
      this._tubeService.findAllPagining(10, this.lastid).subscribe((it: Media[]) => {
        it.forEach(i => {
          this.media.push(i);
        });
      }, error => {
      }, () => {
        if (this.media.length > 0) this.lastid = this.media[this.media.length - 1].id;
        this.canLoad = true;
      });
    }
  }
}
