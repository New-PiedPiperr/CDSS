'use client';

import { useSession } from 'next-auth/react';

export function useClinicianSettings() {
  const queryClient = useQueryClient();
  const { update: updateSession } = useSession();

  // ... (rest of the code)

  // Avatar Upload
  const uploadAvatar = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await axios.post('/api/clinician/settings/avatar', formData);
      return data;
    },
    onSuccess: async (data) => {
      toast.success('Avatar updated');
      queryClient.setQueryData(['clinician-settings'], (old) => {
        if (!old) return old;
        return {
          ...old,
          profile: { ...old.profile, avatarUrl: data.avatarUrl },
        };
      });
      await queryClient.invalidateQueries({ queryKey: ['clinician-settings'] });
      await updateSession({ image: data.avatarUrl }); // Force session update
    },
    onError: (err) => {
      toast.error('Failed to upload avatar');
    },
  });

  // Security Mutations
  const changePassword = useMutation({
    mutationFn: async (data) => {
      const response = await axios.patch('/api/clinician/settings/security', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to change password');
    },
  });

  const toggle2FA = useMutation({
    mutationFn: async (enabled) => {
      const response = await axios.patch('/api/clinician/settings/security', {
        twoFactorEnabled: enabled,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`2FA ${data.twoFactorEnabled ? 'enabled' : 'disabled'}`);
      queryClient.invalidateQueries({ queryKey: ['clinician-security'] });
    },
    onError: (err) => {
      toast.error('Failed to update 2FA settings');
    },
  });

  const logoutAllSessions = useMutation({
    mutationFn: async () => {
      // This would ideally be a DELETE request to /api/clinician/settings/security
      // For now we will mock it or if I added DELETE handler use it.
      // I didn't add DELETE handler yet. I will add it.
      const response = await axios.delete('/api/clinician/settings/security');
      return response.data;
    },
    onSuccess: () => {
      toast.success('All other sessions logged out');
      queryClient.invalidateQueries({ queryKey: ['clinician-security'] });
    },
    onError: (err) => {
      toast.error('Failed to log out sessions');
    },
  });

  return {
    settings: query.data,
    securitySettings: securityQuery.data,
    isLoading: query.isLoading || securityQuery.isLoading,
    isError: query.isError || securityQuery.isError,
    error: query.error || securityQuery.error,
    updateProfile,
    updateProfessional,
    updateClinical,
    updateAvailability,
    updateNotifications,
    uploadAvatar,
    changePassword,
    toggle2FA,
    logoutAllSessions,
  };
}
