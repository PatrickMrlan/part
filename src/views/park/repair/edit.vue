<template>
  <myDrawer
    :title="title"
    size="600px"
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
      label-width="140px"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="检修单位：" prop="unitName">
            <el-input
              v-model="dialogForm.unitName"
              type="text"
              class="input-default"
              placeholder="检修单位"
              maxlength="200"
              clearable
            />
          </el-form-item>

          <el-form-item label="检修人：" prop="repairName">
            <el-input
              v-model="dialogForm.repairName"
              type="text"
              class="input-default"
              placeholder="检修人"
              maxlength="200"
              clearable
            />
          </el-form-item>

          <el-form-item label="检修时间：" prop="time">
            <el-date-picker
              v-model="dialogForm.time"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="保养性质：" prop="nature">
            <el-select
              v-model="dialogForm.nature"
              placeholder="保养性质"
              clearable
              filterable
            >
              <el-option
                v-for="item in natureList"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="维修资料：">
            <el-tooltip
              class="item tips"
              effect="dark"
              content="建议上传4：3的图片"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
            <myUpload
              class="upload-demo"
              ref="uploadDemo"
              action="#"
              accept=".jpg,.gif,.png,.jpeg,.bmp"
              :on-preview="handlePreview"
              :http-request="
                (file, fileList) => handleUpload('repairImg', file, fileList)
              "
              :before-upload="beforeUpload"
              :on-remove="
                (file, fileList) => handleRemove('repairImg', file, fileList)
              "
              :on-change="
                (file, fileList) =>
                  handleIntroduceUploadHide('repairImg', file, fileList)
              "
              :before-remove="beforeRemove"
              multiple
              :file-list="repairImgList"
              list-type="picture-card"
            >
              <div class="uploadImg">
                <i slot="default" class="el-icon-plus"></i>
              </div>
            </myUpload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template slot="footer">
      <myButton :type="'cancel'" @click.native="cancel">取 消</myButton>
      <myButton
        :type="'confirm'"
        icon="el-icon-loading"
        :loading="loading"
        @click.native="submit('dialogForm')"
      >
        提 交
      </myButton>
    </template>
  </myDrawer>
</template>

<script>
import { detail, edit, add } from "@/api/park/repair";
import { fileUpload } from "@/api/upload";

export default {
  components: {},
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "编辑用户";
      },
    },
    id: {
      required: false,
      default() {
        return null;
      },
    },
    entId: {
      type: Number,
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      loading: false,
      natureList: [],
      baseURL: process.env.VUE_APP_BASE_API,
      dialogForm: {
        unitName: null,
        repairName: null,
        time: null,
        nature: null,
        checkState: null,
        checkUser: null,
        checkTime: null,
      },
      repairImgList: [],
      formRules: {},
    };
  },
  async created() {
    await this.loadData();
  },
  methods: {
    beforeRemove(file, fileList) {
      if (file.fileName) {
        return this.$confirm(`确定移除 ${file.fileName}？`);
      } else {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },

    handleRemove(type, file, fileList) {
      // 农资图片
      if (type == "repairImg") {
        this.dialogForm.imgList.forEach((item, i) => {
          if (file.fileId == item.fileId) {
            this.dialogForm.imgList.splice(i, 1);
          }
        });
        this.repairImgList.forEach((item, i) => {
          if (file.fileId == item.fileId) {
            this.repairImgList.splice(i, 1);
          }
        });
      }
    },

    handlePreview(file) {
      if (file.link != undefined) {
        window.open(file.link);
      } else {
        window.open(file.url);
      }
    },

    // 自定义上传图片
    handleUpload(type, file, fileList) {
      const that = this;
      const formData = new FormData();
      formData.append("fileType", 1);
      formData.append("file", file.file);
      formData.append("type", type);

      fileUpload(formData).then((res) => {
        res.sourceType = type;
        that.dialogForm.imgList.push(res);

        // 封面图片
        if (type == "repairImg") {
          that.repairImgList.push({
            link: that.baseURL + res.fileUrl,
            url: that.baseURL + res.fileUrl,
            fileName: res.fileName,
            fileId: res.fileId,
          });
        }

        that.$message({
          type: "success",
          message: "上传成功！",
        });
      });
    },

    beforeUpload(file) {
      let type = file.name.split(".").pop().toUpperCase();

      if (
        type !== "JPEG" &&
        type !== "JPG" &&
        type !== "PNG" &&
        type !== "GIF" &&
        type !== "BMP"
      ) {
        this.$message({
          type: "error",
          message: "只支持JPEG、JPG、PNG、GIF、BMP文件格式！",
        });
        return false;
      }
    },

    handleIntroduceUploadHide(type, file, fileList) {
      switch (type) {
        case "repairImg":
          break;
      }
    },

    cancel(done) {
      this.$emit("close", {});
    },

    // 根据id加载数据
    loadData() {
      const that = this;
      that.loading = true;
      detail({ id: that.id })
        .then((res) => {
          console.log(res);
          that.dialogForm = res.entity;
          this.natureList = res.natureList;

          if (that.dialogForm.imgList.length > 0) {
            that.dialogForm.imgList.forEach((item) => {
              if (item.sourceType == "repairImg") {
                that.repairImgList.push({
                  link: that.baseURL + item.fileUrl,
                  url: that.baseURL + item.fileUrl,
                  fileName: item.fileName,
                  fileId: item.fileId,
                });
              }
            });
          }

          that.loading = false;
        })
        .catch(() => {
          that.loading = false;
        });
    },

    /**
     * 数据提交
     */
    submit() {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs["dialogForm"].validate((valid) => {
        if (valid) {
          that.loading = true;
          if (that.id) {
            edit(that.dialogForm)
              .then((res) => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "操作成功",
                });
                that.$emit("close", { reload: true });
              })
              .catch(() => {
                that.loading = false;
              });
          } else {
            add(that.dialogForm)
              .then((res) => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "操作成功",
                });
                that.$emit("close", {
                  reload: true,
                  returnData: that.dialogForm.tenantType,
                });
              })
              .catch(() => {
                that.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-upload__input {
  display: none !important;
}
/deep/.hideUploadBox > .el-upload--picture-card {
  display: none;
}
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
/deep/.upload-demo > *:first-child {
  display: inline;
}
</style>
