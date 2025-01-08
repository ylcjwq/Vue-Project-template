<script setup lang="ts">
import { sum, multiply } from '@/utils/sum';
import winImg from '@images/win.jpg';
import { test } from '@/api/test';

const a = sum(1, 2);

multiply(3, 4);

async function getFn() {
  const { data } = await test();
  console.log(data.value);
}
</script>

<template>
  <div>
    <h1 class="c-red">{{ a }}</h1>
    <el-image :src="winImg" />
    <el-button @click="getFn()">按钮</el-button>
    <i class="i-ic-baseline-assist-walker wh-20 c-red" />
    <span class="i-mdi-light-home" />
    <i class="i-mdi-alarm wh-10" />
  </div>
  <router-view />
</template>

<style scoped></style>
