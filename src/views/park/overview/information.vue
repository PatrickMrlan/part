<template>
  <div class="information">
    <div class="content leftbox">
      <div class="l_title">西南航空港经济开发区</div>
      <div class="banner">
        <banner :items="banner" :interval="interval" :height="'180px'" />
      </div>
      <div class="entinfo">
        <div>
          <p>国家</p>
          <div>园区级别</div>
        </div>
        <div>
          <p>70<span>km²</span></p>
          <div>规划面积</div>
        </div>
        <div>
          <p>67<span>km²</span></p>
          <div>现有面积</div>
        </div>
        <div>
          <p>220</p>
          <div>园区企业</div>
        </div>
        <div>
          <p>5<span>万</span></p>
          <div>从业人数</div>
        </div>
      </div>
      <div class="enttext">
        西南航空港经济开发区是1992年经省人民政府批准的省级重点开发区，是西部唯
        一集航空、铁路、公路、航运为一体的开发区。园区总体规划面积70平方公里，规划定位为“一区两城”(32平方公里科研教育新城与38平方公里工业新城)，现已开发建设面积67平方公里。
        西南航空港经济开发区是1992年经省人民政府批准的省级重点开发区，是西部唯
        一集航空、铁路、公路、航运为一体的开发区。园区总体规划面积70平方公里，规划定位为“一区两城”(32平方公里科研教育新城与38平方公里工业新城)。
      </div>
    </div>
    <div class="content centerbox">
      <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane label="机构设置" name="机构设置" class="tab"
          >功能开发中...</el-tab-pane
        >
        <el-tab-pane label="主要领导" name="主要领导" class="tab"
          >功能开发中...</el-tab-pane
        >
        <el-tab-pane label="历史更新" name="历史更新" class="tab"
          >功能开发中...</el-tab-pane
        >
        <el-tab-pane label="园区网格" name="园区网格" class="tab gridbox">
          <div id="grid"></div>
          <div class="griduser">
            <p>网格员统计</p>
            <ul type="disc">
              <li>第一网格 3</li>
              <li>第二网格 4</li>
              <li>第三网格 3</li>
              <li>第四网格 5</li>
              <li>第五网格 6</li>
              <li>第六网格 3</li>
              <li>第七网格 4</li>
            </ul>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="content rightbox">
      <div class="notice shadow">
        <div class="title">
          <div class="text">公告信息</div>
          <div class="more">
            <el-select
              v-model="notice"
              filterable
              style="margin-right: 10px; width: 100px"
            >
              <el-option
                v-for="(item, index) in noticeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span>查看更多</span>
          </div>
        </div>
        <ul>
          <li class="notice_active">
            <div class="label">企业</div>
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
          <li>
            <div class="label">园区</div>
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
          <li class="notice_active">
            <div class="label">企业</div>
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
          <li class="notice_active">
            <div class="label">企业</div>
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
          <li>
            <div class="label">园区</div>
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
        </ul>
      </div>
      <div class="notice shadow">
        <div class="title">
          <div class="text">公示信息</div>
          <div class="more">
            <span>查看更多</span>
          </div>
        </div>
        <ul>
          <li class="notice_active">
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
          <li>
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
          <li class="notice_active">
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
          <li class="notice_active">
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
          <li>
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
        </ul>
      </div>
      <div class="notice shadow">
        <div class="title">
          <div class="text">文件通知</div>
          <div class="more">
            <span>查看更多</span>
          </div>
        </div>
        <ul>
          <li class="notice_active">
            <div class="label">企业</div>
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
          <li>
            <div class="label">园区</div>
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
          <li class="notice_active">
            <div class="label">企业</div>
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
          <li class="notice_active">
            <div class="label">企业</div>
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
          <li>
            <div class="label">园区</div>
            <strong>建设项目安全设施“三同时”监督管理办法</strong>
            <span>2023/08/12</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getGrid } from "@/api/park/grid";
