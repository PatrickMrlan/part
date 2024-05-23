<template>
  <myDialog
    :title="title"
    width="1000px"
    class="dialog-form"
    :visible="true"
    :cancel="cancel"
    :loading="loading"
    :top="'25vh'"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="110px"
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="toolsRight">未授权企业</div>
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="tableDataLeft"
            tooltip-effect="dark"
            style="width: 100%"
            size="small"
            height="50vh"
            border
            @selection-change="handleSelectionChangeAdd"
          >
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="entFullName"
              label="企业名称"
            />
          </el-table>
        </el-col>
        <el-col :span="1">
          <div class="button">
            <myButton
              @click.native="addStaff"
              :type="'circle'"
              icon="el-icon-arrow-right"
              circle
            />
            <myButton
              @click.native="removeStaff"
              :type="'circle'"
              icon="el-icon-arrow-left"
              circle
            />
          </div>
        </el-col>
        <el-col :span="17">
          <div class="toolsRight">已授权企业</div>
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="tableDataRight"
            tooltip-effect="dark"
            style="width: 100%"
            size="small"
            height="50vh"
            border
            @selection-change="handleSelectionChangeRemove"
          >
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column
              prop="entName"
              label="企业名称"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="限制期限"
              width="125px"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.isUseTime"
                  placeholder="请选择"
                  class="input-small"
                  clearabl
                  @change="changIsUserTimeType(scope.row, $event)"
                >
                  <el-option
                    v-for="(item, index) in isUseTimeList"
                    :key="index"
                    :label="item.key"
                    :value="item.key"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="期限时间"
              width="300px"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-date-picker
                  v-if="scope.row.isUseTime == '期限使用'"
                  v-model="scope.row.time"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :format="'yyyy-MM-dd'"
                  :clearable="true"
                  :value-format="'yyyy-MM-dd HH:mm:ss'"
                  :default-time="['00:00:00', '23:59:59']"
                  @input="changeTime(scope.row, $event)"
                  style="margin-right: 7px"
                />
              </template>
            </el-table-column>
            <el-table-column label="是否禁用" width="80px" align="center">
              <template slot-scope="scope">
                <el-tooltip :content="scope.row.isDisable" placement="left">
                  <el-switch
                    v-model="scope.row.isDisable"
                    active-value="禁用"
                    inactive-value="正常"
                  >
                  </el-switch>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="footer-item">
      <myButton :type="'cancel'" @click.native="cancel">取 消</myButton>
      <myButton
        :loading="loading"
        @click.native="submitForm('dialogForm')"
      >
        确 定
      </myButton>
    </div>
  </myDialog>
</template>

