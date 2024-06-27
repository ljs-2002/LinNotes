<script setup>
import {onMounted} from "vue";
import useNoteStore from "@/storage/noteStore";
import NoteCard from "@/components/NoteCard.vue";
import {VueDraggable} from "vue-draggable-plus";

const noteStore = useNoteStore()

window.NoteOption.HandleSaveNote(noteStore.update)
window.NoteOption.HandleRequireNoteContent((noteID,senderID)=>{
  let note = noteStore.getNotes(noteID)
  window.NoteOption.ReplyNotesContent(senderID,JSON.stringify(note))
})
const handleCreateNote = () => {
  const noteID = Date.now()
  const createTime = new Date(noteID).toLocaleString()
  window.WindowOption.CreateNotesWindow(noteID).then(()=>{
    noteStore.add(noteID,createTime,createTime,'')
  })
}

const handleOpenNote = (noteID)=>{
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
          :noteID="note.id"
          :handleOpenNote="handleOpenNote"
          :handleDeleteNote="handleDeleteNote"
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