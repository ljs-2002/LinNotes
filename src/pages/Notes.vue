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
  <main class="note-container" :style="{backgroundColor: color,borderColor: color}">
    <div class="sticky-top" :style="{backgroundColor: darken_color }">
      <TitleBar>
      <div contenteditable="true" class="note-title" ref="titleDiv" @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd" @input="handleInput" @keydown.enter.prevent="handleEnter"></div>
      </TitleBar>
<!--      <div class="note-created-time">{{ createdTime }}</div>-->
    </div>
    <div id='vditor-area' class="vditor-container" :style="{backgroundColor: color,borderColor: color}"></div>
  </main>
</template>

<script setup>
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import '@/style/Scrollbar.css'
import {ref, onMounted, onUnmounted} from 'vue'
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

//TODO: 改变便签颜色
let color = ref('#ffffff')
let darken_color = ref(darken(color.value, 0.1))
console.log(darken_color.value)
function darken(color, percent) {
  // 解析颜色
  let r = parseInt(color.slice(1, 3), 16);
  let g = parseInt(color.slice(3, 5), 16);
  let b = parseInt(color.slice(5, 7), 16);

  // 计算减少的值
  const decrease = Math.floor(255 * percent);

  // 根据减少的值计算新的颜色值
  r = Math.max(0, r - decrease);
  g = Math.max(0, g - decrease);
  b = Math.max(0, b - decrease);

  // 转换回十六进制字符串
  const rr = r.toString(16).padStart(2, '0');
  const gg = g.toString(16).padStart(2, '0');
  const bb = b.toString(16).padStart(2, '0');

  return `#${rr}${gg}${bb}`;
}

function updateNoteStore() {
  const content = vditor.value ? vditor.value.getValue() : '';
  window.NoteOption.SaveNotes(noteID, title.value, createdTime.value, content);
}

function checkToDo() {
  const content = vditor.value ? vditor.value.getValue() : '';
  window.NoteOption.CheckToDo(noteID, content);
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
}, 100)

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
    after() {
      vditor.value.setValue(note_content,true)
      vditor.value.focus()
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
  document.addEventListener('click', checkToDo);
})

onUnmounted(() => {
  checkToDo()
  document.removeEventListener('click', checkToDo);
})

</script>
<style scoped lang="scss">
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
  --textarea-background-color: transparent !important;
  --panel-background-color: transparent !important;
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