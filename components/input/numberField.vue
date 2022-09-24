<template>
    <v-text-field v-model.number="count" type="number" class="count-input" dense outlined hide-details height="34" @input="updateCount"></v-text-field>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    props: {
        value: {
            type: Number,
            default: 0
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 1
        }
    },
    data() {
        return { count: this.value, bool: true, oldCount: 1 };
    },
    watch: {
        count(): void {
            this.$emit('input', this.count);
        },
        value(): void {
            this.count = this.value;
        }
    },
    methods: {
        updateCount(): void {
            if (this.count < this.min || this.count > this.max || this.count.toString().length > 4) {
                this.$nextTick(() => (this.count = this.oldCount));
                return;
            }
            this.oldCount = this.count;
        }
    }
});
</script>

<style scoped lang="scss">
:deep(.count-input) {
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0 !important;
    }
    /* Firefox */
    input[type='number'] {
        -moz-appearance: textfield !important;
    }
    input {
        font-weight: 400;
        font-size: 12px;
        line-height: 34px;
    }
}
</style>
