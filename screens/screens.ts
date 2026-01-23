import SignIn from './auth/SignIn';
import SignupStack from './auth/SignupStack';
import ResetPassword from './auth/ResetPassword';

const Screens = {
  SIGNUP_SCREEN: SignupStack,
  SIGNIN_SCREEN: SignIn,
  RESET_PASSWORD_SCREEN: ResetPassword,
};

export default Screens;
