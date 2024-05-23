<template>
  <div class="page" v-loading="loading">
    <div class="header boxShadow" ref="header">
      <div class="title">
        <i class="el-icon-back" @click="back" />
        <span>{{ $route.query.name }}</span>
      </div>
      <p>
        风险伴随的设施、部位、场所和区域，以及在设施、部位、场所和区域实施的伴随风险的作业活动，或以上两者的组合。
      </p>
    </div>
    <div class="table-classic-wrapper">
      <div ref="card">
        <el-card class="box-card" header="风险单元（场所、区域）信息">
          <el-form ref="dialogForm" :model="dialogForm" :rules="formRules">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item
                  label="风险单元（场所、区域）："
                  prop="riskPointName"
                >
                  <el-tooltip
                    class="item tips"
                    effect="dark"
                    content=""
                    placement="top"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                  <el-input
                    v-model.trim="dialogForm.riskPointName"
                    type="text"
                    placeholder="请输入风险单元（场所、区域）"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="风险单元（场所、区域）位置：" prop="address">
                  <el-input
                    placeholder="请选择风险单元（场所、区域）位置"
                    v-model="dialogForm.address"
                    readonly
                  >
                    <template slot="append">
                      <div @click="mapShow = true">选择</div>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="管控层级：" prop="controlLevel">
                  <el-tooltip
                    class="item tips"
                    effect="dark"
                    content=""
                    placement="top"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                  <el-select
                    v-model="dialogForm.controlLevel"
                    placeholder="请选择"
                    filterable
                  >
                    <el-option
                      v-for="(item, index) in enumList.controlLevelList"
                      :key="index"
                      :label="item.key"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="管控负责人：" class="selecrPerson">
                  <div class="selectBox">
                    <span>公司级</span>
                    <el-select
                      v-model="dialogForm.companyPostId"
                      placeholder="请选择"
                      filterable
                      style="margin-bottom: 10px"
                    >
                      <el-option
                        v-for="(item, index) in enumList.companyList"
                        :key="index"
                        :label="item.postName"
                        :value="item.postId"
                      />
                    </el-select>
                  </div>
                  <div class="selectBox">
                    <span>部门/分厂级</span>
                    <el-select
                      v-model="dialogForm.deptPostId"
                      placeholder="请选择"
                      filterable
                      style="margin-bottom: 10px"
                    >
                      <el-option
                        v-for="(item, index) in enumList.deptList"
                        :key="index"
                        :label="item.postName"
                        :value="item.postId"
                      />
                    </el-select>
                  </div>
                  <div class="selectBox">
                    <span>车间/工段级</span>
                    <el-select
                      v-model="dialogForm.workshopPostId"
                      placeholder="请选择"
                      filterable
                      style="margin-bottom: 10px"
                    >
                      <el-option
                        v-for="(item, index) in enumList.workshopList"
                        :key="index"
                        :label="item.postName"
                        :value="item.postId"
                      />
                    </el-select>
                  </div>
                  <div class="selectBox">
                    <span>岗位/班组级</span>
                    <el-select
                      v-model="dialogForm.postId"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="(item, index) in enumList.postList"
                        :key="index"
                        :label="item.postName"
                        :value="item.postId"
                      />
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="现场照片：">
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
                    :file-list="dialogForm.imgList"
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
        </el-card>
      </div>
      <div>
        <el-card class="box-card" header="">
          <div slot="header" class="clearfix">
            <span>风险源（点）辨识</span>
            <myButton
              style="float: right"
              icon="el-icon-plus"
              @click.native="editRiskSource(null)"
              >添加</myButton
            >
          </div>

          <div class="table">
            <div ref="toolsRight" class="toolsRight">
              <div
                v-show="menuShow"
                style="right: 0"
                class="checkBox"
                @click="screening"
              >
                <el-checkbox-group
                  v-model="header"
                  size="mini"
                  @change="handleCheck($event)"
                >
                  <el-checkbox
                    v-for="(item, index) in checked"
                    :key="index"
                    :label="item.headName"
                    :disabled="item.disabled"
                  />
                </el-checkbox-group>
              </div>
              <!-- <myButton
            type="cancel"
            icon="el-icon-download"
            v-if="pageOper.DC"
            @click.native="getExportTableData"
            >导出</myButton
          > -->
              <myButton
                type="cancel"
                icon="el-icon-menu"
                @click.native.stop="screening"
                >筛选列</myButton
              >
            </div>

            <el-table
              :data="dialogForm.riskSourceList"
              style="width: 100%"
              ref="multipleTable"
              v-loading="loading"
              tooltip-effect="dark"
              size="small"
              highlight-current-row
              border
              :height="height"
              :row-key="rowKey"
              :header-cell-style="{
                height: '50px',
                fontSize: '14px',
                fontWeight: 'bold',
              }"
              :cell-style="{
                fontSize: '14px',
              }"
              :row-style="{
                cursor: 'pointer',
              }"
            >
              <el-table-column
                prop="riskName"
                label="名称"
                :show-overflow-tooltip="true"
                v-if="checked[0].isShow"
              >
              </el-table-column>
              <el-table-column
                prop="riskCategory"
                label="类别"
                width="120"
                align="center"
                :show-overflow-tooltip="true"
                v-if="checked[1].isShow"
              >
              </el-table-column>
              <el-table-column
                prop="riskLevel"
                label="风险等级"
                width="120"
                align="center"
                :show-overflow-tooltip="true"
                v-if="checked[2].isShow"
              >
              </el-table-column>
              <el-table-column
                prop="accidentTypeNames"
                label="主要事故类型"
                :show-overflow-tooltip="true"
                v-if="checked[3].isShow"
              >
              </el-table-column>
              <el-table-column
                prop="riskOverview"
                label="风险概述"
                :show-overflow-tooltip="true"
                v-if="checked[4].isShow"
              >
              </el-table-column>
              <el-table-column
                label="操作"
                width="100"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <my-handle>
                    <span @click="editRiskSource(scope.row, scope.$index)"
                      >编辑</span
                    >
                    <span @click="delRiskSource(scope.$index, null)">删除</span>
                  </my-handle>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
    </div>

    <div class="footer boxShadow" ref="footer">
      <myButton type="cancel" @click.native="back"> 取消 </myButton>
      <!-- <myButton type="cancel"> 暂存 </myButton> -->
      <myButton
        icon="el-icon-loading"
        :loading="loading"
        @click.native="submitForm('dialogForm')"
      >
        提交
      </myButton>
    </div>

    <mapup
      v-if="mapShow"
      :show="mapShow"
      :postform="postForm"
      @close="mapupclose"
    />

    <editRiskSource
      v-if="editRiskSourceShow"
      :title="titleName"
      :id="editId"
      :editData="editData"
      @close="editRiskSourceClose"
    />
  </div>
