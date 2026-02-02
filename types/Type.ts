import { ImageSourcePropType } from "react-native";
import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";

export interface PostType {
    subject: String,
    subjectLine: String,
    level: String,
    board: String,
    desc: String,
    minFees: String,
    maxFees: String,
    mode: String,
    freeDemo: Boolean,
    tutorName: String,
    tutorImg: ImageSourcePropType,
    postDate: String,
    totalViews: String,
}