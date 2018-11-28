import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Media} from '../../domain/media';
import {FeedbackService} from "../../services/feedback.service";
import {interval, Subscription} from "rxjs";
import {flatMap} from "rxjs/operators";
import {Stater} from "../../domain/Stater";
import {TubeService} from "../../services/tube.service";


@Component({
  selector: 'as-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, OnDestroy {
  public media: Media = new Media();
  private subscription: Subscription = null;
  public stater: Stater[] = [];

  constructor(private zone: NgZone, private _tubeService: TubeService, private _feedbackService: FeedbackService) {

  }

  ngOnInit() {
    this.subscription = interval(3000).pipe(flatMap(it => this._feedbackService.states())).subscribe(it => this.zone.run(() => {
      this.stater = it
    }));

  }

  ngOnDestroy() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

  upload() {
    this._tubeService.save(this.media).subscribe(it => this.reset());
  }

  reset() {
    this.media = new Media();
  }


  /*
    reset(file: any, fileView: any, meta: any) {
      if (file.files.length > 0) {
        file.files = null;
      }
      fileView.value = '';
      meta.value = '';
      this.media = new Media();
    }


    name(ref1: any, ref2: any, ref3: any) {
      if (ref1.files.length === 1) {
        ref2.value = ref1.files[0].name;
      } else {
        ref2.value = '';
      }
      this.media.title = ref2.value;
      this.media.meta = ref3.value;
    }
  */
  // this.file.nativeElement.files = null;
  /*
    public uploading: Upload<Media>[] = [];
    @ViewChild('file')
    public file: ElementRef;
  */

  // this._tubeService.getUploading().subscribe((u: Upload<Media>) => {
  //   this.zone.run(() => {
  //     const v = this.exist(u);
  //     if (v !== -1) {
  //       if (u.state === 'fail') {
  //         this.uploading[v].state = 'fail';
  //       }
  //       else {
  //         this.uploading[v] = u;
  //       }
  //     }
  //     else {
  //       this.uploading.push(u);
  //     }
  //   });
  // });

  // exist(upload: Upload<Media>): number {
  //   let v = -1;
  //   for (let i = 0; i < this.uploading.length; i++) {
  //     if (this.uploading[i].timeId === upload.timeId) {
  //       v = i;
  //       break;
  //     }
  //   }
  //   return v;
  // }
  // if (this.file.nativeElement.files.length > 0) {
  //   this.media.file = this.file.nativeElement.files[0];
  // }
  // const timeId: number = new Date().getTime();
  // this._tubeService.save(timeId, this.media).subscribe(it => {
  // }, error => {
  //   this._tubeService.getUploading().next(this._tubeService.CopyUpload(this.media, timeId, 0, 'fail'));
  // }, () => {
  // });
  // this.reset();
}
