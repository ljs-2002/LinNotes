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
import {ref, onMounted} from 'vue'
import { useRoute } from 'vue-router'
import _ from 'lodash'
import TitleBar from '@/components/TitleBar.vue'
const vditor = ref()
const titleDiv = ref(null)
const route = useRoute()
const noteID = Number(route.params.id)
const createdTime = ref(new Date(noteID).toLocaleString())
let title = ref(createdTime.value)

let isComposing = ref(false)

if (titleDiv.value) {
  titleDiv.value.innerText = title.value;
}

function updateNoteStore() {
  const content = vditor.value ? vditor.value.getValue() : '';
  window.NoteOption.SaveNotes(noteID, title.value, createdTime.value, content);
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
  let note_content = ''
  window.NoteOption.RequireNoteContent(noteID)
  window.NoteOption.HandleNotesContent((note) => {
    note = JSON.parse(note)
    if (note !== null) {
      // 设置标题
      title.value = note.title
      if (titleDiv.value) {
        titleDiv.value.innerText = note.title
      }
      // 设置内容
      // vditor.value.setValue(note.content)
      note_content = note.content
    }
  })
  vditor.value = new Vditor('vditor-area', {
    height: '100%',
    toolbar: [],
    // blur: () => {
    //   updateNoteStore();
    // }
    after() {
      vditor.value.setValue(note_content,true)
    },
    input: (value) => {
      if (value) {
        updateNoteStore();
      }
    },
    cache: {
      "id": `vditor-${noteID.toString()}`
    },
  })
})

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