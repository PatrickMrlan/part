<template>
  <div class="table-classic-wrapper">
    <el-col :span="6">
      <div class="block">
        <div class="title app-row">
          <div class="flex">标准分类</div>
          <div class="unflex">
            <i
              v-if="pageOper.TJ"
              class="el-icon-plus"
              @click="editClassification(null, 'add')"
            />
          </div>
        </div>
        <div class="content">
          <el-tree
            v-loading="treeLoading"
            :key="timeStamp"
            :data="treeList"
            node-key="id"
            highlight-current
            :default-expand-all="false"
            :expand-on-click-node="false"
            :current-node-key="nowIndex"
            @node-click="nodeClick"
          >
            <span
              slot-scope="{ data }"
              class="app-tree-node"
              @mouseenter="mouseenter(data)"
              @mouseleave="mouseleave(data)"
            >
              <span :title="data.name" class="node-text">{{ data.name }}</span>
              <span v-show="data.isTreeSelect">
                <i
                  class="el-icon-plus"
                  @click="editClassification(data, 'add')"
                >
                </i>
                <i
                  class="el-icon-edit"
                  @click="editClassification(data, 'edit')"
                >
                </i>
                <i class="el-icon-delete" @click="removeClassification(data)">
                </i>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </el-col>
    <el-col :span="18">
      <standardTable ref="standardTable" />
    </el-col>

    <editClassification
      v-if="editClassificationShow"
      :title="titleName"
      :id="editId"
      :type="editType"
      @close="editClose"
    />
  </div>
</template>

<script>
import { removeCategory, listCategory } from "@/api/hazard/standard";

import editClassification from "./editClassification.vue";
import standardTable from "./standardTable.vue";

export default {
  components: { editClassification, standardTable },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      treeLoading: false,
      timeStamp: 0,
      editClassificationShow: false,
      titleName: null,
      editType: null,
      editId: null,

      treeList: [],
      enumList: {},
      nowIndex: null,
    };
  },
  created() {
    this.getTree();
  },
  methods: {
    /**
     * 树形数据
     */
    getTree() {
      this.treeLoading = true;
      listCategory()
        .then((res) => {
          this.treeList = res;
          if (this.treeList.length) {
            this.nowIndex = this.treeList[0].id;
            this.$refs.standardTable.listQuery.categoryId = this.nowIndex;
          }
          this.timeStamp = new Date().getTime();
          this.$refs.standardTable.getMainData();
        })
        .finally(() => {
          this.treeLoading = false;
        });
    },

    nodeClick(data) {
      this.$refs.standardTable.listQuery.categoryId = data.id;
      this.$refs.standardTable.getMainData();

    },

    mouseenter(data) {
      data.isTreeSelect = true;
    },
    mouseleave(data) {
      data.isTreeSelect = false;
    },

    /**
     * 删除树
     */
    removeClassification(data) {
      const that = this;
      let deleteData = [data.id];

      this.$confirm("确认删除选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.treeLoading = true;
          removeCategory(deleteData)
            .then((res) => {
              that.$message({
                type: "success",
                message: "操作成功",
              });
              that.getTree();
            })
            .finally(() => {
              that.treeLoading = false;
            });
        })
        .catch(() => {
          // 取消删除
        });
    },

    editClassification(data, type) {
      if (data) {
        if (type == "add") {
          this.titleName = "添加分类";
        } else if (type == "edit") {
          this.titleName = "编辑分类";
        }
        this.editId = data.id;
        this.editType = type;
      } else {
        this.titleName = "添加分类";
        this.editId = null;
        this.editType = null;
      }

      this.editClassificationShow = true;
    },

    /**
     * 关闭编辑页面
     */
    editClose(data) {
      if (data.reload) {
        if (data.type == "tree") this.getTree();
      }
      this.editClassificationShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.block {
  height: calc(100vh - 170px);
  min-height: calc(100vh - 175px);
  overflow: auto;
}

.app-tree-node {
  display: flex;
  align-items: center;
  padding-right: 8px;
  width: 100%;
  i {
    font-size: 12px;
    display: flex;
    align-items: center;
  }
}
/deep/.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background: rgb(0, 110, 255) !important;
  i:hover {
    color: #fff;
  }
}
</style>
