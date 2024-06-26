<script setup>
import {onMounted} from "vue";
import useNoteStore from "@/storage/noteStore";
import NoteCard from "@/components/NoteCard.vue";
import {VueDraggable} from "vue-draggable-plus";

const noteStore = useNoteStore()

window.electron.ipcRenderer.on('save-notes', (event, id, title,create_time,content) => {
  noteStore.update(id, title, create_time, content)
})

function handleCreateNote(){
  const noteID = Date.now()
  const createTime = new Date(noteID).toLocaleString()
  window.WindowOption.CreateNotesWindow(noteID)
  noteStore.add(noteID,createTime,createTime,'')
}

// function handleOpenNote(id){
//   window.WindowOption.openNotesWindow(id)
// }

function handleDeleteNote(id){
  noteStore.delete(id)
}

onMounted(() => {
  noteStore.load()
  console.log(noteStore.notes)
})

</script>

<template>
<h1>Main Page</h1>
<div >
  <h2>Notes</h2>
  <button @click="noteStore.deleteAll()" >delete All</button>
  <VueDraggable v-model="noteStore.notes_list" animation="150" target=".note-card-list">
    <div class="note-card-list">
      <NoteCard
          v-for="note in noteStore.notes_list"
          :key="note.createTime"
          :noteTitle="note.noteTitle"
          :createTime="note.createTime"
      />
    </div>
  </VueDraggable>
<!--  <ul>-->
<!--    <li v-for="note in noteStore.notes" :key="note[0]">-->
<!--      <div>{{note[1].title}} - {{note[1].content}}</div>-->
<!--      <button @click="handleDeleteNote(note[0])">delete</button>-->
<!--    </li>-->
<!--  </ul>-->
</div>
<button @click="handleCreateNote()" >create Notes</button>

</template>

<style scoped>

</style>