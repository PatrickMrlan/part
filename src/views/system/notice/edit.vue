<template>
  <myDialog
    :title="title"
    width="1000px"
    class="dialog-form"
    :visible="true"
    :cancel="cancel"
    :loading="loading"
    :top="'20vh'"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="120px"
    >
      <el-row :gutter="20">
        <el-form-item label="公告标题：" prop="noticeTitle">
          <el-input
            v-model="dialogForm.noticeTitle"
            type="text"
            class="input-default"
            placeholder="公告标题"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item v-if="isPlatformOrPark" label="公告类型：" prop="allType">

          <el-switch
            v-model="dialogForm.allType"
            active-text="指定机构"

            inactive-text="全体公告"
            active-value="指定机构"
            :inactive-value="inactive_value"
          />
        </el-form-item>

        <el-form-item v-if="isPlatformOrPark && dialogForm.allType == '指定机构'" label="机构类型：" prop="noticeTypeValueList">

          <el-checkbox-group
            v-model="dialogForm.noticeTypeValueList"
            size="mini"
          >
            <el-checkbox
              v-for="(item, index) in noticeTypeList"
              :key="index"
              :label="item.value"
            >{{ item.key }}</el-checkbox>
          </el-checkbox-group>

        </el-form-item>

        <el-form-item v-if="isPlatformOrPark&& dialogForm.allType == '指定机构' && dialogForm.noticeTypeValueList.indexOf('1')!==-1" label="选择园区：" prop="parkIdList">

          <el-select
            v-model="dialogForm.parkIdList"
            multiple
            filterable
            class="input-default"
            placeholder="请选择"
          >
            <el-option
              v-for="item in parkList"
              :key="item.parkId"
              :label="item.parkName"
              :value="item.parkId"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="isPlatformOrPark&&dialogForm.allType == '指定机构' && dialogForm.noticeTypeValueList.indexOf('2')!==-1" label="选择企业：" prop="entNames">

          <el-input
            v-model="dialogForm.entNames"
            type="text"
            readonly
            class="input-default"
            placeholder="请选择企业"
            @focus="lookupEntShow = true"
          />
        </el-form-item>
        <el-form-item v-if="isPlatformOrPark&&dialogForm.allType == '指定机构' && dialogForm.noticeTypeValueList.indexOf('3')!==-1" label="选择第三方：" prop="thirdPartyIdList">

          <el-select
            v-model="dialogForm.thirdPartyIdList"
            multiple
            filterable
            class="input-default"
            placeholder="请选择"
          >
            <el-option
              v-for="item in thirdPartyList"
              :key="item.thirdPartyId"
              :label="item.thirdPartyName"
              :value="item.thirdPartyId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="公告内容：" prop="noticeContent">
          <el-input
            v-model="dialogForm.noticeContent"
            type="textarea"
            :autosize="{ minRows: 4 }"
            placeholder="公告内容"
            maxlength="2000"
          />
        </el-form-item>
        <el-form-item label="相关附件：">
          <myUpload
            action="#"
            class="upload-demo"
            :file-list="dialogForm.fileList"
            :on-preview="handlePreview"
            :http-request="
              (file, fileList) =>
                handleUpload(
                  dialogForm.fileList,
                  file,
                  fileList,
                  'notice_file'
                )
            "
            :before-upload="beforeUpload"
            :on-remove="
              (file, fileList) =>
                handleRemove(
                  dialogForm.fileList,
                  file,
                  fileList
                )
            "
            :before-remove="beforeRemove"
          >
            <myButton>点击上传</myButton>
          </myUpload>
        </el-form-item>
      </el-row>
    </el-form>
    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
      <myButton :loading="loading" @click.native="submit('dialogForm')">
        提 交
      </myButton>
    </template>
    <lookupEnt
      v-if="lookupEntShow"
      :multiple="true"
      :show="lookupEntShow"

      @close="lookupEntClose"
    />

  </myDialog>
