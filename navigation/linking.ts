import { Routes } from './routes';

const config = {
  screens: {
    [Routes.SIGNUP]: 'signup',
    [Routes.SIGNIN]: 'signin',
    [Routes.RESET_PASSWORD]: 'reset-password',
  },
};

const linking = {
  prefixes: ['com.tutofind://', 'tutofind://'],
  config: config,
};

export default linking;
