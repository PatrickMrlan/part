  <template>
  <el-drawer
    title="选择企业"
    :visible.sync="drawer"
    :direction="direction"
    :before-close="cancel"
    size="50%"
    append-to-body
  >
    <div class="table-classic-wrapper">
      <!-- 操作栏 -->
      <div class="app-list-control app-row">
        <div class="flex">
          <el-input
            v-model="listQuery.conditions"
            class="input-normal"
            clearable
            placeholder="企业名称"
            @keyup.native.enter="search"
          />
          <el-button type="primary" plain icon="el-icon-search" @click="search"
            >搜索</el-button
          >
        </div>
        <div v-if="multiple" class="right">
          <el-button type="danger" icon="el-icon-refresh" @click="reset()"
            >重置</el-button
          >
          <el-button type="primary" icon="el-icon-check" @click="check(null)"
            >选择</el-button
          >
        </div>
      </div>
      <!-- 表格栏 -->
      <el-table
        ref="fileTable"
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        size="small"
        border
        :onResizeHeight="false"
        @row-click="handleClickTableRow"
        @selection-change="handleSelectionChange"
        :row-key="rowKey"
      >
        <el-table-column
          :reserve-selection="true"
          v-if="multiple"
          type="selection"
          width="39"
          align="left"
        />
        <el-table-column prop="entFullName" label="企业名称" sortable />
        <el-table-column
          v-if="!multiple"
          label="操作"
          align="center"
          width="90"
          class="app-table-oper"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              circle
              icon="el-icon-check"
              @click="check(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <div class="app-pager">
        <el-pagination
          background
          :current-page="listQuery.pageIndex"
          :page-sizes="[10, 20, 50, 100, 1000, 10000]"
          layout="total, prev, pager, next, sizes, jumper"
          :total="total"
          :pager-count="5"
          @size-change="pagerSizeChange"
          @current-change="pagerCurrentChange"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { list } from "@/api/system/entManagement";

export default {
  name: "Table",
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "选择企业";
      },
    },
    multiple: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    drawer: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    id: {
      required: false,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      // 数据列表加载动画
      loading: false,
      direction: "rtl",
      deptree: [],
      editShow: false,
      editId: null,
      // 查询列表参数对象
      listQuery: {
        id: null,
        conditions: null,
        pageIndex: 1,
        pageSize: 10,
      },
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      treeData: [],
    };
  },

  mounted() {
    this.listQuery.id = this.id;
    this.getMainData();
  },
  methods: {
    rowKey(row) {
      return row.entId;
    },
    handleClickTableRow(row, event, column) {
      this.$refs.fileTable.toggleRowSelection(row);
      // this.multipleSelection.push(row);
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows;
    },
    // /**
    //  * 表格多选回调事件
    //  */
    // handleSelectionChange(val) {
    //   this.multipleSelection = val
    // },
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
      const that = this;
      this.loading = true;
      list(that.listQuery)
        .then((res) => {
          console.log(res);
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
    cancel(done) {
      this.$emit("close", null);
      this.multipleSelection = [];
      this.listQuery.pageIndex = 1;
      this.getMainData();
    },
    check(data) {
      if (data) {
        this.multipleSelection = [];
        this.multipleSelection.push(data);
      }
      this.$emit("close", { data: this.multipleSelection });
    },
    reset() {
      this.$refs.fileTable.clearSelection();
      this.multipleSelection = [];
      this.listQuery.pageIndex = 1;
      this.getMainData();
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-drawer__header {
  span {
    font-size: 18px;
    color: #303133;
  }
}
/deep/.el-drawer__body {
  padding: 0 20px;
}
</style>
