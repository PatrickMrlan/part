<template>
  <myDialog
    :title="title"
    :cancel="cancel"
    :loading="loading"
    :visible="true"
    width="85%"
    footerTip='如未发现隐患则无需点击"发现隐患"录入隐患信息'
  >
    <div style="height: calc(75vh - 40px)" ref="myDialog">
      <el-row :gutter="20">
        <el-col :span="hiddenIndex ? 16 : 24">
          <div class="measures boxShadow">
            <div ref="appRowHeight" class="app-list-control app-row">
              <div class="flex"></div>
              <div class="right">
                <!-- <myButton
                  v-if="!hiddenIndex"
                  icon="el-icon-plus"
                  @click.native="addHidden"
                  >新增隐患</myButton
                >-->
              </div>
            </div>
            <div class="table">
              <el-table
                :data="tableData"
                :key="tableKey"
                border
                :loading="loading"
                style="width: 100%"
                :height="height"
                highlight-current-row
                :header-cell-style="{
                  height: '30px !important',
                  fontSize: '14px',
                  color: '#333',
                }"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  align="center"
                  width="50"
                />
                <el-table-column prop="checkContent" label="检查内容" />
                <el-table-column label="有无隐患" width="120" align="center">
                  <template slot-scope="scope">
                    <span> {{ scope.row.isCheck ? "有" : "无" }} </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="riskAnalysis"
                  label="更多操作"
                  width="80"
                  align="center"
                >
                  <template slot-scope="scope">
                    <myHandle>
                      <span @click="findHidden(scope.row, scope.$index)">{{
                        scope.row.isCheck ? "修改隐患" : "发现隐患"
                      }}</span>
                    </myHandle>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
        <el-col :span="8" v-if="hiddenIndex">
          <div class="hidden boxShadow">
            <el-form
              ref="dialogForm"
              v-loading="loading"
              style="min-height: 100%; padding-top: 40px; position: relative"
              :model="dialogForm"
              :rules="formRules"
              label-width="100px"
            >
              <div>
                <el-form-item label="隐患类型：" prop="hazardType">
                  <el-select
                    v-model="dialogForm.hazardType"
                    filterable
                    placeholder="请选择隐患类型"
                  >
                    <el-option
                      v-for="(item, index) in enumList.hazardTypeList"
                      :key="index"
                      :label="item.key"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="整改类型：" prop="rectType">
                  <el-select
                    v-model="dialogForm.rectType"
                    filterable
                    placeholder="请选择整改类型"
                  >
                    <el-option
                      v-for="(item, index) in enumList.rectTypeList"
                      :key="index"
                      :label="item.key"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="整改期限："
                  prop="rectDate"
                  v-if="dialogForm.rectType == '限期整改'"
                >
                  <el-date-picker
                    v-model="dialogForm.rectDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  />
                </el-form-item>
                <el-form-item label="主要事故隐患或问题：" prop="mainRisk">
                  <el-input
                    type="textarea"
                    v-model="dialogForm.mainRisk"
                    placeholder="请输入主要事故隐患或问题"
                    maxlength="500"
                    show-word-limit
                    :autosize="{ minRows: 4 }"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整改措施或建议：">
                  <el-input
                    type="textarea"
                    v-model="dialogForm.measure"
                    placeholder="请输入整改措施或建议"
                    maxlength="500"
                    show-word-limit
                    :autosize="{ minRows: 4 }"
                    clearable
                  />
                </el-form-item>
                <el-form-item
                  label="不合规的名称、条款和内容："
                  prop="accordance"
                >
                  <el-input
                    type="textarea"
                    v-model="dialogForm.accordance"
                    placeholder="请输入不合规的名称、条款和内容"
                    maxlength="500"
                    show-word-limit
                    :autosize="{ minRows: 4 }"
                    clearable
                  />
                </el-form-item>

                <el-form-item label="隐患照片：" prop="fileList">
                  <myUpload
                    action="#"
                    class="upload-demo"
                    accept=".jpg,.jpeg,.png,.gif,.doc,.bmp,.webp"
                    multiple
                    :file-list="dialogForm.fileList"
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
              </div>
              <div class="addBtn">
                <myButton type="cancel" @click.native="hiddenIndex = null"
                  >取消</myButton
                >
                <myButton
                  icon="el-icon-check"
                  @click.native="submitAdd('dialogForm')"
                  >确认</myButton
                >
              </div>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
      <myButton
        icon="el-icon-loading"
        :loading="loading"
        @click.native="submitForm('dialogForm')"
        >提 交</myButton
      >
    </template>
  </myDialog>
