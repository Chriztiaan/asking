<template>
    <v-btn v-ripple="false" class="pl-0" text plain width="220" :disabled="disabled" v-bind="$attrs" @click="$emit('click')">
        <v-icon v-if="icon" left class="primary--text">{{ icon }}</v-icon>
        <div class="link-btn" :class="disabled ? 'disabled--text' : 'primary--text'"><slot /></div>
    </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    props: {
        icon: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    }
});
</script>

<style scoped lang="scss">
.link-btn:hover {
    text-decoration: underline;
}

.theme--dark {
    .link-btn {
        color: var(--v-text-base) !important;
    }
    .v-icon {
        color: var(--v-text-base) !important;
    }
}
</style>
