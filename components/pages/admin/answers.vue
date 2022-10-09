<template>
    <div>
        <header-1 class="primary--text">Answers</header-1>

        <div class="d-flex flex-column gap-5">
            <template v-if="loading">
                <v-skeleton-loader v-for="j in 3" :key="j" class="v-sheet v-card elevation-4" type="image" />
            </template>
            <div v-else-if="noAnswerSets" class="d-flex flex-column align-center">
                <v-icon class="mb-6 mt-6" size="100" color="tertiary">{{ mdiFormatListText }}</v-icon>
                <header-2 class="wfc">No answers sets yet</header-2>
                <header-5 class="subtext--text">Share your questions with someone!</header-5>
            </div>

            <v-card v-for="(answerSet, i) in answerSets" v-else :key="answerSet.id" elevation="4" class="pa-5 d-flex flex-column gap-4">
                <div class="d-flex justify-space-between align-center">
                    <div class="text--text w-600 lh-20" :class="{ 'f-18': !isMobile, 'f-14': isMobile }">
                        {{ answerSet.contact_person }}
                    </div>
                    <div class="d-flex align-center gap-2">
                        <div class="d-flex align-center">
                            <template v-if="answerSet.remote == 0">
                                <v-icon class="icon-margin-sm" color="tertiary">{{ mdiHome }}</v-icon>
                                <div
                                    class="text--text w-600"
                                    :class="{
                                        'f-14': !isMobile,
                                        'f-12': isMobile
                                    }"
                                >
                                    Remote
                                </div>
                            </template>
                            <template v-else-if="answerSet.remote == 1">
                                <v-icon class="icon-margin" color="tertiary">{{ mdiHomeCity }}</v-icon>
                                <div
                                    class="text--text w-600"
                                    :class="{
                                        'f-14': !isMobile,
                                        'f-12': isMobile
                                    }"
                                >
                                    Hybrid
                                </div>
                            </template>
                            <template v-else-if="answerSet.remote == 2">
                                <v-icon class="icon-margin-sm" color="tertiary">{{ mdiHomeOff }}</v-icon>
                                <div
                                    class="text--text w-600"
                                    :class="{
                                        'f-14': !isMobile,
                                        'f-12': isMobile
                                    }"
                                >
                                    No remote
                                </div>
                            </template>
                        </div>
                        <div class="d-flex align-center gap-2">
                            <v-divider vertical class="tertiary" style="border-right-width: 2px" />
                            <div class="text--text w-600" :class="{ 'f-14': !isMobile, 'f-12': isMobile }">
                                {{ answerSet.company }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-space-between align-center">
                    <div class="d-flex gap-5 width-100 align-start" style="min-width: 280px">
                        <div v-if="!isMobile" class="d-flex flex-column gap-1" style="max-width: 60px">
                            <div class="tertiary--text f-14 w-400">Email:</div>
                            <!-- <div class="tertiary--text f-14 w-400">Phone:</div> -->
                        </div>
                        <div class="d-flex flex-column gap-1">
                            <div class="d-flex align-center gap-2 text--text w-400" :class="{ 'f-14': !isMobile, 'f-12': isMobile }">
                                <div>{{ answerSet.email }}</div>
                                <v-btn class="copy-btn" text min-width="12" width="12" max-height="20" height="20" @click="copyToClipboard(answerSet.email)">
                                    <v-icon small>{{ mdiContentCopy }}</v-icon>
                                </v-btn>
                            </div>
                            <!-- <div class="d-flex align-center gap-2 text--text w-400" :class="{ 'f-14': !isMobile, 'f-12': isMobile }">
                                <div>{{ answerSet.phone_number }}</div>
                                <v-btn class="copy-btn" text min-width="12" width="12" max-height="20" height="20" @click="copyToClipboard(answerSet.phone_number)">
                                    <v-icon small>{{ mdiContentCopy }}</v-icon>
                                </v-btn>
                            </div> -->
                        </div>
                        <v-spacer />
                        <div class="d-flex flex-column align-end gap-1 justify-start width-100">
                            <div class="d-flex align-center gap-1">
                                <v-icon color="text lighten-4" size="20">{{ mdiCreditCardOutline }}</v-icon>
                                <div
                                    class="text--text text--lighten-4 w-400"
                                    :class="{
                                        'f-14': !isMobile,
                                        'f-12': isMobile
                                    }"
                                >
                                    {{ answerSet.salary }}
                                </div>
                            </div>
                            <div class="d-flex align-center gap-1">
                                <v-icon color="text lighten-4" size="20">{{ mdiCalendar }}</v-icon>
                                <div
                                    class="text--text text--lighten-4 w-400"
                                    :class="{
                                        'f-14': !isMobile,
                                        'f-12': isMobile
                                    }"
                                >
                                    {{ answerSet.leave }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-space-between align-end">
                    <div class="subtext--text f-12 lh-12 w-600">Posted: {{ formatPostedDate(answerSet.created_at) }}</div>
                    <div class="d-flex gap-4">
                        <icon-btn color="error" @click="deleteAnswerSet(answerSet.id)">{{ mdiTrashCan }}</icon-btn>
                        <icon-btn color="accent" @click="viewAnswers(i)">{{ mdiMenu }}</icon-btn>
                    </div>
                </div>

                <div v-if="viewEntry == i">
                    <answers-card :answer-set-id="answerSet.id" :notes="answerSet.notes" />
                </div>
            </v-card>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { subDays, format, formatDistance } from 'date-fns';
import { mdiHome, mdiHomeCity, mdiHomeOff, mdiMenu, mdiCreditCardOutline, mdiContentCopy, mdiCalendar, mdiTrashCan, mdiFormatListText } from '@mdi/js';
import answersCard from './answers/answersCard.vue';
import { useAnswerStore } from '@/store/answerStore';
import { AnswerSet } from '@/store/types/DatabaseModels';
import { isMobile } from '@/utils/screen';
import { notificationCopiedClipboard, useNotificationStore } from '@/store/notificationStore';

export default Vue.extend({
    components: { answersCard },
    data() {
        return {
            mdiHome,
            mdiHomeCity,
            mdiHomeOff,
            mdiMenu,
            mdiCalendar,
            mdiTrashCan,
            mdiCreditCardOutline,
            mdiContentCopy,
            mdiFormatListText,

            viewEntry: undefined as number | undefined
        };
    },
    computed: {
        loading(): boolean {
            return useAnswerStore().loading;
        },
        answerSets(): AnswerSet[] {
            return useAnswerStore().answerSets;
        },
        isMobile(): boolean {
            return isMobile(this.$vuetify);
        },
        noAnswerSets(): boolean {
            return this.answerSets.length == 0;
        }
    },
    mounted() {
        useAnswerStore().retrieveAnswerSets();
    },
    methods: {
        viewAnswers(index: number): void {
            if (this.viewEntry == index) {
                this.viewEntry = undefined;
            } else {
                this.viewEntry = index;
            }
        },
        copyToClipboard(text: string): void {
            /* Copy the text inside the text field */
            navigator.clipboard.writeText(text);
            useNotificationStore().addNotification(notificationCopiedClipboard);
        },
        formatPostedDate(value: string): string {
            if (value) {
                const date = new Date(value);
                const now = new Date();
                if (date > subDays(now, 5)) {
                    return formatDistance(date, new Date(), { addSuffix: true });
                }
                return format(date, 'dd MMMM yyyy');
            }
            return 'unknown';
        },
        deleteAnswerSet(answerSetId: string): void {
            useAnswerStore().deleteAnswerSet(answerSetId);
        }
    }
});
</script>

<style scoped lang="scss">
:deep(.v-skeleton-loader__image) {
    height: 182px !important;
}

.icon-margin {
    margin-right: 6px !important;
}

.icon-margin-sm {
    margin-right: 4px !important;
}

.copy-btn {
    padding-left: 10px !important;
    padding-right: 10px !important;
}
</style>
