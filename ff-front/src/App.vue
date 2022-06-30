<template>
    <v-app>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>

import axios from 'axios';

export default {
    name: 'App',

    data: () => ({

    }),
    mounted() {
        // axios({
        //     method: 'get',
        //     url: 'http://localhost:3000/all'
        // }).then(res => {
        //     this.$store.commit('months', res.data);
        // }).catch(err => console.log(err));
    }
};
</script>
