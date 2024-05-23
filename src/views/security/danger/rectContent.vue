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
      :model="dialogForm"
      :rules="formRules"
      label-width="100px"
    >
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col>
          <el-descriptions border :column="2" title="隐患信息">
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

            <el-descriptions-item
              label="整改说明"
              :span="2"
              v-if="dialogForm.rectContent && check"
            >
              {{ dialogForm.rectContent }}
            </el-descriptions-item>
            <el-descriptions-item
              label="整改图片"
              :span="2"
              v-if="dialogForm.rectList && dialogForm.rectList.length && check"
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
            <el-descriptions-item
              label="整改未通过意见"
              :span="2"
              v-if="
                dialogForm.leaderOpinion && dialogForm.rectState != '已整改'
              "
            >
              {{ dialogForm.leaderOpinion }}
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="!check">
        <el-col>
          <el-form-item label="整改说明：" prop="rectContent">
            <el-input
              type="textarea"
              v-model="dialogForm.rectContent"
              placeholder="请输入整改说明"
              clearable
              maxlength="500"
              show-word-limit
              :autosize="{ minRows: 4 }"
            />
          </el-form-item>
          <el-form-item label="整改图片：" prop="rectList">
            <el-tooltip
              class="item tips"
              effect="dark"
              content="只能上传图片"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
            <myUpload
              action="#"
              class="upload-demo"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
              multiple
              :file-list="dialogForm.rectList"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :http-request="handleUpload"
              :before-upload="beforeUpload"
              :before-remove="beforeRemove"
              list-type="picture-card"
            >
              <div class="uploadImg">
                <i slot="default" class="el-icon-plus" />
              </div>
            </myUpload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
      <myButton
        icon="el-icon-loading"
        v-if="!check"
        :loading="loading"
        @click.native="submitForm('dialogForm')"
        >提交整改</myButton
      >
    </template>
  </myDialog>
</template>

<script>
import { submitRect, resultDetail } from "@/api/security/danger";
import { fileUpload } from "@/api/upload";

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
    check: {
      required: false,
      default() {
        return false;
      },
    },
  },

  data() {
    return {
      loading: false,
      baseURL: process.env.VUE_APP_BASE_API,
      srcList: [],
      rectSrcList: [],
      dialogForm: {
        rectContent: null,
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

              item.url = that.baseURL + item.fileUrl;
              item.link = that.baseURL + item.fileUrl;
            });
          }
        })
        .finally(() => {
          that.loading = false;
        });
    },

    beforeUpload(file) {
      let name = file.name.split(".").pop().toUpperCase();
      if (
        name !== "JPG" &&
        name !== "JPEG" &&
        name !== "PNG" &&
        name !== "GIF" &&
        name !== "BMP" &&
        name !== "WEBP"
      ) {
        this.$message({
          type: "error",
          message: "不支持上传当前文件！",
        });
        return false;
      }
    },
    handlePreview(file) {
      if (file && file.fileId) {
        window.open(this.baseURL + file.fileUrl);
      }
    },
    // 自定义上传
    handleUpload(file, fileList) {
      const that = this;
      that.loading = true;
      const formData = new FormData();
      formData.append("fileType", 4);
      formData.append("file", file.file);
      formData.append("type", "hazard_result_rect");
      fileUpload(formData)
        .then((res) => {
          // var index = res.fileName.lastIndexOf(".");

          res.url = that.baseURL + res.fileUrl;
          res.link = that.baseURL + res.fileUrl;
          // res.fileName = res.fileName.substring(0, index);
          res.fileId = res.fileId;

          that.dialogForm.rectList.push(res);
          that.$message({
            type: "success",
            message: "上传成功！",
          });
        })
        .finally(() => {
          that.loading = false;
        });
    },
    beforeRemove(file, fileList) {
      if (file.fileName) {
        return this.$confirm(`确定移除 ${file.fileName}？`);
      } else {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },

    // 移除模板
    handleRemove(file, fileList) {
      this.dialogForm.rectList.forEach((item, index) => {
        if (file.fileId == item.fileId) {
          this.dialogForm.rectList.splice(index, 1);
        }
      });
    },

    /**
     * 提交整改
     */
    submitForm(formName) {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;

          submitRect(that.dialogForm)
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
        } else {
          return false;
        }
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