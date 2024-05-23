<template>
  <div class="table-classic-wrapper">
    <draggable
      v-model="myArray"
      chosen-class="chosen"
      force-fallback="true"
      group="people"
      animation="1000"
      @start="onStart"
      @end="onEnd"
    >
      <transition-group>
        <div class="item" v-for="element in myArray" :key="element.id">
          {{ element.name }}
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: { draggable },

  data() {
    return {
      drag: false,
      myArray: [
        { people: "cn", id: 1, name: "www.itxst.com" },
        { people: "cn", id: 2, name: "www.baidu.com" },
        { people: "cn", id: 3, name: "www.taobao.com" },
        { people: "us", id: 4, name: "www.google.com" },
      ],
    };
  },
  created() {},
  methods: {
    onStart() {
      this.drag = true;
    },
    onEnd() {
      this.drag = false;
    },
  },
};
</script>

<style lang="less" scoped>
/*被拖拽对象的样式*/
.item {
  padding: 6px;
  background-color: #fdfdfd;
  border: solid 1px #eee;
  margin-bottom: 10px;
  cursor: move;
}
.item:hover {
  background-color: #f1f1f1;
  cursor: move;
}
/*选中样式*/
.chosen {
  border: solid 2px #3089dc !important;
}
</style>
