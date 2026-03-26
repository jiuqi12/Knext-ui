<template>
  <div>
    <div class="terminal-container">
      <h2>Terminal终端</h2>
      <!-- 终端容器 -->
      <div class="terminal" ref="terminalRef"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'
import { FitAddon } from 'xterm-addon-fit'

// DOM引用
const terminalRef = ref(null)
// sockeett连接实例
let socket = null

// 创建终端实例
let term = new Terminal({
  cursorBlink: true, // 光标闪烁
  fontSize: 14,
  theme: {
    background: '#1e1e1e'
  },
  scrollback: 1000 // 滚动条历史记录长度
})
// 创建适配插件实例
const fitAddon = new FitAddon()

// 组件挂载后执行挂在终端，插件适配，并打开终端
onMounted(() => {
  // 加载fit插件，自动适配大小
  term.loadAddon(fitAddon)
  // 打开终端
  term.open(terminalRef.value)
  // 适配终端大小
  fitAddon.fit()
  // 聚焦终端
  term.focus()
  // 创建socket连接实例
  socket = new WebSocket(
    'ws://127.0.0.1:8000/api/v1/ws/pods/gitee/gitee-nginx/terminal'
  )
  // 接收数据并写入终端
  socket.onmessage = (event) => {
    term.write(event.data)
  }
  // 监听终端输入事件，将输入数据发送到后端
  term.onData((data) => {
    socket.send(data)
  })
  // 窗口变化时重新适配
  window.addEventListener('resize', () => {
    fitAddon.fit()
  })
})

// 组件销毁前执行关闭终端并且终端socket连接
onBeforeUnmount(() => {
  if (term) {
    term.dispose()
  }
  if (socket) {
    socket.close()
  }
})
</script>

<style lang="scss" scoped>
.terminal-container {
  padding: 20px;
  .terminal {
    width: 100%;
    height: 600px;
    background: #000;
    overflow: hidden;
  }
}
</style>
