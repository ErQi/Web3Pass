<template>
    <button class="link-btn">
        <slot></slot>
    </button>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
@Options({
    props: {
        size: String,
    },
})
export default class LinkButton extends Vue {
    size!: String;
}
</script>

<style scoped lang="postcss">
@layer components {
    .link-btn {
        @apply flex flex-row gap-2 items-center justify-center pb-1 pt-1 px-3 text-center text-base font-light leading-none bg-secondary-btn rounded-sm focus:outline-none;
    }
}
</style>
