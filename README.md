<p align="center">
<img src="https://bafybeih7f7vqm3exiqxpo5i62evjxbclkpxfdmtmgz7t5ag7bx4i2xvovm.ipfs.infura-ipfs.io/cheers-02.png" alt="Cheers Bio" width="250">
</p>
<h1 align="center">Cheers Bio</h1>

Front part of [Cheers Bio](https://rss3.bio/)

The `main` branch is automatically deployed to https://rss3.bio

## Contribution

Any kind of contribution is welcomed

Knowledge you may need: Vue TypeScript

```sh
yarn
yarn dev
```

### 改动

将原项目的 Footprint 区域移除,使用 Content 来进行填充.然后引入了自定义 Markdown 组件来补充 Content 区域类容.

### Markdown.vue

该组件组要用于加载 Markdown 的内容显示.

加载原理

```
    获取markdown内容 -> 处理成markdown的html格式 -> 引入markdown的样式文件渲染
```

### 获取 markdown 内容

这里我们分成了两种形式获取.分别是从本地文件以及 github 的 api 获取

**本地加载**

本地加载首先需要 webpack 能够识别 md 文件,需要配置对应的 loader.
先通过 npm 添加 `html-loader` 包的依赖,然后在`webpack.config.js`配置文件的`rules`中配置对应的 loader

```
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
```

配置完成就可以通过`import`导入本地 md 文件获取对应的内容了.
本地加载需要修改`Markdown.vue`中`article`标签的`v-html`属性.

```
import md from '@/assets/RSS3源码分析.md';

...

    <article className="markdown-body" v-html="compiledMarkdown"></article>
```

[快速创建属于自己的 GitHub 仓库](https://blog.csdn.net/Boring_Wednesday/article/details/78651631)

**网络加载**

网络加载使用了 github 的 api 去获取对应路径下文件的内容. api 使用就不再过多赘述.
正常获取回来的内容是经过 base64 编码过的. 所以添加了`base64`文件来进行解码

```
        axios.get(config.mdUrl).then((response) => {
            this.mdText = response.data.content;
            this.mdText = BASE64Util.base64_decode(this.mdText);
            this.mdText = marked(this.mdText || '', {
                sanitize: true,
            });
            console.log(this.mdText);
        });
```

同时`Markdown.vue`中`article`标签的`v-html`属性直接使用解析过后的`mdText`属性即可.

```
    <article className="markdown-body" v-html="mdText"></article>
```

默认的加载文件路径配置在`/src/config.ts`文件`mdUrl`属性.

```
// 标准格式如下.
https://api.github.com/repos/WeLightProject/WeLightBlockchainOS/contents/README.md?ref=main
// https://api.github.com/repos/{组织/用户名}/{项目名称}/contents/{项目下的具体文件路径,名称}?ref={分支名称}
```

**处理成 html 格式**

把 markdown 内容处理成 html 格式需要用到`marked`库,通过 npm 添加完依赖之后,导入使用之后即可.
百度的出来的都是不带花括号的导入,但是这里不带花括号就会报错,原因未知,也是看到其他文件中有这种导入方式,才尝试加上花括号,才解决一直报错无法导入的问题.

导入之后直接将原始的 md 内容作为参数传递进去,返回的即是 html 格式的内容

```
import { marked } from 'marked';

            .....

            marked(md || '', {
                sanitize: true,
            })
```

**引入 css 样式渲染**

通过 npm 引入`markdown-it-vue`依赖,然后导入下面的样式即可.

```
import 'markdown-it-vue/dist/markdown-it-vue.css';
```

本想一步到位使用第三方组件直接显示 vue,但是引入之后就是各种报错.原因未知.
怀疑是当前 vue 版本为 5.x 原因. 因为在`markdown-it-vue`的 issue 中看到有说 vue 5.x 版本导入报错的.
虽然错误信息不太相同.
其他的 markdown 的渲染编辑组件均尝试过,但是就是各种乱七八糟的报错.无法正常运行.

所以最后只能走 引入基本内容->转换 html 格式->css 样式渲染 基本处理方式来进行处理.

### 默认用户数据

项目中是通过钱包地址抓取用户数据然后进行展示的.
尝试通过路由直接定位到首页并拼接用户获取数据,发现不太行.

最终解决办法绕了点,在首页里面直接重定向到首页.

需要展示某个用户数据直接修改 `src/config.ts` 中的 `address`即可.

### 部署

下载项目之后根据自己的需求修改 `src/config.ts` 中的钱包地址和对应的 md 文件 url 地址.

```
export default {
    address: '0xC994B5384C0d0611De2ecE7d6fF1aD16C34A812F',
    mdUrl: 'https://api.github.com/repos/komomoo/vuepress-theme-resume/contents/example/README.md?ref=master',
    ...
}
```

接着 使用 `webpack` 指令打包,打包出来的即可正常访问(打包时间比较长,无进度条,需要耐心等候,约 1 分钟左右.)
