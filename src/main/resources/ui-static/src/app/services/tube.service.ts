import {Injectable} from '@angular/core';
import {DefaultService} from './default.service';
import {Media} from '../domain/media';
import {UserService} from './user.service';
import {HttpClient} from '@angular/common/http';
import {filter, map} from 'rxjs/operators';
import {Observable, ReplaySubject, Subject, zip} from 'rxjs';
import {Upload} from '../domain/upload';
import {FeedbackService} from './feedback.service';
import {AuthService} from './auth.service';
import {User} from '../domain/user';
import {MediaInformation} from '../domain/media-information';
import {UserUserFollow} from '../domain/user-user-follow';
import {UserMediaView} from '../domain/user-media-view';
import {Ids} from '../domain/ids';
import {mergeMap} from 'rxjs/internal/operators';
import {MediaGroup} from "../domain/media-group";

@Injectable()
export class TubeService {
  private url = '/tube/api/';
  private uploadingSubject: Subject<Upload<Media>> = new ReplaySubject<Upload<Media>>();


  constructor(private _http: HttpClient,
              private _defaultService: DefaultService,
              private _userService: UserService,
              private _feedbackService: FeedbackService,
              private _authService: AuthService) {
    this.url = this._defaultService.url + this.url;
  }

  findAllPagining(size: number, id: string): Observable<Media[]> {
    return this._http.get<Media[]>(this.url + size + '/' + id)
      .pipe(filter(it => it.length > 0), mergeMap((it: Media[]) => {
        return zip(this._userService.findAll(it.map(value => value.userId)),
          this._feedbackService.mediaInfoAll(it.map(value => value.id)),
          (users: User[], mediaInfo: MediaInformation[]) => {
            return it.map((media: Media) => {
              media.user = users.find((u: User) => u.id === media.userId);
              media.mediaInfo = mediaInfo.find((m: MediaInformation) => m.mediaId === media.id);
              return media;
            });
          });
      }));
  }

  subscriptions(size: number, id: string): Observable<Media[]> {
    return this._feedbackService.followingTo(this._authService.getAuthUser().user.id)
      .pipe(filter((it: UserUserFollow[]) => it.length > 0), mergeMap((it: UserUserFollow[]) => {
        return zip(this._http.post<Media[]>(this.url + size + '/' + id,
          new Ids(it.map(value => value.to))),
          this._userService.findAll(it.map(value => value.to)),
          (media: Media[], users: User[]) => {
            return media.map(value => {
              value.user = users.find((u: User) => u.id === value.userId);
              return value;
            });
          });
      }));
  }

  history(size: number, lastId: string): Observable<UserMediaView[]> {
    return this._feedbackService.views(this._authService.getAuthUser().user.id, size, lastId)
      .pipe(filter((it: UserMediaView[]) => it.length > 0), mergeMap((itums: UserMediaView[]) => {
        return this.findAllByIds(itums.map(itum => itum.mediaId))
          .pipe(map((itms: Media[]) => {
            itums.forEach((itum: UserMediaView) => {
              itum.m = itms.find(itm => itm.id === itum.mediaId);
            });
            return itums;
          }));
      }))
      ;
  }

  trending(): Observable<Media[]> {
    return this._feedbackService.trending()
      .pipe(filter((it: MediaInformation[]) => it.length > 0), mergeMap((itums: MediaInformation[]) => {
        return zip(this._feedbackService.mediaInfoAll(itums.map(itum => itum.mediaId)),
          this.findAllByIds(itums.map(itum => itum.mediaId)),
          (mis: MediaInformation[], ms: Media[]) => {
            return ms.map((media: Media) => {
              media.mediaInfo = mis.find((m: MediaInformation) => m.mediaId === media.id);
              return media;
            });
          });
      }));
  }


  findAllByIds(ids: string[]): Observable<Media[]> {
    return this._http.post<Media[]>(this.url, new Ids(ids))
      .pipe(mergeMap((itms: Media[]) => {
        return this._userService.findAll(itms.map((itm: Media) => itm.userId))
          .pipe(map((itus: User[]) => {
            itms.forEach(itm => {
              itm.user = itus.find(itu => itu.id === itm.userId);
            });
            return itms;
          }))
          ;
      }));
  }

