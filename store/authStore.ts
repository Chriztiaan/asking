import { SignInWithOAuthCredentials } from '@supabase/supabase-js';
import { defineStore } from 'pinia';
import { useNotificationStore } from './notificationStore';
import { useProfileStore } from './profileStore';
import { supabase } from './setup/supabase';
import { Profile, Questionnaire } from './types/DatabaseModels';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        loggedIn: false,
        userId: '',
        loaded: false
    }),

    getters: {
        // double: (state) => state.n * 2,
    },

    actions: {
        login(): void {
            supabase.auth.signInWithPassword({} as any);
        },
        async loadUser(): Promise<void> {
            if (this.userId) {
                return;
            }
            const { data, error } = await supabase.auth.getUser();
            if (!error && data) {
                console.log('ads');
                this.userId = data.user.id;
                const exists = await useProfileStore().retrieveProfile(this.userId, true);
                if (!exists || !useProfileStore().profile?.name) {
                    console.log('MISSING');
                    const { data, error } = await supabase.auth.getSession();
                    if (!error && data) {
                        // data.session.
                        console.log(data.session?.user.user_metadata);
                        const fullname = data.session?.user.user_metadata.full_name || '';
                        const profileUrl = data.session?.user.user_metadata.avatar_url || '';

                        useProfileStore().upsertProfile({ name: fullname, user_id: this.userId, profile: profileUrl } as Profile);
                        // avatar_url
                    }
                }
            }

            this.loaded = true;
        },
        async loginGoogle(): Promise<void> {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: 'http://localhost:3000/admin/' }
            } as SignInWithOAuthCredentials);
            if (error) {
                useNotificationStore().addNotification('Failed to log in.');
            }
        },
        async loginLinkedIn(): Promise<void> {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'linkedin',
                // https://master--stalwart-kringle-8f06cb.netlify.app/admin/
                options: { redirectTo: 'http://localhost:3000/admin/' }
            } as SignInWithOAuthCredentials);

            if (error) {
                useNotificationStore().addNotification('Failed to log in.');
            }
        },
        logout(): void {
            supabase.auth.signOut();
            this.loggedIn = false;
            this.loaded = false;
        },
        onAuthChange(): void {
            supabase.auth.onAuthStateChange((event, session) => {
                if (event == 'USER_DELETED' || event == 'SIGNED_OUT') {
                    this.logout();
                    console.log('Auto logout', session);
                }
            });
        },
        async delete(): Promise<void> {
            await supabase
                .from('questionnaires')
                .delete()
                .match({ user_id: this.userId } as Questionnaire);
            supabase.rpc('deleteUser' as never).then((a) => {
                console.log(a);
            });
        }
    }
});
