<template>
  <myDialog
    :title="title"
    width="75%"
    class="dialog-form"
    :visible="true"
    :loading="loading"
    :cancel="cancel"
  >
    <el-col>
      <standardTable
        ref="standardTable"
        :type="true"
        :objectId="id"
        :tags="tags"
      />
    </el-col>

    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
    </template>
  </myDialog>
</template>

<script>
import standardTable from "../standard/standardTable.vue";

export default {
  components: { standardTable },

  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
    id: {
      required: false,
      default() {
        return null;
      },
    },
    tags: {
      require: false,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  created() {},
  methods: {
    cancel(done) {
      this.$emit("close", { reload: done });
    },
  },
};
</script>

<style lang="less" scoped>
</style>