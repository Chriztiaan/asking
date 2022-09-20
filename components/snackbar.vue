<template>
    <v-snackbar v-model="internalValue" :timeout="3500" :left="!isMobile">
        {{ text }}
    </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { isMobile } from '@/utils/screen';

export default Vue.extend({
    props: {
        value: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: 'some text'
        }
    },
    data() {
        return {
            internalValue: this.value
        };
    },
    computed: {
        isMobile(): boolean {
            return isMobile(this.$vuetify);
        }
    },
    watch: {
        value(): void {
            if (this.internalValue != this.value) {
                this.internalValue = this.value;
            }
        },
        internalValue(): void {
            if (!this.internalValue) {
                this.$emit('input', false);
            }
        }
    }
});
</script>