<script>
import {
  detail,
  addList,
  authorizeDetail,
} from "@/api/system/businessManagement";
import { Message } from "element-ui";
export default {
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return "编辑角色";
      },
    },
    id: {
      required: false,
      default() {
        return null;
      },
    },
    appId: {
      required: false,
      default() {
        return null;
      },
    },
  },
  // watch: {
  //   tableDataRight: {
  //     handler(newVal, oldVal) {
  //       console.log('newVal', newVal)
  //       console.log('oldVal', oldVal)
  //       if (newVal.time == null || oldVal.time == null) {
  //         newVal.time = []
  //         oldVal.time = []
  //       }
  //     },
  //     deep: true
  //   }
  // },
  data() {
    return {
      loading: false,
      entId: null,
      time: [],
      isUseTimeList: [],
      isDisableList: [],
      dialogForm: {
        appId: null,
        entId: null, // 应用id
        entName: null, // 应用名称
        isUseTime: null, // 是否控制使用时间
        isDisable: null, // 是否禁止使用
        startUseTime: null, // 开始使用时间
        endUseTime: null, // 结束使用时间
        secretId: null, // 配置SecretId
        secretKey: null, // 配置SecretKey
      },
      tableDataLeft: [],
      tableDataRight: [],
      multipleSelectionLeft: [],
      multipleSelectionRight: [],
      empty: [],
      formRules: {
        entName: [
          { required: true, message: "请输入企业名称！", trigger: "blur" },
          {
            max: 20,
            message: "企业名称长度不能大于20",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  created() {
    this.dialogForm.appId = this.appId;
    this.entId = this.id;
    this.loadData();
  },
  methods: {
    // 根据id加载数据
    loadData() {
      const that = this;
      that.loading = true;
      detail().then((res) => {
        that.isDisableList = res.isDisableList;
        that.isUseTimeList = res.isUseTimeList;
      });
      authorizeDetail({ appId: that.appId })
        .then((res) => {
          that.loading = false;
          that.tableDataLeft = res.noAppEntList;
          that.tableDataRight = res.appEntList;
          that.tableDataRight.forEach((item) => {
            console.log(item);
            if (item.startUseTime == null) {
              item.startUseTime = "";
            }
            if (item.endUseTime == null) {
              item.endUseTime = "";
            }
            item.time = [item.startUseTime, item.endUseTime];
          });
          console.log(that.tableDataRight);
        })
        .catch(() => {
          that.loading = false;
        });
    },
    handleSelectionChangeAdd(e) {
      this.multipleSelectionLeft = e;
    },
    handleSelectionChangeRemove(e) {
      this.multipleSelectionRight = e;
    },
    addStaff() {
      const that = this;
      if (that.multipleSelectionLeft.length <= 0) {
        Message({
          type: "warning",
          message: "请选择未授权企业",
        });
        return;
      }
      that.multipleSelectionLeft.forEach((item) => {
        item.entName = item.entFullName;
        item.isUseTime = "无限制";
        item.time = [];
        item.startUseTime = "";
        item.endUseTime = "";
        item.appId = that.appId;
        that.tableDataRight.push(item);
        that.tableDataLeft.forEach((itemSon, index) => {
          if (item.entId == itemSon.entId) {
            that.tableDataLeft.splice(index, 1);
          }
        });
      });
      this.multipleSelectionLeft = [];
    },
    removeStaff() {
      const that = this;
      if (that.multipleSelectionRight.length <= 0) {
        Message({
          type: "warning",
          message: "请选择已授权企业",
        });
        return;
      }
      that.multipleSelectionRight.forEach((item) => {
        that.tableDataLeft.push(item);
        item.entFullName = item.entName;
        that.tableDataRight.forEach((itemSon, index) => {
          if (item.entId == itemSon.entId) {
            that.tableDataRight.splice(index, 1);
          }
        });
      });

      that.multipleSelectionRight = [];
    },

    /**
     * 数据提交
     */
    submitForm(formName) {
      const that = this;
      if (that.loading) {
        return;
      }
      if (that.tableDataRight.length == 0) {
        Message({
          type: "warning",
          message: "请添加授权企业",
        });
        return;
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          addList(that.tableDataRight)
            .then((res) => {
              that.loading = false;
              Message({
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
    cancel(done) {
      this.$emit("close", {});
    },
    changIsUserTimeType(data, e) {
      if (e == "无限制") {
        data.time = [];
        data.startUseTime = "";
        data.endUseTime = "";
      }
      this.tableDataRight = JSON.parse(JSON.stringify(this.tableDataRight));
    },

    changeTime(data, val) {
      if (val.length) {
        data.startUseTime = val[0];
        data.endUseTime = val[1];
        data.time = [val[0], val[1]];
      } else {
        data.startUseTime = null;
        data.endUseTime = null;
        data.time = [];
      }
      this.tableDataRight = JSON.parse(JSON.stringify(this.tableDataRight));
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-dialog {
  min-height: 60vh;
  .el-table {
    min-height: 50vh;
  }
  .toolsRight {
    flex-direction: row;
  }
  .el-range-editor--small {
    width: 285px;
  }
}
.button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  & > * {
    width: 32px;
    height: 32px;
  }
}
</style>
