<template>
  <div class="table-classic-wrapper">
    <div class="header" ref="header">
      <div class="title">
        <i class="el-icon-back" @click="back" />
        <span>机构设置</span>
      </div>
      <myButton
        :type="'confirm'"
        icon="el-icon-plus"
        v-show="activeName == 'first'"
        @click.native="association"
        >选择关联机构</myButton
      >
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
      <el-tab-pane label="上级机构" name="first" class="tabs">
        <myTable
          ref="fileTable"
          :show-index="true"
          :checked="checked"
          :loading.sync="loading"
          :table-data="tableData"
          export-file-name="角色管理"
          custom-label="操作"
          custom-label-width="160px"
          :row-key="rowKey"
          @change="multiple"
          :onResizeHeight="320"
          exportFileName="上级机构"
        >
          <template slot="custom" slot-scope="scope">
            <myHandle>
              <span
                title="解除关联"
                v-if="scope.data.row.associationStatus !== '已关联'"
                @click="associated(scope.data.row, 0)"
              >
                取消关联
              </span>
              <span
                title="确认关联"
                @click="associated(scope.data.row, 1)"
                v-else
              >
                确认关联
              </span>
              <span
                title="删除关联"
                @click="associated(scope.data.row, null)"
              >
                删除关联
              </span>
            </myHandle>
          </template>
        </myTable>
      </el-tab-pane>
      <el-tab-pane label="下级机构" name="second" class="tabs">
        <myTable
          ref="fileTable1"
          :show-index="true"
          :checked="checked"
          :loading.sync="loading"
          :table-data="tableData"
          custom-label="操作"
          custom-label-width="120px"
          :row-key="rowKey"
          @change="multiple"
          :onResizeHeight="320"
          exportFileName="下级机构"
        >
          <template slot="custom" slot-scope="scope">
            <myHandle>
              <span
                title="解除关联"
                v-if="scope.data.row.associationStatus == '已关联'"
                @click="associated(scope.data.row, 0)"
              >
                解除关联
              </span>
              <span
                title="确认关联"
                @click="associated(scope.data.row, 1)"
                v-else
              >
                确认关联
              </span>
              <span
                title="删除关联"
                @click="associated(scope.data.row, null)"
              >
                删除关联
              </span>
            </myHandle>
          </template>
        </myTable>
      </el-tab-pane>
    </el-tabs>

    <associationtable
      v-if="associationShow"
      @close="associationClose"
      @pushtable="pushtable"
    />
  </div>
</template>

<script>
import { subEnt, parentEnt, associated } from "@/api/system/enterprise";
import associationtable from "./associationtable";
export default {
  components: { associationtable },
  data() {
    return {
      activeName: "first",
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      // 数据列表加载动画
      loading: false,
      // 数据列表
      tableData: [],
      // 数据总数
      total: 0,
      // 查询列表参数对象
      listQuery: {
        entId: JSON.parse(sessionStorage.getItem("loginUser") || "{}").entId,
        pageIndex: 1,
        pageSize: 10
      },
      checked: [
        { key: "机构名称", val: "entName" },
        { key: "机构代码", val: "entCode" },
        {
          key: "统一社会信用代码",
          val: "entCode",
          align: "center",
          width: "150px"
        },
        { key: "行政区划", val: "district", align: "center" },
        { key: "法人", val: "legalPersonName", align: "center" },
        { key: "联系电话", val: "legalPersonPhone", align: "center" },
        { key: "关联状态", val: "associationStatus", align: "center" }
      ],
      associationShow: false
    };
  },
  async created() {
    await this.getMainData();
  },
  methods: {
    rowKey(row) {
      return row.entId;
    },
    multiple(e) {
      this.multipleSelection = e;
    },
    handleClick(tab, event) {
      this.listQuery.pageIndex = 1;
      this.getMainData();
    },
    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this;
      this.loading = true;
      if (this.activeName == "first") {
        //上级机构
        parentEnt(that.listQuery)
          .then(res => {
            that.loading = false;
            that.tableData = res;
          })
          .catch(() => {
            that.loading = false;
          });
      } else if (this.activeName == "second") {
        subEnt(that.listQuery)
          .then(res => {
            that.loading = false;
            that.tableData = res;
          })
          .catch(() => {
            that.loading = false;
          });
      }
    },
    back() {
      this.$router.push({
        path: "/security/institution/index",
        query: {
          name: "机构设置"
        }
      });
    },
    association() {
      this.associationShow = true;
    },
    associationClose() {
      this.associationShow = false;
    },
    pushtable(data) {
      const hasDuplicates = this.tableData.some(value => {
        return data.entId === value.entId;
      });
      if (hasDuplicates) {
        return this.$message({
          message: "该机构已存在！",
          type: "warning"
        });
      } else {
        this.tableData.push(data);
      }
    },
    associated(data, value) {
      console.log(data);
      const that = this;
      this.loading = true;
      associated({ id: data.entId, value: value })
        .then(res => {
          that.loading = false;
          that.$message({
            message: "操作成功",
            type: "success"
          });
          this.getMainData();
        })
        .catch(() => {
          that.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scope>
.tabs {
  padding: 6px;
  box-sizing: border-box;
}
.header {
  box-sizing: border-box;
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
  .title {
    height: 30px;
    font-size: 20px;
    font-family: "Microsoft YaHei, Microsoft YaHei";
    font-weight: bold;
    color: #006cfb;
    i {
      font-weight: bold;
      margin-right: 5px;
      cursor: pointer;
    }
  }
}
</style>
