<template>
  <div>
    <div class="shortcutMenu shadow">
      <div class="title">
        <span>我的快捷方式</span>
        <myButton @click.native="setting"> 保存 </myButton>
      </div>
      <ul>
        <li
          v-for="(item, index) in appMyList"
          :key="index"
          @click="delApp(item, index)"
        >
          <div v-if="isSetting" class="opIcon">
            <img src="@/assets/img/delIcon.png" />
          </div>
          <div class="pic">
            <img
              :src="
                item.shortcutIcon
                  ? baseURL + item.shortcutIcon
                  : '@/assets/img/homeIcon/appIcon.png'
              "
            />
          </div>
          <p>{{ item.shortcutName }}</p>
        </li>
        <!-- <li @click="setting()">
          <div class="pic addApp">
            <img src="@/assets/img/homeIcon/setup.png" />
          </div>
          <p>{{ isSetting ? "完成" : "设置" }}</p>
        </li> -->
      </ul>
    </div>
    <div class="shortcutMenu shadow">
      <div class="title">
        <span>全部应用</span>
      </div>
      <ul>
        <div v-if="appAllList.length === 0">暂无应用</div>
        <li
          v-for="(item, index) in appAllList"
          :key="index"
          @click="addApp(item, index)"
        >
          <div v-if="isSetting" class="opIcon">
            <img src="@/assets/img/addIcon.png" />
          </div>
          <div class="pic">
            <img
              :src="
                item.shortcutIcon
                  ? baseURL + item.shortcutIcon
                  : '@/assets/img/homeIcon/appIcon.png'
              "
            />
          </div>
          <p>{{ item.shortcutName }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { myShortcut, saveShortcut } from "@/api/system/shortcut.js";
export default {
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      appAllList: [],
      appMyList: [],
      isSetting: true,
    };
  },
  mounted() {
    this.getMyAppList();
  },
  methods: {
    getMyAppList() {
      myShortcut().then((res) => {
        this.appMyList = res.myShortcutList;
        this.appAllList = res.cloudShortcutList;
        this.appMyList.sort((a, b) => {
          return a.sort - b.sort;
        });
        this.appAllList.sort((a, b) => {
          return a.sort - b.sort;
        });
        this.array_diff(this.appAllList, this.appMyList);
      });
    },
    /**
     * 数组去重
     */
    array_diff(a, b) {
      for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
          if (a[j].id == b[i].id) {
            console.log(j);
            a.splice(j, 1);
            j = j - 1;
          }
        }
      }
      return a;
    },
    setting() {
      // this.isSetting = !this.isSetting;
      if (this.isSetting) {
        saveShortcut(this.appMyList).then((res) => {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.getMyAppList();
        });
      }
    },
    delApp(data, i) {
      var tmp = JSON.parse(JSON.stringify(data));
      if (this.isSetting) {
        this.appMyList.splice(i, 1);
        if (this.appAllList.filter((x) => x.id === data.id).length === 0) {
          tmp.sort = this.appAllList.length;
          this.appAllList.push(tmp);
        }
      }

    },
    addApp(data, i) {
      var tmp = JSON.parse(JSON.stringify(data));
      if (this.isSetting) {
        this.appAllList.splice(i, 1);
        if (this.appMyList.filter((x) => x.id === data.id).length === 0) {
          tmp.sort = this.appMyList.length;
          this.appMyList.push(tmp);
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.shadow {
  width: calc(100% - 20px);
  margin: auto;
  // padding: 20px 0;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  margin-bottom: 20px;
  .title {
    border-bottom: 1px solid #e7eaef;
    padding: 0 20px 11px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      cursor: pointer;
    }
    span:nth-of-type(1) {
      font-size: 14px;
      color: #000;
      font-weight: bold;
    }
    span:nth-of-type(2) {
      font-size: 12px;
      color: #006eff;
    }
    img {
      cursor: pointer;
    }
  }
}
.shortcutMenu {
  &:first-of-type {
    margin-top: 10px;
  }
  padding: 20px 0 0;
  & > ul {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    min-height: 100px;
    & > div {
      font-size: 14px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    li {
      padding: 12px 25px;
      margin: 10px;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      position: relative;
      .opIcon {
        position: absolute;
        left: calc(50% + 12px);
        top: 0;
        img {
          width: 20px;
          height: 20px;
        }
      }
      .pic {
        height: 56px;
        width: 56px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 56px;
          height: 56px;
          border-radius: 50%;
        }
      }
      p {
        text-align: center;
        margin-top: 12px;
        font-size: 14px;
        color: #000;
      }
    }
    li:hover {
      background-color: #f3f4f7;
    }
  }
}
</style>
