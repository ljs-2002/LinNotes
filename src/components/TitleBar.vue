<template>
  <div class="title-bar">
    <div class="title-bar__buttons">
      <button @click="minimize"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
          fill="rgba(0,0,0,1)">
          <path d="M5 11V13H19V11H5Z"></path>
        </svg></button>
      <button @click="toggleAlwaysOnTop"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24"
          height="24" fill="rgba(0,0,0,1)">
          <path
            d="M18 3V5H17V11L19 14V16H13V23H11V16H5V14L7 11V5H6V3H18ZM9 5V11.6056L7.4037 14H16.5963L15 11.6056V5H9Z">
          </path>
        </svg></button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      windowId: null, // 在data中添加一个用于存储窗口ID的属性
    };
  },
  methods: {
    getWindowId() {
      // 如果已经有窗口ID，则直接返回一个解决了的Promise
      if (this.windowId !== null) {
        return Promise.resolve(this.windowId);
      }
      // 否则，从WindowOption中获取窗口ID
      return window.WindowOption.GetWindowId().then((id) => {
        this.windowId = id; // 获取到ID后，将其保存
        return id; // 返回获取到的ID
      });
    },
    minimize() {
      this.getWindowId().then((id) => {
        window.WindowOption.Minimize(id);
      });
    },
    toggleAlwaysOnTop() {
      this.getWindowId().then((id) => {
        window.WindowOption.ToggleAlwaysOnTop(id);
      });
    }
  }
}

</script>

<style scoped>
.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-app-region: drag;
  background-color: #ffffff;
  color: white;
  height: 30px;
  padding: 0 10px;
}

.title-bar__buttons {
  display: flex;
}

button {
  -webkit-app-region: no-drag;
  background: none;
  border: none;
  color: white;
  padding: 0 10px;
  cursor: pointer;
}

button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
