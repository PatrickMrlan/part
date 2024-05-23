<template>
  <div>
    <myDialog
      :title="title"
      width="480px"
      :loading.sync="loading"
      :cancel.sync="cancel"
      :visible="true"
    >
      <el-form
        ref="dialogForm"
        :model="dialogForm"
        :rules="formRules"
        label-width="110px"
      >
        <el-form-item label="字典项名称：" prop="dictName">
          <el-input
            v-model="dialogForm.dictName"
            type="text"
            class="input-default"
            placeholder="字典项名称"
          />
        </el-form-item>
        <el-form-item label="字典项值：" prop="dictCode">
          <el-input
            v-model="dialogForm.dictCode"
            type="text"
            class="input-default"
            placeholder="字典项值"
            maxlength="200"
          />
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input-number v-model="dialogForm.sort" :min="1" :max="999" />
        </el-form-item>
        <el-form-item label="描述：" prop="descriptionInfo">
          <el-input
            v-model="dialogForm.descriptionInfo"
            type="textarea"
:rows="6"
            max="50"
            class="input-default"
            placeholder="描述"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <myButton :type="'cancel'" @click.native="cancel">取 消</myButton>
        <myButton :loading="loading" @click.native="submit('dialogForm')">
          提 交
        </myButton>
      </template>
    </myDialog>
  </div>
</template>

<script>
import {
  addDictionaryItem,
  editDictionaryItem,
  dictionaryItemDetail
} from '@/api/system/dictionary'
import { Message } from 'element-ui'
export default {
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return '提示'
      }
    },
    id: {
      required: false,
      default() {
        return null
      }
    },
    dictId: {
      required: false,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      loading: false,
      dictTypeList: [],
      dialogForm: {
        dictId: null,
        id: null,
        descriptionInfo: null,
        dictName: null,
        dictCode: null,
        sort: 0
      },
      formRules: {
        dictName: [
          { required: true, message: '请输入字典名称！', trigger: 'blur' }

        ],
        dictCode: [
          { required: true, message: '请输入字典编码！', trigger: 'blur' }

        ]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loading = true
      dictionaryItemDetail({ id: this.id })
        .then((res) => {
          this.loading = false
          this.dialogForm = res.entity
          console.log(res)
        })
        .catch(() => {
          this.loading = false
        })
    },
    cancel() {
      this.$emit('close', {})
    },
    submit() {
      const that = this
      if (that.loading) {
        return
      }
      that.dialogForm.dictId = that.dictId
      that.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          that.loading = true
          if (that.id) {
            editDictionaryItem(that.dialogForm)
              .then((res) => {
                that.loading = false
                Message({
                  type: 'success',
                  message: '操作成功'
                })
                that.$emit('close', { reload: true })
              })
              .catch(() => {
                that.loading = false
              })
          } else {
            addDictionaryItem(that.dialogForm)
              .then((res) => {
                that.loading = false
                Message({
                  type: 'success',
                  message: '操作成功'
                })
                that.$emit('close', { reload: true })
              })
              .catch(() => {
                that.loading = false
              })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>
</style>
