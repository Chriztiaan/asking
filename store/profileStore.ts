import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';
import { supabase } from './setup/supabase';
import { Profile } from './types/DatabaseModels';

export const useProfileStore = defineStore('profile', {
    state: () => ({
        profile: undefined as Profile | undefined,
        retrieving: false,
        updating: false,
        profilePicture: '',
        loadingProfilePicture: false
    }),

    actions: {
        async retrieveProfile(userId = ''): Promise<void> {
            const derivedUserId = userId || useAuthStore().userId;
            this.retrieving = true;

            const { data, error } = await supabase.from('profiles').select().match({ user_id: derivedUserId }).limit(1).single();

            if (!error && !!data) {
                this.profile = data;
            } else {
                console.log(error);
            }

            this.retrieving = false;
        },
        async upsertProfile(profile: Profile): Promise<void> {
            this.updating = true;

            const { data, error } = await supabase.from('profiles').upsert(profile).select().single();

            if (!error && !!data) {
                this.profile = data;
            } else {
                console.log(error);
            }

            this.updating = false;
        },
        async uploadProfilePicture(file: File): Promise<void> {
            this.loadingProfilePicture = true;
            this.profilePicture = '';

            const derivedUserId = useAuthStore().userId;
            const { data, error } = await supabase.storage.from('avatars').upload('public/' + derivedUserId, file, {
                cacheControl: '3600',
                upsert: true
            });
            console.log(data);
            console.error(error);
            this.retrieveProfilePicture();
        },
        async retrieveProfilePicture(): Promise<void> {
            this.loadingProfilePicture = true;
            const derivedUserId = useAuthStore().userId;

            const { data, error } = await supabase.storage.from('avatars').createSignedUrl('public/' + derivedUserId, 60);
            // await supabase.storage.from('avatars').

            if (!error && data.signedUrl) {
                this.profilePicture = data.signedUrl;
                console.log(this.profilePicture);
            } else {
                this.profilePicture = '';
                console.log(this.profilePicture);
                console.error(error);
            }

            this.loadingProfilePicture = false;
        }
    }
});
