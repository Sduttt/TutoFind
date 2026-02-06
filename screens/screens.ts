import SignIn from './auth/SignIn';
import SignupStack from './auth/SignupStack';
import ResetPassword from './auth/ResetPassword';
import UserDashboard from './common/UserDashboard';
import OtherDetails from './auth/OtherDetails';
import CreatePost from './tutor/CreatePost';
import ViewPosts from './tutor/ViewPosts';
import StudentHome from './student/StudentHome';
import TutorProfile from './common/TutorProfile';
import UpdateUserDetails from './common/UpdateUserDetails';

const Screens = {
  SIGNUP_SCREEN: SignupStack,
  SIGNIN_SCREEN: SignIn,
  RESET_PASSWORD_SCREEN: ResetPassword,
  USER_DASHBOARD_SCREEN: UserDashboard,
  ADD_USER_DETAILS_SCREEN: OtherDetails,
  CREATE_POST_SCREEN: CreatePost,
  VIEW_POSTS_SCREEN: ViewPosts,
  STUDENT_HOME_SCREEN: StudentHome,
  TUTOR_PROFILE_SCREEN: TutorProfile,
  UPDATE_USER_DETAILS_SCREEN: UpdateUserDetails,
};

export default Screens;
