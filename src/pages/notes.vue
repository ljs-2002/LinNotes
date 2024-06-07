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
    height: '50vh',
    width: '98vw' ,
    toolbar:[],
  })
})
</script>
<style lang="scss" scoped>

</style>