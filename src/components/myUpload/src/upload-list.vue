<template>
  <div>
    <transition-group
      tag="ul"
      :class="[
        'el-upload-list',
        'el-upload-list--' + listType,
        { 'is-disabled': disabled },
      ]"
      name="el-list"
      style="display: inline-flex; flex-wrap: wrap"
    >
      <li
        v-for="file in arr"
        :key="file.uid"
        style="width: min-content; margin: 0 0 10px 0; display: inline-block"
      >
        <div
          :class="[
            'el-upload-list__item',
            'is-' + file.status,
            focusing ? 'focusing' : '',
          ]"
          :title="file.name || file.fileName"
          style="margin: 0 8px 0 0"
          tabindex="0"
          @keydown.delete="!disabled && $emit('remove', file)"
          @focus="focusing = true"
          @blur="focusing = false"
          @click="focusing = false"
        >
          <img
            class="el-upload-list__item-thumbnail"
            v-if="
              file.status !== 'uploading' &&
              ['picture-card', 'picture'].indexOf(listType) > -1
            "
            :src="file.url"
            alt=""
          />
          <a class="el-upload-list__item-name" @click="handleClick(file)">
            <i class="el-icon-document"></i>{{ file.fileName }}
          </a>
          <label class="el-upload-list__item-status-label">
            <i
              :class="{
                'el-icon-upload-success': true,
                'el-icon-circle-check': listType === 'text',
                'el-icon-check':
                  ['picture-card', 'picture'].indexOf(listType) > -1,
              }"
            ></i>
          </label>
          <i
            class="el-icon-close"
            v-if="!disabled"
            @click="$emit('remove', file)"
          ></i>
          <i class="el-icon-close-tip" v-if="!disabled">{{
            t("el.upload.deleteTip")
          }}</i>
          <!--因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上-->
          <el-progress
            v-if="file.status === 'uploading'"
            :type="listType === 'picture-card' ? 'circle' : 'line'"
            :stroke-width="listType === 'picture-card' ? 6 : 2"
            :percentage="parsePercentage(file.percentage)"
          >
          </el-progress>
          <span
            class="el-upload-list__item-actions"
            v-if="listType === 'picture-card'"
          >
            <span
              class="el-upload-list__item-preview"
              v-if="handlePreview && listType === 'picture-card'"
              @click="handlePreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="$emit('remove', file)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
        <!-- <div style="display: inline-block">
          <el-input
            v-if="!disabled"
            v-model="file.fileName"
            style="width: 95% !important"
          />
        </div> -->
      </li>
    </transition-group>
  </div>
</template>
<script>
import Locale from "element-ui/src/mixins/locale";
import ElProgress from "element-ui/packages/progress";
import draggable from "vuedraggable";

export default {
  name: "ElUploadList",

  mixins: [Locale],

  data() {
    return {
      focusing: false,
      arr: [],
    };
  },
  components: { ElProgress, draggable },

  props: {
    files: {
      type: Array,
      default() {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    handlePreview: Function,
    listType: String,
    myType: String,
    mySort: Number,
    myFileList: Array,
  },
  watch: {
    files(item1, item2) {
      this.arr = this.files;
    },
    immediate: true, // watch侦听操作内的函数会立刻被执行
  },
  created() {
    this.arr = this.files;
  },
  methods: {
    parsePercentage(val) {
      return parseInt(val, 10);
    },
    handleClick(file) {
      this.handlePreview && this.handlePreview(file);
    },
    // 开始拖拽
    onStart() {},
    // 结束拖拽
    draggableEnd() {
      // console.log(this.$store);
      if (this.mySort) {
        this.arr.forEach((item) => {
          this.myFileList.forEach((itemSon) => {
            if (!item.fileKey && !item.key) {
              if (item.name == itemSon.fileName) {
                item.fileKey = itemSon.fileKey;
              }
            }
          });
          item.sort = this.mySort;
        });
      }
      switch (this.myType) {
        case "小区":
          this.$store.commit("upload/setUploadListProject", this.arr);
          break;
      }
    },
    // 拖拽中
    onMove() {},
  },
};
</script>
