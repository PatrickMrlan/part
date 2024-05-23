<template>
  <div class="table-classic-wrapper">
    <!-- 操作栏 -->
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <div class="right">
          <el-button
            v-if="pageOper.TJ"
            type="primary"
            icon="el-icon-plus"
            @click="edit(null)"
            >添加</el-button
          >
        </div>
      </div>
    </div>

    <el-table
      ref="refTable"
      v-loading="loading"
      :data="menuList"
      style="width: 100%"
      row-key="id"
      default-expand-all
      border
      :header-cell-style="{ height: '30px !important', fontSize: '14px' }"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      select-on-indeterminate
      :height="screenHeight"
    >
      <el-table-column prop="title" label="网格名称" min-width="180" />
      <!-- <el-table-column prop="title" label="网格员" min-width="180" /> -->
      <el-table-column
        prop="gridState"
        width="120"
        label="网格状态"
        align="center"
      />

      <el-table-column prop="sort" label="排序" width="100" align="center" />

      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="160"
        class="app-table-oper"
      >
        <template slot-scope="scope">
          <myHandle>
            <span
              v-if="pageOper.XG"
              title="添加子级"
              @click="addGrid(scope.row)"
            >
              添加子级
            </span>
            <span v-if="pageOper.XG" title="编辑" @click="edit(scope.row)">
              编辑
            </span>
            <span v-if="pageOper.SC" title="删除" @click="remove(scope.row)">
              删除
            </span>
          </myHandle>
        </template>
        <edit
          v-if="editShow"
          :id="editId"
          :pid="pid"
          :visible="editShow"
          :title="titleName"
          @close="editClose"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { list, remove } from "@/api/park/grid";
import edit from "./edit.vue";

export default {
  name: "Table",
  components: { edit },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      // 数据列表加载动画
      loading: false,
      gridStateList: [],
      menuList: [],
      appList: [],
      // 新增/修改 标题
      titleName: null,
      // 筛选列

      // 查询列表参数对象
      listQuery: {
        parkId:null,
        keyword: null,
        pageIndex: 1,
        auditStatus: null,
        pageSize: 10
      },
      total: 0,
      // 表格数据数组
      tableData: [],
      tableStamp: 0,
      // 多选数据暂存数组
      multipleSelection: [],
      editId: null,
      editShow: false,
      pid: null,
      screenHeight: null,
      loginUser:{}
    };
  },
  async created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    if (this.loginUser.sysPark) {
      this.listQuery.parkId = this.loginUser.sysPark.parkId;
    } else {
      this.$message({
        type: "warning",
        message: "当前用户暂无园区!",
      });
    }
    await this.getMainData();
  },

  methods: {
    /**
     * 新增
     */
    addGrid(data) {
      this.pid = data.id;
      this.editId = null;
      this.editShow = true;
      this.titleName = "新增网格管理";
    },
    /**
     * 添加/编辑
     */
    edit(data) {
      if (data) {
        this.editId = data.id;
        this.titleName = "编辑网格管理";
      } else {
        this.editId = null;
        this.titleName = "添加网格管理";
      }
      this.editShow = true;
    },

    editClose(data) {
      this.editShow = false;
      if (data.reload) {
        this.getMainData();
      }
    },
    onResize() {
      this.screenHeight = window.innerHeight;
      const h = this.$refs.appRowHeight.offsetHeight;
      this.screenHeight = this.screenHeight - h - 128;
    },
    rowKey(row) {
      return row.id;
    },
    multiple(e) {
      this.multipleSelection = e;
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
     * 分页数据加载
     */
    getMainData() {
      this.loading = true;
      this.appList.forEach(item => {
        if (this.appId == item.id) {
          this.appName = item.appName;
        }
      });
      list(this.listQuery)
        .then(res => {
          console.log(res);
          this.loading = false;
          this.appList = res.appList;
          this.gridStateList = res.gridStateList;

          this.appName = this.appName || this.appList[0].appName;
          res.menuList.forEach(item => {
            item.level = 1;
            item.isLeaf = false;
            if (item.children == 0) {
              item.empty = true;
            }
            if (item.children.length > 0) {
              item.children.forEach(child1 => {
                child1.level = 2;
                child1.isLeaf = false;
                if (child1.children.length > 0) {
                  child1.children.forEach(child2 => {
                    child2.level = 3;
                    if (child2.children && child2.children.length > 0) {
                      child2.isLeaf = false;
                    } else {
                      child2.isLeaf = true;
                    }
                  });
                } else {
                  child1.isLeaf = true;
                }
              });
            } else {
              item.isLeaf = true;
            }
          });
          this.menuList = res.menuList;
          // this.menuList.forEach((app) => {
          //   app.children = app.menuList;
          //   app.name = app.appName;
          // });
        })
        .catch(() => {
          this.loading = false;
        });
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
        .then(res => {
          that.$refs.fileTable.exportTable(res.records);
        })
        .finally(() => {
          that.loading = false;
        });
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
          message: "请选择需要删除的数据!"
        });
        return;
      } else {
        deleteData.forEach(item => {
          ids.push(item.id);
        });
      }
      this.$confirm("确认删除选中的" + deleteData.length + "条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;

          remove(ids)
            .then(res => {
              that.$message({
                type: "success",
                message: "操作成功"
              });
              that.getMainData();
            })
            .finally(() => {
              that.loading = false;
              that.multipleSelection = [];
              that.$refs.refTable.$refs.multipleTable.clearSelection();
            });
        })
        .catch(() => {
          // 取消删除
        });
    }
  }
};
</script>

<style lang="less" scoped>
.img {
  text-align: left;
}
/deep/.img > p > img {
  margin-left: 10px;
  width: 90px;
  height: 90px;
  object-fit: cover;
}
.flex {
  display: flex;
  justify-content: space-between;
}
</style>
