<template>
  <myDialog
    :title="title"
    width="500px"
    :loading="loading"
    class="dialog-form menuManage"
    :top="'15vh'"
    :visible="true"
    :cancel="cancel"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="父级字典：" prop="depId">
        <treeselect
          v-model="dialogForm.parentId"
          :multiple="false"
          :close-on-select="true"
          :options="dicTree"
          :default-expand-level="2"
          :normalizer="treeSelectNormalizer"
          no-results-text="未找到相关结果"
          no-options-text="没有可选择的数据"
          placeholder="字典配置"
          class="input-default"
        />
      </el-form-item>

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
      <el-form-item label="相关Code：" prop="xgCode">
        <el-input
          v-model="dialogForm.xgCode"
          type="text"
          class="input-default"
          placeholder="相关Code"
          maxlength="200"
        />
      </el-form-item>

      <el-form-item label="排序：" prop="sort">
        <el-input-number v-model="dialogForm.sort" :min="1" :max="999" />
      </el-form-item>
      <el-form-item label="备注：" prop="description">
        <el-input
          v-model="dialogForm.description"
          type="textarea"
          :rows="6"
          max="200"
          class="input-default"
          placeholder="备注"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

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
  </myDialog>
</template>

<script>
import { list, add, edit, detail } from '@/api/system/dictionary'

import { Message } from 'element-ui'
import treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { treeselect },
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return '字典编辑'
      }
    },

    id: {
      type: String,
      required: false,
      default() {
        return null
      }
    },
    pid: {
      type: String,

      required: false,
      default() {
        return null
      }
    },

    pnode: {
      type: Object,
      required: false,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      loading: false,
      dicTree: [],
      dialogForm: {
        sort: 1
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
  computed: {

  },
  created() {
    this.dialogForm.parentId = this.pid
    this.dialogForm.id = this.id
    this.getTreeList()
    if (this.id) {
      this.loadData()
    }
  },
  methods: {
    /**
     * 树状下拉框重构数据
     */
    treeSelectNormalizer(node) {
      // console.log(node);
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    getTreeList() {
      const that = this
      list()
        .then((res) => {
          that.dicTree = res
        })
        .catch(() => {})
    },
    loadData() {
      const that = this
      detail({ id: this.id })
        .then((res) => {
          that.dialogForm = res.entity
        })
        .catch(() => {})
    },
    /**
     * 数据提交
     */
    submitForm(formName) {
      const that = this
      if (that.loading) {
        return
      }
      that.dialogForm.appId = that.appId
      // if (that.pnode) {
      //   that.dialogForm.parentId = that.pnode.id;
      // }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true
          if (this.id) {
            edit(that.dialogForm)
              .then((res) => {
                that.loading = false
                Message({
                  type: 'success',
                  message: '操作成功'
                })
                this.$emit('close', {
                  reload: true,
                  menuId: that.dialogForm.menuId
                })
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
                this.$emit('close', {
                  reload: true,
                  menuId: that.dialogForm.menuId
                })
              })
              .catch(() => {
                that.loading = false
              })
          }
        } else {
          return false
        }
      })
      console.log(that.dialogForm)
    },
    // 新建数据
    cancel(done) {
      this.$emit('close', {})
    }
  }
}
</script>

<style lang="less">
.menuManage {
  .vue-treeselect__menu {
    max-height: 200px !important;
  }
}
</style>
