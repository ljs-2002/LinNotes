<script setup>
import {onMounted} from "vue";
// import {ipcRenderer} from "electron";
import useNoteStore from "@/storage/noteStore";
const noteStore = useNoteStore()

window.electron.ipcRenderer.on('save-notes', (event, id, title, content) => {
  noteStore.update(id, title, content)
})

function handleCreateNote(){
  const noteID = Date.now()
  const createTime = new Date(noteID).toLocaleString()
  window.WindowOption.CreateNotesWindow(noteID)
  noteStore.add(noteID,createTime,'')
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
  <ul>
    <li v-for="note in noteStore.notes" :key="note[0]">
      <div>{{note[1].title}} - {{note[1].content}}</div>
      <button @click="handleDeleteNote(note[0])">delete</button>
    </li>
  </ul>
</div>
<button @click="handleCreateNote()" >create Notes</button>

</template>

<style scoped>

</style>