<template>
  <div class="title-bar">
    <div class="title-bar__buttons">
      <button @click="minimize">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"
             fill="rgba(0,0,0,1)">
          <path d="M5 11V13H19V11H5Z"></path>
        </svg>
      </button>
      <button @click="toggleAlwaysOnTop">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18"
             height="18" :fill="isRotated ? 'rgba(53,116,240,1)' : 'rgba(0,0,0,1)'"
             :class="{ 'rotate-svg': !isRotated }">
          <path
              d="M18 3V5H17V11L19 14V16H13V23H11V16H5V14L7 11V5H6V3H18ZM9 5V11.6056L7.4037 14H16.5963L15 11.6056V5H9Z">
          </path>
        </svg>
      </button>
    </div>
    <div class="title-bar__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      windowId: null, // 在data中添加一个用于存储窗口ID的属性
      isRotated: false,
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
        this.isRotated = !this.isRotated;
      });
    }
  }
}

</script>

<style scoped>
.title-bar {
  display: flex;
  justify-content: center;
  /*justify-content: flex-start;*/
  align-items: center;
  -webkit-app-region: drag;
  position: relative;
  /*background-color: #ffffff;*/
  color: white;
  border: none !important;
  padding: 5px 0;
}

.title-bar__content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.title-bar__buttons {
  display: flex;
  position: absolute;
  left: 0;
  /*margin-top: 5px;*/
  /*margin-left: 0;*/
}

button {
  -webkit-app-region: no-drag;
  background: none;
  border: none;
  color: white;
  padding: 2px 5px;
  cursor: pointer;
  outline: none;
}

button:hover {
  /*background-color: rgba(255, 255, 255, 0.2);*/
  background-color: darkgray;
}

.rotate-svg {
  transform: rotate(45deg);
}
</style>