</template>
<script>
import { fileUpload } from '@/api/upload'
import { enumList, add, edit, detail } from '@/api/system/notice'
import lookupEnt from './lookupEnt'
export default {
  components: { lookupEnt },
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return '编辑用户'
      }
    },
    visible: {
      type: Boolean,
      required: true,
      default() {
        return false
      }
    },
    id: {
      type: String,
      required: false,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      loading: false,
      dialogForm: {},
      noticeTypeList: [],
      parkList: [],
      inactive_value: null,
      thirdPartyList: [],
      loginUser: JSON.parse(sessionStorage.getItem('loginUser')),
      isPlatformOrPark: false,
      lookupEntShow: false,
      formRules: {
        noticeTitle: [
          { required: true, message: '请输入公告标题！', trigger: 'blur' }
        ],
        noticeContent: [
          { required: true, message: '请输入公告内容！', trigger: 'blur' }
        ],

        allType: [
          { required: true, message: '请选择公告类型！', trigger: 'change' }
        ],
        noticeTypeValueList: [
          { required: true, message: '请选择机构类型！', trigger: 'change' }
        ],
        parkIdList: [
          { required: true, message: '请选择园区！', trigger: 'change' }
        ],
        entNames: [
          { required: true, message: '请选择企业！', trigger: 'change' }
        ],
        thirdPartyIdList: [
          { required: true, message: '请选择第三方！', trigger: 'change' }
        ]

      },
      postForm: {
        longitude: null,
        latitude: null,
        detailedAddress: null
      },
      mapShow: false,
      files: [],
      hideUpload_introduce_before: false
    }
  },
  created() {
    this.isPlatformOrPark = this.loginUser.userType === '平台' || this.loginUser.userType === '园区'
    this.getenumList()
    this.loadData()
  },
  methods: {
    checkboxChange(val) {
    },
    getenumList() {
      enumList().then(res => {
        this.noticeTypeList = res.noticeTypeList
        this.parkList = res.parkList
        this.thirdPartyList = res.thirdPartyList
      })
    },
    loadData() {
      const that = this
      that.loading = true
      detail({ id: that.id })
        .then(res => {
          console.log(res)
          that.dialogForm = res
        })
        .finally(() => {
          that.loading = false
        })
    },

    cancel(done) {
      this.$emit('close', {})
    },
    submit() {
      const that = this
      if (that.loading) {
        return
      }
      that.$refs['dialogForm'].validate(valid => {
        console.log(valid)
        if (valid) {
          that.loading = true
          // 提交表单
          if (that.id) {
            edit(that.dialogForm)
              .then(res => {
                that.loading = false
                that.$message({
                  type: 'success',
                  message: '修改成功'
                })
                that.$emit('close', { reload: true })
              })
              .catch(() => {
                that.loading = false
              })
          } else {
            add(that.dialogForm)
              .then(res => {
                that.loading = false
                that.$message({
                  type: 'success',
                  message: '添加成功'
                })
                that.$emit('close', { reload: true })
              })
              .catch(() => {
                that.loading = false
              })
          }
        }
      })
    },
    beforeRemove(file, fileList) {
      if (file.fileName) {
        return this.$confirm(`确定移除 ${file.fileName}？`)
      } else {
        return this.$confirm(`确定移除 ${file.name}？`)
      }
    },
    lookupEntClose(data) {
      var that = this

      if (data.length > 0) {
        that.dialogForm.entNames = null
        that.dialogForm.entIdList = []
        var entNameList = data.map((item) => {
          return item.entName
        })
        that.dialogForm.entNames = entNameList.join()
        var entIdList = data.map((item) => {
          return item.entId
        })
        that.dialogForm.entIdList = entIdList
      }
      this.lookupEntShow = false
    },
    // 移除模板
    handleRemoveImg(file, fileList) {
      this.files = []
      this.dialogForm.businessLicense = ''
      this.hideUpload_introduce_before = false
    },
    beforeUpload(file) {
      const name = file.name
        .split('.')
        .pop()
        .toUpperCase()
      if (
        name !== 'PDF' &&
        name !== 'DOCX' &&
        name !== 'DOC' &&
        name !== 'XLS' &&
        name !== 'XLSX' &&
        name !== 'JPG' &&
        name !== 'JPEG' &&
        name !== 'PNG' &&
        name !== 'GIF' &&
        name !== 'BMP' &&
        name !== 'WEBP' &&
        name !== 'RAR' &&
        name !== 'ZIP' &&
        name !== 'TXT'
      ) {
        this.$message({
          type: 'error',
          message: '不支持上传当前文件！'
        })
        return false
      }
    },
    handlePreview(file) {
      if (file && file.fileUrl) {
        window.open(file.fileUrl)
      }
    },

    // 自定义上传
    handleUpload(dataList, file, fileList, type) {
      const that = this
      that.loading = true
      const formData = new FormData()
      formData.append('fileType', 4)
      formData.append('file', file.file)
      formData.append('type', type)
      fileUpload(formData)
        .then(res => {
          // var index = res.fileName.lastIndexOf(".");

          res.link = that.baseURL + res.fileUrl
          // res.fileName = res.fileName.substring(0, index);

          dataList.push(res)
          that.$message({
            type: 'success',
            message: '上传成功！'
          })
        })
        .finally(() => {
          that.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
/** 输入框、下拉框的宽度 **/
/deep/.el-cascader,
/deep/.el-select,
/deep/.el-input-number,
/deep/.el-date-editor,
/deep/.el-switch,
/deep/.el-input {
  width: 100% !important;
}

/** 问号提示 **/
/deep/.tips {
  font-size: 16px;
  cursor: pointer;
}
/deep/input[type="file"] {
  display: none;
}
/** 上传文件 **/
/deep/ .upload-demo > div:first-of-type {
  display: inline;
}

/deep/.hideUploadBox > .el-upload--picture-card {
  display: none !important;
}
</style>
