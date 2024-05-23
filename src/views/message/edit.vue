<template>
  <myDialog
    :title="title"
    width="500px"
    :loading="loading"
    top="15vh"
    :visible="true"
    :cancel="cancel"
  >
    <el-form ref="dialogForm" :model="dialogForm" label-width="6.875rem">
      <el-row :gutter="20">
        <el-col>
          <el-descriptions :column="1" border :labelStyle="{ width: '100px' }">
            <el-descriptions-item label="消息标题">
              {{ dialogForm.noticeTitle }}
            </el-descriptions-item>
            <el-descriptions-item label="消息内容">
              {{ dialogForm.noticeContent }}
            </el-descriptions-item>
            <el-descriptions-item label="消息类型">
              {{ dialogForm.noticeType }}
            </el-descriptions-item>
            <el-descriptions-item label="来源名称">
              {{ dialogForm.sourceName }}
            </el-descriptions-item>
            <el-descriptions-item label="来源类型">
              {{ dialogForm.sourceType }}
            </el-descriptions-item>
            <el-descriptions-item label="添加时间">
              {{ dialogForm.addTime }}
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </el-form>
    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">返 回</myButton>
    </template>
  </myDialog>
</template>

<script>
import { detail } from "@/api/message";

export default {
  props: {
    title: {
      required: true,
      default() {
        return "";
      },
    },
    id: {
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      loading: false,
      dialogForm: {},
    };
  },
  created() {
    this.detail();
  },
  methods: {
    detail() {
      const that = this;
      //把这条消息改为已查看
      that.loading = true;
      detail({ id: that.id })
        .then((res) => {
          that.loading = false;
          this.dialogForm = res;
        })
        .catch(() => {
          that.loading = false;
        });
    },
    // 取消
    cancel(done) {
      this.$emit("close", {});
    },
  },
};
</script>

<style lang="less" scoped>
</style>
