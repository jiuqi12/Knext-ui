<template>
  <div class="log-container">
    <h2>Kubernetes Pod Logs</h2>

    <div class="controls">
      <button @click="connect">Start</button>
      <button @click="disconnect">Stop</button>
    </div>

    <div class="log-window" ref="logWindow">
      <div v-for="(line, index) in logs" :key="index">
        {{ line }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const ws = ref(null)
const logs = ref([])

const logWindow = ref(null)

function connect() {
  const url = 'ws://localhost:8000/api/v1/ws/pods/default/nginx/logs'

  ws.value = new WebSocket(url)

  ws.value.onmessage = (event) => {
    logs.value.push(event.data)

    // 限制最大日志数量
    if (logs.value.length > 1000) {
      logs.value.shift()
    }

    scrollToBottom()
  }

  ws.value.onopen = () => {
    console.log('log stream connected')
  }

  ws.value.onclose = () => {
    console.log('log stream closed')
  }
}

function disconnect() {
  if (ws.value) {
    ws.value.close()
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (logWindow.value) {
      logWindow.value.scrollTop = logWindow.value.scrollHeight
    }
  })
}
</script>

<style scoped>
.log-container {
  padding: 20px;
}

.controls {
  margin-bottom: 10px;
}

.controls input {
  margin-right: 10px;
  padding: 5px;
}

.controls button {
  margin-right: 10px;
}

.log-window {
  height: 500px;
  overflow: auto;
  background: #000;
  color: #00ff00;
  font-family: monospace;
  padding: 10px;
  border-radius: 4px;
}
</style>
