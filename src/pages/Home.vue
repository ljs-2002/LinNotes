<script setup>
import {onMounted} from "vue";
import useNoteStore from "@/storage/noteStore";
import NoteCard from "@/components/NoteCard.vue";
import {VueDraggable} from "vue-draggable-plus";

const noteStore = useNoteStore()

window.NoteOption.HandleSaveNote(noteStore.update)
window.NoteOption.HandleRequireNoteContent((noteID, senderID) => {
  let note = noteStore.getNotes(noteID)
  window.NoteOption.ReplyNotesContent(senderID, JSON.stringify(note))
})
const handleCreateNote = () => {
  const noteID = Date.now()
  const createTime = new Date(noteID).toLocaleString()
  window.WindowOption.CreateNotesWindow(noteID).then(() => {
    noteStore.add(noteID, createTime, createTime, '')
  })
}
window.NoteOption.HandleShortCutCreateNote(handleCreateNote)
const handleOpenNote = (noteID) => {
  window.WindowOption.CreateNotesWindow(noteID)
}

const handleDeleteNote = (noteID) => {
  window.WindowOption.DeleteWindow(noteID)
  noteStore.delete(noteID)
}

onMounted(() => {
  noteStore.load()
})

</script>

<template>
  <main class="note-list">
  <div class="note-list-title">
    <div>便签列表</div>
<!--    <button @click="noteStore.deleteAll()" >delete All</button>-->
  </div>
  <div class="note-list-area">
    <VueDraggable v-if="noteStore.notes_list.length" v-model="noteStore.notes_list" animation="150" target=".note-card-list">
      <div class="note-card-list">
        <NoteCard
            v-for="note in noteStore.notes_list"
            :key="note.createTime"
            :noteTitle="note.noteTitle"
            :createTime="note.createTime"
            :noteID="note.id"
            :handleOpenNote="handleOpenNote"
            :handleDeleteNote="handleDeleteNote"
        />
      </div>
    </VueDraggable>
    <div v-else class="empty-note-list">
      <div>点击下方+号创建新的便签</div>
      <div>快捷键：Ctrl/Command + =</div>
    </div>
  </div>
    <button class="create-note-button" @click="handleCreateNote()">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path
            d="M13.0001 10.9999L22.0002 10.9997L22.0002 12.9997L13.0001 12.9999L13.0001 21.9998L11.0001 21.9998L11.0001 12.9999L2.00004 13.0001L2 11.0001L11.0001 10.9999L11 2.00025L13 2.00024L13.0001 10.9999Z"></path>
      </svg>
    </button>
  </main>
</template>

<style scoped>
.note-list {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.note-list-title {
  position: sticky;
  top: 0;
  z-index: 1; /* 确保置顶内容总是在其他内容之上 */
  background: white;
  font-size: 24px;
  font-weight: bold;
  padding: 10px 0;
  border-bottom: 2px solid #000;
}

.note-list-area {
  height: calc(100vh - 50px);
  overflow-y: auto;
  flex-grow: 1; /* 这使得该div填满剩余空间 */
}

.empty-note-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: rgba(77,78,81,0.8);
  font-size: 18px;
  font-weight: bold;
}

.create-note-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px; /* 可以根据需要调整高度 */
  background-color: #f1f1f1; /* 可以根据需要调整背景颜色 */
  font-size: 30px; /* 可以根据需要调整十字符号的大小 */
  font-weight: bold; /* 粗的十字符号 */
  position: sticky;
  bottom: 0;
  z-index: 1; /* 确保底部内容总是在其他内容之上 */
  border-left: none; /* 去掉左边的线 */
  border-right: none;
}
</style>