<template>
    <article class="markdown-body" v-html="compiledMarkdown" />
</template>

<script>
import 'markdown-it-vue/dist/markdown-it-vue.css';
import md from '@/assets/RSS3源码分析.md';
import { marked } from 'marked';

// 通过html-loader 加载本地md文件.  再通过marked转成html格式, 最后引入markdown-it-vue.css 完成渲染
export default {
    data() {
        return {
            md,
        };
    },
    computed: {
        compiledMarkdown: function () {
            return marked(md || '', {
                sanitize: true,
            });
        },
    },
};
</script>

<style scoped></style>
