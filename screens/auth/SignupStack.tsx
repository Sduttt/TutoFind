import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import * as Progress from 'react-native-progress';
import { useSignupStore } from '../../store/SignupStore';
import UserType from './UserType';
import PersonalDetails from './PersonalDetails';
type Props = {};

const SignupStack = (props: Props) => {
  const [progress, setProgress] = React.useState(0.33);
  const { step } = useSignupStore();

  useEffect(() => {
    setProgress(step / 3);
  }, [step]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <UserType />;
      case 2:
        return <PersonalDetails />;
      default:
        return <UserType />;
    }
  };
  return (
    <SafeAreaView>
      <Progress.Bar progress={progress} width={200} />
      {renderStep()}
    </SafeAreaView>
  );
};

export default SignupStack;
