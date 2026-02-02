import SignIn from './auth/SignIn';
import SignupStack from './auth/SignupStack';
import ResetPassword from './auth/ResetPassword';
import TutorDashboard from './tutor/TutorDashboard';
import OtherDetails from './auth/OtherDetails';
import CreatePost from './tutor/CreatePost';
import ViewPosts from './tutor/ViewPosts';

const Screens = {
  SIGNUP_SCREEN: SignupStack,
  SIGNIN_SCREEN: SignIn,
  RESET_PASSWORD_SCREEN: ResetPassword,
  TUTOR_DASHBOARD_SCREEN: TutorDashboard,
  ADD_USER_DETAILS_SCREEN: OtherDetails,
  CREATE_POST_SCREEN: CreatePost,
  VIEW_POSTS_SCREEN: ViewPosts,
};

export default Screens;
