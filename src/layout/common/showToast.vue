<template>
  <div v-if="reminderList.length && this.$store.state.showToast">
    <myDialog
      :title="'重要提醒'"
      :width="1000"
      class="dialog-form"
      :visible="true"
      :cancel="cancel"
      :loading="loading"
      :top="'10vh'"
    >
      <ul class="content">
        <li v-for="(item,index) in reminderList" :key="index">{{index+1}}、{{ item.noticeContent}}</li>
      </ul>
      <template slot="footer">
        <myButton :type="'cancel'" @click.native="cancel">取 消</myButton>
      </template>
    </myDialog>
  </div>
</template>
  
  <script>
import { getImportantList } from "@/api/system/noticeAnnouncement";
export default {
  props: {
    data: {
      type: Array,
      required: false,
      default() {
        return null;
      },
    },
    loading: {
      required: false,
      default() {
        return false;
      },
    },
  },

  data() {
    return {
      reminderList: [],
    };
  },
  created() {
    this.getImportantList();
  },
  methods: {
    /**
     * 获取重要提醒
     */
    getImportantList() {
      this.loading = true;
      getImportantList()
        .then((res) => {
          console.log(res);
          this.reminderList = res;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 关闭弹窗
     * @param {*} done
     */
    cancel(done) {
      this.$emit("close", {});
    },
  },
};
</script>
  
  <style lang="less" scoped>
</style>