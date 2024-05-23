<template>
  <myDialog
    title="二维码查看"
    :cancel="cancel"
    :loading="loading"
    :visible="true"
    width="600px"
  >
    <el-form ref="dialogForm" :model="dialogForm" label-width="110px">
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="微信二维码：" prop="qrCode">
            <div style="display: flex">
              <div ref="qrcode" style="width: 150px" />
              <el-button
                style="margin-left: 10px; width: 80px; height: 32px"
                size="small"
                type="primary"
                @click="creatQrcode(url)"
              >
                <span>重新生成</span>
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">关 闭</myButton>
    </template>
  </myDialog>
</template>

<script>
import { Message } from 'element-ui'
import QRCode from 'qrcodejs2'
export default {
  props: {
    url: {
      required: false,
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      loading: false,
      dialogForm: {

      }
    }
  },
  created() {
  },
  mounted() {
    this.creatQrcode(this.url)
  },
  methods: {

    // 取消
    cancel(done) {
      this.$emit('close', {})
    },
    // 生成二维码
    creatQrcode(url) {
      this.$nextTick(() => {
        this.$refs.qrcode.innerHTML = ''

        new QRCode(this.$refs.qrcode, {
          text: url, // url地址  文本等需要转换为二维码的内容
          width: 150,
          height: 150,
          colorDark: '#333333', // 二维码颜色
          colorLight: '#ffffff', // 二维码背景色
          correctLevel: QRCode.CorrectLevel.L // 容错率，L/M/H
        })

        Message({
          type: 'success',
          message: '生成成功'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
