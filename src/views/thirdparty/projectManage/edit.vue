<template>
  <myDrawer :title="title" :visible="visible" :cancel="cancel" size="60%">
    <el-form
      v-loading="loading"
      style="min-height: 100%"
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
    >
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="项目名称：" prop="projectName">
            <el-input
              v-model="dialogForm.projectName"
              type="text"
              placeholder="请输入项目名称"
              clearable
              maxlength="100"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="项目开始时间：" prop="startTime">
            <el-date-picker
              v-model="dialogForm.startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              @change="changeTime"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目结束时间：" prop="endTime">
            <el-date-picker
              v-model="dialogForm.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              @change="changeTime"
            />
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="项目详情：" prop="projectDetail">
            <el-input
              v-model="dialogForm.projectDetail"
              type="textarea"
              placeholder="请输入项目详情"
              clearable
              show-word-limit
              maxlength="500"
              :autosize="{ minRows: 4 }"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin: 10px 0">
        <el-col>
          <div class="table-title">
            <h3>关联园区：</h3>
            <myButton @click.native="openLookup('园区')">选 择</myButton>
          </div>
          <div
            class="table"
            v-if="dialogForm.parkList && dialogForm.parkList.length > 0"
          >
            <el-table
              :data="dialogForm.parkList"
              border
              highlight-current-row
              style="width: 100%"
              :header-cell-style="{
                height: '30px !important',
                fontSize: '14px',
                color: '#333',
              }"
            >
              <el-table-column
                label="序号"
                type="index"
                align="center"
                width="50"
              />
              <el-table-column
                prop="parkName"
                label="园区名称"
                show-overflow-tooltip
              />
              <el-table-column
                prop="parkCode"
                label="园区统一社会信用代码"
                width="200px"
              />
              <el-table-column
                prop="contact"
                label="联系人"
                align="center"
                width="150px"
              />
              <el-table-column
                prop="contactTel"
                label="联系电话"
                align="center"
                width="120px"
              />
              <el-table-column
                prop="establishDate"
                label="成立日期"
                align="center"
                width="120px"
              />
              <el-table-column label="操作" width="70px" align="center">
                <template slot-scope="scope">
                  <my-handle>
                    <span @click="delRows(dialogForm.parkList, scope.$index)"
                      >删除</span
                    >
                  </my-handle>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 10px 0">
        <el-col>
          <div class="table-title">
            <h3>关联企业：</h3>
            <myButton @click.native="openLookup('企业')">选 择</myButton>
          </div>
          <div
            class="table"
            v-if="
              dialogForm.enterpriseList && dialogForm.enterpriseList.length > 0
            "
          >
            <el-table
              :data="dialogForm.enterpriseList"
              border
              highlight-current-row
              style="width: 100%"
              :header-cell-style="{
                height: '30px !important',
                fontSize: '14px',
                color: '#333',
              }"
            >
              <el-table-column
                label="序号"
                type="index"
                align="center"
                width="50"
              />
              <el-table-column
                prop="entName"
                label="企业名称"
                show-overflow-tooltip
              />
              <el-table-column
                prop="entCode"
                label="企业统一社会信用代码"
                width="200px"
              />
              <el-table-column
                prop="contact"
                label="联系人"
                align="center"
                width="150px"
              />
              <el-table-column
                prop="contactTel"
                label="联系电话"
                align="center"
                width="120px"
              />
              <el-table-column
                prop="entState"
                label="企业状态"
                align="center"
                width="120px"
              />
              <el-table-column label="操作" width="70px" align="center">
                <template slot-scope="scope">
                  <my-handle>
                    <span
                      @click="delRows(dialogForm.enterpriseList, scope.$index)"
                      >删除</span
                    >
                  </my-handle>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 10px 0">
        <el-col>
          <div class="table-title">
            <h3>关联人员：</h3>
            <myButton @click.native="openLookup('人员')">选 择</myButton>
          </div>
          <div
            class="table"
            v-if="dialogForm.userList && dialogForm.userList.length > 0"
          >
            <el-table
              :data="dialogForm.userList"
              border
              highlight-current-row
              style="width: 100%"
              :key="userTableKey"
              :header-cell-style="{
                height: '30px !important',
                fontSize: '14px',
                color: '#333',
              }"
            >
              <el-table-column
                label="序号"
                type="index"
                align="center"
                width="50"
              />
              <el-table-column prop="loginCode" label="账号" />
              <el-table-column prop="userName" label="人员名称" />
              <el-table-column
                prop="userTel"
                label="联系电话"
                align="center"
                width="120px"
              />
              <el-table-column
                prop="userIdentity"
                label="人员类型"
                align="center"
                width="120px"
              />
              <el-table-column
                prop="userState"
                label="账号状态"
                align="center"
                width="120px"
              />
              <el-table-column width="120px" align="center">
                <template slot="header">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="关联人员的主要负责人，默认为第一个"
                    placement="top-start"
                  >
                    <span>主要负责人 <i class="el-icon-question"></i> </span>
                  </el-tooltip>
                </template>

                <template slot-scope="scope">
                  <div>
                    <el-switch
                      style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                      "
                      v-model="scope.row.isHead"
                      :active-value="1"
                      :inactive-value="0"
                      @change="changePerson(dialogForm.userList, scope.row)"
                    ></el-switch>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="70px" align="center">
                <template slot-scope="scope">
                  <my-handle>
                    <span @click="delRows(dialogForm.userList, scope.$index)"
                      >删除</span
                    >
                  </my-handle>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="相关附件：" prop="fileList">
            <el-tooltip
              class="item tips"
              effect="dark"
              content="可上传图片、文档"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
            <myUpload
              action="#"
              class="upload-demo"
              accept=".jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.pdf,.bmp,.webp"
              multiple
              :file-list="dialogForm.fileList"
              :on-preview="handlePreview"
              :on-remove="handleRemoveImg"
              :http-request="handleUpload"
              :before-upload="beforeUploadImg"
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
      <myButton :loading="loading" @click.native="submit('dialogForm')">
        提 交
      </myButton>
    </template>

    <lookup
      v-if="lookupShow"
      :type="lookupType"
      :title="titleName"
      :tableDataCheck="tableDataCheck"
      :multiple="true"
      @close="lookupClose"
    />
  </myDrawer>
