<template>
  <div class="table-classic-wrapper">
    <!-- <div @click="showDialog=true">角色</div> -->
    <!-- <myTree
      title="标题"
      :default-expand-all="true"
      @node-click="nodeClick"
      :treeList="treeList"
    >
      <template slot="title">
        <i v-if="pageOper.TJ" title="添加配置" class="el-icon-plus" />
      </template>
      <template slot="item" slot-scope="scope">
        <i
          v-if="scope.data.level < 4"
          class="el-icon-circle-plus-outline"
          @click="clickIcon(scope.data)"
          >&nbsp;</i
        >
        <i class="el-icon-edit-outline">&nbsp;</i>
        <i class="el-icon-delete" />
      </template>
    </myTree> -->
    <!-- <myTable :checked="checked"></myTable> -->
  </div>
</template>

<script>
import { Message } from "element-ui";

export default {
  name: "Table",

  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,
      showDialog: false,
      // treeList: [
      //   {
      //     title: "分组一",
      //     id: "1",
      //     children: [
      //       {
      //         title: "分组1-1",
      //         id: "1-1",
      //         children: [
      //           {
      //             title: "分组1-1-1",
      //             id: "1-1-1",
      //             children: [
      //               {
      //                 title: "分组1-1-1-1",
      //                 id: "1-1-1-1",
      //                 children: [
      //                   {
      //                     title: "分组1-1-1-1-1",
      //                     id: "1-1-1-1-1",
      //                     children: [],
      //                   },
      //                 ],
      //               },
      //             ],
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   { title: "分组二", id: "2", children: [], level: 1 },
      // ],
      checked: [
        { key: "字典项", val: "dictName" },
        { key: "字典项值", val: "dictCode" },
        { key: "描述", val: "descriptionInfo" },
        { key: "添加时间", val: "addTime", align: "center" },
      ],
    };
  },
  methods: {
    submit() {
      console.log("提交");
    },
    cancel() {},
    nodeClick(e) {
      console.log(e);
    },
    clickIcon(e) {
      console.log(e);
    },
  },
};
</script>

<style lang="less" scoped>
</style>
