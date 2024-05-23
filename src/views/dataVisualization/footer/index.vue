<template>
  <div class="footer">
    <div>
      <div
        v-for="(item, index) in menuList"
        :key="index"
        :class="index == nowIndex ? 'footerActive' : ''"
        @click="changeMenu(item, index)"
      >
        <img
          :src="
            require('@/assets/img/bigScreen/footer-icon' + (index + 1) + '.png')
          "
        />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: ["企业分布", "风险分布", "隐患分布", "应急资源"],
      nowIndex: 0,
    };
  },
  methods: {
    changeMenu(data, index) {
      this.nowIndex = index;

      this.$store.commit("setEnterpriseView", false);
      this.$store.commit("setRiskView", false);
      this.$store.commit("setHiddenView", false);
      this.$store.commit("setEmergencyView", false);

      switch (data) {
        case "企业分布":
          this.$store.commit("setEnterpriseView", true);
          break;
        case "风险分布":
          this.$store.commit("setRiskView", true);
          break;
        case "隐患分布":
          this.$store.commit("setHiddenView", true);
          break;
        case "应急资源":
          this.$store.commit("setEmergencyView", true);
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.footer {
  width: 100%;
  position: absolute;
  bottom: 20px;
  display: flex;
  justify-content: center;
  //   left: 50%;
  & > div {
    display: flex;
    grid-gap: 10px;
    & > div {
      background: pink;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px 10px;
      border-radius: 14px;
      background: url(../../../assets/img/bigScreen/footer-item-bg.png)
        no-repeat;
      background-size: 100% 100%;
      img {
        width: 24px;
        height: 24px;
        object-fit: contain;
        margin-right: 5px;
      }
      span {
        font-size: 16px;
        color: #376188;
        filter: brightness(160%);
      }
    }
    .footerActive {
      background: url(../../../assets/img/bigScreen/footer-item-bgActive.png)
        no-repeat;
      background-size: 100% 100%;
      span {
        font-weight: 520;
        color: #a8cdd0;
        filter: brightness(130%);
      }
    }
  }
}
</style>