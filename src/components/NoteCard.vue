<script setup>
defineProps(['noteTitle', 'createTime', 'noteID', 'handleOpenNote', 'handleDeleteNote'])

</script>

<template>
  <div class="note-card">
    <div class="note-info">
      <div class="note-title">{{ noteTitle }}</div>
      <div class="note-created-time">{{ createTime }}</div>
    </div>
    <div class="note-operation">
      <button @click="handleDeleteNote(noteID)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path
              d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
        </svg>
      </button>
      <button @click="handleOpenNote(noteID)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path
              d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.note-title {
  font-weight: bold;
  font-size: 24px;
  text-align: left;
  padding: 5px 10px;
}

.note-created-time {
  color: grey;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: left;
  padding: 0 10px;
}

.note-card {
  display: flex;
  justify-content: space-between;
  border: 2px solid black;
  border-radius: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 2px;
}

.note-operation {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-operation button {
  width: 40px; /* 设置按钮的宽度 */
  height: 40px; /* 设置按钮的高度 */
  border-radius: 50%; /* 使按钮变成圆形 */
  margin: 5px; /* 设置按钮之间的间隔 */
}

.note-operation button:hover {
  background-color: #bababa; /* 鼠标悬停时的背景颜色 */
}
</style>