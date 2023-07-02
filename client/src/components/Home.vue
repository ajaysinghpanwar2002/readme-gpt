<template>
    <div>
        <h1
            class="w-full flex justify-center text-xl p-10 text-zinc-300 font-medium text-opacity-80 hover:text-opacity-100">
            Generate Github documentation using LLM</h1>
        <div class="w-full flex justify-around p-10 ">
            <input class="placeholder-black p-2 rounded-sm" type="text" placeholder="Enter Github Username"
                v-model="username" />
            <input class="placeholder-black p-2 rounded-sm" type="text" placeholder="Enter Repository Name"
                v-model="RepositoryName" />
        </div>
        <div class="flex justify-center p-10 ">
            <button @click="getReadme" type="button" class="bg-gray-50 hover:bg-gray-200 rounded-sm px-2">Make
                documentation</button>
        </div>
        <div class="w-full flex justify-center p-20">
            <template v-if="loading">
                <loading />
            </template>
            <template v-else>
                <img src="../assets/GitHub_Invertocat_Logo.svg" />
            </template>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import { SERVER_URL } from '../constants';
import Loading from './Loading.vue';

export default {
    name: 'Home',
    data() {
        return {
            username: '',
            RepositoryName: '',
            loading: false,
        };
    },
    methods: {
        async getReadme() {
            const URL = `${SERVER_URL}/${this.username}/${this.RepositoryName}`;
            this.loading = true;
            try {
                const readmeData = await axios.get(URL);
                console.log(readmeData.data);
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
    },
    components: {
        Loading,
    },
};
</script>
