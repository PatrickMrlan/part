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
        label-width="100px"
      >
        <el-form-item label="字典名称：" prop="dictName">
          <el-input
            v-model="dialogForm.dictName"
            type="text"
            class="input-default"
            placeholder="字典名称"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="字典编码：" prop="dictCode">
          <el-input
            v-model="dialogForm.dictCode"
            type="text"
            class="input-default"
            placeholder="字典编码"
            maxlength="200"
          />
        </el-form-item>
        <el-form-item label="字典类型：" prop="dictType">
          <el-select
            v-model="dialogForm.dictType"
            placeholder="请选择字典类型"
            filterable
            class="input-default"
          >
            <el-option
              v-for="(item, index) in dictTypeList"
              :key="index"
              :label="item.key"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input-number v-model="dialogForm.sort" :min="1" :max="999" />
        </el-form-item>
        <el-form-item label="备注：" prop="description">
          <el-input
            v-model="dialogForm.description"
            type="textarea"
:rows="6"
            max="50"
            class="input-default"
            placeholder="备注"
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
  addDictionary,
  editDictionary,
  dictionaryDetail,
  dictionaryList

} from '../../../api/system/dictionary'
import treeselect from '@riophae/vue-treeselect'

import { Message } from 'element-ui'
export default {
  components: { treeselect },

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
        return ''
      }
    },
    pid: {
      required: false,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      dicList: [],
      loading: false,
      dictTypeList: [],
      dialogForm: {
        dictName: null,
        id: null,
        description: null,
        dictCode: null,
        dictType: null
      },
      formRules: {
        dictName: [
          { required: true, message: '请输入字典名称！', trigger: 'blur' },
          {
            max: 20,
            message: '字典名称长度不能大于20',
            trigger: ['blur', 'change']
          }
        ],
        dictCode: [
          { required: true, message: '请输入字典编码！', trigger: 'blur' },
          {
            max: 200,
            message: '字典编码长度不能大于200',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created() {
    this.getDictionaryList()
    this.loadData()
    if (this.pid) {
      this.dialogForm.pid = this.pid
    }
  },
  methods: {
    getDictionaryList() {
      dictionaryList().then((res) => {
        console.log(res)
        this.dicList = res
        this.dicList.forEach(
          (item) => (item.title = `${item.name}`)
        )
        this.timeStamp = new Date().getTime()
      })
    },
    /**
     * 树状下拉框重构数据
     */
    treeSelectNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    loadData() {
      this.loading = true
      dictionaryDetail({ id: this.id })
        .then((res) => {
          this.loading = false
          this.dictTypeList = res.dictTypeList
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
      that.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          that.loading = true
          if (that.id) {
            editDictionary(that.dialogForm)
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
            if (this.pid) {
              this.dialogForm.parentId = this.pid
            }
            addDictionary(that.dialogForm)
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
