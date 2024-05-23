<template>
  <el-dialog
    v-loading="loading"
    :title="title"
    width="1200px"
    class="dialog-form"
    :visible="show"
    :before-close="cancel"
    :close-on-click-modal="false"
    :modal-append-to-body="true"
    :destroy-on-close="false"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    append-to-body
    top="5vh"
  >
    <div class="table-classic-wrapper">
      <amap
        :postform="postform"
        style="height: 65vh"
        @getPosition="getPosition"
      />
    </div>
  </el-dialog>
</template>
  
  <script>
import Amap from "@/components/Amap";

export default {
  name: "Table",
  components: { Amap },
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "详细地址选择";
      },
    },
    multiple: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    show: {
      type: Boolean,
      required: true,
      default() {
        return false;
      },
    },
    postform: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      // 数据列表加载动画
      loading: false,
      deptree: [],
      postForm: [],
      editShow: false,
      editId: null,
      // 查询列表参数对象
      listQuery: {
        entName: null,
        pageIndex: 1,
        pageSize: 10,
      },
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
    };
  },
  created() {
    // this.getDepList()
    console.log(this.postform);
  },
  methods: {
    /**
     * 表格多选回调事件
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取地址信息
    getPosition(data) {
      console.log("data", data);
      if (data != null) {
        this.postForm.detailedAddress = data.address;
        this.postForm.longitude = String(data.lng);
        this.postForm.latitude = String(data.lat);
        this.$emit("close", data);
      }
    },
    /**
     * 查询按钮事件
     */
    search() {
      this.listQuery.pageIndex = 1;
      this.tableData = [];
      this.getMainData();
    },

    cancel(done) {
      this.$emit("close", null);
    },
    check(data) {
      if (data != null) {
        this.multipleSelection = [];
        this.multipleSelection.push(data);
      }

      this.$emit("close", { data: this.multipleSelection });
    },
    reset() {
      this.multipleSelection = [];
      this.listQuery.pageIndex = 1;
      this.getMainData();
    },
  },
};
</script>
  
  <style lang="less" scoped>
</style>
  