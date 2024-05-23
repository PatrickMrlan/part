<template>
  <myDialog
    :loading="loading"
    :title="title"
    width="880px"
    class="dialog-form"
    :visible="true"
    :top="'10vh'"
    :cancel="cancel"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="110px"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="应用地址：" prop="appUrl">
            <el-input
              v-model.trim="dialogForm.appUrl"
              type="text"
              placeholder="应用地址"
              clearable
              maxlength="255"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应用名称：" prop="appName">
            <el-input
              v-model.trim="dialogForm.appName"
              type="text"
              class="input-default"
              placeholder="应用名称"
              clearable
              maxlength="20"
            />
          </el-form-item>

          <el-form-item label="时间限制：">
            <el-select
              v-model="dialogForm.isUseTime"
              placeholder="请选择"
              class="input-default"
              clearabl
            >
              <el-option
                v-for="(item, index) in isUseTimeList"
                :key="index"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="
              dialogForm.isUseTime == '期限使用' || dialogForm.isUseTime == '1'
            "
            label="应用使用时间："
          >
            <el-date-picker
              v-model="time"
              type="daterange"
              class="input-default"
              range-separator="~"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="跳转类型：" prop="jumpType">
            <el-select
              v-model="dialogForm.jumpType"
              placeholder="请选择"
              class="input-default"
              clearabl
            >
              <el-option
                v-for="(item, index) in jumpTypeList"
                :key="index"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="跳转方式：" prop="jumpMode">
            <el-select
              v-model="dialogForm.jumpMode"
              placeholder="请选择"
              class="input-default"
              clearabl
            >
              <el-option
                v-for="(item, index) in jumpModeList"
                :key="index"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="排序：" prop="sort">
            <el-input-number v-model="dialogForm.sort" :min="0" :max="999" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-col :span="12">
        <el-form-item label="应用图标：" prop="appIcon">
          <el-input
            v-show="false"
            v-model.trim="dialogForm.appIcon"
            readonly
            clearable
          />
          <el-upload
            :action="serverUrl"
            accept=".jpg,.gif,.png,.jpeg"
            :file-list="fileListIcon"
            :on-success="handleSuccessIcon"
            :on-preview="handlePreviewIcon"
            :on-change="handleIntroduceUploadHideIcon"
            :on-remove="handleRemoveIcon"
            list-type="picture-card"
            :limit="limitCountIcon"
            :class="{ hideUploadBoxIcon: hideUpload_introduce_Icon }"
          >
            <div class="uploadDiv">
              <i slot="default" class="el-icon-plus" />
            </div>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="应用图片：" prop="appImg">
          <el-input
            v-show="false"
            v-model.trim="dialogForm.appImg"
            readonly
            clearable
            placeholder="请上传封面图片，建议400*400像素的图片"
          />
          <el-upload
            :action="serverUrl"
            accept=".jpg,.gif,.png,.jpeg"
            :file-list="fileList"
            :on-success="handleSuccess"
            :on-preview="handlePreview"
            :data="uploadObjs"
            :on-change="handleIntroduceUploadHide"
            :on-remove="handleRemove"
            list-type="picture-card"
            :limit="limitCount"
            :class="{ hideUploadBox: hideUpload_introduce }"
          >
            <div class="uploadDiv">
              <i slot="default" class="el-icon-plus" />
            </div>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-form>
    <template slot="footer">
      <myButton :type="'cancel'" @click.native="cancel">取 消</myButton>
      <myButton
        :type="'confirm'"
        icon="el-icon-loading"
        :loading="loading"
        @click.native="submitForm('dialogForm')"
      >
        确 定
      </myButton>
    </template>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" height="80%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleIcon" append-to-body>
      <img width="100%" height="80%" :src="dialogImageUrlIcon" alt="">
    </el-dialog>
    <iconList :show="iconShow" @close="iconColse" />
  </myDialog>
</template>

