<template>
  <div>
    <div class="shadow notice">
      <div class="title">
        <div class="text">公告信息</div>
        <div class="more">
          <el-select
            v-model="notice"
            filterable
            style="margin-right: 10px; width: 100px"
            @change="selectType()"
          >
            <el-option
              v-for="(item, index) in noticeList"
              :key="index"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
          <span @click="goPage()">查看更多</span>
        </div>
      </div>
      <ul>

        <li v-for="(item,index) in tableData" :key="index" :class="item.announcementType === '企业'? 'notice_active':''">
          <div class="label">{{ item.announcementType }}</div>
          <strong>{{ item.noticeTitle }}</strong>
          <span>{{ item.timeStr }}</span>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
import { list } from '@/api/system/notice'

export default {
  props: {
    data: {
      type: Object,
      required: true,
      default() {
        return {
          notice: {}
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      notice: null,
      customData: {},
      noticeList: [
        { label: '全部公告', value: 0 },
        { label: '企业公告', value: 1 },
        { label: '园区公告', value: 2 }
      ],
      tableData: [
        { announcementType: null }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.data && this.data.notice) {
        this.noticeList = this.data.notice.noticeType
        this.tableData = this.data.notice.noticeList.records
      }
    })
  },
  methods: {
    goPage() {
      this.$router.push({
        path: '/system/notice/index',
        query: {
          name: '公告管理'

        }
      })
    },
    selectType() {
      list({ announcementType: this.notice })
        .then((res) => {
          this.tableData = res.records
        })
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

.notice {
  width: 100%;
  min-width: 310px;
  height: 300px;
  ul {
    padding: 10px 20px;
    height: calc(100% - 50px);
    overflow: auto;
    li {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      font-size: 14px;
      .label {
        font-size: 12px;
        color: #d46b08;
        background: #ffe7ba;
        border-radius: 3px;
        margin: 0 5px;
        min-width: 60px;
        text-align: center;
      }
      strong {
        width: calc(100% - 80px - 40px - 20px);
        color: #000000;
        font-weight: normal;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      span {
        min-width: 80px;
        color: #999999;
        margin-left: auto;
        text-align: right;
      }
    }
    li::before {
      content: "";
      min-width: 4px;
      height: 4px;
      background: #006eff;
      border-radius: 100%;
    }

    .notice_active {
      .label {
        color: #096dd9;
        background: #bae7ff;
      }
    }

    .notice_active::before {
      content: "";
      min-width: 4px;
      height: 4px;
      background: #999999;
      border-radius: 100%;
    }
  }
}
</style>
