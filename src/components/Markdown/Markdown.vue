<template>
    <div>
        <!--    <markdown-it-vue-light :content="htmlMD"/>-->
        <!--    <vue-markdown>{{htmlMD}}</vue-markdown>-->
        <markdown />
    </div>
</template>

<script>
import MarkdownItVue from 'markdown-it-vue';
// import vueMarkdown from 'vue-markdown'
import 'markdown-it-vue/dist/markdown-it-vue.css';
import htmlMD from '@/assets/RSS3源码分析.md';
import mavonEditor from 'mavon-editor';

export default {
    components: {
        MarkdownItVue,
        mavonEditor,
        // vueMarkdown,
    },
    data() {
        return {
            htmlMD: '# rss3 #\n' + 'Web3Pass 项目中的核心网络请求框架,所有的网络数据通过这里传输请求.\n',
        };
    },
};
</script>

<style lang="postcss" scoped></style>
