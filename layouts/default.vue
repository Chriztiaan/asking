<template>
    <v-app>
        <v-app-bar :app="!isMobile" flat color="app-background" :height="height" :elevation="isMobile ? 1 : 0">
            <div class="px-12 d-flex flex-column justify-center justify-md-start flex-md-row align-center gap-3 py-4" style="width: 100%">
                <div v-if="isMobile" class="d-flex justify-space-between width-100">
                    <v-img :src="require(`~/assets/leave.svg`)" max-height="50" max-width="50" />
                    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
                </div>
                <template v-else>
                    <v-img :src="require(`~/assets/leave.svg`)" max-height="50" max-width="50" />
                </template>
                <template v-if="!isMobile || drawer">
                    <v-btn class="f-18 w-700" :outlined="isMobile" width="100" text to="/home"> Home </v-btn>
                    <v-btn class="f-18 w-700" :outlined="isMobile" width="100" text to="/design"> Manage </v-btn>
                    <v-spacer />
                </template>
                <div class="d-flex gap-3 align-center">
                    <div class="d-flex align-center gap-2">
                        <v-icon v-if="$vuetify.theme.dark">{{ mdiWeatherNight }}</v-icon>
                        <v-icon v-else>{{ mdiWhiteBalanceSunny }}</v-icon>
                        <v-switch v-model="$vuetify.theme.dark" dense :dark="false" inset hide-details @change="changeDarkMode"></v-switch>
                    </div>
                </div>
            </div>
        </v-app-bar>
        <v-main class="text--text app-background" :class="{ 'main-mobile': isMobile, 'main-drawer': drawer }">
            <v-main>
                <v-container> <Nuxt /> </v-container>
            </v-main>
        </v-main>
        <snackbar />
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mdiWeatherNight, mdiWhiteBalanceSunny, mdiBellOutline, mdiChevronDown } from '@mdi/js';
import { isMobile } from '@/utils/screen';

export default Vue.extend({
    name: 'AdminLayout',
    data() {
        return {
            mdiWeatherNight,
            mdiWhiteBalanceSunny,
            mdiBellOutline,
            mdiChevronDown,
            drawer: false
        };
    },
    computed: {
        isMobile(): boolean {
            return isMobile(this.$vuetify);
        },
        height(): number {
            if (this.drawer) {
                return 275;
            }
            if (this.isMobile) {
                return 160;
            } else {
                return 80;
            }
        }
    },
    methods: {
        changeDarkMode(): void {
            localStorage.setItem('dark-mode', this.$vuetify.theme.dark + '');
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
    margin-top: 170px !important;
}
</style>
