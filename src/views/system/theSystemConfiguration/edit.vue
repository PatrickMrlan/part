<template>
  <myDialog
    :title="title"
    width="1000px"
    :loading="loading"
    :visible="true"
    class="dialog-form"
    :cancel="cancel"
    top="20vh"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="110px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="配置编码：" prop="configureKey">
            <el-input
              v-model.trim="dialogForm.configureKey"
              type="text"
              class="input-default"
              placeholder="配置编码"
              clearable
            />
          </el-form-item>
          <el-form-item label="配置值类型：" prop="valueType">
            <el-select
              v-model="dialogForm.valueType"
              placeholder="请选择"
              class="input-default"
              filterable
              clearabl
            >
              <el-option
                v-for="(item, index) in valueTypeList"
                :key="index"
                :label="item.key"
                :value="item.key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="排序：" prop="sort">
            <el-input-number v-model="dialogForm.sort" :min="0" :max="999" />
          </el-form-item>

          <el-form-item
            v-if="dialogForm.configType == '图片'"
            label="资源图片："
            prop="resourceIcon"
          >
            <el-input
              v-show="false"
              v-model.trim="dialogForm.resourceIcon"
              readonly
              clearable
              placeholder="请上传封面图片，建议400*400像素的图片"
            />
            <el-upload
              :action="serverUrl"
              accept=".jpg,.gif,.png,.jpeg"
              :file-list="fileListImg"
              :on-success="handleSuccessImg"
              :data="uploadObjs"
              :on-preview="handlePreviewImg"
              :on-change="handleIntroduceUploadHideImg"
              :on-remove="handleRemoveImg"
              list-type="picture-card"
              :limit="limitCount"
              :class="{ hideUploadBox: hideUpload_introduce }"
            >
              <div
                style="
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  color: #8c939d;
                "
              >
                <i slot="default" class="el-icon-plus" />
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配置值：" prop="configureValue">
            <el-switch
              v-if="dialogForm.configType == '是否'"
              v-model="dialogForm.configureValue"
              active-value="是"
              inactive-value="否"
              active-text="启用"
              inactive-text="禁用"
            />
            <el-input
              v-else
              v-model.trim="dialogForm.configureValue"
              type="text"
              class="input-default"
              :readonly="dialogForm.configType == '图片' ? true : false"
              placeholder="配置值"
            />
          </el-form-item>

          <el-form-item label="配置类型：" prop="configType">
            <el-select
              v-model="dialogForm.configType"
              placeholder="请选择"
              class="input-default"
              clearable
              filterable
            >
              <el-option
                v-for="(item, index) in configTypeList"
                :key="index"
                :label="item.val"
                :value="item.val"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否系统：" prop="isSystem">
            <el-select
              v-model="dialogForm.isSystem"
              placeholder="请选择"
              class="input-default"
              filterable
              clearabl
            >
              <el-option
                v-for="(item, index) in isSystemList"
                :key="index"
                :label="item.key"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="配置详情：" prop="configureDetail">
            <el-input
              v-model.trim="dialogForm.configureDetail"
              type="textarea"
:rows="6"
              maxlength="255"
              show-word-limit
              placeholder="配置详情"
              :autosize="{ minRows: 8, maxRows: 12 }"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template slot="footer">
      <myButton :type="'cancel'" @click.native="cancel">取 消</myButton>
      <myButton
        :type="'confirm'"
        icon="el-icon-loading"
        :loading="loading"
        @click.native="submitForm('dialogForm')"
      >
        提 交
      </myButton>
    </template>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" height="80%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </myDialog>
</template>

<script>
import { detail, edit, add } from '@/api/system/theSystemConfiguration'
import { Message } from 'element-ui'
export default {
  components: {},

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
    },
    configureTypeId: {
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
      time: [],
      isSystemList: [],
      configTypeList: [], // 配置类型数组
      valueTypeList: [], // 配置值类型数组
      uploadObjs: {
        'fileType': 1,
        'type': 'configureImg'
      },
      dialogForm: {
        id: null,
        configureDetail: null, // 配置详情
        configureKey: null, // 配置编码
        configureTypeId: null, // 配置类型标识
        configureValue: null, // 配置值
        isSystem: null, // 是否系统
        valueType: null,
        sort: null // 排序
      },
      limitCount: 1,
      // 上传的图片
      fileListImg: [],
      dialogImageUrl: null,
      dialogVisible: false,
      hideUpload_introduce: false,
      formRules: {
        configureKey: [
          { required: true, message: '请输入配置编码！', trigger: 'blur' }
        ],
        configureValue: [
          { required: true, message: '请输入配置值！', trigger: 'blur' }
        ]
      }
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
          that.loading = false
          that.isSystemList = res.yesOrNoList
          that.configTypeList = res.configTypeList
          that.valueTypeList = res.valueTypeList
          that.dialogForm = res.entity
          if (that.id) {
            that.fileListImg = [{ url: res.entity.configureValue }]
            that.hideUpload_introduce = true
          }
        })
        .catch(() => {
          that.loading = false
        })
    },
    handlePreviewImg(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 主封面图片上传成功
    handleSuccessImg(file, fileList) {
      console.log(fileList)
      this.dialogForm.configureValue = fileList.response.data.fileUrl
    },
    // 移除主封面图片
    handleRemoveImg(file, fileList) {
      this.dialogForm.configureValue = null
      this.hideUpload_introduce = fileList.length >= this.limitCount
    },
    handleIntroduceUploadHideImg(file, fileList) {
      this.hideUpload_introduce = fileList.length >= this.limitCount
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
          that.dialogForm.configureTypeId = that.configureTypeId
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

    changeTime(val) {
      if (val.length) {
        this.dialogForm.startUseTime = val[0]
        this.dialogForm.endUseTime = val[1]
      } else {
        this.dialogForm.startUseTime = null
        this.dialogForm.endUseTime = null
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-upload__input {
  display: none !important;
}
/deep/.hideUploadBox > .el-upload--picture-card {
  display: none;
}
</style>
