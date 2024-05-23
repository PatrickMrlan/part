<template>
  <myDialog
    :title="title"
    :cancel="cancel"
    :loading="loading"
    :visible="true"
    width="50%"
  >
    <el-form
      ref="dialogForm"
      style="min-height: 100%"
      :model="confirmInfo"
      :rules="formRules"
      label-width="65px"
    >
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col>
          <el-descriptions border :column="2" title="整改信息">
            <el-descriptions-item label="隐患类型">
              {{ dialogForm.hazardType }}
            </el-descriptions-item>
            <el-descriptions-item label="整改状态">
              {{ dialogForm.rectState }}
            </el-descriptions-item>
            <el-descriptions-item
              label="整改期限"
              v-if="dialogForm.rectType == '限期整改'"
            >
              {{ dialogForm.rectDate }}
            </el-descriptions-item>
            <el-descriptions-item label="整改类型" :span="2">
              {{ dialogForm.rectType }}
            </el-descriptions-item>
            <el-descriptions-item label="主要事故隐患或问题" :span="2">
              {{ dialogForm.mainRisk }}
            </el-descriptions-item>
            <el-descriptions-item label="整改措施或建议" :span="2">
              {{ dialogForm.measure }}
            </el-descriptions-item>
            <el-descriptions-item label="不合规的名称、条款和内容" :span="2">
              {{ dialogForm.accordance }}
            </el-descriptions-item>
            <el-descriptions-item
              label="隐患图片"
              :span="2"
              v-if="dialogForm.fileList && dialogForm.fileList.length"
            >
              <div>
                <el-image
                  v-for="(item, index) in dialogForm.fileList"
                  :key="index"
                  style="width: 50px; height: 50px; margin-right: 10px"
                  :src="baseURL + item.fileUrl"
                  :preview-src-list="srcList"
                  fit="contain"
                >
                </el-image>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="整改说明" :span="2">
              {{ dialogForm.rectContent }}
            </el-descriptions-item>
            <el-descriptions-item
              label="整改后图片"
              :span="2"
              v-if="dialogForm.rectList && dialogForm.rectList.length"
            >
              <div>
                <el-image
                  v-for="(item, index) in dialogForm.rectList"
                  :key="index"
                  style="width: 50px; height: 50px; margin-right: 10px"
                  :src="baseURL + item.fileUrl"
                  :preview-src-list="rectSrcList"
                  fit="contain"
                >
                </el-image>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col>
          <el-form-item label="意见：" prop="desc">
            <el-input
              type="textarea"
              v-model="confirmInfo.desc"
              placeholder="请输入意见"
              clearable
              maxlength="500"
              show-word-limit
              :autosize="{ minRows: 4 }"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
      <myButton
        icon="el-icon-loading"
        type="remove"
        :loading="loading"
        @click.native="submitForm(0)"
        >不通过</myButton
      >
      <myButton
        icon="el-icon-loading"
        :loading="loading"
        @click.native="submitForm(1)"
        >通过</myButton
      >
    </template>
  </myDialog>
</template>
  
  <script>
import { leaderConfirm, resultDetail } from "@/api/security/danger";

export default {
  props: {
    title: {
      required: false,
      default() {
        return "";
      },
    },
    id: {
      required: true,
      default() {
        return null;
      },
    },
  },

  data() {
    return {
      loading: false,
      baseURL: process.env.VUE_APP_BASE_API,
      srcList: [],
      rectSrcList: [],
      dialogForm: {},
      confirmInfo: {
        id: null,
        value: null,
        desc: null,
      },

      formRules: {
        rectContent: [
          {
            required: true,
            message: "请输入整改说明！",
            trigger: ["blur", "change"],
          },
        ],
        rectList: [
          {
            required: true,
            message: "请输入整改图片！",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  created() {
    this.loadData();
    this.confirmInfo.id = this.id;
  },
  methods: {
    loadData() {
      const that = this;
      that.loading = true;
      resultDetail({ resultId: this.id })
        .then((res) => {
          this.dialogForm = res;
          this.srcList = [];
          this.rectSrcList = [];

          if (this.dialogForm.fileList && this.dialogForm.fileList.length) {
            this.dialogForm.fileList.forEach((item) => {
              this.srcList.push(this.baseURL + item.fileUrl);
            });
          }
          if (this.dialogForm.rectList && this.dialogForm.rectList.length) {
            this.dialogForm.rectList.forEach((item) => {
              this.rectSrcList.push(this.baseURL + item.fileUrl);
            });
          }
        })
        .finally(() => {
          that.loading = false;
        });
    },

    /**
     * 提交整改
     */
    submitForm(type) {
      const that = this;
      if (that.loading) {
        return;
      }

      that.loading = true;
      that.confirmInfo.value = type;
      leaderConfirm(that.confirmInfo)
        .then((res) => {
          that.loading = false;
          that.$message({
            type: "success",
            message: "操作成功",
          });
          this.$emit("close", { reload: true });
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
</style>