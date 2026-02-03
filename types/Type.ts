import { ImageSourcePropType } from 'react-native';
import { Timestamp } from 'react-native-reanimated/lib/typescript/commonTypes';

export interface PostType {
  subject: any;
  subjectLine: any;
  level: any;
  board: any;
  desc: any;
  minFees: any;
  maxFees: any;
  mode: any;
  freeDemo: any;
  tutorName: any;
  tutorImg: ImageSourcePropType;
  postDate: any;
  totalViews: any;
  tutorId: any;
  postId: string;
  isLive: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}
