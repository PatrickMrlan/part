<template>
  <myDrawer :title="title" :visible="visible" :cancel="cancel" size="800px">
    <el-descriptions class="margin-top" title="目标计划详情" :column="3" border >
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-document"></i>
          标题
        </template>
        {{ dialogForm.planName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-collection-tag"></i>
          年份
        </template>
        {{ dialogForm.planYear }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-date"></i>
          添加时间
        </template>
        {{ dialogForm.addTime }}
      </el-descriptions-item>
      <el-descriptions-item contentClassName="contbox">
        <template slot="label">
          <i class="el-icon-notebook-1"></i>
          内容
        </template>
        {{ dialogForm.planContent }}
      </el-descriptions-item>
    </el-descriptions>
  </myDrawer>
</template>

<script>
import {
  detail,
} from '@/api/security/targetplan'
export default {
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return ''
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
    }
  },
  async created() {
    if (this.id) {
      await this.loadData()
    }
  },
  methods: {
    cancel(done) {
      this.$emit('close', {})
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
.contbox{
  width: 20px;
}
</style>
