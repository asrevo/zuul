import {Injectable} from '@angular/core';
import {DefaultService} from './default.service';
import {Media} from '../domain/media';
import {HttpClient} from '@angular/common/http';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {Upload} from '../domain/upload';

@Injectable()
export class FileService {
  private url = '/file/api/';
  private uploadingSubject: Subject<Upload<Media>> = new ReplaySubject<Upload<Media>>();


  constructor(private _http: HttpClient,
              private _defaultService: DefaultService) {
    this.url = this._defaultService.url + this.url;
  }


  save(media: Media): Observable<Object> {
    return this._http.post(this.url + "save", media);
  }

  /*
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
  */

  // }

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
}
