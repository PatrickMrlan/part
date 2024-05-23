<template>
  <myDrawer
    :title="title"
    class="dialog-form"
    :visible="visible"
    :cancel="cancel"
    :loading="loading"
    size="800px"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      label-width="100px"
      :rules="formRules"
    >
      <el-row :gutter="20">
        <el-col :span="12">
        <el-form-item label="网格名称：" prop="name">
          <el-input
            v-model="dialogForm.name"
            type="text"
            placeholder="请输入网格名称"
            clearable
            maxlength="200"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="父级：" prop="parentId">
          <el-select
            v-model="dialogForm.parentId"
            ref="dictionarySelect"
            clearable
            filterable
            placeholder="请选择父级"
          >
            <el-option
              v-for="item in gridList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="网格区域：" prop="gridArea">
          <!-- <el-input
            v-model.trim="dialogForm.gridArea"
            type="text"
            placeholder="网格区域"
            readonly
            class="input-default"
            @focus="drawShow = true"
          /> -->
          <el-button
            v-model="dialogForm.gridArea"
            type="primary"
            @click="drawShow = true"
            >{{ drawContent }}</el-button
          >
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="网格员：" prop="userList">
          <el-button

            type="primary"
            @click="openLookup('人员')"
            >选 择</el-button
          >
        </el-form-item>
      </el-col>

    </el-row>
        <el-row :gutter="20" style="margin: 10px 0">
          <el-col>
            <!-- <div class="table-title">
              <h3>网格员：</h3>
              <myButton @click.native="openLookup('人员')">选 择</myButton>
            </div> -->

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
                  color: '#333'
                }"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  align="center"
                  width="50"
                />
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
                      content="网格的网格长，默认为第一个"
                      placement="top-start"
                    >
                      <span>网格长 <i class="el-icon-question"></i> </span>
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
                        v-model="scope.row.type"
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
        <el-col :span="12">
        <el-form-item label="排序：" prop="gridSort">
          <el-input-number
            v-model="dialogForm.gridSort"
            type="text"
            placeholder="请输入排序"
            clearable
            :min="1"
          />
        </el-form-item>
      </el-col>
    </el-form>

    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
      <myButton :loading="loading" @click.native="submit('dialogForm')">
        提 交
      </myButton>
    </template>

    <draw
      v-if="drawShow"
      :column-id="id"
      :cent-array="centArray"
      :gridArea="dialogForm.gridArea"
      append-to-body
      @close="drawClose"
      :centArray="centArray"
    />

    <lookup
      v-if="lookupShow"
      :title="titleName"
      :tableDataCheck="tableDataCheck"
      :multiple="true"
      @close="lookupClose"
    />
  </myDrawer>
</template>

