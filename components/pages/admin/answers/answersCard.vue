<template>
    <div>
        <v-divider />
        <div class="mt-4 d-flex flex-column gap-5">
            <template v-if="loading">
                <text-field v-for="i in 3" :key="i" loading />
                <text-area loading>Notes</text-area>
            </template>
            <template v-else>
                <text-field v-for="(p, i) in pairs" :key="i" :value="p.answer.content" disabled>{{ i + 1 }}. {{ p.question.content }}</text-field>
                <text-area :value="notes" disabled>Notes</text-area>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { useAnswerStore } from '@/store/answerStore';
import { Answer, Question } from '@/store/types/DatabaseModels';
export default Vue.extend({
    props: {
        answerSetId: {
            type: String,
            default: ''
        },
        notes: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            loading: false
        };
    },
    computed: {
        answers(): Answer[] | undefined {
            return useAnswerStore().answers.find((a) => a.key == this.answerSetId)?.answers;
        },
        pairs(): Array<{ answer: Answer; question: Question }> | undefined {
            if (!this.answers) {
                return undefined;
            }
            const answers = this.answers;
            return useAnswerStore()
                .pairs.filter((p) => answers.includes(p.answer))
                .sort((a, b) => new Date(a.question.created_at as string).getTime() - new Date(b.question.created_at as string).getTime());
        }
    },
    mounted(): void {
        if (this.answerSetId && !this.answers) {
            this.loading = true;
            useAnswerStore()
                .retrieveAnswers(this.answerSetId)
                .then(() => (this.loading = false));
        }
    }
});
</script>
