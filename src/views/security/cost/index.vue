<template>
  <div class="table-classic-wrapper">
    <el-card class="box-card topcard">
      <div class="headbox">
        <div class="warnicon">
          <i class="el-icon-warning "></i>
        </div>
        <div class="headright">
          <div class="headright_box">
            <p>{{ ledgerobj.allPlan ? ledgerobj.allPlan : 0 }}</p>
            <p>计划投入总计（元）</p>
          </div>
          <div class="headright_box">
            <p>{{ ledgerobj.allExtract ? ledgerobj.allExtract : 0 }}</p>
            <p>提取金额总计（元）</p>
          </div>
          <div class="headright_box">
            <p>{{ ledgerobj.allReality ? ledgerobj.allReality : 0 }}</p>
            <p>实际支出总计（元）</p>
          </div>
          <div class="headright_box">
            <p>{{ ledgerobj.allPayProportion ? ledgerobj.allPayProportion : 0 }}</p>
            <p>支出占比（%）</p>
          </div>
          <div class="headright_box">
            <el-button type="text" style="font-size: 13px; text-align: right; color:dodgerblue;" @click="getCostFile">参考依据：《企业安全生产费用提取和使用管理办法》（财资〔2020〕136 号）》点击查看 </el-button>
          </div>
        </div>
      </div>
    </el-card>
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        
        <el-select v-model="listQuery.costYear" 
          placeholder="请选择年份" 
          class="input-normal" 
          clearable
          filterable
        >
          <el-option v-for="item in enumList.planYearList" 
          :key="item" 
          :label="item" 
          :value="item" 
          />
        </el-select>

        <el-select v-model="listQuery.status" 
          placeholder="请选择达标情况" 
          class="input-normal" 
          clearable
        >
          <el-option v-for="item in enumList.complianceStatusList" 
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
      custom1-label="达标情况"
      custom1-label-width="100px"
      custom2-label="明细记录"
      custom2-label-width="200px"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
      :row-key="rowKey"
      :onResizeHeight="118"
    >
    <template slot="custom1" slot-scope="scope">
        <div>
          <i
            class="stateIcon"
            :style="{
              backgroundColor:
                scope.data.row.complianceStatus == '低于'
                  ? '#92ce77'
                  : scope.data.row.complianceStatus == '高于'
                  ? '#fac858'
                  : scope.data.row.complianceStatus == '持平'
                  ? '#40E0C3'
                  : 'transparent',
            }"
          />{{ scope.data.row.complianceStatus }}
        </div>
      </template>
      <template slot="custom2" slot-scope="scope">
        <myHandle>
          <span v-if="pageOper.XG" title="上传" @click="upFile(scope.data.row)">
            上传
          </span>
          <span v-if="pageOper.CX && scope.data.row.fileUrl" title="查看" @click="preview(scope.data.row)">
            查看
          </span>
        </myHandle>
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
    <upFile
      v-if="upFileShow"
      :visible="upFileShow"
      :id="sourceId"
      :title="titleName"
      @close="upFileClose"
    />
  </div>
</template>
<script>
import { list, ledger, del ,enumList} from "@/api/security/cost";
import edit from "./edit";
import upFile from "./upFile";
export default {
  components: { edit,upFile },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      pageOper: this.getPageOper(this.$route),
      ledgerobj: {},
      loading: false,
      checked: [
        { key: "年份", val: "costYear" },
        { key: "计划投入（元）", val: "paLnInvest" },
        { key: "提取金额（元）", val: "extractAmount" },
        { key: "实际支出（元）", val: "realityPay" },
        { key: "支出占比", val: "payProportion" },
      ],
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      total: 0,
      listQuery: {
        keyword: null,
        pageIndex: 1,
        pageSize: 10,
        costYear: null,
        status: null,
      },
      editShow: false,
      editId: null,
      titleName: null,
      enumList:[],
      upFileShow:false,
      sourceId:null,
    };
  },
  async created() {
    await this.getlist();
    await this.getledger();
    await this.getenumList();
  },
  methods: {
    getCostFile(){
      let random = Math.floor(Math.random() * 10000 + 1);
      console.log(random);
      window.open(
        this.baseURL + "/static/templates/财资〔2022〕136号 企业安全生产费用提取和使用管理办法.doc?id=" + random
      );
    },
    preview(data){
      window.open(this.baseURL + data.fileUrl);
    },
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
    getenumList() {
      const that = this
      enumList().then(res => {
        that.enumList = res;
        that.depList= res.sysDepartmentList;
      })
    },
   

    /**
     * 编辑/添加按钮点击事件
     */
    edit(data) {
      if (data && data.costId) {
        this.editId = data.costId;
        this.titleName = "编辑费用";
      } else {
        this.editId = null;
        this.titleName = "新增费用";
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
          ids.push(item.costId);
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
        this.getledger();
      }
    },
    upFile(data) {
      this.sourceId = data.costId;
      // console.log(this.sourceId);
      this.titleName = "上传明细";
      this.upFileShow = true;
    },
    upFileClose(data) {
      this.upFileShow = false;
      this.getlist();
      this.getledger();
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
