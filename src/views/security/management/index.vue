<template>
  <div class="table-classic-wrapper">
    <el-card class="box-card topcard">
      <div class="headbox">
        <div class="warnicon">
          <i class="el-icon-warning "></i>
        </div>
        <div class="headright">
          <div class="headright_box">
            <p>{{ ledgerobj.institutionNum ? ledgerobj.institutionNum : 0 }}</p>
            <p>安全生产管理制度总数</p>
          </div>
          <div class="headright_box">
          <p>{{ ledgerobj.integrity ? ledgerobj.integrity : 0.0 }}</p>
          <p>必备资料完整度</p>
        </div>
        </div>

      </div>
    </el-card>
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model="listQuery.keyword"
          placeholder="输入岗位名称、姓名、关键词，回车检索"
          class="input-with"
          @keyup.enter.native="search"
          clearable
        ></el-input>

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
      custom-label-width="120px"
      custom1-label="制度文件"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
      :row-key="rowKey"
      :onResizeHeight="118"
    >
        
      <template slot="custom1" slot-scope="scope">
        <span class="fileName" @click="openfile(scope.data.row)">{{
          scope.data.row.fileName
        }}</span>
      </template>

      <template slot="custom" slot-scope="scope">
        <myHandle>
          <span v-if="pageOper.XG" title="编辑" @click="edit(scope.data.row)">
            编辑
          </span>
          <span v-if="pageOper.SC" title="删除" @click="remove(scope.data.row)">
            删除
          </span>
        </myHandle>
      </template>

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
import { list, ledger, del } from "@/api/security/management";
import edit from "./edit";
export default {
  components: { edit },
  data() {
    return {
      pageOper: this.getPageOper(this.$route),
      ledgerobj: {},
      loading: false,
      checked: [
        { key: "制度名称", val: "institutionName" },
        {
          key: "是否必备",
          val: "isEssential",
          align: "center",
          width: "100px"
        },
        {
          key: "发布日期",
          val: "releaseDate",
          align: "center",
          width: "150px"
        },
        {
          key: "最后修订日期",
          val: "lastRevisionDate",
          align: "center",
          width: "150px"
        }
      ],
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      total: 0,
      listQuery: {
        keyword: null,
        pageIndex: 1,
        pageSize: 10
      },
      editShow: false,
      editId: null,
      titleName: null
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
      list(this.listQuery)
        .then(res => {
          that.loading = false;
          that.tableData = res.records;
          that.listQuery.pageSize = res.size;
          that.listQuery.pageIndex = res.current;
          that.total = res.total;
          that.tableData.forEach(ele => {
            ele.lastRevisionDate = ele.sysEntInstitutionFile.lastRevisionDate;
            ele.releaseDate = ele.sysEntInstitutionFile.releaseDate;
            ele.fileName = ele.sysEntInstitutionFile.fileName;
          });
          console.log(res);
        })
        .catch(() => {
          that.loading = false;
        });
    },
    getledger() {
      ledger().then(res => {
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
      if (data && data.institutionId) {
        this.editId = data.institutionId;
        this.titleName = "编辑制度";
      } else {
        this.editId = null;
        this.titleName = "新增制度";
      }
      this.editShow = true;
    },
    //删除
    remove(data) {
      const that = this;
      let deleteData = [];
      if (data == null) {
        deleteData = that.multipleSelection;
      } else {
        deleteData.push(data);
      }
      var ids = [];

      if (deleteData.length === 0) {
        that.$message({
          type: "warning",
          message: "请选择需要删除的数据!"
        });
        return;
      } else {
        deleteData.forEach(item => {
          ids.push(item.institutionId);
        });
      }
      this.$confirm("确认删除选中的" + deleteData.length + "条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;

          del(ids)
            .then(res => {
              that.$message({
                type: "success",
                message: "操作成功"
              });
              that.getlist();
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
        .then(res => {
          that.$refs.fileTable.exportTable(res.records);
        })
        .finally(() => {
          that.loading = false;
        });
    },
    //打开文件
    openfile(data) {
      window.open(data.sysEntInstitutionFile.fileUrl);
    }
  }
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
    .headright_box{
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
</style>
