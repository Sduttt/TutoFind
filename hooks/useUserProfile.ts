import { useState, useEffect, useCallback } from 'react';
import { UseAuthStore } from '../store/AuthStore';
import { getUserProfile } from '../services/userService';

export const useUserProfile = () => {
  const { userId } = UseAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const { data, error: apiError } = await getUserProfile(userId);

    if (apiError) {
      setError(apiError);
    } else {
      setUserProfile(data);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    user: userProfile,
    loading,
    error,
    refetch: fetchProfile,
  };
};
