 <template>
  <div class="header">
    <img src="@/assets/img/bigScreen/header-bg.png" />
    <div class="info">
      <div class="left">
        <span>崇州大数据经济技术开发区</span>
      </div>
      <div class="middle">
        <img src="@/assets/img/bigScreen/header-logo.png" alt="" />
      </div>
      <div class="right">
        <div class="time">{{ time }}</div>
        <div class="date">
          <p>{{ week }}</p>
          <p>{{ date }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
 
 <script>
import basic from "@/utils/basic";

export default {
  data() {
    return {
      timer: null,
      time: null, // 时间
      date: null, // 日期
      week: null, // 星期
    };
  },
  created() {
    this.getDateTime();
  },
  methods: {
    /**
     * 获取 日期、时间、星期
     */
    getDateTime() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.time = basic.format(new Date(), "hh : mm : ss");
        this.date = basic.format(new Date(), "YYYY/MM/DD");
        this.week = basic.format(new Date(), "星期WW");
      }, 1000);
    },
  },
};
</script>
 
<style lang="less" scoped>
.header {
  width: 100%;
  height: 120px;
  background: url(../../../assets/img/bigScreen/head.webp) no-repeat center top;
  background-size: 65% 75%;
  position: absolute;
  top: 0;
  z-index: 20;
  & > img {
    z-index: 15;
    width: 100%;
    object-fit: contain;
    position: absolute;
  }
  & > .info {
    z-index: 22;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    & > div {
      width: calc(100% / 3);
    }
    .left,
    .right {
      display: flex;
      align-items: center;
      height: 50%;
      padding: 0 15px;
    }
    .left {
      background: url(../../../assets/img/bigScreen/header-left-bg.png)
        no-repeat center bottom;
      background-size: 100% 100%;

      span {
        font-size: 24px;
        font-weight: bold;
        background: linear-gradient(to bottom, #85accf, #376188);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        filter: brightness(160%);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .middle {
      text-align: center;
      img {
        width: 80%;
        object-fit: contain;
      }
    }
    .right {
      background: url(../../../assets/img/bigScreen/header-right-bg.png)
        no-repeat center bottom;
      background-size: 100% 100%;
      justify-content: flex-end;
      .time {
        font-size: 22px;
        font-weight: 500;
        color: #fff;
      }
      .date {
        color: #376188;
        font-size: 14px;
        margin-left: 10px;
        font-weight: 500;
        filter: brightness(160%);
      }
    }
  }
}
</style>