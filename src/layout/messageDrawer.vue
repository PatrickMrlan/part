<template>
  <el-drawer
    title="消息列表"
    :visible.sync="visible"
    direction="btt"
    :wrapper-closable="false"
    :close-on-press-escape="false"
    custom-class="messageDrawer"
  >
    <div class="messaageList">
      <div v-if="messaageData && messaageData.length">
        <div v-for="(item, index) in messaageData" :key="index" class="message_content" @click="goPage(item.url)">
          {{ item.describeInfo }}
        </div>
      </div>

    </div>
  </el-drawer>
</template>

<script>
import { listByUser } from '@/api/system/message'

export default {
  name: 'MessageDrawer',
  props: {
    drawer: {
      required: false,
      default() {
        return false
      }
    },
    messaageData: {

      required: false,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loginUser: {},
      messageIdList: JSON.parse(sessionStorage.getItem('messageIdList')) || [],

      visible: false,
      //   messaageData: null,

      websock: null,
      time1: null, // 连接的延时器
      timeout: 5 * 1000, // 30秒一次心跳
      timeObj: null, // 心跳心跳倒计时,
      interval: null
    }
  },
  created() {
    this.loginUser = JSON.parse(sessionStorage.getItem('loginUser'))
    this.getMessage()

    if (this.interval) {
      clearInterval(this.interval)
    }
    this.interval = setInterval(() => {
      this.getMessage()
    }, 30 * 1000)
    // this.initWebSocket()
  },
  methods: {
    goPage(url) {
      if (url) {
        this.$router.push({
          path: url

        })
        this.visible = false
      }
    },
    getMessage() {
      this.visible = false
      listByUser({ messageIdList: this.messageIdList }).then((res) => {
        if (res.list.length > 0) {
          this.messaageData = res.list
          this.messageIdList = this.messageIdList.concat(res.messageIdList)
          sessionStorage.setItem('messageIdList', JSON.stringify(this.messageIdList))
          this.visible = true
        } else {
          this.visible = false
        }
      })
    },
    initWebSocket: function() {
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      // 用户token

      let url = ''
      if (process.env.NODE_ENV === 'production') {
        // 生产环境
        // url = 'ws://118.123.213.111:8865/websocket/' + this.loginUser.userId + ',' + this.loginUser.companyId
        url = 'ws://118.123.213.111:8254/websocket/' + this.loginUser.token
      } else {
        // development 开发环境
        // url = 'ws://192.168.31.240:30008/?bindType=2&bindContent=' + bindContent
        // url = 'ws://118.123.213.111:8865/websocket/' + this.loginUser.userId + ',' + this.loginUser.companyId
        url = 'ws://192.168.10.51:8082/websocket/' + this.loginUser.token
      }
      // this.websock = new WebSocket('ws://192.168.31.240:30008/?bindType=2&bindContent=' + bindContent)
      this.websock = new WebSocket(url)
      this.websock.onopen = this.websocketOnopen
      this.websock.onerror = this.websocketOnerror
      this.websock.onmessage = this.websocketOnmessage
      this.websock.onclose = this.websocketOnclose
    },
    websocketOnopen: function() {
      console.log('页面WebSocket连接成功')
      // 开启心跳检测
      this.start()
    },
    // 正式包中连接会一分钟后断开，使用心跳监测如果断开连接则重新连接
    start() {
      // 开启心跳
      const context = this
      clearInterval(context.timeObj)

      context.timeObj = setInterval(function() {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息
        if (context.websock.readyState === 1) {
          // 如果连接正常
          context.websock.send(
            JSON.stringify({
              type: 0,
              data: '心跳'
            })
          )
        } else {
          // 否则重连
          context.reconnect()
        }
      }, context.timeout)
    },
    // 连接失败后的回调函数
    websocketOnerror: function(e) {
      this.reconnect()
    },
    // 当从服务器接受到信息时的回调函数
    websocketOnmessage: function(e) {
      const data = JSON.parse(e.data)
      console.log(e)
      switch (data.type) {
        case 0: // 心跳
          this.visible = false
          break
        case 1: //
          this.messaageData = data.data
          this.visible = true
          break
      }
    },

    websocketOnclose: function(e) {
      // console.log('connection closed (' + e.code + ')')
    },
    websocketSend(text) {
      // 数据发送
      try {
        this.websock.send(text)
      } catch (err) {
        // console.log('send failed (' + err.code + ')')
      }
    },
    reconnect() {
      const context = this
      if (context.lockReconnect) return
      context.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      clearTimeout(this.time1)
      this.time1 = setTimeout(function() {
        // console.info('尝试重连...')
        context.initWebSocket()
        context.lockReconnect = false
      }, 5000)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.messageDrawer {
  width: 500px !important;
  height: 350px !important;
  left: unset !important;
  border-radius: 10px 10px 0 0;

  .el-drawer__header {
    font-size: 20px;
    color: #000;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px !important;
    padding: 10px 20px !important;
  }
}

.messaageList {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  & > div {
    cursor: pointer;
    width: 100%;
    padding: 10px;
    margin-bottom: 10px !important;
    font-size: 16px;
    color: #000;
  }
  & > div:hover {
  }
}
.message_content:hover{
    background: rgba(0, 0, 0, 0.1);

    color:#006EFF

}
</style>
