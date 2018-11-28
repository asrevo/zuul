import {Component, OnInit, Input} from '@angular/core';
import {Media} from '../../domain/media';

@Component({
  selector: 'as-video-row',
  templateUrl: './video-row.component.html',
  styleUrls: ['./video-row.component.css']
})
export class VideoRowComponent implements OnInit {
  @Input()
  public media: Media;

  constructor() { }

  ngOnInit() {
  }

}
