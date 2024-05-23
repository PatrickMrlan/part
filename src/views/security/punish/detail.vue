<template>
  <myDrawer :title="title" :visible="visible" :cancel="cancel" size="800px">
    <el-descriptions :column="2" border :labelStyle="{ width: '100px' }">
      <el-descriptions-item label="处罚文号">{{
        detailInfo.punishCode
      }}</el-descriptions-item>
      <el-descriptions-item label="处罚类型">{{
        detailInfo.punishType
      }}</el-descriptions-item>
       <el-descriptions-item label="处罚时间">{{
        detailInfo.punishDate
      }}</el-descriptions-item>
      <el-descriptions-item label="发文机构">{{
        detailInfo.orgName
      }}</el-descriptions-item>
      <el-descriptions-item label="关联企业">{{
        detailInfo.enName
      }}</el-descriptions-item>
      <el-descriptions-item label="处罚原因" :span="2">{{
        detailInfo.punishReason
      }}</el-descriptions-item>

      <el-descriptions-item label="评分文件" :span="2" contentClassName="file">
        <div
          class="file"
          v-for="(item, index) in detailInfo.fileList"
          :key="index"
          @click="clickFile(item)"
        >
          {{ item.fileName }}
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
    </template>
  </myDrawer>
</template>

<script>
import {
  detail,
} from '@/api/security/punish'
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
      detailInfo: {},
    }
  },
  async created() {
    if (this.id) {
      await this.loadData()
    }
  },
  methods: {
    clickFile(data) {
      if (data && data.fileId) {
        window.open(
          this.baseURL +data.fileUrl
        );
      }
    },
    cancel(done) {
      this.$emit('close', {})
    },

    loadData() {
      const that = this
      that.loading = true
      detail({ id: that.id })
        .then(res => {
          console.log(res)
          that.detailInfo = res
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
.file {
  cursor: pointer;
  color: #0061ff;
  font-size: 16px;
}
</style>
