<template>
  <div :style="{ marginBottom: circle ? '10px' : '' }" class="buttonSpace">
    <div
      v-if="type == 'keep'"
      class="botton"
      :class="plain ? 'plainBtn' : ''"
      :style="{
        color: plain ? themeColor : '#ffffff',
        border: plain ? '1px solid #CFD5DE' : '1px solid ' + themeColor,
        background: plain ? '#ffffff' : themeColor,
      }"
    >
      <i v-if="loading" :class="icon" style="margin-right: 4px"></i>
      <slot></slot>
    </div>
    <div
      v-if="type == 'confirm'"
      class="button"
      :class="plain ? 'plainBtn' : ''"
      :style="{
        color: plain ? themeColor : '#ffffff',
        border: plain ? '1px solid #CFD5DE' : '1px solid ' + themeColor,
        background: plain ? '#ffffff' : themeColor,
      }"
    >
      <i v-if="loading" :class="icon" style="margin-right: 4px"></i>
      <slot></slot>
    </div>
    <div
      v-if="type == 'circle'"
      class="circle"
      :class="plain ? 'plainBtn' : ''"
      :style="{
        color: plain ? themeColor : '#ffffff',
        border: plain ? '1px solid #CFD5DE' : '1px solid ' + themeColor,
        background: plain ? '#ffffff' : themeColor,
      }"
    >
      <i
        v-if="loading"
        :class="icon"
        :style="{ marginRight: circle ? '0' : '4px' }"
      ></i>
      <slot></slot>
    </div>
    <div
      v-if="type == 'cancel'"
      id="cancel"
      class="button cancelButton"
      @mouseenter.capture="onmouseenterCancel"
      @mouseleave.capture="onmouseleaveCancel"
    >
      <i v-if="loading" :class="icon" style="margin-right: 4px"></i>
      <slot></slot>
    </div>
    <div
      v-if="type == 'search'"
      id="search"
      class="button searchButton"
      :style="{
        color: themeColor,
        border: '1px solid ' + themeColor,
        backgroundColor: themeColor + '20',
      }"
      @mouseenter.capture="onmouseenterSearch"
      @mouseleave.capture="onmouseleaveSearch"
    >
      <i v-if="loading" :class="icon" style="margin-right: 4px"></i>
      <slot></slot>
    </div>

    <div
      v-if="type == 'remove'"
      id="remove"
      class="button removeButton"
    >
    <i v-if="loading" :class="icon" style="margin-right: 4px"></i>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "myButtom",
  props: {
    // 朴素按钮
    plain: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    loading: {
      type: Boolean,
      required: false,
      default() {
        return true;
      },
    },
    click: {
      type: Function,
      required: false,
      default() {
        return null;
      },
    },
    icon: {
      required: false,
      default() {
        return null;
      },
    },
    type: {
      type: String,
      required: false,
      default() {
        return "confirm";
      },
    },
    circle: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
  },
  computed: {
    ...mapGetters("app", ["themeColor"]),
  },
  methods: {
    onmouseenterCancel() {
      let btn = document.querySelectorAll("#cancel");
      const that = this;
      for (let i = 0; i < btn.length; i++) {
        btn[i].onmouseenter = function () {
          btn[i].style.color = that.themeColor;
          btn[i].style.border = "1px solid " + that.themeColor;
          btn[i].style.backgroundColor = that.themeColor + "20";
        };
      }
    },
    onmouseleaveCancel() {
      let btn = document.querySelectorAll("#cancel");
      for (let i = 0; i < btn.length; i++) {
        btn[i].onmouseleave = function () {
          btn[i].style.color = "#606266";
          btn[i].style.border = "1px solid #dcdfe6";
          btn[i].style.backgroundColor = "#fff";
        };
      }
    },
    onmouseenterSearch() {
      let btn = document.querySelectorAll("#search");
      const that = this;
      for (let i = 0; i < btn.length; i++) {
        btn[i].onmouseenter = function () {
          btn[i].style.color = "#fff";
          btn[i].style.backgroundColor = that.themeColor;
        };
      }
    },
    onmouseleaveSearch() {
      let btn = document.querySelectorAll("#search");
      const that = this;
      for (let i = 0; i < btn.length; i++) {
        btn[i].onmouseleave = function () {
          btn[i].style.color = that.themeColor;
          btn[i].style.backgroundColor = that.themeColor + "20";
        };
      }
    },
  },
};
</script>

<style lang="less" scoped>
.buttonSpace {
  display: inline-block;
}
.botton {
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  padding: 0 16px;
  display: inline-block;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
.button {
  box-sizing: border-box;
  display: inline-block;
  text-align: center;
  height: 32px;
  line-height: 30px;
  padding: 0 15px;
  font-size: 12px;
  border-radius: 3px;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
.circle {
  width: 32px;
  height: 32px;
  border-radius: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
.cancelButton {
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  &:hover {
    opacity: 1;
  }
}
.searchButton {
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  &:hover {
    opacity: 1;
  }
}
.plainBtn {
  background: #fff;
  border: 1px solid #cfd5de;
}

.removeButton{
  background: #fff;
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
  &:hover {
    opacity: 0.9;
  }
}
</style>