  findByUserId(itm: string): Observable<Media[]> {
    return this._http.get<Media[]>(this.url + 'user/' + itm)
      .pipe(mergeMap((it: Media[]) => {
        return zip(this._userService.findAll(
          it.map(value => value.userId)),
          this._feedbackService.mediaInfoAll(it.map(value => value.id)),
          (users: User[], mediaInfo: MediaInformation[]) => {
            return it.map((media: Media) => {
              media.user = users.find((u: User) => u.id === media.userId);
              media.mediaInfo = mediaInfo.find((m: MediaInformation) => m.mediaId === media.id);
              return media;
            });
          });
      }));
  }

  findOne(it: number): Observable<Media> {
    return this._http.get<Media>(this.url + it)
      .pipe(mergeMap((itm: Media) => this._userService.findOne(itm.userId).pipe(map(itu => {
        itm.user = itu;
        return itm;
      }))), mergeMap((itmf: Media) => this._feedbackService.mediaInfo(itmf.id).pipe(map(itm => {
        itmf.mediaInfo = itm;
        return itmf;
      }))));
  }

  findGroup(media: string): Observable<MediaGroup> {
    return this._http.get<MediaGroup>(this.url + "group/" + media)
  }

  findAllInGroup(media: string): Observable<Media[]> {
    return this._http.get<Media[]>(this.url + "group/" + media + "/media")
      .pipe(mergeMap((it: Media[]) => {
        return zip(this._userService.findAll(
          it.map(value => value.userId)),
          this._feedbackService.mediaInfoAll(it.map(value => value.id)),
          (users: User[], mediaInfo: MediaInformation[]) => {
            return it.map((media: Media) => {
              media.user = users.find((u: User) => u.id === media.userId);
              media.mediaInfo = mediaInfo.find((m: MediaInformation) => m.mediaId === media.id);
              return media;
            });
          });
      }));
  }

  save(media: Media): Observable<Object> {
    return this._http.post(this.url + "save", media);
  }

  /*
    save<R>(timeId: number, media: Media): Observable<Upload<Media>> {
      return this._http.request(new HttpRequest('POST', this.url + 'save', this.toFormData(media), {
        reportProgress: true, headers: new HttpHeaders({'enctype': 'multipart/form-data'})
      })).pipe(
        map((it: HttpEvent<R>) => {
          switch (it.type) {
            case HttpEventType.Sent:
              return this.CopyUpload(media, timeId, 0, 'binding');
            case HttpEventType.UploadProgress:
              return this.CopyUpload(media, timeId, Math.round(100 * it.loaded / it.total), 'binding');
            // case HttpEventType.DownloadProgress:
            //   return this.CopyUpload(media, timeId, 100, 'completed');
            // case HttpEventType.ResponseHeader:
            //   return this.CopyUpload(media, timeId, 100, 'completed');
            case HttpEventType.Response:
              return this.CopyUpload(media, timeId, 100, 'completed');
            default:
              return null;
          }
        }),
        filter(it => it != null),
        tap((it: Upload<Media>) => {
          this.uploadingSubject.next(it);
        }));
    }

    CopyUpload(media: Media, timeId: number, value: number, state: string): Upload<Media> {
      const uploadObj: Upload<Media> = new Upload<Media>();
      uploadObj.timeId = timeId;
      uploadObj.data = media;
      uploadObj.value = value;
      uploadObj.state = state;
      return uploadObj;
    }

    private toFormData(media: Media): FormData {
      const formData: FormData = new FormData();
      if (media.title != null) {
        formData.append('title', media.title);
      }
      if (media.meta != null) {
        formData.append('meta', media.meta);
      }
      if (media.url != null) {
        formData.append('url', media.url);
      }
      return formData;
    }

    getUploading(): Subject<Upload<Media>> {
      return this.uploadingSubject;
    }
  */


}
