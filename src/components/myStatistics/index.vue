<template>
  <div
    class="statistics"
    ref="statistics"
    v-if="myStatisticsList && myStatisticsList.length"
  >
    <div
      v-for="(item, index) in myStatisticsList"
      :key="index"
      class="statistics-item"
    >
      <el-statistic
        group-separator=","
        :precision="2"
        decimal-separator="."
        :title="item.title"
        :value="item.value * 1"
      >
        <template slot="title">
          <div class="title">
            {{ item.title || "" }}
            <el-tooltip
              v-if="item.tip"
              class="item tips"
              effect="dark"
              :content="item.tip"
              placement="bottom"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
        </template>
        <template slot="formatter">
          <div
            class="formatter"
            :style="{ color: item.color ? item.color : '' }"
          >
            {{ numFormat(item.value) || 0 }}
            <span v-if="item.unit">{{ item.unit }}</span>
          </div>
        </template>
      </el-statistic>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyStatistics",
  props: {
    myStatisticsList: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      statisticsList: [],
    };
  },
  created() {
    this.statisticsList = this.myStatisticsList;
  },

  methods: {
    numFormat(num) {
      var res = (num+'').toString().replace(/\d+/, function (n) {
        // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
          return $1 + ",";
        });
      });
      return res;
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  color: #00000073;
  font-size: 14px;
}
.formatter {
  color: #000000d9;
  font-size: 24px;
}

/deep/.tips {
  font-size: 16px;
  cursor: pointer;
}

.statistics {
  display: flex;
  flex-flow: row wrap;
  padding: 20px;
  box-shadow: 0px 1px 6px 1px rgba(0, 0, 0, 0.16);
  margin-bottom: 20px;
  .statistics-item:not(:last-child) {
    margin-right: 50px;
  }
}
</style>