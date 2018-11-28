import {Injectable} from '@angular/core';
import {DefaultService} from './default.service';
import {UserService} from './user.service';
import {SearchResult} from '../domain/searchResult';
import {Search} from '../domain/search';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../domain/user';
import {filter, map, mergeMap} from 'rxjs/internal/operators';
import {Master} from "../domain/master";

@Injectable()
export class IndexingService {
  private url = '/indexing/api/';


  constructor(private _http: HttpClient, private _defaultService: DefaultService, private _userService: UserService) {
    this.url = this._defaultService.url + this.url;
  }

  search(search: Search): Observable<SearchResult> {
    return this._http.post<SearchResult>(this.url + 'search', search)
      .pipe(filter((it: SearchResult) => it.master.length > 0), mergeMap((it: SearchResult) => {
        return this._userService.findAll(it.master.map((itm: Master) => itm.userId))
          .pipe(map((itus: User[]) => {
            it.master.map((itm: Master) => {
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
