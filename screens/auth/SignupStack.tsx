import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import * as Progress from 'react-native-progress';
import { useSignupStore } from '../../store/SignupStore';
import UserType from './UserType';
import PersonalDetails from './PersonalDetails';
import OtherDetails from './OtherDetails';


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
      case 3:
        return <OtherDetails />;
      default:
        return <UserType />;
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Progress.Bar progress={progress} width={null} className="mx-6 mt-4" />
      {renderStep()}
    </SafeAreaView>
  );
};

export default SignupStack;
