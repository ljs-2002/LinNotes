<script setup>
defineProps(['noteTitle','createTime'])
</script>

<template>
<div class="note-card">
  <div class="note-info">
    <div class="note-title">{{noteTitle}}</div>
    <div class="note-created-time">{{createTime}}</div>
  </div>
  <div class="note-operation">
    <button>delete</button>
    <button>open</button>
  </div>
</div>
</template>

<style scoped>
.note-title {
  font-weight: bold;
  font-size: 30px;
  margin-bottom: -20px;
  text-align: left;
  padding: 10px;
}
.note-created-time {
  color: grey;
  font-size: 14px;
  margin-top: -20px;
  margin-bottom: 20px;
  text-align: left;
  padding: 10px;
}
.note-card {
  display: flex;
  justify-content: space-between;
  border: 1px solid black;
  border-radius: 10px;
  margin-bottom: 10px;
}
.note-operation {
  display: flex;
  justify-content: space-between;
}
</style>