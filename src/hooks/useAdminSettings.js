import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useAdminSettings() {
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const res = await fetch('/api/admin/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      return res.json();
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/admin/settings/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update profile');
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-settings'], (prev) => ({
        ...prev,
        profile: data,
      }));
      toast.success('Profile updated successfully');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const updateSystem = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/admin/settings/system', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update system settings');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-settings'], (prev) => ({
        ...prev,
        system: data,
      }));
      toast.success('System settings updated');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const updateSecurity = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/admin/settings/security', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update security settings');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-settings'], (prev) => ({
        ...prev,
        security: data,
      }));
      toast.success('Security settings updated');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const uploadAvatar = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/settings/avatar', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload avatar');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-settings'], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          profile: { ...prev.profile, avatarUrl: data.avatarUrl }
        };
      });
      toast.success('Profile picture updated');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateProfile,
    updateSystem,
    updateSecurity,
    uploadAvatar,
  };
}
