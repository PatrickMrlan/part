<template>
  <div class="table-classic-wrapper">
  
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">

        <el-input
          v-model="listQuery.keyword"
          placeholder="输入事故原因进行检索"
          class="input-long"
          clearable
          @keyup.enter.native="search"
        />
        <el-select v-model="listQuery.accidentType" 
          placeholder="请选择事故类型" 
          class="input-normal" 
          clearable
        >
          <el-option v-for="item in enumList.accidentTypeList" 
          :key="item.value" 
          :label="item.key" 
          :value="item.value" 
          />
        </el-select>

        <el-select v-model="listQuery.accidentLevel" 
          placeholder="请选择事故等级" 
          class="input-normal" 
          clearable
        >
          <el-option v-for="item in enumList.accidentLevelList" 
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
          :type="'confirm'"
          icon="el-icon-plus"
          @click.native="edit(null)"
          >添加</myButton
        >
        <myButton
          v-if="pageOper.SC"
          :type="'confirm'"
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
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
      :row-key="rowKey"
      :onResizeHeight="118"
    >
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
import { list,  del ,enumList} from "@/api/security/accident";
import edit from "./edit";
export default {
  components: { edit},
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      pageOper: this.getPageOper(this.$route),
      ledgerobj: {},
      loading: false,
      checked: [
        { key: "关联企业", val: "enName" },
        { key: "发生时间", val: "occurTime" , align: 'center', width: '200px'},
        { key: "事故原因", val: "accidentReason" },
        { key: "事故类型", val: "accidentType" , align: 'center'},
        { key: "事故等级", val: "accidentLevel", align: 'center' },
        { key: "死亡人数", val: "deathNum" , align: 'center', width: '100px'},
        { key: "重伤人数", val: "seriousInjuryNum" , align: 'center', width: '100px'},
        { key: "轻伤人数", val: "minorWoundNum" , align: 'center', width: '100px'},
        { key: "损失金额（元）", val: "damagesAmount" ,  width: '120px'},
      
      ],
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      total: 0,
      listQuery: {
        keyword: null,
        pageIndex: 1,
        pageSize: 10,
        accidentType: null,
        accidentLevel: null,
      },
      editShow: false,
      editId: null,
      titleName: null,
      enumList:[],
    };
  },
  async created() {
    await this.getlist();
    await this.getenumList();
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
          console.log(res);
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
      this.getlist();
    },
    getenumList() {
      const that = this
      enumList().then(res => {
        that.enumList = res;
      })
    },
   

    /**
     * 编辑/添加按钮点击事件
     */
    edit(data) {
      if (data && data.accidentId) {
        this.editId = data.accidentId;
        this.titleName = "编辑事故";
      } else {
        this.editId = null;
        this.titleName = "新增事故";
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
          ids.push(item.accidentId);
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
/deep/.stateIcon {
  width: 10px;
  height: 10px;
  display: inline-block;
  border-radius: 100%;
  background: transparent;
  margin-right: 5px;
}
</style>
