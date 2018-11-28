import {Media} from "./media";

export class UserMediaView {
  id: string;
  userId: string;
  mediaId: string;
  createdDate: Date;
  lastViewDate: Date;
  count: number;
  m: Media;
}
