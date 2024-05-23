<template>
  <div>
    <div class="shadow warn">
      <div class="title">
        <div class="text">预警提醒（<span>{{ tableData.length || 0 }}</span>）</div>

      </div>
      <ul>
        <li v-for="(item,index) in tableData" :key="index">

          <div class="info" @click="goPage(item.url)">{{ item.describeInfo }}</div>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
      default() {
        return {
          warn: {}
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      tableData: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.data && this.data.warn) {
        this.tableData = this.data.warn.warnList
      }
    })
  },
  methods: {
    goPage(url) {
      if (url) {
        this.$router.push({
          path: url

        })
      }
    }

  }

}
</script>

<style lang="less" scoped>
.shadow {
  background: #fff;
  border-radius: 2px;
  box-shadow: 0px 3px 6px 1px rgba(21, 34, 50, 0.16);
  box-sizing: border-box;
  .title {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    box-sizing: border-box;
    border-bottom: 2px solid #e7eaef;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    white-space: nowrap;
    .text {
      font-size: 16px;
      font-family: "Microsoft YaHei, Microsoft YaHei";
      color: #262626;
      display: flex;
      align-items: center;
      span {
        color: #006eff;
      }
    }
    .text::before {
      content: "";
      height: 21px;
      width: 4px;
      background: #1182fb;
      margin-right: 5px;
    }

    .more {
      cursor: pointer;
      display: flex;
      align-items: center;
      span {
        font-size: 12px;
        color: #006eff;
      }
    }
  }
}

.warn {
  min-width: 310px;
  height: 100%;
  ul {
    padding: 10px 20px 0;
    height: calc(100% - 50px);
    overflow: auto;
    li {
      display: flex;
      align-items: center;
      overflow: hidden;
      height: 30px;
      margin-bottom: 10px;
      & > *:not(:first-child) {
        margin-left: 16px;
        font-size: 14px;
      }
      .icon {
        width: 24px;
        height: 24px;
        img {
          object-fit: contain;
        }
      }

      .type {
        min-width: 58px;
        margin-left: 12px;
        color: #000000;
      }
      .date {
        min-width: 62px;
        font-size: 12px;
        color: #999999;
      }
      .info {
        color: #000000;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .info::before {
      content: "";
      height: 21px;
      width: 4px;
      background: #1182fb;
      margin-right: 5px;
    }
    .info:hover{
        cursor: pointer;
        color:#1182fb
    }
      .state {
        margin-left: auto;
        min-width: 52px;
        height: 22px;
        border-radius: 4px;
        text-align: center;
        box-sizing: border-box;
        border: 1px solid transparent;
      }

      .not-handle {
        background: #fff1f0;
        border: 1px solid #ffccc7;
        color: #ff4d4f;
      }
      .handle {
        background: #f6ffed;
        border: 1px solid #d9f7be;
        color: #52c41a;
      }
      .close {
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.15);
        color: #000000;
      }
    }
  }
}
</style>