</template>

<script>
import mapup from "../../secureManagement/enterpriseArchives/mapup.vue";
import { fileUpload } from "@/api/upload";
import editRiskSource from "./editRiskSource.vue";
import { Message } from "element-ui";

import { add, edit, detail, enumList } from "@/api/risk/riskPoint";

export default {
  components: { mapup, editRiskSource },
  props: {
    parkType: {
      require: false,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      loading: false,

      header: ["名称", "类别", "风险等级", "主要事故类型", "风险概述"],

      checked: [
        {
          headName: "名称",
          isShow: true,
          disabled: false,
        },
        {
          headName: "类别",
          isShow: true,
          disabled: false,
        },
        {
          headName: "风险等级",
          isShow: true,
          disabled: false,
        },
        {
          headName: "主要事故类型",
          isShow: true,
          disabled: false,
        },
        {
          headName: "风险概述",
          isShow: true,
          disabled: false,
        },
      ],

      menuShow: false,
      height: null,
      total: 0,
      tableData: [],

      dialogForm: {
        riskPointName: null, // 风险单元（场所、区域）标题
        controlLevel: null, // 管控层级
        longitude: null, // 经度
        latitude: null, // 维度
        address: null, // 风险单元（场所、区域）位置
        siteImg: [], // 现场照片
        riskLevel: null, // 风险等级
        postId: null, // 管控负责人（关联用户岗位）
        riskSourceList: [], // 表格
      },
      enumList: {}, // 枚举
      formRules: {
        riskPointName: [
          {
            required: true,
            message: "请输入风险单元（场所、区域）！",
            trigger: ["blur", "change"],
          },
        ],
        address: [
          {
            required: true,
            message: "请选择风险单元（场所、区域）位置！",
            trigger: ["blur", "change"],
          },
        ],
        controlLevel: [
          {
            required: true,
            message: "请选择管控层级！",
            trigger: ["blur", "change"],
          },
        ],
      },
      mapShow: false,
      postForm: {
        longitude: null,
        latitude: null,
        detailedAddress: null,
      },

      editRiskSourceShow: false,
      editId: null,
      editIndex: null,
      editData: null,
      titleName: null,
      loginUser: {},
    };
  },
  watch: {
    tableData() {
      this.$nextTick(() => {
        this.onResize();
      });
    },
  },
  created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    this.getEnumList();
    this.loadData();
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
    loadData() {
      this.loading = true;
      detail({ id: this.$route.query.id })
        .then((res) => {
          this.dialogForm = res.riskPoints;

          if (this.dialogForm.imgList && this.dialogForm.imgList.length) {
            this.dialogForm.imgList.forEach((item) => {
              item.link = this.baseURL + item.fileUrl;
              item.url = this.baseURL + item.fileUrl;
            });
          }
          if (
            !this.dialogForm.address ||
            !this.dialogForm.latitude ||
            !this.dialogForm.longitude
          ) {
            if (this.loginUser.userType == "企业") {
              this.dialogForm.address = this.loginUser.sysEnterprise.address;
              this.dialogForm.latitude = this.loginUser.sysEnterprise.latitude;
              this.dialogForm.longitude =
                this.loginUser.sysEnterprise.longitude;
            }

            if (this.loginUser.userType == "园区") {
              this.dialogForm.address = this.loginUser.sysPark.address;
              this.dialogForm.latitude = this.loginUser.sysPark.latitude;
              this.dialogForm.longitude = this.loginUser.sysPark.longitude;
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 获取枚举
     */
    getEnumList() {
      enumList().then((res) => {
        this.enumList = res;
      });
    },

    rowKey(row) {
      return row.id;
    },

    /**
     * 数据提交
     */
    submitForm(formName) {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;

          if (that.$route.query.id) {
            edit(that.dialogForm)
              .then((res) => {
                that.loading = false;
                Message({
                  type: "success",
                  message: "操作成功",
                });
                this.back();
              })
              .catch(() => {
                that.loading = false;
              });
          } else {
            add(that.dialogForm)
              .then((res) => {
                that.loading = false;
                Message({
                  type: "success",
                  message: "操作成功",
                });
                this.back();
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

    back() {
      this.$router.go(-1);
    },

    /**
     * 打开和关闭筛选列
     */
    screening() {
      this.menuShow = !this.menuShow;
    },

    /**
     * 删除
     */
    delRiskSource(index) {
      this.dialogForm.riskSourceList.forEach((item, i) => {
        if (i == index) {
          this.dialogForm.riskSourceList.splice(i, 1);
        }
      });
    },

    editRiskSource(data, index) {
      this.editIndex = null;
      this.editData = null;
      this.editId = null;

      if (data == null) {
        this.editId = null;
        this.titleName = "新增风险源（点）";
      } else {
        this.editData = data;
        this.editIndex = index + "";
        this.titleName = "编辑风险源（点）";
      }
      this.editRiskSourceShow = true;
    },

    /**
     * 关闭编辑页面
     */
    editRiskSourceClose(data) {
      this.editRiskSourceShow = false;

      console.log(data);

      if (data.reload) {
        let arr = [];
        let accidentTypeName = null;

        data.data.majorAccidentsList.forEach((item) => {
          console.log(item);

          arr.push(item.accidentTypeName);
          accidentTypeName = arr.join(",");
        });
        data.data.accidentTypeNames = accidentTypeName;

        if (this.editIndex) {
          this.dialogForm.riskSourceList[this.editIndex] = data.data;
        } else {
          this.dialogForm.riskSourceList.push(data.data);
        }
      }
    },

    onResize() {
      this.height = window.innerHeight;
      let h1, h2, h3;
      if (this.$refs.header.offsetHeight) {
        h1 = this.$refs.header.offsetHeight;
      }
      if (this.$refs.card.offsetHeight) {
        h2 = this.$refs.card.offsetHeight;
      }
      if (this.$refs.footer.offsetHeight) {
        h3 = this.$refs.footer.offsetHeight;
      }

      this.height = this.height - h1 - h2 - h3;
    },

    handleCheck(event) {
      this.checked.forEach((item) => {
        item.isShow = false;
        event.forEach((val) => {
          if (item.headName == val) {
            item.isShow = true;
          }
        });
      });
      this.checked = JSON.parse(JSON.stringify(this.checked));
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
      formData.append("type", "risk_point_img");
      fileUpload(formData)
        .then((res) => {
          // var index = res.fileName.lastIndexOf(".");

          res.url = that.baseURL + res.fileUrl;
          res.link = that.baseURL + res.fileUrl;
          // res.fileName = res.fileName.substring(0, index);
          res.fileId = res.fileId;

          that.dialogForm.imgList.push(res);
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
      this.dialogForm.imgList.forEach((item, index) => {
        if (file.fileId == item.fileId) {
          this.dialogForm.imgList.splice(index, 1);
        }
      });
    },

    mapupclose(data) {
      this.mapShow = false;
      this.$forceUpdate();
      if (data != null) {
        this.dialogForm.address = data.address;
        this.dialogForm.longitude = data.lng;
        this.dialogForm.latitude = data.lat;

        this.postForm.detailedAddress = data.address;
        this.postForm.longitude = data.lng;
        this.postForm.latitude = data.lat;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.boxShadow {
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.16);
}
.page {
  background: #f0f2f5;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.header {
  background: #fff;
  height: 100px;
  border-bottom: 1px solid #e9e9e9;
  box-sizing: border-box;
  padding: 16px 32px;
  margin-bottom: 16px;
  .title {
    height: 26px;
    font-size: 20px;
    font-family: "Microsoft YaHei, Microsoft YaHei";
    font-weight: bold;
    color: #006cfb;
    margin-bottom: 16px;
    i {
      font-weight: bold;
      margin-right: 5px;
      cursor: pointer;
    }
  }
  p {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
  }
}

.footer {
  margin: auto 0 0 0 !important;
  height: 55px;
  background: #ffffff;
  box-sizing: border-box;
  border-top: 1px solid #e9e9e9;
  padding: 12px 24px;
  text-align: right;
}

/deep/.table-classic-wrapper {
  padding: 0 24px !important;
  margin-bottom: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  grid-gap: 16px;
  overflow: auto;
  .el-card__header {
    font-size: 16px;
    font-weight: bold;
    color: #000000;
  }
}
/deep/.el-input-group__append {
  cursor: pointer;
}

/** 输入框、下拉框的宽度 **/
/deep/.el-cascader,
/deep/.el-select,
/deep/.el-input-number,
/deep/.el-date-editor,
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

/deep/.el-upload--picture-card,
/deep/.el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}

.uploadImg {
  width: 100px;
  height: 100px;
  line-height: 105px;
}
.selecrPerson {
  /deep/.el-form-item__label {
    float: none;
  }
  .selectBox {
    display: flex;
    & > span {
      padding: 0 10px;
      min-width: 96px;
      height: 32px;
      background: #f5f5f5;
      border-radius: 4px 0px 0px 4px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      font-size: 12px;
      color: rgba(0, 0, 0, 0.88);
      box-sizing: border-box;
      white-space: nowrap;
    }

    /deep/.el-input__inner {
      border-radius: 0px 4px 4px 0px;
    }
  }
}
</style>