<template>
  <div class="table-classic-wrapper">
    <el-row :gutter="20">
      <el-col :span="24">
        <div ref="appRowHeight" class="appRowHeight">
          <div class="app-list-control app-row">
            <div />
            <div class="right">
              <myButton
                v-if="pageOper.TJ"
                :type="'confirm'"
                icon="el-icon-plus"
                @click.native="editMenu(null)"
                >添加
              </myButton>
            </div>
          </div>
        </div>
        <div class="content">
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
            @row-click="clickTable"
          >
            <el-table-column prop="name" label="菜单名称" min-width="180" fixed>
              <template slot-scope="scope">
                <span :style="{ marginLeft: scope.row.empty ? '22px' : '' }">{{
                  scope.row.name
                }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="name"
              label="菜单类型"
              align="left"
              min-width="120"
              sortable
            /> -->
            <el-table-column
              prop="address"
              label="图标"
              align="center"
              width="70"
            >
              <template slot-scope="scope">
                <div class="icon" style="text-align: center">
                  <i :class="scope.row.icon" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="menuUrl" min-width="180" label="路径" />
            <el-table-column
              prop="sort"
              label="排序"
              width="100"
              align="center"
            />
            <el-table-column
              label="权限配置"
              width="100"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <myHandle
                  v-if="scope.row.isLeaf"
                  title="权限配置"
                  @click.stop.native="permissionDeploy(scope.row)"
                  >权限配置
                </myHandle>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              fixed="right"
              width="150"
              class="app-table-oper"
            >
              <template slot-scope="scope">
                <myHandle>
                  <span
                    v-if="pageOper.TJ"
                    :style="{
                      visibility: scope.row.level < 3 ? 'visible' : 'hidden'
                    }"
                    title="添加"
                    @click.stop="addMenu(scope.row)"
                    >添加</span
                  >
                  <span
                    v-if="pageOper.XG"
                    title="编辑"
                    @click.stop="editMenu(scope.row)"
                  >
                    编辑
                  </span>
                  <span
                    v-if="pageOper.SC"
                    title="删除"
                    @click.stop="deleteMenu(scope.row)"
                  >
                    删除
                  </span>
                </myHandle>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <edit
      v-if="editShow"
      :id="editId"
      :title="titleName"
      :pnode="selectNode"
      :pid="pid"
      :app-id="appId"
      :app-name="appName"
      @close="editColse"
    />
    <permission
      v-if="permissionShow"
      :menu-id="permissionId"
      :title="titleName"
      :pnode="selectNode"
      :pid="pid"
      @close="permissionColse"
    />
  </div>
</template>

<script>
import { treeList, menuRemove } from "../../../api/menu";
import { Message } from "element-ui";
import edit from "./edit";
import permission from "./permission";

export default {
  name: "Table",
  components: { edit, permission },
  data() {
    return {
      // 新增/修改 标题
      titleName: null,
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,
      editShow: false,
      appId: null,
      appList: [],
      menuList: [],
      selectNode: null,
      editId: null,
      selectNodeOperList: [],
      pid: null,
      permissionShow: false,
      permissionId: null,
      screenHeight: null
    };
  },
  mounted() {
    this.getMainData();
    this.onResize();
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      this.screenHeight = window.innerHeight - 210;
      const h = this.$refs.appRowHeight.offsetHeight;
    },
    getMainData() {
      this.loading = true;
      // this.appList.forEach((item) => {
      //   if (this.appId == item.id) {
      //     this.appName = item.appName;
      //   }
      // });
      treeList({ appId: null })
        .then(res => {
          this.loading = false;
          this.appList = res.appList;
          this.appId = this.appId || this.appList[0].id;
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
     * 编辑页关闭事件
     */
    editColse(data) {
      this.editShow = false;
      if (data.reload) {
        this.getMainData();
      }
    },
    /**
     * 新增
     */
    addMenu(data) {
      this.pid = null;
      if (data) {
        this.pid = data.id;
      }
      this.selectNode = null;
      this.editId = null;
      this.editShow = true;
      this.titleName = "新增菜单管理";
    },
    /**
     * 编辑/修改
     */
    editMenu(data) {
      this.selectNode = null;
      this.editId = null;
      this.pid = null;
      if (data) {
        this.selectNode = data;
        this.editId = data.id;
        this.pid = data.pid;
        this.titleName = "修改菜单管理";
      } else {
        this.titleName = "新增菜单管理";
      }
      this.editShow = true;
    },
    /**
     * 删除
     */
    deleteMenu(data) {
      this.$confirm("确认删除" + data.name + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          menuRemove([data.id])
            .then(res => {
              this.loading = false;
              Message({
                type: "success",
                message: "操作成功"
              });
              this.getMainData();
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          // 取消删除
        });
    },
    /**
     * 权限配置
     */
    permissionDeploy(data) {
      console.log(data);
      const that = this;
      that.titleName = "操作权限配置";
      that.permissionId = data.id;
      that.permissionShow = true;
    },
    permissionColse(data) {
      this.permissionShow = false;
      if (data.reload) {
        this.getMainData();
      }
    },
    clickTable(row) {
      this.$refs.refTable.toggleRowExpansion(row);
    }
  }
};
</script>

<style lang="less" scoped>
.table-classic-wrapper {
  .content {
    box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  }

  .appRowHeight {
    display: flex;
    font-size: 14px;
    justify-content: left;
    align-items: center;
  }

  .app-list-control {
    display: flex;
    align-items: center;
  }

  .el-card {
    min-height: 656px;
  }

  .control-btns {
    margin-bottom: 20px;
  }

  .search-form {
    padding-top: 18px;
    margin-bottom: 15px;
    background-color: #f7f8fb;
  }

  .el-table thead {
    font-weight: 600;

    th {
      background-color: #f2f3f7;
    }
  }

  .upload-box,
  .export-data {
    width: 300px;
    margin: 0 auto 30px;
  }

  .upload-box {
    width: 156px;

    .files-upload {
      color: #20a0ff;
    }
  }

  .hints {
    font-size: 12px;
    color: #aaa;
    text-align: center;
  }
}

/deep/.el-table__row {
  cursor: pointer;
}
</style>
