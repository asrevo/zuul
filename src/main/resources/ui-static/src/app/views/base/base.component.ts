import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {TubeService} from '../../services/tube.service';
import {Media} from '../../domain/media';
import {ActivatedRoute, Router} from '@angular/router';
import {DefaultService} from '../../services/default.service';

@Component({
  selector: 'as-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {
  public media: Media[] = [];

  constructor(public _activatedRoute: ActivatedRoute,
              public _router: Router,
              private _userService: UserService,
              private _authService: AuthService,
              private _tubeService: TubeService,
              private _defaultService: DefaultService) {
    this._defaultService.handle(this._router, this._authService);
  }


  ngOnInit() {
    this._userService.currentUser().subscribe(it => this._authService.setAuth(it, 'true'), it => this._authService.setAuth(null, 'false'));
    this._tubeService.findAllPagining(5, '0').subscribe((it: Media[]) => this.media = it);
  }

}
