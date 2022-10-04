import { SignInWithOAuthCredentials } from '@supabase/supabase-js';
import { defineStore } from 'pinia';
import { useNotificationStore } from './notificationStore';
import { useProfileStore } from './profileStore';
import { supabase } from './setup/supabase';
import { Profile, Questionnaire } from './types/DatabaseModels';
const url = location.protocol + '//' + location.host + '/admin/';
export const useAuthStore = defineStore('auth', {
    state: () => ({
        loggedIn: false,
        userId: '',
        loaded: false,
        router: undefined as unknown
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
                this.userId = data.user.id;
                const exists = await useProfileStore().retrieveProfile(this.userId, true);
                if (!exists || !useProfileStore().profile?.name) {
                    const { data, error } = await supabase.auth.getSession();
                    if (!error && data) {
                        const fullname = data.session?.user.user_metadata.full_name || '';
                        const profileUrl = data.session?.user.user_metadata.avatar_url || '';

                        await useProfileStore().upsertProfile({ name: fullname, user_id: this.userId, profile: profileUrl } as Profile, true);
                    }
                }
            }

            this.loaded = true;
        },
        async loginGoogle(): Promise<void> {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: url }
            } as SignInWithOAuthCredentials);
            if (error) {
                useNotificationStore().addNotification('Failed to log in.');
            }
        },
        async loginLinkedIn(): Promise<void> {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'linkedin',

                options: { redirectTo: url }
            } as SignInWithOAuthCredentials);

            if (error) {
                useNotificationStore().addNotification('Failed to log in.');
            }
        },
        logout(): void {
            supabase.auth.signOut();
            this.loggedIn = false;
            this.loaded = false;
            (this.router as any).push('/login');
        },

        async delete(): Promise<void> {
            await supabase
                .from('questionnaires')
                .delete()
                .match({ user_id: this.userId } as Questionnaire);

            supabase.rpc('deleteUser' as never).then((a) => {
                if (!a.error) {
                    this.logout();
                }
            });
        }
    }
});
