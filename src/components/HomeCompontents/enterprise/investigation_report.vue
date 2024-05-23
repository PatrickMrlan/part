<template>
  <div>
    <div class="shadow report">
      <div class="title">
        <div class="text">园区公开事故调查报告</div>
      </div>
      <div class="pageData">
        <div class="info">
          <div class="left">
            <img src="@/assets/img/homeIcon/pageImg.png" />
          </div>
          <div class="right">
            <div class="name">科技园项目工地“6·20”触电事故调查报告</div>
            <div class="date">2023/06/27 09:12:58</div>
            <div class="details">
              <span
                >2023年6月20日17时30分许，光明区凤凰街道尚智科技园项目工地发生</span
              >
            </div>
          </div>
        </div>
        <p>
          <el-pagination background layout="prev, pager, next" :total="1">
          </el-pagination>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
    };
  },
};
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

.report {
  min-width: 310px;
  height: 100%;
  .pageData {
    height: calc(100% - 50px);
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .info {
      display: flex;
      overflow: auto;
      .left {
        margin-right: 16px;
        min-width: 50%;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      .right {
        font-family: "Microsoft YaHei, Microsoft YaHei";
        padding: 10px 0;
        .name {
          font-size: 18px;
          font-weight: bold;
          color: #000000;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .date {
          font-size: 14px;
          color: #999999;
          margin: 10px 0;
        }
        .details {
          color: #006eff;
          span {
            font-size: 14px;
            color: #000000;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          strong {
            font-weight: 400;
          }
        }
      }
    }
  }
}
</style>