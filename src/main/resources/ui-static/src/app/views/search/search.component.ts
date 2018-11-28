import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Search} from '../../domain/search';
import {ActivatedRoute, Params} from '@angular/router';
import {IndexingService} from '../../services/indexing.service';
import {map} from 'rxjs/internal/operators';
import {Master} from "../../domain/master";

@Component({
  selector: 'as-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public master: Master[] = [];
  public search: Search = new Search();

  constructor(private _activatedRoute: ActivatedRoute, private _indexingService: IndexingService, private _location: Location) {
  }

  more() {
    this.search.page += 1;
    this.doSearch();
  }

  ngOnInit() {
    this._activatedRoute.params.pipe(map((it: Params) => {
      const search = new Search();
      search.search_key = it['search_key'].split('-').join(' ');
      search.page = Number.parseInt(it['page']);
      return search;
    }))
      .subscribe(it => {
        this.search = it;
        this.master = [];
        this.doSearch();
      });
  }

  doSearch() {
    this._indexingService.search(this.search).subscribe(it => {
      it.master.forEach(itm => {
        this.master.push(itm);
      });
      this._location.replaceState('/search/' + this.search.page + '/' + (this.search.search_key.split(' ').join('-')));
    });
  }
}
