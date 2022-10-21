<template>
    <v-app>
        <v-app-bar :app="!isMobile" flat color="app-background" :max-height="height" :height="height" :elevation="isMobile ? 1 : 0">
            <div
                :class="{ 'px-12': !isMobile, 'px-2': isMobile }"
                class="d-flex flex-column justify-center justify-md-start flex-md-row align-center gap-3 py-4"
                style="width: 100%"
            >
                <div v-if="isMobile" class="d-flex justify-space-between width-100">
                    <div class="d-flex gap-4">
                        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
                        <logo style="max-height: 50px; max-width: 50px" />
                    </div>
                    <div class="d-flex gap-3 align-center">
                        <div class="d-flex align-center gap-2">
                            <v-icon v-if="$vuetify.theme.dark">{{ mdiWeatherNight }}</v-icon>
                            <v-icon v-else>{{ mdiWhiteBalanceSunny }}</v-icon>
                            <v-switch v-model="$vuetify.theme.dark" dense :dark="false" inset hide-details @change="changeDarkMode"></v-switch>
                        </div>

                        <v-btn v-if="false" icon height="24" width="24">
                            <v-icon color="text" size="20">{{ mdiBellOutline }}</v-icon>
                        </v-btn>

                        <v-menu v-if="hasUser" offset-y>
                            <template #activator="{ on }">
                                <profile-avatar v-if="hasUser" v-on="on" />
                            </template>
                            <v-list width="200">
                                <v-list-item @click="logout">
                                    <v-list-item-title>Logout</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </div>
                </div>
                <template v-else>
                    <logo style="max-height: 50px; max-width: 50px" />
                </template>
                <template v-if="!isMobile || drawer">
                    <v-btn class="f-18 w-700" :outlined="isMobile" width="100" text to="/" nuxt> Home </v-btn>
                    <v-btn v-if="hasUser" class="f-18 w-700" :outlined="isMobile" width="100" text to="/manage" nuxt :link="true"> Manage </v-btn>
                    <v-btn v-else class="f-18 w-700" :outlined="isMobile" width="100" text to="/login" nuxt :link="true"> Login </v-btn>
                    <v-btn class="f-18 w-700" :outlined="isMobile" width="100" text to="/about" nuxt> About </v-btn>

                    <v-spacer />
                </template>
                <div v-if="!isMobile" class="d-flex gap-3 align-center">
                    <div class="d-flex align-center gap-2">
                        <v-icon v-if="$vuetify.theme.dark">{{ mdiWeatherNight }}</v-icon>
                        <v-icon v-else>{{ mdiWhiteBalanceSunny }}</v-icon>
                        <v-switch v-model="$vuetify.theme.dark" dense :dark="false" inset hide-details @change="changeDarkMode"></v-switch>
                    </div>

                    <v-btn v-if="false" icon height="24" width="24">
                        <v-icon color="text" size="20">{{ mdiBellOutline }}</v-icon>
                    </v-btn>

                    <v-menu v-if="hasUser" offset-y>
                        <template #activator="{ on }">
                            <profile-avatar v-if="hasUser" v-on="on" />
                        </template>
                        <v-list width="200">
                            <v-list-item @click="logout">
                                <v-list-item-title>Logout</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
            </div>
        </v-app-bar>
        <v-main class="text--text app-background" :class="{ 'main-mobile': isMobile, 'main-drawer': drawer }">
            <v-main>
                <v-container> <Nuxt /> </v-container>
            </v-main>
        </v-main>
        <my-footer class="text--text app-background" />
        <snackbar />
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mdiWeatherNight, mdiWhiteBalanceSunny, mdiBellOutline } from '@mdi/js';
import { isMobile } from '@/utils/screen';
import { useAuthStore } from '@/store/authStore';
import Logo from '@/assets/logo.vue';

export default Vue.extend({
    name: 'AdminLayout',
    components: { Logo },
    data() {
        return {
            mdiWeatherNight,
            mdiWhiteBalanceSunny,
            mdiBellOutline,
            drawer: false
        };
    },
    computed: {
        userLoaded(): boolean {
            return useAuthStore().loaded;
        },
        hasUser(): boolean {
            return this.userLoaded && !!useAuthStore().userId;
        },
        isMobile(): boolean {
            return isMobile(this.$vuetify);
        },
        height(): number {
            if (this.isMobile) {
                if (this.drawer) {
                    return 244;
                }
                return 76;
            } else {
                return 80;
            }
        }
    },
    watch: {
        userLoaded(): void {
            this.guard();
        },
        '$router.currentRoute': {
            handler(): void {
                this.guard();
            },
            immediate: true
        }
    },
    mounted() {
        useAuthStore().router = this.$router;
        useAuthStore().loadUser();
    },
    methods: {
        guard(): void {
            const route = this.$router.currentRoute.name;
            const authed = this.userLoaded && this.hasUser;
            console.log(route);
            if (!this.userLoaded) {
                return;
            }
            if (route == 'index') {
                return;
            }

            if (route == 'login' && authed) {
                this.$router.push('/manage');
                return;
            }

            if (route == 'manage' && !authed) {
                console.log('ahaha');
                this.$router.push('/login');
            }
        },
        changeDarkMode(): void {
            localStorage.setItem('dark-mode', this.$vuetify.theme.dark + '');
        },
        logout(): void {
            useAuthStore().logout();
        }
    }
});
</script>

<style scoped>
.main-mobile {
    margin-top: 0px !important;
    padding-top: 0px !important;
}
.main-drawer {
    margin-top: 0px !important;
}

.v-btn--active::before {
    opacity: 0 !important;
}
</style>
