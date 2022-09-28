import { SignInWithOAuthCredentials } from '@supabase/supabase-js';
import { defineStore } from 'pinia';
import { supabase } from './setup/supabase';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        loggedIn: false,
        userId: '92db24d4-5290-4819-9bac-7de8efe7d603'
    }),

    getters: {
        // double: (state) => state.n * 2,
    },

    actions: {
        login(): void {
            supabase.auth.signInWithPassword({} as any);
        },
        async loginGoogle(): Promise<void> {
            await console.log();
            await console.log();
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: location.protocol + '//' + location.host + '/admin' }
            } as SignInWithOAuthCredentials);
            console.log(data);

            console.log(error);
        },
        logout(): void {
            supabase.auth.signOut();
            this.loggedIn = false;
        },
        onAuthChange(): void {
            supabase.auth.onAuthStateChange((event, session) => {
                if (event == 'USER_DELETED' || event == 'SIGNED_OUT') {
                    this.logout();
                    console.log('Auto logout', session);
                }
            });
        }
    }
});
