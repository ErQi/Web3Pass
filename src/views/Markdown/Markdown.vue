<template>
    <article className="markdown-body" v-html="mdText"></article>
</template>

<script>
import 'markdown-it-vue/dist/markdown-it-vue.css';
import md from '@/assets/RSS3源码分析.md';
import { marked } from 'marked';
import config from '@/config';
import axios from 'axios';
import BASE64Util from '@/common/base64';

let mdText = '';
// 通过html-loader 加载本地md文件.  再通过marked转成html格式, 最后引入markdown-it-vue.css 完成渲染
export default {
    created() {
        console.log('加载完毕');
        axios.get(config.mdUrl).then((response) => {
            mdText = response.data.content;
            mdText = BASE64Util.base64_decode(mdText);
            mdText = marked(mdText || '', {
                sanitize: true,
            });
            console.log(mdText);
        });
    },
    data() {
        return {
            md,
            mdText,
        };
    },
    computed: {
        // 加载本地文件的形式
        compiledMarkdown: function () {
            let s = marked(md || '', {
                sanitize: true,
            });
            // console.log(s)
            return s;
        },
        // 加载githubUrl的形式
        loadMarkdown: function () {},
    },
};
</script>

<style></style>
