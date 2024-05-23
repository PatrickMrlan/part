<template>
  <div class="table-classic-wrapper">
    <el-card class="box-card topcard">
      <div class="headbox">
        <div class="warnicon">
          <i class="el-icon-warning"></i>
        </div>
        <div class="headright">
          <div class="headright_box">
            <p>{{ this.ledgerParm.allNumber }} 个</p>
            <p>设施设备总数</p>
          </div>
          <div class="headright_box">
            <p>{{ this.ledgerParm.specialNumber }} 个</p>
            <p>特种设备</p>
          </div>
          <div class="headright_box">
            <p>{{ this.ledgerParm.otherNumber }} 个</p>
            <p>其他</p>
          </div>
          <div class="headright_box">
            <p>{{ this.ledgerParm.useNumber }} 个</p>
            <p>使用登记证</p>
          </div>
        </div>
      </div>
    </el-card>

    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model="listQuery.keyword"
          placeholder="输入规章名称，回车检索"
          class="input-normal"
          @keyup.enter.native="search"
          clearable
        ></el-input>

        <el-select
          v-model="listQuery.deviceLargeCategory"
          placeholder="请选择设备大类"
          class="input-normal"
          clearable
          @change="search"
        >
          <el-option
            v-for="item in deviceLargeCategoryList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="listQuery.deviceSubclass"
          placeholder="请选择设备小类"
          class="input-normal"
          @change="search"
          clearable
        >
          <el-option
            v-for="item in deviceSubclassList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="listQuery.isUseRegistration"
          placeholder="是否办理使用登记"
          class="input-normal"
          clearable
          @change="search"
        >
          <el-option
            v-for="item in yesOrNoList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
        </el-select>

        <myButton
          v-if="pageOper.CX"
          :type="'search'"
          icon="el-icon-search"
          @click.native="search"
          >搜索</myButton
        >
      </div>
      <div class="right">
        <myButton
          v-if="pageOper.TJ"
          icon="el-icon-plus"
          @click.native="edit(null)"
          >添加</myButton
        >
        <myButton
          v-if="pageOper.SC"
          type="remove"
          icon="el-icon-delete"
          @click.native="remove(null)"
          >删除</myButton
        >
      </div>
    </div>
    <myTable
      ref="fileTable"
      :show-index="true"
      :selection="true"
      @change="multiple"
      :checked="checked"
      :loading.sync="loading"
      :d-c-authority="pageOper.DC"
      :total.sync="total"
      :page-index="listQuery.pageIndex"
      :table-data="tableData"
      custom-label="操作"
      custom-label-width="220px"
      custom1-label="维修保养"
      custom1-label-width="100px"
      custom2-label="安装位置"
      custom2-label-width="150px"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
      :row-key="rowKey"
      :onResizeHeight="118"
    >
      <template slot="custom1" slot-scope="scope">
        <span
          v-if="pageOper.XG && scope.data.row.repairId != null"
          title="查看详情"
          style="color: #006eff"
          @click="repair(scope.data.row)"
          >查看详情</span
        >
        <span v-if="pageOper.XG && scope.data.row.repairId == null">无</span>
      </template>

      <template slot="custom2" slot-scope="scope">
        {{ scope.data.row.address
        }}<span
          v-if="
            scope.data.row.longitude != null && scope.data.row.latitude != null
          "
          style="color: green"
          >(√已标注)</span
        >
        <span
          v-if="
            scope.data.row.longitude == null && scope.data.row.latitude == null
          "
          style="color: red"
          >(×未标注)</span
        >
      </template>

      <template slot="custom" slot-scope="scope">
        <myHandle>
          <span
            v-if="pageOper.XG"
            title="位置标注"
            @click="mapup(scope.data.row)"
          >
            位置标注
          </span>
          <span v-if="pageOper.XG" title="预览" @click="look(scope.data.row)">
            预览
          </span>
          <span v-if="pageOper.XG" title="编辑" @click="edit(scope.data.row)">
            编辑
          </span>
          <span v-if="pageOper.SC" title="删除" @click="remove(scope.data.row)">
            删除
          </span>
        </myHandle>
      </template>
    </myTable>

    <edit v-if="editShow" :id="editId" :title="titleName" @close="editColse" />

    <repair
      v-if="repairShow"
      :id="editId"
      :title="titleName"
      :visible="repairShow"
      @close="repairClose"
    />

    <mapup
      v-if="mapShow"
      :show="mapShow"
      :postform="postForm"
      @close="mapupclose"
    />

    <look v-if="lookShow" :id="editId" :title="titleName" @close="lookClose" />
  </div>
