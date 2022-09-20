<template>
    <div>
        <div v-if="loading" class="d-flex align-center">
            <v-skeleton-loader type="button"></v-skeleton-loader>
        </div>
        <v-btn v-else :color="color" v-bind="$attrs" @click="$emit('click')">
            <v-icon>
                <slot>mdi-home</slot>
            </v-icon>
        </v-btn>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    props: {
        color: {
            type: String,
            default: 'primary'
        },
        loading: {
            type: Boolean,
            default: false
        }
    }
});
</script>

<style scoped>
:deep(.v-btn) {
    height: 40px;
    width: 40px;
    min-width: 40px !important;
    max-width: 40px !important;
    padding: 0 !important;
    border-radius: 10px;
}

:deep(.v-skeleton-loader__button) {
    width: 40px !important;
    height: 40px;
    border-radius: 10px;
}
</style>
