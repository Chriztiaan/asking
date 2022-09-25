<template>
    <div class="d-flex justify-center pb-2">
        <div v-if="submitted" class="d-flex flex-column justify-center" style="height: 300px">
            <header-1>Thank you!</header-1>
        </div>
        <div v-else class="d-flex flex-column gap-8" :class="breakpoint" style="max-width: 800px">
            <v-card elevation="4" class="pa-5 d-flex justify-start align-center gap-4 flex-wrap">
                <template v-if="loadingProfileCard">
                    <div>
                        <v-skeleton-loader type="avatar" height="75" />
                    </div>
                    <div>
                        <v-skeleton-loader type="chip" class="name-loader"></v-skeleton-loader>
                    </div>
                    <v-spacer />
                    <div class="width-50">
                        <v-skeleton-loader class="bio-loader" type="image"></v-skeleton-loader>
                    </div>
                </template>
                <template v-else>
                    <v-avatar size="75">
                        <v-img :src="profilePicture"></v-img>
                    </v-avatar>
                    <div class="f-16 w-500 text--text">{{ name }}</div>
                    <v-spacer />
                    <div class="f-14 w-400 text--text" style="min-width: 300px; max-width: 400px">{{ bio }}</div>
                </template>
            </v-card>

            <template v-if="loadingQuestions">
                <div class="d-flex flex-column my-12">
                    <div class="d-flex flex-wrap">
                        <div v-for="i in 4" :key="i" class="yellow text-field"></div>
                    </div>
                    <div class="d-flex align-center justify-center" style="height: 150px">
                        <v-progress-circular :size="100" :width="4" color="tertiary" indeterminate></v-progress-circular>
                    </div>
                </div>
            </template>
            <template v-else>
                <header-3 class="mt-0">
                    {{ questionnaireTitle }}
                </header-3>
                <div class="d-flex flex-column gap-3">
                    <header-4>Job details</header-4>
                    <div class="d-flex gap-4 gap-row-5 flex-wrap">
                        <text-field :disabled="submitting" placeholder="Dream Company">Company</text-field>
                        <text-field v-if="salary" :disabled="submitting" placeholder="22 schmeckles p/m">Salary</text-field>
                        <text-field v-if="leave" :disabled="submitting" placeholder="30 days p/a">Leave Policy</text-field>
                        <dropdown v-if="remote" :disabled="submitting" :items="remoteOptions">Remote Work Policy</dropdown>
                    </div>
                </div>

                <div class="d-flex flex-column gap-3">
                    <header-4>Contact information</header-4>
                    <div class="d-flex gap-4 flex-wrap">
                        <text-field :disabled="submitting" placeholder="John Smith">Contact Person</text-field>
                        <text-field :disabled="submitting" placeholder="john@mail.com">Email</text-field>
                    </div>
                </div>

                <div class="mt-4 d-flex flex-column gap-5 custom-questions">
                    <header-4>Just a few more things</header-4>
                    <text-field v-for="(q, i) in questions" :key="q.id" :disabled="submitting" placeholder="">{{ i + 1 }}. {{ q.content }}</text-field>
                    <text-area :disabled="submitting">Notes</text-area>
                </div>
            </template>
            <div class="d-flex flex-column gap-5">
                <v-divider class="" />
                <div class="d-flex justify-end">
                    <v-btn color="primary" :disabled="loadingProfileCard || loadingQuestions || submitting" :loading="submitting" width="150" @click="submit">Submit</v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mdiHome, mdiHomeCity, mdiHomeOff } from '@mdi/js';
import { useProfileStore } from '@/store/profileStore';
import { useQuestionnaireStore } from '@/store/questionnaireStore';
import { Profile, Question, Questionnaire } from '@/store/types/DatabaseModels';
import DropdownOption from '@/components/input/dropdownOption';
import dropdown from '@/components/input/dropdown.vue';
import { useAnswerStore } from '@/store/answerStore';

