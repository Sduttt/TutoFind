import React from 'react';
import { View } from 'react-native';
import { UseAuthStore } from '../store/AuthStore';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { ADMOB_BANNER_UNIT_ID } from '@env'; // or pass as prop

const unitId = __DEV__ ? TestIds.BANNER : ADMOB_BANNER_UNIT_ID;

export default function AdBanner({ style }: { style?: any }) {
  const { data } = UseAuthStore();
  if (
    data?.subscription_type === 'silver' ||
    data?.subscription_type === 'gold'
  ) {
    return null;
  }
  return (
    <View style={style}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={err => {
          console.warn('Ad failed: ', err);
        }}
      />
    </View>
  );
}