</template>

<script>
import { fileUpload } from "@/api/upload";
import { mapGetters } from "vuex";
import { enumList } from "@/api/security/danger";
import { listByTemplate } from "@/api/hazard/standard";
import myTip from "../../../components/myTip.vue";

export default {
  components: { myTip },
  props: {
    title: {
      required: true,
      default() {
        return "";
      },
    },
    data: {
      required: false,
      default() {
        return null;
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
      baseURL: process.env.VUE_APP_BASE_API,
      dialogForm: {
        rectContent: null, // 整改内容
        hazardType: "一般隐患", // 隐患类型
        rectType: "现场整改", // 整改类型
        rectDate: null, // 整改期限
        mainRisk: null, // 主要事故隐患或问题
        measure: null, // 整改措施或建议
        accordance: null, // 不合规的名称、条款和内容

        fileList: [], // 现场照片

        address: null, // 隐患位置
        remark: null, // 备注
      },
      formRules: {
        mainRisk: [
          {
            required: true,
            message: "请输入主要事故隐患或问题！",
            trigger: ["blur", "change"],
          },
        ],
        hazardType: [
          {
            required: true,
            message: "请选择隐患类型！",
            trigger: ["blur", "change"],
          },
        ],
        rectType: [
          {
            required: true,
            message: "请选择整改类型！",
            trigger: ["blur", "change"],
          },
        ],

        rectDate: [
          {
            required: true,
            message: "请选择整改期限！",
            trigger: ["blur", "change"],
          },
        ],
      },

      enumList: {}, // 枚举
      standardList: [],
      nowIndex: 0,
      measures: {
        riskSourceId: null,
      },
      height: null,
      tableData: [],
      hiddenIndex: null,
      tableKey: 0,
    };
  },
  watch: {
    tableData() {
      this.$nextTick(() => {
        this.onResize();
      });
    },
  },
  computed: {
    ...mapGetters("app", ["themeColor"]),
  },
  created() {
    // this.standardList = this.data;
    console.log(this.id);

    if (this.id) {
      this.getData();
    }

    this.getEnumList();
  },
  mounted() {
    this.$nextTick(() => {
      this.onResize();
    });
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    submitForm() {
      const that = this;
      if (that.loading) {
        return;
      }

      if (that.hiddenIndex) {
        that.$message({
          message: "请完成隐患的添加",
          type: "warning",
        });

        return;
      }
      that.loading = true;

      that.$emit("close", {
        reload: true,
        hazardStandardList: that.tableData,
      });

      that.loading = false;
    },

    /**
     * 发现隐患
     */
    findHidden(data, index) {
      console.log(data);
      this.dialogForm.mainRisk =
        data.mainRisk || data.inspectionStandards || null;
      this.dialogForm.measure = data.measure || null;
      this.dialogForm.accordance = data.accordance || null;
      this.dialogForm.rectDate = data.rectDate || null;
      this.dialogForm.rectType = data.rectType || "现场整改";
      this.dialogForm.hazardType = data.hazardType || "一般隐患";
      this.dialogForm.fileList = data.fileList || [];

      if (data.standardId) {
        this.dialogForm.standardId = data.standardId;
      }

      this.hiddenIndex = index + "";
    },

    /**
     * 确认新增
     */
    submitAdd(formName) {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;

          let obj = Object.assign({}, that.dialogForm);
          obj.isCheck = true;
          Object.assign(that.tableData[that.hiddenIndex], obj);

          that.tableData[that.hiddenIndex].customTable = that.tableData;

          that.loading = false;
          that.$forceUpdate();
          that.tableKey = new Date().getTime();
          that.hiddenIndex = null;
        } else {
          return false;
        }
      });
    },

    getData() {
      const that = this;
      this.loading = true;
      listByTemplate({
        templateId: this.id,
        pageIndex: 1,
        pageSize: 99999999,
      })
        .then((res) => {
          that.tableData = res.records;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    getEnumList() {
      enumList().then((res) => {
        this.enumList = res;
      });
    },

    onResize() {
      this.height = this.$refs.myDialog.offsetHeight;
      let h1;
      if (this.$refs.appRowHeight.offsetHeight) {
        h1 = this.$refs.appRowHeight.offsetHeight;
      }
      this.height = this.height - h1 - 20;
    },
    // 取消
    cancel(done) {
      this.$emit("close", {});
    },

    beforeRemove(file, fileList) {
      if (file.fileName) {
        return this.$confirm(`确定移除 ${file.fileName}？`);
      } else {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
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
      formData.append("type", "hazard_result");
      fileUpload(formData)
        .then((res) => {
          // var index = res.fileName.lastIndexOf(".");

          res.url = that.baseURL + res.fileUrl;
          res.link = that.baseURL + res.fileUrl;
          // res.fileName = res.fileName.substring(0, index);
          res.fileId = res.fileId;

          that.dialogForm.fileList.push(res);
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
      this.dialogForm.fileList.forEach((item, index) => {
        if (file.fileId == item.fileId) {
          this.dialogForm.fileList.splice(index, 1);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.hidden {
  /** 输入框、下拉框的宽度 **/
  /deep/.el-cascader,
  /deep/.el-select,
  /deep/.el-input-number,
  /deep/.el-date-editor,
  /deep/.el-input {
    width: 100% !important;
  }
}

.boxShadow {
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.16);
}
.riskSource {
  .title {
    height: 50px;
    padding: 0px 10px;
    line-height: 50px;
    border: 1px solid #e6e6e6;
    border-bottom: none;
    font-weight: bold;
    background-color: rgb(242, 242, 242);
    color: #000;
    font-size: 16px;
    box-sizing: border-box;
  }

  .standardList {
    height: calc(75vh - 90px);
    overflow: auto;
    padding: 10px;
    & > div {
      width: 100%;
      padding: 0 10px;
      font-size: 14px;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      border-radius: 4px;
    }
    & > div:hover {
      background: #eee;
    }
    & > .riskSourceActive {
      color: #fff;
    }
  }
}

.measures {
  padding: 10px;
}

.hidden {
  padding: 10px;
  height: calc(75vh - 40px);
  overflow: auto;
}

* {
  // 滚动条整体部分
  /deep/&::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  // 滚动条的轨道的两端按钮，允许通过点击微调小方块的位置。
  /deep/ &::-webkit-scrollbar-button {
    display: none;
  }
  // 滚动条的轨道（里面装有Thumb）
  /deep/ &::-webkit-scrollbar-track {
    background: transparent;
  }
  // 滚动条的轨道（里面装有Thumb）
  /deep/ &::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }
  // 滚动条里面的小方块，能向上向下移动（或往左往右移动，取决于是垂直滚动条还是水平滚动条）
  /deep/ &::-webkit-scrollbar-thumb {
    background: rgba(119, 120, 122, 0.3);
    cursor: pointer;
    border-radius: 4px;
  }
}

/deep/input[type="file"] {
  display: none;
}
/** 上传文件 **/
/deep/ .upload-demo > div:first-of-type {
  display: inline;
}

.addBtn {
  position: absolute;
  top: 0;
  background: #fff;
  width: 100%;
  text-align: right;
}

/deep/.el-dialog__footer{
  display: flex;
  .tip{
    margin: 0 auto 0 0;
  }
}
</style>