<script>
import { detail, add, edit } from "@/api/park/grid";
import { Message } from "element-ui";
import { mapGetters } from "vuex";
import draw from "../grid/draw.vue";
import lookup from "./lookup.vue";
export default {
  components: { draw, lookup },
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "";
      }
    },
    visible: {
      type: Boolean,
      required: true,
      default() {
        return false;
      }
    },
    id: {
      required: false,
      default() {
        return null;
      }
    },
    pid: {
      required: false,
      default() {
        return null;
      }
    }
  },
  data() {
    return {
      pageOper: this.getPageOper(this.$route),
      baseURL: process.env.VUE_APP_BASE_API,
      drawShow: false,
      dialogForm: {
        name: null, //  网格名称
        gridArea: null, //  网格区域
        parentId: null,
        personType: null,
        gridLongitude: null,
        gridLatitude: null
      },
      centArray:[104.06, 30.67],
      gridList: [],
      postForm: {
        longitude: null,
        latitude: null,
        detailedAddress: null
      },
      userList: [],
      drawContent: null,

      loading: false,
      formRules: {
        name: [
          {
            required: true,
            message: "请输入网格名称",
            trigger: ["blur", "change"]
          }
        ]
      },
      titleName: null,
      lookupShow: false,
      userTableKey: null,
      tableDataCheck: [],
      loginUser: {},
    };
  },
  created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    this.loadData();
  },
  computed: {
    ...mapGetters("app", ["themeColor"])
  },

  methods: {
    findIndex(arr, key, value) {
      return arr.findIndex(obj => obj[key] === value);
    },
    calculateCenterPoint() {
      if (this.dialogForm.gridArea != null) {
        const points = this.dialogForm.gridArea.split(";");
        let lngSum = 0;
        let latSum = 0;
        for (let i = 0; i < points.length; i++) {
          const point = points[i].split(",");
          const lng = parseFloat(point[0]);
          const lat = parseFloat(point[1]);
          lngSum += lng;
          latSum += lat;
        }
        const centerLng = lngSum / points.length;
        const centerLat = latSum / points.length;
        this.dialogForm.gridLongitude = centerLng;
        this.dialogForm.gridLatitude = centerLat;
      }
    },
    drawClose(data) {
      console.log(data);

      this.drawShow = false;
      if (data.gridArea) {
        this.dialogForm.gridArea = data.gridArea;
      } else {
        this.dialogForm.gridArea = null;
      }
      this.calculateCenterPoint();
    },

    loadData() {
      this.loading = true;
      detail({ id: this.id })
        .then(res => {
          console.log(res);
          this.dialogForm = res.entity;
          this.gridList = res.gridList;
          let arr = [];
          if (res.entity.gridInspector) {
            res.entity.gridInspector.split(",").forEach((ele, idx) => {
              arr.push(Number(ele));
            });
          }

          this.gridInspector = arr;
          if (
            res.entity.gridLongitude != null &&
            res.entity.gridLatitude != null
          ) {
            this.centArray = [
              res.entity.gridLongitude,
              res.entity.gridLatitude
            ];
          }
          if (
            res.entity.gridLongitude != null &&
            res.entity.gridLatitude != null
          ) {
            this.centArray = [104.06, 30.67];
          }

          if (!res.entity.gridArea) {
            this.drawContent = "绘制区域";
          } else {
            this.drawContent = "修改区域";
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    openLookup() {
      this.titleName = "选择网格员";
      this.lookupShow = true;
      this.tableDataCheck = this.dialogForm.userList;
      console.log(this.tableDataCheck);
    },
    delRows(table, index) {
      table.splice(index, 1);
    },
    lookupClose(data, flag) {
      console.log(data, flag);
      this.dialogForm.userList = data;
      if(this.dialogForm.userList.length){
        this.dialogForm.userList.forEach(item => {
        item.type = 0;
      });
      this.dialogForm.userList[0].type = 1;
      }

      this.lookupShow = false;
    },
    
    changePerson(table, row) {
      console.log(table);
      table.forEach((item) => {
        item.type = 0;
      });
      row.type = 1;
      this.$forceUpdate();
    },


    cancel(done) {
      this.$emit("close", {});
    },

    showdetail() {
      console.log("this.gridInspector", this.gridInspector);
    },

    submit() {
      const that = this;
      if (this.id == null) {
        if (this.dialogForm.parentId == null) {
          this.dialogForm.parentId = this.pid;
        }
      }
      if (that.loading) {
        return;
      }
      that.dialogForm.parkId=this.loginUser.sysPark.parkId;
      that.$refs["dialogForm"].validate(valid => {
        if (valid) {
          that.loading = true;
          if (that.id) {
            edit(that.dialogForm)
              .then(res => {
                that.loading = false;
                Message({
                  type: "success",
                  message: "操作成功"
                });
                that.$emit("close", { reload: true });
              })
              .catch(() => {
                that.loading = false;
              });
          } else {
            add(that.dialogForm)
              .then(res => {
                that.loading = false;
                Message({
                  type: "success",
                  message: "操作成功"
                });
                that.$emit("close", {
                  reload: true,
                  returnData: that.dialogForm.tenantType
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
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.tenantType {
  position: sticky;
  top: -24px;
  z-index: 3;
  background: #fff;
  .el-form-item__label {
    font-size: 16px;
    font-weight: bold;
    color: #000;
  }
}
/deep/.el-image {
  margin-right: 10px;
}

/** 输入框、下拉框的宽度 **/
/deep/.el-cascader,
/deep/.el-select,
/deep/.el-input-number,
/deep/.el-input {
  width: 100% !important;
}

/deep/.el-input-group__append {
  padding: 0 10px;
}

/** 问号提示 **/
/deep/.tips {
  font-size: 16px;
  cursor: pointer;
}

/deep/input[type="file"] {
  display: none;
}
/deep/.hideUploadBox > .el-upload--picture-card {
  display: none !important;
}

/deep/.idCard .el-upload-list__item,
/deep/.idCard .el-upload {
  width: 100%;
}

//   /deep/.idCard1 .el-upload {
//     background: url(../../../assets/img/idCard1.png) no-repeat;
//     background-size: 100% 100%;
//   }

//   /deep/.idCard2 .el-upload {
//     background: url(../../../assets/img/idCard2.png) no-repeat;
//     background-size: 100% 100%;
//   }

/deep/.el-card:not(:last-child) {
  margin-bottom: 24px;
}
/deep/.el-card__header {
  font-size: 16px;
  font-weight: bold;
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
