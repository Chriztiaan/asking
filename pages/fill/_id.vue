<template>
    <div class="d-flex flex-column gap-5">
        <v-card elevation="4" class="pa-5 d-flex justify-start align-center gap-4">
            <v-avatar size="75">
                <div v-if="loadingProfilePicture" class="d-flex align-center justify-center" style="height: 150px">
                    <v-progress-circular :size="75" :width="4" color="tertiary" indeterminate></v-progress-circular>
                </div>
                <v-img v-else :src="profilePicture"></v-img>
            </v-avatar>
            <div class="f-16 w-500 text--text">{{ name }}</div>
            <v-spacer />
            <div class="f-14 w-400 text--text" style="max-width: 400px">{{ bio }}</div>
        </v-card>

        <header-3 class="mt-5">{{ questionnaireTitle }}</header-3>
        <div class="d-flex flex-wrap gap-4">
            <text-field v-if="salary">Salary</text-field>
            <text-field v-if="leave">Leave</text-field>
            <dropdown v-if="remote" :items="remoteOptions">Remote Work Policy</dropdown>
        </div>

        <div class="mt-4 d-flex flex-column gap-5">
            <text-field v-for="(q, i) in questions" :key="q.id" placeholder="">{{ i + 1 }}. {{ q.content }}</text-field>
            <text-area>Notes</text-area>
        </div>
        <!-- 

        <div>Fill - {{ id }}</div>
        <div>-------------</div>

        <div>{{ name }}</div>
        <div>{{ bio }}</div>
        <div>{{ profilePicture }}</div>
        <div>-------------</div>
        <div>{{ questionnaireTitle }}</div>
        <div>-------------</div>
        <div>{{ salary }}</div>
        <div>{{ leave }}</div>
        <div>{{ remote }}</div>
        <div>-------------</div>
        <div>{{ questions }}</div> -->
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
export default Vue.extend({
    name: 'FillPage',
    components: { dropdown },
    layout: 'admin',

    data() {
        return {
            // mdiHome,
            // mdiHomeCity,
            // mdiHomeOff,

            remoteOptions: [new DropdownOption('Remote', mdiHome), new DropdownOption('Hybrid', mdiHomeCity), new DropdownOption('No Remote', mdiHomeOff)],
            id: ''
        };
    },
    computed: {
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
        loadingProfilePicture(): boolean {
            return useProfileStore().loadingProfilePicture;
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

        // Tri state
        remote(): boolean {
            return this.questionnaire?.remote || false;
        },
        questions(): Question[] {
            return useQuestionnaireStore().questions;
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
    mounted(): void {
        console.log(this.$route.params);
    },
    methods: {
        retrieveInformation(): void {
            // profile
            useProfileStore().retrieveProfile(this.id);
            // profile picture
            useProfileStore().retrieveProfilePicture(this.id);
            // questionnaire
            useQuestionnaireStore().retrieveQuestionnaire(this.id);
        }
    }
});
</script>
