<script setup lang="ts">
import { sum, multiply } from '@/utils/sum';
import winImg from '@assets/images/win.jpg';

const a = sum(1, 2);
multiply(3, 4);
console.log(123);
console.error(123);
</script>

<template>
  <div>
    <h1 class="c-red">{{ a }}</h1>
    <el-image :src="winImg" />
    <el-button>按钮</el-button>
    <i class="i-ic-baseline-assist-walker wh-20 c-red" />
    <span class="i-mdi-light-home" />
    <i class="i-mdi-alarm wh-10" />
  </div>
</template>

<style scoped></style>
