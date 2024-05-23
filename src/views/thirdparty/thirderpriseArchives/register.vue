<template>
    <myDialog
      title="员工注册"
      :cancel="cancel"
      :loading="loading"
      :visible="true"
      width="550px"
    >
      <el-form ref="dialogForm" :model="dialogForm">
        <el-row :gutter="20">
          <el-col>
            <el-form-item label="是否开启第三方员工注册：" prop="isOpenRegister">
              <el-switch
                v-model="sysEnterprise.isOpenRegister"
                active-text="开启"
                inactive-text="关闭"
                :active-value="'是'"
                :inactive-value="'否'"
                @change="editRegister"
              />
            </el-form-item>
            <el-form-item label="后台地址：" prop="riskName">
              <el-input
                ref="pcUrl"
                v-model.trim="dialogForm.pcUrl"
                readonly
                type="text"
                class="input-default"
              />
              <el-button
                style="margin-left: 10px;"
                size="small"
                type="primary"
                @click="copyText"
              >
                <span>复制链接</span>
  
              </el-button>
            </el-form-item>
            <el-form-item label="微信二维码：" prop="riskName">
              <div style="display: flex;">
                <div ref="qrcode" style="width: 150px;" />
                <!-- <el-button
                  style="margin-left: 10px; width: 80px;height: 32px;"
                  size="small"
                  type="primary"
                  @click="creatQrcode(dialogForm.wxUrl)"
                >
                  <span>重新生成</span>
  
                </el-button> -->
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
  import { edit, detail } from '@/api/thirdparty/information'
  import { Message } from 'element-ui'
  import QRCode from 'qrcodejs2'
  export default {
    props: {
  
      id: {
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
          pcUrl: window.location.href.split('#')[0] + '#/thirdpartyuser?thirdPartyId=' + this.id,
          wxUrl: window.location.href.split('#')[0] + '#/thirdpartyuser?thirdPartyId=' + this.id
        },
        sysEnterprise: {}
      }
    },
    created() {
      this.getDetail()
    },
    mounted() {
      this.creatQrcode(this.dialogForm.wxUrl)
    },
    methods: {
      getDetail() {
        detail({ id: this.id })
          .then((res) => {
            console.log(res)
            this.sysEnterprise = res
          })
          .finally(() => {
            this.loading = false
          })
      },
      editRegister(e) {
        edit(this.sysEnterprise)
          .then((res) => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          })
          .catch((e) => {
  
          })
  
        console.log(e)
      },
      copyText() {
        const url = this.dialogForm.pcUrl
        const oInput = document.createElement('input')
        oInput.value = url
        document.body.appendChild(oInput)
        oInput.select() // 选择对象;
        console.log(oInput.value)
        document.execCommand('Copy') // 执行浏览器复制命令
  
        oInput.remove()
  
        Message({
          type: 'success',
          message: '复制成功'
        })
      },
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
  