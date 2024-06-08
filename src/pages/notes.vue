<!--
 * @Author: LinJiasheng
 * @Date: 2024-06-07 16:32:06
 * @LastEditors: LinJiasheng
 * @LastEditTime: 2024-06-07 23:42:41
 * @Description: 
 * 
 * Copyright (c) 2024 by LinJiasheng, All Rights Reserved. 
-->
<template>
  <TitleBar />
  <div id='vditor' style="height: 200px;"></div>
</template>

<script setup>
import Vditor from 'vditor'
import 'vditor/dist/index.css';
import { ref, onMounted } from 'vue';
import TitleBar from '@/components/TitleBar.vue';
const vditor = ref()
onMounted(() => {
  vditor.value = new Vditor('vditor',{
    height: '80vh',
    width: '98vw' ,
    toolbar:[],
  })
})
</script>
<style lang="scss" scoped>

</style>