<script>
import { detail, edit, add } from '@/api/system/applicationManagement'
import { Message } from 'element-ui'
import iconList from '../menu/icon.vue'
export default {
  components: { iconList },

  props: {
    title: {
      type: String,
      required: true,
      default() {
        return '编辑角色'
      }
    },
    id: {
      required: false,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      serverUrl: process.env.VUE_APP_BASE_API + '/admin/fileUpload', // 这里写你要上传的图片服务器地址
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      uploadObjs: {
        'fileType': 1,
        'type': 'sys_app_img'
      },
      time: [],
      jumpTypeList: [],
      jumpModeList: [],
      isUseTimeList: [],
      isDisableList: [],
      dialogForm: {
        appName: null, // 应用名称
        appUrl: null, // 应用地址
        appIcon: null, // 应用图标
        appImg: null, // 应用图片
        sort: 0, // 排序
        jumpType: null, // 跳转类型
        jumpMode: null, // 跳转方式
        isUseTime: null, // 是否控制使用时间
        isDisable: null, // 是否禁止使用
        startUseTime: null, // 开始使用时间
        endUseTime: null // 结束使用时间
      },
      hideUpload_introduce: false,
      hideUpload_introduce_Icon: false,
      limitCount: 1,
      limitCountIcon: 1,

      fileList: [],
      fileListIcon: [],
      dialogImageUrl: null,
      dialogImageUrlIcon: null,
      dialogVisible: false,
      dialogVisibleIcon: false,
      iconShow: false, // 图标显示
      formRules: {
        appName: [
          { required: true, message: '请输入应用名称！', trigger: 'blur' },
          {
            max: 20,
            message: '应用名称长度不能大于20',
            trigger: ['blur', 'change']
          }
        ],
        appUrl: [
          { required: true, message: '请输入跳转链接！', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    time: {
      handler(newData, oldData) {
        if (newData == null || !newData.length) {
          this.dialogForm.startUseTime = null
          this.dialogForm.endUseTime = null
        } else {
          this.dialogForm.startUseTime = newData[0]
          this.dialogForm.endUseTime = newData[1]
        }
      },
      immediate: true
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 根据id加载数据
    loadData() {
      const that = this
      that.loading = true
      detail({ id: that.id })
        .then((res) => {
          console.log(res)
          that.loading = false
          that.jumpTypeList = res.jumpTypeList
          that.jumpModeList = res.jumpModeList
          that.isDisableList = res.isDisableList
          that.isUseTimeList = res.isUseTimeList
          if (that.id) {
            that.dialogForm = res.cloudApp
            that.time = [
              res.cloudApp.startUseTime,
              res.cloudApp.endUseTime
            ]
            if (res.cloudApp.appImg) {
              that.fileList = [
                { url: process.env.VUE_APP_BASE_API + res.cloudApp.appImg }
              ]
              that.hideUpload_introduce = true
            }
            if (res.cloudApp.appIcon) {
              that.fileListIcon = [
                { url: process.env.VUE_APP_BASE_API + res.cloudApp.appIcon }
              ]
              that.hideUpload_introduce_Icon = true
            }
          }
        })
        .catch(() => {
          that.loading = false
        })
    },
    /**
     * 数据提交
     */
    submitForm(formName) {
      const that = this
      console.log(that.dialogForm)
      if (that.loading) {
        return
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true
          if (that.id) {
            edit(that.dialogForm)
              .then((res) => {
                that.loading = false
                Message({
                  type: 'success',
                  message: '操作成功'
                })
                this.$emit('close', { reload: true })
              })
              .catch(() => {
                that.loading = false
              })
          } else {
            add(that.dialogForm)
              .then((res) => {
                that.loading = false
                Message({
                  type: 'success',
                  message: '操作成功'
                })
                this.$emit('close', { reload: true })
              })
              .catch(() => {
                that.loading = false
              })
          }
        } else {
          return false
        }
      })
    },
    cancel(done) {
      this.$emit('close', {})
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handlePreviewIcon(file) {
      this.dialogImageUrlIcon = file.url
      this.dialogVisibleIcon = true
    },
    // 主封面图片上传成功
    handleSuccess(file, fileList) {
      console.log(fileList)
      this.dialogForm.appImg = fileList.response.data.fileUrl
    },
    handleIntroduceUploadHide(file, fileList) {
      this.hideUpload_introduce = fileList.length >= this.limitCount
    },
    // 移除主封面图片
    handleRemove(file, fileList) {
      this.dialogForm.appImg = null
      this.hideUpload_introduce = fileList.length >= this.limitCount
    },
    // 图标上传成功
    handleSuccessIcon(file, fileList) {
      console.log(fileList)
      this.dialogForm.appIcon = fileList.response.data.fileUrl
    },
    // 移除图标
    handleRemoveIcon(file, fileList) {
      this.dialogForm.appIcon = null
      this.hideUpload_introduce_Icon = fileList.length >= this.limitCountIcon
    },
    handleIntroduceUploadHideIcon(file, fileList) {
      this.hideUpload_introduce_Icon = fileList.length >= this.limitCountIcon
    },
    beforeUpload() {
      this.isDisabled = true
    },
    iconColse(data) {
      this.iconShow = false
      console.log(data)
      this.dialogForm.appIcon = data.name
    }
  }
}
</script>

<style lang="less" scoped>
.input-default textarea {
  height: 44vh;
}
.uploadPhoto {
  .el-input {
    width: 92%;
    float: left;
  }
  .el-upload--picture-card {
    height: 0;
    line-height: 0;
    border: none;
  }
  .el-upload {
    width: 8%;
    position: absolute;
    top: 0;
    right: 0;
    .el-button {
      width: 100%;
    }
  }
  .el-upload-list__item {
    margin-top: 10px !important;
  }
}
/deep/.el-upload__input {
  display: none !important;
}
/deep/.el-date-editor--daterange {
  width: 260px;
  .el-range-separator {
    padding: 0 !important;
  }
}

/deep/.hideUploadBox > .el-upload--picture-card {
  display: none;
}
/deep/.hideUploadBoxIcon > .el-upload--picture-card {
  display: none;
}
.uploadDiv {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #8c939d;
}
</style>
