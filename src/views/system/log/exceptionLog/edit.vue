<template>
  <myDialog
    :title="title"
    width="500px"
    class="dialog-form"
    :visible="true"
    :cancel="cancel"
    :loading="loading"
    :top="'10vh'"
  >
    <el-form ref="dialogForm" :model="dialogForm" label-width="110px">
      <el-row :gutter="20" style="padding-right: 50px">
        <el-form-item label="操作时间：">
          <span>
            {{ dialogForm.addTime }}
          </span>
        </el-form-item>

        <el-form-item label="IP地址：">
          <span>
            {{ dialogForm.ipAddress }}
          </span>
        </el-form-item>
        <el-form-item label="错误地址：">
          <span class="error">
            {{ dialogForm.errorUrl }}
          </span>
        </el-form-item>
        <el-form-item label="错误信息：">
          <span class="error">
            {{ dialogForm.errorMsg }}
          </span>
        </el-form-item>
      </el-row>
    </el-form>
    <template slot="footer" >
        <myButton :type="'cancel'" @click.native="cancel">取 消</myButton>
      </template>
  </myDialog>
</template>
  
<script>
import { Message } from "element-ui";
export default {
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return null;
      },
    },
    editData: {
      required: true,
      default() {
        return null;
      },
    },
  },
  mounted() {
    this.dialogForm = this.editData;
    this.getData();
  },
  data() {
    return {
      loading: false,
      dialogForm: {},
      tableData: [],
    };
  },

  methods: {
    getData() {
      let arr = [];
      arr.push(this.dialogForm);
    },

    cancel(done) {
      this.$emit("close", {});
    },
  },
};
</script>
  
<style lang="less" scoped>
.error {
  color: red;
}

/deep/ th {
  color: #000;
}
</style>
  