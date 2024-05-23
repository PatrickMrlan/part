<template>
  <div>
    <div class="shadow menu">
      <div class="title">
        <div class="text">快捷导航</div>
        <div class="more">
          <img src="@/assets/img/homeIcon/setupCheck.png" />
        </div>
      </div>
      <ul>
        <li
          @click="
            Touch('/secureManagement/enterpriseArchives/index', '企业档案')
          "
        >
          <img src="@/assets/img/homeIcon/menu_one.png" />
          <p>企业档案</p>
        </li>
        <li
          @click="Touch('/riskGradingControl/pointLedger/index', '风险单元（场所、区域）台账')"
        >
          <img src="@/assets/img/homeIcon/menu_two.png" />
          <p>风险台账</p>
        </li>
        <li @click="Touch('/security/danger/index', '隐患排查治理')">
          <img src="@/assets/img/homeIcon/menu_three.png" />
          <p>隐患排查</p>
        </li>
        <li @click="Touch('/security/institution/index', '机构设置')">
          <img src="@/assets/img/homeIcon/menu_four.png" />
          <p>机构设置</p>
        </li>
        <li @click="Touch('/security/inventory/index', '职责清单')">
          <img src="@/assets/img/homeIcon/menu_two.png" />
          <p>职责清单</p>
        </li>
      </ul>
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
  methods: {
    Touch(url, name) {
      this.$router.push({ path: url, query: { name: name } });
    },
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

.menu {
  min-width: 310px;
  height: 100%;
  ul {
    padding: 10px 20px 0;
    height: calc(100% - 50px);
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    li {
      width: 25%;
      min-width: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 8px;
      cursor: pointer;

      p {
        font-size: 14px;
        color: #000000;
        margin-top: 4px;
      }
    }
  }
}
</style>