export default Vue.extend({
    name: 'FillPage',
    components: { dropdown },
    layout: 'admin',

    data() {
        return {
            remoteOptions: [new DropdownOption('Remote', mdiHome), new DropdownOption('Hybrid', mdiHomeCity), new DropdownOption('No Remote', mdiHomeOff)],
            id: ''
        };
    },
    computed: {
        loadingProfileCard(): boolean {
            return useProfileStore().loadingProfilePicture || useProfileStore().retrieving;
        },
        loadingQuestions(): boolean {
            return useQuestionnaireStore().loading || useQuestionnaireStore().questionsLoading;
        },
        profile(): Profile | undefined {
            return useProfileStore().profile;
        },
        name(): string {
            if (this.profile && this.profile.name) {
                return this.profile.name;
            } else {
                return '';
            }
        },
        bio(): string {
            if (this.profile && this.profile.bio) {
                return this.profile.bio;
            } else {
                return '';
            }
        },
        profilePicture(): string {
            const p = useProfileStore().profilePicture;
            if (p) {
                return p;
            }
            return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6aMSd6UXIgSwBn5c9fvTlZwMjPjeP7vGfnSXXMy68evP4I6USVcPZqq5OYSbxUAtdbEk&usqp=CAU';
        },

        questionnaire(): Questionnaire | undefined {
            return useQuestionnaireStore().questionnaire;
        },
        questionnaireTitle(): string {
            if (this.questionnaire && this.questionnaire.title) {
                return this.questionnaire.title;
            } else {
                return '';
            }
        },
        salary(): boolean {
            return this.questionnaire?.salary || false;
        },
        leave(): boolean {
            return this.questionnaire?.leave || false;
        },

        remote(): boolean {
            return this.questionnaire?.remote || false;
        },
        questions(): Question[] {
            return useQuestionnaireStore().questions;
        },
        breakpoint(): string {
            return this.$vuetify.breakpoint.name;
        },

        submitting(): boolean {
            return useAnswerStore().answersSubmitting;
        },
        submitted(): boolean {
            return useAnswerStore().submitted;
        }
    },
    watch: {
        '$route.params': {
            handler(): void {
                // handler
                this.id = this.$route.params.id;
                if (this.id) {
                    this.retrieveInformation();
                }
            },
            immediate: true
        }
    },
    methods: {
        retrieveInformation(): void {
            // profile
            useProfileStore().retrieveProfile(this.id);
            // profile picture
            useProfileStore().retrieveProfilePicture(this.id);
            // questionnaire
            useQuestionnaireStore().retrieveQuestionnaire(this.id);
        },
        submit(): void {
            useAnswerStore().submitAnswers({} as any, {} as any);
        }
    }
});
</script>

<style scoped lang="scss">
.xs :deep(.text-field) {
    width: 100% !important;
}

.sm :deep(.text-field) {
    width: 48% !important;
}

.md :deep(.text-field) {
    width: 49% !important;
}

:deep(.text-field) {
    width: 32% !important;
    min-width: 220px;
    /* max-width: min(100%, 430px) !important; */
}

.xs .custom-questions :deep(.text-field) {
    width: 100% !important;
}

.sm .custom-questions :deep(.text-field) {
    width: 100% !important;
}

.md .custom-questions :deep(.text-field) {
    width: 100% !important;
}

.custom-questions :deep(.text-field) {
    width: 50% !important;
}

:deep(.v-skeleton-loader__avatar) {
    width: 75px !important;
    height: 75px !important;
}

.bio-loader :deep(.v-skeleton-loader__image) {
    // width: 100% !important;
    height: 75px !important;
    min-width: 400px;
    max-width: 400px;
}

.xs,
.sm {
    .bio-loader :deep(.v-skeleton-loader__image) {
        // width: 100% !important;
        width: 300px !important;
        min-width: 100% !important;
    }
}

.name-loader :deep(.v-skeleton-loader__chip) {
    width: 150px !important;
    height: 40px;
    border-radius: 10px;
}
</style>
