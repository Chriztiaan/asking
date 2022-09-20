<template>
    <div class="d-flex flex-column gap-1 text-field">
        <header-5><slot>&nbsp;</slot></header-5>
        <div v-if="loading" class="d-flex align-center">
            <v-skeleton-loader type="chip" width="100%"></v-skeleton-loader>
        </div>
        <v-text-field v-else type="search" v-bind="$attrs" dense outlined hide-details height="34" v-on="$listeners"></v-text-field>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    }
});
</script>

<style scoped>
:deep(.v-skeleton-loader__chip) {
    width: 100% !important;
    height: 40px;
    border-radius: 10px;
}
</style>