</template>

<script>
import { detail, add, edit } from "@/api/thirdparty/projectManage";
import { fileUpload } from "@/api/upload";
import basic from "@/utils/basic";

import lookup from "./lookup.vue";

export default {
  components: { lookup },
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
    visible: {
      type: Boolean,
      required: true,
      default() {
        return false;
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
      baseURL: process.env.VUE_APP_BASE_API,
      loading: false,
      dialogForm: {
        projectName:null,
        projectDetail:null,
        startTime:null,
        endTime:null,
      },
      formRules: {
        projectName: [
          {
            required: true,
            message: "请输入项目名称",
            trigger: ["change", "blur"],
          },
        ],
        startTime: [
          {
            required: true,
            message: "请选择项目开始时间",
            trigger: ["change", "blur"],
          },
        ],
        endTime: [
          {
            required: true,
            message: "请选择项目结束时间",
            trigger: ["change", "blur"],
          },
        ],
      },

      lookupType: null,
      lookupShow: false,
      titleName: null,
      tableDataCheck: [],
      userTableKey: null,
      checkTime: false,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      const that = this;
      that.loading = true;
      detail({ id: this.id })
        .then((res) => {
          console.log(res);
          this.dialogForm = res;

          if (this.dialogForm.fileList && this.dialogForm.fileList.length > 0) {
            this.dialogForm.fileList.forEach((item) => {
              item.url = require("@/assets/img/fileCover.png");
              item.link = that.baseURL + item.fileUrl;
              item.fileName = item.fileName;
              item.fileId = item.fileId;
            });
          }
        })
        .finally(() => {
          that.loading = false;
        });
    },

    submit(fromName) {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs[fromName].validate((valid) => {
        if (valid) {
          if (that.checkTime) {
            that.$message({
              message: "【任务开始时间】必须在【任务结束时间】前",
              type: "warning",
            });
            return;
          }

          that.loading = true;

          if (that.id) {
            edit(that.dialogForm)
              .then((res) => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "修改成功",
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
                  message: "添加成功",
                });
                that.$emit("close", { reload: true });
              })
              .catch(() => {
                that.loading = false;
              });
          }
        }
      });
    },

    changeTime() {
      if (this.dialogForm.startTime && this.dialogForm.endTime) {
        if (
          !basic.compareDatetime(
            this.dialogForm.startTime,
            this.dialogForm.endTime
          )
        ) {
          this.checkTime = true;
          return this.$message({
            message: "【任务开始时间】必须在【任务结束时间】前",
            type: "warning",
          });
        } else {
          this.checkTime = false;
        }
      }
    },

    changePerson(table, row) {
      table.forEach((item) => {
        item.isHead = 0;
      });
      row.isHead = 1;
      this.userTableKey = new Date().getTime();
      this.$forceUpdate();
    },

    delRows(table, index) {
      table.splice(index, 1);
    },

    openLookup(type) {
      this.titleName = "选择" + type;
      this.lookupType = type;
      this.lookupShow = true;
      switch (type) {
        case "园区":
          this.tableDataCheck = this.dialogForm.parkList;
          break;
        case "企业":
          this.tableDataCheck = this.dialogForm.enterpriseList;
          break;
        case "人员":
          this.tableDataCheck = this.dialogForm.userList;
          break;
        default:
          break;
      }
    },

    lookupClose(data, flag) {
      console.log(data, flag);
      if (flag) {
        switch (this.lookupType) {
          case "园区":
            this.dialogForm.parkList = data;
            break;
          case "企业":
            this.dialogForm.enterpriseList = data;
            break;
          case "人员":
            this.dialogForm.userList = data;
            this.dialogForm.userList.forEach((item) => {
              item.isHead = 0;
            });
            this.dialogForm.userList[0].isHead = 1;
            break;
          default:
            break;
        }
      }
      this.lookupShow = false;
    },

    beforeRemove(file, fileList) {
      if (file.fileName) {
        return this.$confirm(`确定移除 ${file.fileName}？`);
      } else {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },

    // 移除模板
    handleRemoveImg(file, fileList) {
      this.dialogForm.fileList.forEach((item, index) => {
        if (file.fileId == item.fileId) {
          this.dialogForm.fileList.splice(index, 1);
        }
      });
    },
    beforeUploadImg(file) {
      let name = file.name.split(".").pop().toUpperCase();
      if (
        name !== "PDF" &&
        name !== "DOCX" &&
        name !== "DOC" &&
        name !== "XLS" &&
        name !== "XLSX" &&
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
      if (file && file.fileUrl) {
        window.open(file.fileUrl);
      }
    },

    // 自定义上传
    handleUpload(file, fileList) {
      const that = this;
      that.loading = true;
      const formData = new FormData();
      formData.append("fileType", 4);
      formData.append("file", file.file);
      formData.append("type", "thirdParty_project");
      fileUpload(formData)
        .then((res) => {
          res.url = require("@/assets/img/fileCover.png");
          res.link = that.baseURL + res.fileUrl;
          res.fileName = res.fileName;
          res.fileId = res.fileId;
          this.dialogForm.fileList.push(res);
          that.$message({
            type: "success",
            message: "上传成功！",
          });
        })
        .finally(() => {
          that.loading = false;
        });
    },

    cancel(done) {
      this.$emit("close", {});
    },
  },
};
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
/deep/input[type="file"] {
  display: none;
}
/** 上传文件 **/
/deep/ .upload-demo > div:first-of-type {
  display: inline;
}

/deep/.hideUploadBox > .el-upload--picture-card {
  display: none !important;
}

.table-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    font-size: 14px;
    color: #606266;
  }
}
.table {
  margin: 10px 0;
}
</style>