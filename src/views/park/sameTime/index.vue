<template>
  <div class="table-classic-wrapper">
    <el-card class="box-card topcard">
      <div class="headbox">
        <div class="warnicon">
          <i class="el-icon-warning"></i>
        </div>
        <div class="headright">
          <div class="headright_box">
            <p>{{ ledgerobj.gwaqCount ? ledgerobj.gwaqCount : 0 }}</p>
            <p>项目总数</p>
          </div>
          <div class="steps">
            <el-steps :active="2" align-center>
              <el-step title="步骤1" description="方案"></el-step>
              <el-step
                title="步骤2"
                description="这是一段很长很长很长的描述性文字"
              ></el-step>
              <el-step
                title="步骤3"
                description="这是一段很长很长很长的描述性文字"
              ></el-step>
              <el-step
                title="步骤4"
                description="这是一段很长很长很长的描述性文字"
              ></el-step>
            </el-steps>
          </div>
        </div>
      </div>
    </el-card>

    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model="listQuery.keyword"
          placeholder="项目名称、建设、设计、施工单位"
          class="input-with"
          @keyup.enter.native="search"
          clearable
        ></el-input>

        <el-select
          v-model="listQuery.nature"
          placeholder="项目性质"
          class="input-normal"
          clearable
        >
          <el-option
            v-for="item in natureList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="listQuery.type"
          placeholder="项目类型"
          class="input-normal"
          clearable
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="listQuery.safe"
          placeholder="安全许可证"
          class="input-normal"
          clearable
        >
          <el-option
            v-for="item in haveList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="listQuery.protect"
          placeholder="职业病防护"
          class="input-normal"
          clearable
        >
          <el-option
            v-for="item in haveList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="listQuery.fire"
          placeholder="消防设施"
          class="input-normal"
          clearable
        >
          <el-option
            v-for="item in haveList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="listQuery.lighting"
          placeholder="防雷装置"
          class="input-normal"
          clearable
        >
          <el-option
            v-for="item in haveList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="listQuery.environment"
          placeholder="生态环境保护设施"
          class="input-normal"
          clearable
        >
          <el-option
            v-for="item in haveList"
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
      custom-label-width="200px"
      custom1-label="安全设施"
      custom1-label-width="100px"
      custom2-label="职业病防护"
      custom2-label-width="100px"
      custom3-label="消防设施"
      custom3-label-width="100px"
      custom4-label="防雷装置"
      custom4-label-width="100px"
      custom5-label="生态环境保护设施"
      custom5-label-width="100px"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
      :row-key="rowKey"
      :onResizeHeight="118"
    >
      <myHandle>
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
    </myTable>

    <edit
      v-if="editShow"
      :visible="editShow"
      :id="editId"
      :title="titleName"
      @close="editClose"
    />
  </div>
</template>
<script>
import { list, ledger, detail, remove } from "@/api/park/sameTime";

import edit from "./edit";
export default {
  components: { edit },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      pageOper: this.getPageOper(this.$route),
      ledgerobj: {},
      loading: false,
      checked: [
        { key: "建设单位", val: "build" },
        { key: "项目名称", val: "name" },
        { key: "项目性质", val: "nature" },
        { key: "项目类型", val: "type" },
        { key: "项目状态", val: "state" },
        {
          key: "用地面积（㎡）",
          val: "area",
          align: "center",
          width: "150px",
        },
      ],
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      total: 0,
      listQuery: {
        environment: null,
        lighting: null,
        fire: null,
        protect: null,
        safe: null,
        type: null,
        nature: null,
        keyword: null,
        pageIndex: 1,
        pageSize: 10,
      },
      editShow: false,
      editId: null,
      titleName: null,
      typeList: [],

      natureList: [],
      stateList: [],
      materialList: [],
      unitTypeList: [],
      haveList: [],
    };
  },
  async created() {
    await this.getlist();
    await this.getledger();
  },
  methods: {
    rowKey(row) {
      return row.institutionId;
    },
    multiple(e) {
      // console.log(e);
      this.multipleSelection = e;
    },
    getlist() {
      const that = this;
      this.loading = true;
      detail()
        .then((res) => {
          this.natureList = res.natureList;
          this.stateList = res.stateList;
          this.materialList = res.materialList;
          this.unitTypeList = res.unitTypeList;
          this.haveList = res.haveList;
          this.typeList = res.typeList;
        })
        .finally(() => {
          that.loading = false;
        });

      list(this.listQuery)
        .then((res) => {
          that.loading = false;
          that.tableData = res.records;
          that.listQuery.pageSize = res.size;
          that.listQuery.pageIndex = res.current;
          that.total = res.total;
          console.log(res);
        })
        .catch(() => {
          that.loading = false;
        });
    },

    getledger() {
      ledger().then((res) => {
        this.ledgerobj = res;
      });
    },
    /**
     * 查询按钮事件
     */
    search() {
      this.listQuery.pageIndex = 1;
      this.tableData = [];
      this.getlist();
    },

    /**
     * 编辑/添加按钮点击事件
     */
    edit(data) {
      if (data && data.regulationId) {
        this.editId = data.regulationId;
        this.titleName = "编辑三同时";
      } else {
        this.editId = null;
        this.titleName = "新增三同时";
      }
      this.editShow = true;
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
    /**
     * 关闭编辑页面
     */
    editClose(data) {
      this.editShow = false;
      if (data.reload) {
        this.getlist();
      }
    },
    /**
     * 每页数量改变事件
     */
    pagerSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.getlist();
    },
    /**
     * 页码改变事件
     */
    pagerCurrentChange(pageIndex) {
      this.listQuery.pageIndex = pageIndex;
      this.getlist();
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
  },
};
</script>

<style scoped lang="less">
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
      margin: 0 20px;
    }
    .headright_box {
      margin: 0 20px;
      p {
        text-align: center;
      }
    }
  }
}
.headright_box > :nth-child(1) {
  font-size: 18px;
  font-weight: 600;
}
/deep/.topcard {
  margin-bottom: 20px;
}
.input-with {
  width: 280px !important;
}
.fileName {
  color: rgb(30, 119, 235);
}
/deep/.stateIcon {
  width: 10px;
  height: 10px;
  display: inline-block;
  border-radius: 100%;
  background: transparent;
  margin-right: 5px;
}
</style>