export default {
  data() {
    return {
      activeName: "园区网格",
      interval: 3000,
      banner: [
        {
          image: "https://picsum.photos/800/400?random=1"
        },
        {
          image: "https://picsum.photos/800/400?random=2"
        },
        {
          image: "https://picsum.photos/800/400?random=3"
        }
      ],
      mapcenter: [104.0642, 30.6597],
      notice: 0,
      noticeList: [
        { label: "全部公告", value: 0 },
        { label: "企业公告", value: 1 },
        { label: "园区公告", value: 2 }
      ],
      listQuery:{},
      loginUser:{},
    };
  },
  created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    if (this.loginUser.sysPark) {
      this.listQuery.parkId = this.loginUser.sysPark.parkId;
    } else {
      this.$message({
        type: "warning",
        message: "当前用户暂无园区!",
      });
    }
  },
  mounted() {
    this.intAmap(() => {
      this.getList();
    });
  },
  methods: {
    getList(){
      getGrid(this.listQuery).then(res=>{
        console.log(res);
      })
    },
     // 地图初始化
     intAmap(callBack) {
      this.AMap = window.AMap;
      this.AMap.plugin(
        ["AMap.MouseTool", "AMap.PolyEditor", "AMap.ControlBar"],
        function() {
          //TODO  创建控件并添加
        }
      );
      this.map = new this.AMap.Map("grid", {
        center: [116.434381, 39.898515],
        zoom: 11, //级别
        viewMode: "3D", //使用3D视图
        buildingAnimation: true, //楼块出现是否带动画
      });
      this.map.addControl(new this.AMap.ControlBar());
      if (callBack && typeof callBack == "function") {
        callBack();
      }
    },
  }
};
</script>

<style lang="less" scoped>
.information {
  height: calc(100vh - 184px - 58px);
  display: flex;
  justify-content: space-between;
}
.content {
  width: 28%;
  height: 100%;
}
.leftbox {
  padding: 20px;
  min-width: 230px;
  box-sizing: border-box;
  overflow: auto;
  background-color: #ffffff;
  box-shadow: 0px 3px 6px 1px rgba(21, 34, 50, 0.16);
  .l_title {
    font-family: Microsoft YaHei, Microsoft YaHei;
    color: #343434;
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 10px;
  }
  .banner {
    width: 100%;
  }
  .entinfo {
    border-top: 2px solid #e7eaef;
    border-bottom: 2px solid #e7eaef;
    margin: 20px 0;
    padding: 10px 0;
    box-sizing: border-box;
    display: flex;
    & > div {
      width: 20%;
      text-align: center;
      p {
        font-size: 18px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        color: #565656;
        span {
          font-size: 12px;
        }
      }
      div {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-size: 12px;
        font-weight: 400;
        color: #999999;
      }
    }
  }
  .enttext {
    font-size: 13px;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    color: #565656;
    line-height: 28px;
    padding-bottom: 10px;
    box-sizing: border-box;
    border-bottom: 2px solid #e7eaef;
  }
}
.centerbox {
  width: 40%;
  min-width: 360px;
  background-color: #ffffff;
  box-shadow: 0px 3px 6px 1px rgba(21, 34, 50, 0.16);
  .tabs {
    width: 100%;
    height: 100%;
    .tab {
      padding: 20px;
      box-sizing: border-box;
      overflow: auto;
      #grid {
        width: 100%;
        height: calc(100vh - 330px);
      }
    }
    .gridbox {
      position: relative;
      .griduser {
        position: absolute;
        left: 30px;
        top: 5%;
        max-height: 40%;
        background-color: #ffffff;
        overflow: auto;
        box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.12);
        font-size: 12px;
        padding: 10px;
        box-sizing: border-box;
        height: 204px;
        overflow: auto;
        p {
          color: #999999;
        }
        ul {
          list-style-type: disc;
          li {
            margin: 5px 0 5px 18px;
          }
          li::before {
            content: "";
            width: 4px;
            height: 4px;
            background: #5993df;
            border-radius: 100%;
          }
        }
      }
    }
  }
}
.rightbox {
  min-width: 230px;
  .notice {
    height: calc((100% - 140px) / 2 - 52.5px);
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
          min-width: 30px;
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
        margin-right: 4px;
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
        margin-right: 4px;
      }
    }
  }
}
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
.rightbox > :nth-child(2) {
  margin: 12px 0;
}
</style>