</template>
<script>
import { list, remove, enumList, ledger } from "@/api/park/facilities";
import edit from "./edit";
import mapup from "../sameTime/mapup.vue";
import look from "./look.vue";
import repair from "./repair.vue";

export default {
  components: { edit, mapup, look, repair },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,

      // 多选数据暂存数组
      multipleSelection: [],

      timeStamp: 0,
      yesOrNoList: [],
      lookShow: false,
      mapShow: false,
      repairShow: false,

      ledgerParm: {},

      postForm: {
        longitude: null,
        latitude: null,
        detailedAddress: null,
      },

      listQuery: {
        pageIndex: 1,
        pageSize: 10,
      },
      mapupShow: false,
      tableData: [],
      checked: [
        { key: "设备名称", val: "deviceName", align: "center", width: "100px" },
        {
          key: "设备大类",
          val: "deviceLargeCategory",
          align: "center",
          width: "100px",
        },
        {
          key: "设备小类",
          val: "deviceSubclass",
          align: "center",
          width: "120px",
        },
        {
          key: "设备编号",
          val: "deviceCode",
          align: "center",
          width: "120px",
        },
        {
          key: "规格型号",
          val: "deviceModel",
          align: "center",
          width: "120px",
        },
        { key: "生产厂商", val: "manufacturer", align: "center" },
        { key: "是否办理使用登记", val: "isUseRegistration", align: "center" },
      ],
      total: 0,
      deviceLargeCategoryList: [],
      deviceSubclassList: [],
      editId: null,
      editShow: false,
    };
  },
  async created() {
    await this.getMainData();
    await this.getEnumList();
  },
  methods: {
    mapup(data) {
      this.mapShow = true;

      this.dialogForm.address = data.address;
      this.dialogForm.longitude = data.lng;
      this.dialogForm.latitude = data.lat;

      this.postForm.address = data.address;
      this.postForm.longitude = data.lng;
      this.postForm.latitude = data.lat;
    },
    // 地图弹窗
    mapupclose(data) {
      this.mapShow = false;
      if (data != null) {
        this.dialogForm.address = data.address;
        this.dialogForm.longitude = data.lng;
        this.dialogForm.latitude = data.lat;

        this.postForm.address = data.address;
        this.postForm.longitude = data.lng;
        this.postForm.latitude = data.lat;
      }
    },

    getEnumList() {
      const that = this;
      that.loading = true;
      // 获取枚举列表
      enumList()
        .then((res) => {
          this.yesOrNoList = res.yesOrNoList;
          this.deviceSubclassList = res.deviceSubclassList;
          this.deviceLargeCategoryList = res.deviceLargeCategoryList;
        })
        .catch(() => {
          that.loading = false;
        });
    },

    rowKey(row) {
      return row.parkUserId;
    },
    /**
     * 表格多选回调事件
     */
    multiple(e) {
      this.multipleSelection = e;
    },

    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this;
      this.loading = true;
      console.log(that.listQuery);

      ledger().then((res) => {
        this.ledgerParm = res;
        console.log(this.ledgerParm);
      });

      list(that.listQuery)
        .then((res) => {
          that.loading = false;
          that.tableData = res.records;
          that.listQuery.pageSize = res.size;
          that.listQuery.pageIndex = res.current;
          that.total = res.total;
        })
        .catch(() => {
          that.loading = false;
        });
    },
    /**
     * 查询按钮事件
     */
    search() {
      this.listQuery.pageIndex = 1;
      this.tableData = [];
      this.getMainData();
    },
    /**
     * 每页数量改变事件
     */
    pagerSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.getMainData();
    },
    /**
     * 页码改变事件
     */
    pagerCurrentChange(pageIndex) {
      this.listQuery.pageIndex = pageIndex;
      this.getMainData();
    },

    /**
     * 1. 获取导出表格的数据
     * 2. 调用子组件的方法实现导出
     */
    getExportTableData(total) {
      const that = this;
      that.loading = true;
      that.listQuery.pageIndex = 1;
      that.listQuery.pageSize = total;
      list(that.listQuery)
        .then((res) => {
          that.$refs.fileTable.exportTable(res.records);
        })
        .finally(() => {
          that.loading = false;
        });
    },

    /**
     * 编辑/添加按钮点击事件
     */
    edit(data) {
      // data 为 null 时添加
      console.log(data);
      if (data == null) {
        this.editId = null;
        this.titleName = "新增设施设备";
      } else {
        this.editId = data.deviceId;
        this.titleName = "修改设施设备";
      }
      this.editShow = true;
    },

    editColse(data) {
      this.editShow = false;
      if (data.reload) {
        this.getMainData();
      }
    },

    /**
     * 编辑/添加按钮点击事件
     */
    repair(data) {
      // data 为 null 时添加
      if (data == null) {
        this.editId = null;
        this.titleName = "维修保养";
      } else {
        this.editId = data.deviceId;
        this.titleName = "维修保养";
      }
      this.repairShow = true;
    },

    repairClose(data) {
      this.repairShow = false;
      if (data.reload) {
        this.getMainData();
      }
    },

    look(data) {
      this.lookShow = true;
      this.editId = data.deviceId;
      this.titleName = "查看详情";
      if (data.reload) {
        this.getMainData();
      }
    },

    lookClose(data) {
      this.lookShow = false;
      if (data.reload) {
        this.getMainData();
      }
    },
    /**
     * 删除/批量删除事件
     */
    remove(data) {
      const that = this;
      let deleteData = [];
      if (data == null) {
        deleteData = that.multipleSelection;
      } else {
        deleteData.push(data);
      }
      console.log(deleteData);
      var ids = [];

      if (deleteData.length === 0) {
        that.$message({
          type: "warning",
          message: "请选择需要删除的数据!",
        });
        return;
      } else {
        deleteData.forEach((item) => {
          ids.push(item.roleId);
        });
      }
      this.$confirm("确认删除选中的" + deleteData.length + "条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;

          remove(ids)
            .then((res) => {
              that.$message({
                type: "success",
                message: "操作成功",
              });
              that.getMainData();
            })
            .finally(() => {
              that.loading = false;
              that.multipleSelection = [];
              that.$refs.fileTable.$refs.multipleTable.clearSelection();
            });
        })
        .catch(() => {
          // 取消删除
        });
    },
  },
};
</script>

<style lang="less" scoped>
.warnicon i {
  font-size: 60px;
  color: #ffb219;
  margin-right: 10px;
}
.headbox {
  display: flex;
  align-items: center;
  font-size: 14px;
  .headright {
    display: flex;
    &_box {
      margin: 0 30px;
    }
    .headright_box {
      margin: 0 20px;
      p {
        text-align: center;
      }
    }
  }
}

/deep/.topcard {
  margin-bottom: 20px;
}

.input-clong {
  width: 216px !important;
}

.block {
  height: calc(100vh - 290px);
  min-height: calc(100vh - 295px);
  overflow: auto;
}
</style>
