<template>
  <div class="table-classic-wrapper">
    <el-card class="box-card topcard">
      <div class="headbox">
        <div class="warnicon">
          <i class="el-icon-warning "></i>
        </div>
        <div class="headright">
          <div class="headright_box">
            <p>{{ ledgerobj.gwaqCount ? ledgerobj.gwaqCount : 0 }}</p>
            <p>岗位安全生产操作规程</p>
          </div>
          <div class="headright_box">
            <p>{{ ledgerobj.zywsCount ? ledgerobj.zywsCount : 0 }}</p>
            <p>职业卫生操作规程</p>
          </div>
          <div class="headright_box">
            <p>{{ ledgerobj.inEffectCount ? ledgerobj.inEffectCount : 0 }}</p>
            <p>生效中</p>
          </div>
          <div class="headright_box">
            <p>{{ ledgerobj.expiredCount ? ledgerobj.expiredCount : 0 }}</p>
            <p>已失效</p>
          </div>
        </div>
      </div>
    </el-card>
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model="listQuery.keyword"
          placeholder="输入规章名称，回车检索"
          class="input-with"
          @keyup.enter.native="search"
          clearable
        ></el-input>
        <el-select v-model="listQuery.regulationType" 
          placeholder="请选择规章类型" 
          class="input-normal" 
          clearable
        >
          <el-option v-for="item in enumList.regulationTypeList" 
          :key="item.id" 
          :label="item.dictName" 
          :value="item.id" 
          />
        </el-select>
        <el-select v-model="listQuery.postId" 
          placeholder="请选择适用岗位" 
          class="input-normal" 
          clearable
        >
          <el-option v-for="item in enumList.sysPostList" 
          :key="item.postId" 
          :label="item.postName" 
          :value="item.postId" 
          />
        </el-select>
        <el-select v-model="listQuery.ismId" 
          placeholder="请选择制度分类" 
          class="input-normal" 
          clearable
        >
          <el-option v-for="item in enumList.securityIsmList" 
          :key="item.ismId" 
          :label="item.ismName" 
          :value="item.ismId" 
          />
        </el-select>

        <treeselect
            v-model="listQuery.depId"
            :single="true"
            :clearable="true"
            class="input-short"
            :options="depList"
            placeholder="请选择部门"
            :normalizer="treeSelectNormalizer"
            :show-count="true"
            no-results-text="未找到相关结果"
            no-options-text="没有可选择的数据"
          />

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
          @click.native="toIsm"
          >制度分类</myButton
        >
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
      custom1-label="有效性"
      custom1-label-width="100px"
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
                scope.data.row.effectiveness == '生效中'
                  ? '#40E0C3'
                  : scope.data.row.effectiveness == '已失效'
                  ? '#fac858'
                  : 'transparent',
            }"
          />{{ scope.data.row.effectiveness }}
        </div>
      </template>
      <template slot="custom" slot-scope="scope">
        <myHandle>
          <span  v-if="scope.data.row.fileUrl" title="预览" @click="preview(scope.data.row)">
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
import { list, ledger, del ,enumList} from "@/api/security/operate";
import edit from "./edit";
import treeselect from "@riophae/vue-treeselect";
export default {
  components: { edit,treeselect },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      pageOper: this.getPageOper(this.$route),
      ledgerobj: {},
      loading: false,
      checked: [
        { key: "规程名称", val: "regulationName" },
        { key: "规程类型", val: "regulationTypeName" },
        { key: "制度分类", val: "ismName" },
        { key: "部门", val: "depName" },
        { key: "适用岗位", val: "postName" },
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
        },
      
      ],
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      total: 0,
      listQuery: {
        keyword: null,
        pageIndex: 1,
        pageSize: 10,
        regulationType: null,
        depId: null,
        postId: null,
        ismId: null,
      },
      editShow: false,
      editId: null,
      titleName: null,
      enumList:[],
      depList: [], 
    };
  },
  async created() {
    await this.getlist();
    await this.getledger();
    await this.getenumList();
  },
  methods: {

    toIsm() {
      this.$router.push({
        path: "/security/operate/indexIsm",
        query: {
          name: "制度分类"
        }
      });
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
     * 树状下拉框重构数据
     */
     treeSelectNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },

    /**
     * 编辑/添加按钮点击事件
     */
    edit(data) {
      if (data && data.regulationId) {
        this.editId = data.regulationId;
        this.titleName = "编辑规章";
      } else {
        this.editId = null;
        this.titleName = "新增规章";
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
          ids.push(item.regulationId);
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
/deep/.stateIcon {
  width: 10px;
  height: 10px;
  display: inline-block;
  border-radius: 100%;
  background: transparent;
  margin-right: 5px;
}
</style>
