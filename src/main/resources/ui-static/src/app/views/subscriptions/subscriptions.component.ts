import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {TubeService} from '../../services/tube.service';
import {Media} from '../../domain/media';
import {take} from 'rxjs/operators';
import {AuthUser} from '../../domain/auth-user';
import {filter, mergeMap} from 'rxjs/internal/operators';

@Component({
  selector: 'as-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {
  public media: Media[] = [];
  private lastid = '0';
  public canLoad = true;

  constructor(private _authService: AuthService, private _tubeService: TubeService) {
  }

  ngOnInit() {
    this.load();
  }

  load() {
    if (this.canLoad) {
      this.canLoad = false;
      this._authService.onChange().asObservable().pipe(filter((it: AuthUser) => it.isAuth === 'true'))
        .pipe(mergeMap(it => this._tubeService.subscriptions(5, this.lastid)), take(1))
        .subscribe((it: Media[]) => {
            it.forEach(i => {
              this.media.push(i);
            });
          }
          , error => {
          }, () => {
            if (this.media.length > 0) {
              this.lastid = this.media[this.media.length - 1].id;
            }
            this.canLoad = true;
          });
    }
  }

}
