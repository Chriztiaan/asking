<template>
    <div class="d-flex flex-column align-center justify-center gap-2" style="height: 50vh">
        <div class="text--text d-flex" style="font-size: 64px">
            pallet
            <div class="header--text">:</div>
        </div>
        <div class="text--text d-flex" style="font-size: 44px; max-width: 650px; text-align: center">ask questions about your next tech job</div>
        <v-btn to="/login" class="mt-7" nuxt color="primary">Get started</v-btn>
    </div>
</template>

<script>
export default {
    name: 'HomePageT',
    layout: 'admin'
};
</script>
