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
  <main class="note-container">
    <TitleBar />
    <div contenteditable="true" class="note-title" ref="titleDiv" @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd" @input="handleInput"></div>
    <div class="note-created-time">{{ createdTime }}</div>
    <div id='vditor-area' class="vditor-container"></div>
  </main>
</template>

<script setup>
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { ref, onMounted } from 'vue'
import _ from 'lodash'
import useNoteStore from '@/storage/noteStore'
import TitleBar from '@/components/TitleBar.vue'
const vditor = ref()
const titleDiv = ref(null)
const createdTime = ref(new Date().toLocaleString())
let title = ref(createdTime.value)
const noteStore = useNoteStore()
const noteID = Date.now()
let isComposing = ref(false)

function updateNoteStore() {
  const content = vditor.value ? vditor.value.getValue() : '';
  noteStore.update(`note_${noteID}`, title.value, content);
}

const handleCompositionStart = () => {
  isComposing.value = true;
};

const handleCompositionEnd = () => {
  isComposing.value = false;
  // 触发更新以确保在组合输入结束后更新数据
  handleInput();
};

const handleInput = _.debounce(() => {
  if (!isComposing.value && titleDiv.value) {
    title.value = titleDiv.value.innerText;
    // 更新笔记内容
    updateNoteStore();
  }
}, 500)
onMounted(() => {
  vditor.value = new Vditor('vditor-area', {
    height: '100%',
    toolbar: [],
    // blur: () => {
    //   updateNoteStore();
    // }
    input: (value) => {
      if (value) {
        updateNoteStore();
      }
    },
    cache: {
      "id": `vditor-${noteID.toString()}`
    },
  })
  if (titleDiv.value) {
    titleDiv.value.innerText = title.value;
  }
  // // 监听输入事件，更新标题变量
  // titleDiv.value.addEventListener('input', () => {
  //   title.value = titleDiv.value.innerText;
  // });
})
// noteStore.add(timestamp.value,'aaa')

</script>
<style scoped>
.note-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
}

.vditor-container {
  flex-grow: 1;
  /* 这使得该div填满剩余空间 */
  overflow-y: auto;
  /* 添加滚动条以防内容溢出 */
}

.note-title {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 10px;
}

.note-created-time {
  color: grey;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>