<template>
    <div class="d-flex flex-column gap-1">
        <header-5><slot>&nbsp;</slot></header-5>
        <v-skeleton-loader v-if="loading" type="image" height="150"></v-skeleton-loader>
        <v-textarea v-else v-bind="$attrs" hide-details no-resize outlined v-on="$listeners" />
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
}
</style>
