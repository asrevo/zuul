import {Injectable} from '@angular/core';
import {DefaultService} from './default.service';
import {UserService} from './user.service';
import {SearchResult} from '../domain/searchResult';
import {Search} from '../domain/search';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../domain/user';
import {Media} from '../domain/media';
import {filter, map, mergeMap} from 'rxjs/internal/operators';

@Injectable()
export class IndexingService {
  private url = '/indexing/api/';


  constructor(private _http: HttpClient, private _defaultService: DefaultService, private _userService: UserService) {
    this.url = this._defaultService.url + this.url;
  }

  search(search: Search): Observable<SearchResult> {
    return this._http.post<SearchResult>(this.url + 'search', search)
      .pipe(filter((it: SearchResult) => it.media.length > 0), mergeMap((it: SearchResult) => {
        return this._userService.findAll(it.media.map((itm: Media) => itm.userId))
          .pipe(map((itus: User[]) => {
            it.media.map((itm: Media) => {
              itm.user = itus.find((i: User) => i.id === itm.userId);
              return itm;
            });
            return it;
          }))
          ;
      }))
      ;
  }
}
