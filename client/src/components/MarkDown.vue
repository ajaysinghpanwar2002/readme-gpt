<template>
    <div class="w-full flex justify-center">
        <div v-html="parsedContent"></div>
    </div>
</template>

<script>
import MarkdownIt from 'markdown-it';

export default {
    name: "MarkDown",
    props: {
        content: {
            type: String,
            required: true
        }
    },
    computed: {
        parsedContent() {
            const md = new MarkdownIt();
            return md.render(this.content);
        }
    }
};
</script>