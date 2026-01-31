import SignIn from './auth/SignIn';
import SignupStack from './auth/SignupStack';
import ResetPassword from './auth/ResetPassword';
import TutorDashboard from './tutor/TutorDashboard';
import OtherDetails from './auth/OtherDetails';

const Screens = {
  SIGNUP_SCREEN: SignupStack,
  SIGNIN_SCREEN: SignIn,
  RESET_PASSWORD_SCREEN: ResetPassword,
  TUTOR_DASHBOARD_SCREEN: TutorDashboard,
  ADD_USER_DETAILS_SCREEN: OtherDetails
};

export default Screens;
