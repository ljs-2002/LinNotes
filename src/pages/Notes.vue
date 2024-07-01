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
    <div class="sticky-top">
      <TitleBar>
      <div contenteditable="true" class="note-title" ref="titleDiv" @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd" @input="handleInput" @keydown.enter.prevent="handleEnter"></div>
      </TitleBar>
<!--      <div class="note-created-time">{{ createdTime }}</div>-->
    </div>
    <div id='vditor-area' class="vditor-container"></div>
  </main>
</template>

<script setup>
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import '@/style/Scrollbar.css'
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
if (titleDiv.value) {
  titleDiv.value.innerText = title.value;
}

let isFirstEmpty = true
let isComposing = ref(false)

function updateNoteStore() {
  const content = vditor.value ? vditor.value.getValue() : '';
  window.NoteOption.SaveNotes(noteID, title.value, createdTime.value, content);
}

const handleEnter = () => {
  // 当按下回车键时，将焦点转移到vditor中
  if (vditor.value) {
    vditor.value.focus()
  }
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
      //输入为空且是第一次输入为空，触发更新
      if (value === '' && isFirstEmpty) {
        updateNoteStore();
        isFirstEmpty = false;
      }else if(value !== ''){
        isFirstEmpty = true;
        updateNoteStore();
      }
    },
    cache: {
      "id": `vditor-${noteID.toString()}`
    },
  })
})

</script>
<style scoped lang="scss">
$color: #f0f0f0;
.note-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-height: 100vh;
  margin: 0;
}

.sticky-top {
  position: sticky;
  top: 0;
  /* 背景颜色为主题色加深一点*/
  background-color: darken($color, 0%);
  z-index: 1; /* 确保置顶内容总是在其他内容之上 */
}

.vditor-container {
  overflow-y: auto;
  /* 这使得该div填满剩余空间 */
  flex-grow: 1;
}

.vditor {
  border: none !important;
  --border-color: transparent !important;
}

.note-title {
  font-weight: bold;
  font-size: 16px;
  margin: 0 auto;
  outline: none;
  color: black;
  padding: 0 5px 0 0;
  -webkit-app-region: no-drag;
}

.note-created-time {
  color: grey;
  font-size: 14px;
  margin-left: 10px;
  margin-bottom: 5px;
}
</style>