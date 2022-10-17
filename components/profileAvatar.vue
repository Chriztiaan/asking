<template>
    <v-btn icon v-bind="$attrs" @click="$emit('click', $event)">
        <v-badge bordered bottom color="secondary" dot offset-x="10" offset-y="45">
            <v-avatar size="50">
                <div v-if="loadingProfilePicture" class="d-flex align-center justify-center" style="height: 150px">
                    <v-progress-circular :size="50" :width="4" color="tertiary" indeterminate></v-progress-circular>
                </div>
                <v-img v-else :src="profilePicture" referrerpolicy="no-referrer"></v-img>
                <!-- Hack -->
                <img v-show="false" :src="profilePicture" referrerpolicy="no-referrer" />
            </v-avatar>
        </v-badge>
    </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';
import { useProfileStore } from '@/store/profileStore';
export default Vue.extend({
    computed: {
        profilePicture(): string {
            const p = useProfileStore().profilePicture;
            if (p) {
                return p;
            }
            return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6aMSd6UXIgSwBn5c9fvTlZwMjPjeP7vGfnSXXMy68evP4I6USVcPZqq5OYSbxUAtdbEk&usqp=CAU';
        },
        loadingProfilePicture(): boolean {
            return useProfileStore().loadingProfilePicture;
        }
    },
    mounted() {
        useProfileStore().retrieveProfilePicture();
    }
});
</script>
