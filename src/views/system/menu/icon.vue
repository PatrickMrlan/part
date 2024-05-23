<template>
  <el-dialog
    title="选择图标"
    width="973px"
    class="dialog-form"
    :visible="show"
    :before-close="cancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :destroy-on-close="false"
    append-to-body
  >
    <ul class="icon-list">
      <li>
        <span><i class="el-icon-platform-eleme" @click="check($event)" /><span class="icon-name">el-icon-platform-eleme</span></span>
      </li>
      <li>
        <span><i class="el-icon-eleme" @click="check($event)" /><span class="icon-name">el-icon-eleme</span></span>
      </li>
      <li>
        <span><i class="el-icon-delete-solid" @click="check($event)" /><span class="icon-name">el-icon-delete-solid</span></span>
      </li>
      <li>
        <span><i class="el-icon-delete" @click="check($event)" /><span class="icon-name">el-icon-delete</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-tools" @click="check($event)" /><span class="icon-name">el-icon-s-tools</span></span>
      </li>
      <li>
        <span><i class="el-icon-setting" @click="check($event)" /><span class="icon-name">el-icon-setting</span></span>
      </li>
      <li>
        <span><i class="el-icon-user-solid" @click="check($event)" /><span class="icon-name">el-icon-user-solid</span></span>
      </li>
      <li>
        <span><i class="el-icon-user" @click="check($event)" /><span class="icon-name">el-icon-user</span></span>
      </li>
      <li>
        <span><i class="el-icon-phone" @click="check($event)" /><span class="icon-name">el-icon-phone</span></span>
      </li>
      <li>
        <span><i class="el-icon-phone-outline" @click="check($event)" /><span class="icon-name">el-icon-phone-outline</span></span>
      </li>
      <li>
        <span><i class="el-icon-more" @click="check($event)" /><span class="icon-name">el-icon-more</span></span>
      </li>
      <li>
        <span><i class="el-icon-more-outline" @click="check($event)" /><span class="icon-name">el-icon-more-outline</span></span>
      </li>
      <li>
        <span><i class="el-icon-star-on" @click="check($event)" /><span class="icon-name">el-icon-star-on</span></span>
      </li>
      <li>
        <span><i class="el-icon-star-off" @click="check($event)" /><span class="icon-name">el-icon-star-off</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-goods" @click="check($event)" /><span class="icon-name">el-icon-s-goods</span></span>
      </li>
      <li>
        <span><i class="el-icon-goods" @click="check($event)" /><span class="icon-name">el-icon-goods</span></span>
      </li>
      <li>
        <span><i class="el-icon-warning" @click="check($event)" /><span class="icon-name">el-icon-warning</span></span>
      </li>
      <li>
        <span><i class="el-icon-warning-outline" @click="check($event)" /><span class="icon-name">el-icon-warning-outline</span></span>
      </li>
      <li>
        <span><i class="el-icon-question" @click="check($event)" /><span class="icon-name">el-icon-question</span></span>
      </li>
      <li>
        <span><i class="el-icon-info" @click="check($event)" /><span class="icon-name">el-icon-info</span></span>
      </li>
      <li>
        <span><i class="el-icon-remove" @click="check($event)" /><span class="icon-name">el-icon-remove</span></span>
      </li>
      <li>
        <span><i class="el-icon-circle-plus" @click="check($event)" /><span class="icon-name">el-icon-circle-plus</span></span>
      </li>
      <li>
        <span><i class="el-icon-success" @click="check($event)" /><span class="icon-name">el-icon-success</span></span>
      </li>
      <li>
        <span><i class="el-icon-error" @click="check($event)" /><span class="icon-name">el-icon-error</span></span>
      </li>
      <li>
        <span><i class="el-icon-zoom-in" @click="check($event)" /><span class="icon-name">el-icon-zoom-in</span></span>
      </li>
      <li>
        <span><i class="el-icon-zoom-out" @click="check($event)" /><span class="icon-name">el-icon-zoom-out</span></span>
      </li>
      <li>
        <span><i class="el-icon-remove-outline" @click="check($event)" /><span class="icon-name">el-icon-remove-outline</span></span>
      </li>
      <li>
        <span><i class="el-icon-circle-plus-outline" @click="check($event)" /><span class="icon-name">el-icon-circle-plus-outline</span></span>
      </li>
      <li>
        <span><i class="el-icon-circle-check" @click="check($event)" /><span class="icon-name">el-icon-circle-check</span></span>
      </li>
      <li>
        <span><i class="el-icon-circle-close" @click="check($event)" /><span class="icon-name">el-icon-circle-close</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-help" @click="check($event)" /><span class="icon-name">el-icon-s-help</span></span>
      </li>
      <li>
        <span><i class="el-icon-help" @click="check($event)" /><span class="icon-name">el-icon-help</span></span>
      </li>
      <li>
        <span><i class="el-icon-minus" @click="check($event)" /><span class="icon-name">el-icon-minus</span></span>
      </li>
      <li>
        <span><i class="el-icon-plus" @click="check($event)" /><span class="icon-name">el-icon-plus</span></span>
      </li>
      <li>
        <span><i class="el-icon-check" @click="check($event)" /><span class="icon-name">el-icon-check</span></span>
      </li>
      <li>
        <span><i class="el-icon-close" @click="check($event)" /><span class="icon-name">el-icon-close</span></span>
      </li>
      <li>
        <span><i class="el-icon-picture" @click="check($event)" /><span class="icon-name">el-icon-picture</span></span>
      </li>
      <li>
        <span><i class="el-icon-picture-outline" @click="check($event)" /><span class="icon-name">el-icon-picture-outline</span></span>
      </li>
      <li>
        <span><i class="el-icon-picture-outline-round" @click="check($event)" /><span class="icon-name">el-icon-picture-outline-round</span></span>
      </li>
      <li>
        <span><i class="el-icon-upload" @click="check($event)" /><span class="icon-name">el-icon-upload</span></span>
      </li>
      <li>
        <span><i class="el-icon-upload2" @click="check($event)" /><span class="icon-name">el-icon-upload2</span></span>
      </li>
      <li>
        <span><i class="el-icon-download" @click="check($event)" /><span class="icon-name">el-icon-download</span></span>
      </li>
      <li>
        <span><i class="el-icon-camera-solid" @click="check($event)" /><span class="icon-name">el-icon-camera-solid</span></span>
      </li>
      <li>
        <span><i class="el-icon-camera" @click="check($event)" /><span class="icon-name">el-icon-camera</span></span>
      </li>
      <li>
        <span><i class="el-icon-video-camera-solid" @click="check($event)" /><span class="icon-name">el-icon-video-camera-solid</span></span>
      </li>
      <li>
        <span><i class="el-icon-video-camera" @click="check($event)" /><span class="icon-name">el-icon-video-camera</span></span>
      </li>
      <li>
        <span><i class="el-icon-message-solid" @click="check($event)" /><span class="icon-name">el-icon-message-solid</span></span>
      </li>
      <li>
        <span><i class="el-icon-bell" @click="check($event)" /><span class="icon-name">el-icon-bell</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-cooperation" @click="check($event)" /><span class="icon-name">el-icon-s-cooperation</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-order" @click="check($event)" /><span class="icon-name">el-icon-s-order</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-platform" @click="check($event)" /><span class="icon-name">el-icon-s-platform</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-fold" @click="check($event)" /><span class="icon-name">el-icon-s-fold</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-unfold" @click="check($event)" /><span class="icon-name">el-icon-s-unfold</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-operation" @click="check($event)" /><span class="icon-name">el-icon-s-operation</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-promotion" @click="check($event)" /><span class="icon-name">el-icon-s-promotion</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-home" @click="check($event)" /><span class="icon-name">el-icon-s-home</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-release" @click="check($event)" /><span class="icon-name">el-icon-s-release</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-ticket" @click="check($event)" /><span class="icon-name">el-icon-s-ticket</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-management" @click="check($event)" /><span class="icon-name">el-icon-s-management</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-open" @click="check($event)" /><span class="icon-name">el-icon-s-open</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-shop" @click="check($event)" /><span class="icon-name">el-icon-s-shop</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-marketing" @click="check($event)" /><span class="icon-name">el-icon-s-marketing</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-flag" @click="check($event)" /><span class="icon-name">el-icon-s-flag</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-comment" @click="check($event)" /><span class="icon-name">el-icon-s-comment</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-finance" @click="check($event)" /><span class="icon-name">el-icon-s-finance</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-claim" @click="check($event)" /><span class="icon-name">el-icon-s-claim</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-custom" @click="check($event)" /><span class="icon-name">el-icon-s-custom</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-opportunity" @click="check($event)" /><span class="icon-name">el-icon-s-opportunity</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-data" @click="check($event)" /><span class="icon-name">el-icon-s-data</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-check" @click="check($event)" /><span class="icon-name">el-icon-s-check</span></span>
      </li>
      <li>
        <span><i class="el-icon-s-grid" @click="check($event)" /><span class="icon-name">el-icon-s-grid</span></span>
      </li>
      <li>
        <span><i class="el-icon-menu" @click="check($event)" /><span class="icon-name">el-icon-menu</span></span>
      </li>
      <li>
        <span><i class="el-icon-share" @click="check($event)" /><span class="icon-name">el-icon-share</span></span>
      </li>
      <li>
        <span><i class="el-icon-d-caret" @click="check($event)" /><span class="icon-name">el-icon-d-caret</span></span>
      </li>
      <li>
        <span><i class="el-icon-caret-left" @click="check($event)" /><span class="icon-name">el-icon-caret-left</span></span>
      </li>
      <li>
        <span><i class="el-icon-caret-right" @click="check($event)" /><span class="icon-name">el-icon-caret-right</span></span>
      </li>
      <li>
        <span><i class="el-icon-caret-bottom" @click="check($event)" /><span class="icon-name">el-icon-caret-bottom</span></span>
      </li>
      <li>
        <span><i class="el-icon-caret-top" @click="check($event)" /><span class="icon-name">el-icon-caret-top</span></span>
      </li>
      <li>
        <span><i class="el-icon-bottom-left" @click="check($event)" /><span class="icon-name">el-icon-bottom-left</span></span>
      </li>
      <li>
        <span><i class="el-icon-bottom-right" @click="check($event)" /><span class="icon-name">el-icon-bottom-right</span></span>
      </li>
      <li>
        <span><i class="el-icon-back" @click="check($event)" /><span class="icon-name">el-icon-back</span></span>
      </li>
      <li>
        <span><i class="el-icon-right" @click="check($event)" /><span class="icon-name">el-icon-right</span></span>
      </li>
      <li>
        <span><i class="el-icon-bottom" @click="check($event)" /><span class="icon-name">el-icon-bottom</span></span>
      </li>
      <li>
        <span><i class="el-icon-top" @click="check($event)" /><span class="icon-name">el-icon-top</span></span>
      </li>
      <li>
        <span><i class="el-icon-top-left" @click="check($event)" /><span class="icon-name">el-icon-top-left</span></span>
      </li>
      <li>
        <span><i class="el-icon-top-right" @click="check($event)" /><span class="icon-name">el-icon-top-right</span></span>
      </li>
      <li>
        <span><i class="el-icon-arrow-left" @click="check($event)" /><span class="icon-name">el-icon-arrow-left</span></span>
      </li>
      <li>
        <span><i class="el-icon-arrow-right" @click="check($event)" /><span class="icon-name">el-icon-arrow-right</span></span>
      </li>
      <li>
        <span><i class="el-icon-arrow-down" @click="check($event)" /><span class="icon-name">el-icon-arrow-down</span></span>
      </li>
      <li>
        <span><i class="el-icon-arrow-up" @click="check($event)" /><span class="icon-name">el-icon-arrow-up</span></span>
      </li>
      <li>
        <span><i class="el-icon-d-arrow-left" @click="check($event)" /><span class="icon-name">el-icon-d-arrow-left</span></span>
      </li>
      <li>
        <span><i class="el-icon-d-arrow-right" @click="check($event)" /><span class="icon-name">el-icon-d-arrow-right</span></span>
      </li>
      <li>
        <span><i class="el-icon-video-pause" @click="check($event)" /><span class="icon-name">el-icon-video-pause</span></span>
      </li>
      <li>
        <span><i class="el-icon-video-play" @click="check($event)" /><span class="icon-name">el-icon-video-play</span></span>
      </li>
      <li>
        <span><i class="el-icon-refresh" @click="check($event)" /><span class="icon-name">el-icon-refresh</span></span>
      </li>
      <li>
        <span><i class="el-icon-refresh-right" @click="check($event)" /><span class="icon-name">el-icon-refresh-right</span></span>
      </li>
      <li>
        <span><i class="el-icon-refresh-left" @click="check($event)" /><span class="icon-name">el-icon-refresh-left</span></span>
      </li>
      <li>
        <span><i class="el-icon-finished" @click="check($event)" /><span class="icon-name">el-icon-finished</span></span>
      </li>
      <li>
        <span><i class="el-icon-sort" @click="check($event)" /><span class="icon-name">el-icon-sort</span></span>
      </li>
      <li>
        <span><i class="el-icon-sort-up" @click="check($event)" /><span class="icon-name">el-icon-sort-up</span></span>
      </li>
      <li>
        <span><i class="el-icon-sort-down" @click="check($event)" /><span class="icon-name">el-icon-sort-down</span></span>
      </li>
      <li>
        <span><i class="el-icon-rank" @click="check($event)" /><span class="icon-name">el-icon-rank</span></span>
      </li>
      <li>
        <span><i class="el-icon-loading" @click="check($event)" /><span class="icon-name">el-icon-loading</span></span>
      </li>
      <li>
        <span><i class="el-icon-view" @click="check($event)" /><span class="icon-name">el-icon-view</span></span>
      </li>
      <li>
        <span><i class="el-icon-c-scale-to-original" @click="check($event)" /><span class="icon-name">el-icon-c-scale-to-original</span></span>
      </li>
      <li>
        <span><i class="el-icon-date" @click="check($event)" /><span class="icon-name">el-icon-date</span></span>
      </li>
      <li>
        <span><i class="el-icon-edit" @click="check($event)" /><span class="icon-name">el-icon-edit</span></span>
      </li>
      <li>
        <span><i class="el-icon-edit-outline" @click="check($event)" /><span class="icon-name">el-icon-edit-outline</span></span>
      </li>
      <li>
        <span><i class="el-icon-folder" @click="check($event)" /><span class="icon-name">el-icon-folder</span></span>
      </li>
      <li>
        <span><i class="el-icon-folder-opened" @click="check($event)" /><span class="icon-name">el-icon-folder-opened</span></span>
      </li>
      <li>
        <span><i class="el-icon-folder-add" @click="check($event)" /><span class="icon-name">el-icon-folder-add</span></span>
      </li>
      <li>
        <span><i class="el-icon-folder-remove" @click="check($event)" /><span class="icon-name">el-icon-folder-remove</span></span>
      </li>
      <li>
        <span><i class="el-icon-folder-delete" @click="check($event)" /><span class="icon-name">el-icon-folder-delete</span></span>
      </li>
      <li>
        <span><i class="el-icon-folder-checked" @click="check($event)" /><span class="icon-name">el-icon-folder-checked</span></span>
      </li>
      <li>
        <span><i class="el-icon-tickets" @click="check($event)" /><span class="icon-name">el-icon-tickets</span></span>
      </li>
      <li>
        <span><i class="el-icon-document-remove" @click="check($event)" /><span class="icon-name">el-icon-document-remove</span></span>
      </li>
      <li>
        <span><i class="el-icon-document-delete" @click="check($event)" /><span class="icon-name">el-icon-document-delete</span></span>
      </li>
      <li>
        <span><i class="el-icon-document-copy" @click="check($event)" /><span class="icon-name">el-icon-document-copy</span></span>
      </li>
      <li>
        <span><i class="el-icon-document-checked" @click="check($event)" /><span class="icon-name">el-icon-document-checked</span></span>
      </li>
      <li>
        <span><i class="el-icon-document" @click="check($event)" /><span class="icon-name">el-icon-document</span></span>
      </li>
      <li>
        <span><i class="el-icon-document-add" @click="check($event)" /><span class="icon-name">el-icon-document-add</span></span>
      </li>
      <li>
        <span><i class="el-icon-printer" @click="check($event)" /><span class="icon-name">el-icon-printer</span></span>
      </li>
      <li>
        <span><i class="el-icon-paperclip" @click="check($event)" /><span class="icon-name">el-icon-paperclip</span></span>
      </li>
      <li>
        <span><i class="el-icon-takeaway-box" @click="check($event)" /><span class="icon-name">el-icon-takeaway-box</span></span>
      </li>
      <li>
        <span><i class="el-icon-search" @click="check($event)" /><span class="icon-name">el-icon-search</span></span>
      </li>
      <li>
        <span><i class="el-icon-monitor" @click="check($event)" /><span class="icon-name">el-icon-monitor</span></span>
      </li>
      <li>
        <span><i class="el-icon-attract" @click="check($event)" /><span class="icon-name">el-icon-attract</span></span>
      </li>
      <li>
        <span><i class="el-icon-mobile" @click="check($event)" /><span class="icon-name">el-icon-mobile</span></span>
      </li>
      <li>
        <span><i class="el-icon-scissors" @click="check($event)" /><span class="icon-name">el-icon-scissors</span></span>
      </li>
      <li>
        <span><i class="el-icon-umbrella" @click="check($event)" /><span class="icon-name">el-icon-umbrella</span></span>
      </li>
      <li>
        <span><i class="el-icon-headset" @click="check($event)" /><span class="icon-name">el-icon-headset</span></span>
      </li>
      <li>
        <span><i class="el-icon-brush" @click="check($event)" /><span class="icon-name">el-icon-brush</span></span>
      </li>
      <li>
        <span><i class="el-icon-mouse" @click="check($event)" /><span class="icon-name">el-icon-mouse</span></span>
      </li>
      <li>
        <span><i class="el-icon-coordinate" @click="check($event)" /><span class="icon-name">el-icon-coordinate</span></span>
      </li>
      <li>
        <span><i class="el-icon-magic-stick" @click="check($event)" /><span class="icon-name">el-icon-magic-stick</span></span>
      </li>
      <li>
        <span><i class="el-icon-reading" @click="check($event)" /><span class="icon-name">el-icon-reading</span></span>
      </li>
      <li>
        <span><i class="el-icon-data-line" @click="check($event)" /><span class="icon-name">el-icon-data-line</span></span>
      </li>
      <li>
        <span><i class="el-icon-data-board" @click="check($event)" /><span class="icon-name">el-icon-data-board</span></span>
      </li>
      <li>
        <span><i class="el-icon-pie-chart" @click="check($event)" /><span class="icon-name">el-icon-pie-chart</span></span>
      </li>
      <li>
        <span><i class="el-icon-data-analysis" @click="check($event)" /><span class="icon-name">el-icon-data-analysis</span></span>
      </li>
      <li>
        <span><i class="el-icon-collection-tag" @click="check($event)" /><span class="icon-name">el-icon-collection-tag</span></span>
      </li>
      <li>
        <span><i class="el-icon-film" @click="check($event)" /><span class="icon-name">el-icon-film</span></span>
      </li>
      <li>
        <span><i class="el-icon-suitcase" @click="check($event)" /><span class="icon-name">el-icon-suitcase</span></span>
      </li>
      <li>
        <span><i class="el-icon-suitcase-1" @click="check($event)" /><span class="icon-name">el-icon-suitcase-1</span></span>
      </li>
      <li>
        <span><i class="el-icon-receiving" @click="check($event)" /><span class="icon-name">el-icon-receiving</span></span>
      </li>
      <li>
        <span><i class="el-icon-collection" @click="check($event)" /><span class="icon-name">el-icon-collection</span></span>
      </li>
      <li>
        <span><i class="el-icon-files" @click="check($event)" /><span class="icon-name">el-icon-files</span></span>
      </li>
      <li>
        <span><i class="el-icon-notebook-1" @click="check($event)" /><span class="icon-name">el-icon-notebook-1</span></span>
      </li>
      <li>
        <span><i class="el-icon-notebook-2" @click="check($event)" /><span class="icon-name">el-icon-notebook-2</span></span>
      </li>
      <li>
        <span><i class="el-icon-toilet-paper" @click="check($event)" /><span class="icon-name">el-icon-toilet-paper</span></span>
      </li>
      <li>
        <span><i class="el-icon-office-building" @click="check($event)" /><span class="icon-name">el-icon-office-building</span></span>
      </li>
      <li>
        <span><i class="el-icon-school" @click="check($event)" /><span class="icon-name">el-icon-school</span></span>
      </li>
      <li>
        <span><i class="el-icon-table-lamp" @click="check($event)" /><span class="icon-name">el-icon-table-lamp</span></span>
      </li>
      <li>
        <span><i class="el-icon-house" @click="check($event)" /><span class="icon-name">el-icon-house</span></span>
      </li>
      <li>
        <span><i class="el-icon-no-smoking" @click="check($event)" /><span class="icon-name">el-icon-no-smoking</span></span>
      </li>
      <li>
        <span><i class="el-icon-smoking" @click="check($event)" /><span class="icon-name">el-icon-smoking</span></span>
      </li>
      <li>
        <span><i class="el-icon-shopping-cart-full" @click="check($event)" /><span class="icon-name">el-icon-shopping-cart-full</span></span>
      </li>
      <li>
        <span><i class="el-icon-shopping-cart-1" @click="check($event)" /><span class="icon-name">el-icon-shopping-cart-1</span></span>
      </li>
      <li>
        <span><i class="el-icon-shopping-cart-2" @click="check($event)" /><span class="icon-name">el-icon-shopping-cart-2</span></span>
      </li>
      <li>
        <span><i class="el-icon-shopping-bag-1" @click="check($event)" /><span class="icon-name">el-icon-shopping-bag-1</span></span>
      </li>
      <li>
        <span><i class="el-icon-shopping-bag-2" @click="check($event)" /><span class="icon-name">el-icon-shopping-bag-2</span></span>
      </li>
      <li>
        <span><i class="el-icon-sold-out" @click="check($event)" /><span class="icon-name">el-icon-sold-out</span></span>
      </li>
      <li>
        <span><i class="el-icon-sell" @click="check($event)" /><span class="icon-name">el-icon-sell</span></span>
      </li>
      <li>
        <span><i class="el-icon-present" @click="check($event)" /><span class="icon-name">el-icon-present</span></span>
      </li>
      <li>
        <span><i class="el-icon-box" @click="check($event)" /><span class="icon-name">el-icon-box</span></span>
      </li>
      <li>
        <span><i class="el-icon-bank-card" @click="check($event)" /><span class="icon-name">el-icon-bank-card</span></span>
      </li>
      <li>
        <span><i class="el-icon-money" @click="check($event)" /><span class="icon-name">el-icon-money</span></span>
      </li>
      <li>
        <span><i class="el-icon-coin" @click="check($event)" /><span class="icon-name">el-icon-coin</span></span>
      </li>
      <li>
        <span><i class="el-icon-wallet" @click="check($event)" /><span class="icon-name">el-icon-wallet</span></span>
      </li>
      <li>
        <span><i class="el-icon-discount" @click="check($event)" /><span class="icon-name">el-icon-discount</span></span>
      </li>
      <li>
        <span><i class="el-icon-price-tag" @click="check($event)" /><span class="icon-name">el-icon-price-tag</span></span>
      </li>
      <li>
        <span><i class="el-icon-news" @click="check($event)" /><span class="icon-name">el-icon-news</span></span>
      </li>
      <li>
        <span><i class="el-icon-guide" @click="check($event)" /><span class="icon-name">el-icon-guide</span></span>
      </li>
      <li>
        <span><i class="el-icon-male" @click="check($event)" /><span class="icon-name">el-icon-male</span></span>
      </li>
      <li>
        <span><i class="el-icon-female" @click="check($event)" /><span class="icon-name">el-icon-female</span></span>
      </li>
      <li>
        <span><i class="el-icon-thumb" @click="check($event)" /><span class="icon-name">el-icon-thumb</span></span>
      </li>
      <li>
        <span><i class="el-icon-cpu" @click="check($event)" /><span class="icon-name">el-icon-cpu</span></span>
      </li>
      <li>
        <span><i class="el-icon-link" @click="check($event)" /><span class="icon-name">el-icon-link</span></span>
      </li>
      <li>
        <span><i class="el-icon-connection" @click="check($event)" /><span class="icon-name">el-icon-connection</span></span>
      </li>
      <li>
        <span><i class="el-icon-open" @click="check($event)" /><span class="icon-name">el-icon-open</span></span>
      </li>
      <li>
        <span><i class="el-icon-turn-off" @click="check($event)" /><span class="icon-name">el-icon-turn-off</span></span>
      </li>
      <li>
        <span><i class="el-icon-set-up" @click="check($event)" /><span class="icon-name">el-icon-set-up</span></span>
      </li>
      <li>
        <span><i class="el-icon-chat-round" @click="check($event)" /><span class="icon-name">el-icon-chat-round</span></span>
      </li>
      <li>
        <span><i class="el-icon-chat-line-round" @click="check($event)" /><span class="icon-name">el-icon-chat-line-round</span></span>
      </li>
      <li>
        <span><i class="el-icon-chat-square" @click="check($event)" /><span class="icon-name">el-icon-chat-square</span></span>
      </li>
      <li>
        <span><i class="el-icon-chat-dot-round" @click="check($event)" /><span class="icon-name">el-icon-chat-dot-round</span></span>
      </li>
      <li>
        <span><i class="el-icon-chat-dot-square" @click="check($event)" /><span class="icon-name">el-icon-chat-dot-square</span></span>
      </li>
      <li>
        <span><i class="el-icon-chat-line-square" @click="check($event)" /><span class="icon-name">el-icon-chat-line-square</span></span>
      </li>
      <li>
        <span><i class="el-icon-message" @click="check($event)" /><span class="icon-name">el-icon-message</span></span>
      </li>
      <li>
        <span><i class="el-icon-postcard" @click="check($event)" /><span class="icon-name">el-icon-postcard</span></span>
      </li>
      <li>
        <span><i class="el-icon-position" @click="check($event)" /><span class="icon-name">el-icon-position</span></span>
      </li>
      <li>
        <span><i class="el-icon-turn-off-microphone" @click="check($event)" /><span class="icon-name">el-icon-turn-off-microphone</span></span>
      </li>
      <li>
        <span><i class="el-icon-microphone" @click="check($event)" /><span class="icon-name">el-icon-microphone</span></span>
      </li>
      <li>
        <span><i class="el-icon-close-notification" @click="check($event)" /><span class="icon-name">el-icon-close-notification</span></span>
      </li>
      <li>
        <span><i class="el-icon-bangzhu" @click="check($event)" /><span class="icon-name">el-icon-bangzhu</span></span>
      </li>
      <li>
        <span><i class="el-icon-time" @click="check($event)" /><span class="icon-name">el-icon-time</span></span>
      </li>
      <li>
        <span><i class="el-icon-odometer" @click="check($event)" /><span class="icon-name">el-icon-odometer</span></span>
      </li>
      <li>
        <span><i class="el-icon-crop" @click="check($event)" /><span class="icon-name">el-icon-crop</span></span>
      </li>
      <li>
        <span><i class="el-icon-aim" @click="check($event)" /><span class="icon-name">el-icon-aim</span></span>
      </li>
      <li>
        <span><i class="el-icon-switch-button" @click="check($event)" /><span class="icon-name">el-icon-switch-button</span></span>
      </li>
      <li>
        <span><i class="el-icon-full-screen" @click="check($event)" /><span class="icon-name">el-icon-full-screen</span></span>
      </li>
      <li>
        <span><i class="el-icon-copy-document" @click="check($event)" /><span class="icon-name">el-icon-copy-document</span></span>
      </li>
      <li>
        <span><i class="el-icon-mic" @click="check($event)" /><span class="icon-name">el-icon-mic</span></span>
      </li>
      <li>
        <span><i class="el-icon-stopwatch" @click="check($event)" /><span class="icon-name">el-icon-stopwatch</span></span>
      </li>
      <li>
        <span><i class="el-icon-medal-1" @click="check($event)" /><span class="icon-name">el-icon-medal-1</span></span>
      </li>
      <li>
        <span><i class="el-icon-medal" @click="check($event)" /><span class="icon-name">el-icon-medal</span></span>
      </li>
      <li>
        <span><i class="el-icon-trophy" @click="check($event)" /><span class="icon-name">el-icon-trophy</span></span>
      </li>
      <li>
        <span><i class="el-icon-trophy-1" @click="check($event)" /><span class="icon-name">el-icon-trophy-1</span></span>
      </li>
      <li>
        <span><i class="el-icon-first-aid-kit" @click="check($event)" /><span class="icon-name">el-icon-first-aid-kit</span></span>
      </li>
      <li>
        <span><i class="el-icon-discover" @click="check($event)" /><span class="icon-name">el-icon-discover</span></span>
      </li>
      <li>
        <span><i class="el-icon-place" @click="check($event)" /><span class="icon-name">el-icon-place</span></span>
      </li>
      <li>
        <span><i class="el-icon-location" @click="check($event)" /><span class="icon-name">el-icon-location</span></span>
      </li>
      <li>
        <span><i class="el-icon-location-outline" @click="check($event)" /><span class="icon-name">el-icon-location-outline</span></span>
      </li>
      <li>
        <span><i class="el-icon-location-information" @click="check($event)" /><span class="icon-name">el-icon-location-information</span></span>
      </li>
      <li>
        <span><i class="el-icon-add-location" @click="check($event)" /><span class="icon-name">el-icon-add-location</span></span>
      </li>
      <li>
        <span><i class="el-icon-delete-location" @click="check($event)" /><span class="icon-name">el-icon-delete-location</span></span>
      </li>
      <li>
        <span><i class="el-icon-map-location" @click="check($event)" /><span class="icon-name">el-icon-map-location</span></span>
      </li>
      <li>
        <span><i class="el-icon-alarm-clock" @click="check($event)" /><span class="icon-name">el-icon-alarm-clock</span></span>
      </li>
      <li>
        <span><i class="el-icon-timer" @click="check($event)" /><span class="icon-name">el-icon-timer</span></span>
      </li>
      <li>
        <span><i class="el-icon-watch-1" @click="check($event)" /><span class="icon-name">el-icon-watch-1</span></span>
      </li>
      <li>
        <span><i class="el-icon-watch" @click="check($event)" /><span class="icon-name">el-icon-watch</span></span>
      </li>
      <li>
        <span><i class="el-icon-lock" @click="check($event)" /><span class="icon-name">el-icon-lock</span></span>
      </li>
      <li>
        <span><i class="el-icon-unlock" @click="check($event)" /><span class="icon-name">el-icon-unlock</span></span>
      </li>
      <li>
        <span><i class="el-icon-key" @click="check($event)" /><span class="icon-name">el-icon-key</span></span>
      </li>
      <li>
        <span><i class="el-icon-service" @click="check($event)" /><span class="icon-name">el-icon-service</span></span>
      </li>
      <li>
        <span><i class="el-icon-mobile-phone" @click="check($event)" /><span class="icon-name">el-icon-mobile-phone</span></span>
      </li>
      <li>
        <span><i class="el-icon-bicycle" @click="check($event)" /><span class="icon-name">el-icon-bicycle</span></span>
      </li>
      <li>
        <span><i class="el-icon-truck" @click="check($event)" /><span class="icon-name">el-icon-truck</span></span>
      </li>
      <li>
        <span><i class="el-icon-ship" @click="check($event)" /><span class="icon-name">el-icon-ship</span></span>
      </li>
      <li>
        <span><i class="el-icon-basketball" @click="check($event)" /><span class="icon-name">el-icon-basketball</span></span>
      </li>
      <li>
        <span><i class="el-icon-football" @click="check($event)" /><span class="icon-name">el-icon-football</span></span>
      </li>
      <li>
        <span><i class="el-icon-soccer" @click="check($event)" /><span class="icon-name">el-icon-soccer</span></span>
      </li>
      <li>
        <span><i class="el-icon-baseball" @click="check($event)" /><span class="icon-name">el-icon-baseball</span></span>
      </li>
      <li>
        <span><i class="el-icon-wind-power" @click="check($event)" /><span class="icon-name">el-icon-wind-power</span></span>
      </li>
      <li>
        <span><i class="el-icon-light-rain" @click="check($event)" /><span class="icon-name">el-icon-light-rain</span></span>
      </li>
      <li>
        <span><i class="el-icon-lightning" @click="check($event)" /><span class="icon-name">el-icon-lightning</span></span>
      </li>
      <li>
        <span><i class="el-icon-heavy-rain" @click="check($event)" /><span class="icon-name">el-icon-heavy-rain</span></span>
      </li>
      <li>
        <span><i class="el-icon-sunrise" @click="check($event)" /><span class="icon-name">el-icon-sunrise</span></span>
      </li>
      <li>
        <span><i class="el-icon-sunrise-1" @click="check($event)" /><span class="icon-name">el-icon-sunrise-1</span></span>
      </li>
      <li>
        <span><i class="el-icon-sunset" @click="check($event)" /><span class="icon-name">el-icon-sunset</span></span>
      </li>
      <li>
        <span><i class="el-icon-sunny" @click="check($event)" /><span class="icon-name">el-icon-sunny</span></span>
      </li>
      <li>
        <span><i class="el-icon-cloudy" @click="check($event)" /><span class="icon-name">el-icon-cloudy</span></span>
      </li>
      <li>
        <span><i class="el-icon-partly-cloudy" @click="check($event)" /><span class="icon-name">el-icon-partly-cloudy</span></span>
      </li>
      <li>
        <span><i class="el-icon-cloudy-and-sunny" @click="check($event)" /><span class="icon-name">el-icon-cloudy-and-sunny</span></span>
      </li>
      <li>
        <span><i class="el-icon-moon" @click="check($event)" /><span class="icon-name">el-icon-moon</span></span>
      </li>
      <li>
        <span><i class="el-icon-moon-night" @click="check($event)" /><span class="icon-name">el-icon-moon-night</span></span>
      </li>
      <li>
        <span><i class="el-icon-dish" @click="check($event)" /><span class="icon-name">el-icon-dish</span></span>
      </li>
      <li>
        <span><i class="el-icon-dish-1" @click="check($event)" /><span class="icon-name">el-icon-dish-1</span></span>
      </li>
      <li>
        <span><i class="el-icon-food" @click="check($event)" /><span class="icon-name">el-icon-food</span></span>
      </li>
      <li>
        <span><i class="el-icon-chicken" @click="check($event)" /><span class="icon-name">el-icon-chicken</span></span>
      </li>
      <li>
        <span><i class="el-icon-fork-spoon" @click="check($event)" /><span class="icon-name">el-icon-fork-spoon</span></span>
      </li>
      <li>
        <span><i class="el-icon-knife-fork" @click="check($event)" /><span class="icon-name">el-icon-knife-fork</span></span>
      </li>
      <li>
        <span><i class="el-icon-burger" @click="check($event)" /><span class="icon-name">el-icon-burger</span></span>
      </li>
      <li>
        <span><i class="el-icon-tableware" @click="check($event)" /><span class="icon-name">el-icon-tableware</span></span>
      </li>
      <li>
        <span><i class="el-icon-sugar" @click="check($event)" /><span class="icon-name">el-icon-sugar</span></span>
      </li>
      <li>
        <span><i class="el-icon-dessert" @click="check($event)" /><span class="icon-name">el-icon-dessert</span></span>
      </li>
      <li>
        <span><i class="el-icon-ice-cream" @click="check($event)" /><span class="icon-name">el-icon-ice-cream</span></span>
      </li>
      <li>
        <span><i class="el-icon-hot-water" @click="check($event)" /><span class="icon-name">el-icon-hot-water</span></span>
      </li>
      <li>
        <span><i class="el-icon-water-cup" @click="check($event)" /><span class="icon-name">el-icon-water-cup</span></span>
      </li>
      <li>
        <span><i class="el-icon-coffee-cup" @click="check($event)" /><span class="icon-name">el-icon-coffee-cup</span></span>
      </li>
      <li>
        <span><i class="el-icon-cold-drink" @click="check($event)" /><span class="icon-name">el-icon-cold-drink</span></span>
      </li>
      <li>
        <span><i class="el-icon-goblet" @click="check($event)" /><span class="icon-name">el-icon-goblet</span></span>
      </li>
      <li>
        <span><i class="el-icon-goblet-full" @click="check($event)" /><span class="icon-name">el-icon-goblet-full</span></span>
      </li>
      <li>
        <span><i class="el-icon-goblet-square" @click="check($event)" /><span class="icon-name">el-icon-goblet-square</span></span>
      </li>
      <li>
        <span><i class="el-icon-goblet-square-full" @click="check($event)" /><span class="icon-name">el-icon-goblet-square-full</span></span>
      </li>
      <li>
        <span><i class="el-icon-refrigerator" @click="check($event)" /><span class="icon-name">el-icon-refrigerator</span></span>
      </li>
      <li>
        <span><i class="el-icon-grape" @click="check($event)" /><span class="icon-name">el-icon-grape</span></span>
      </li>
      <li>
        <span><i class="el-icon-watermelon" @click="check($event)" /><span class="icon-name">el-icon-watermelon</span></span>
      </li>
      <li>
        <span><i class="el-icon-cherry" @click="check($event)" /><span class="icon-name">el-icon-cherry</span></span>
      </li>
      <li>
        <span><i class="el-icon-apple" @click="check($event)" /><span class="icon-name">el-icon-apple</span></span>
      </li>
      <li>
        <span><i class="el-icon-pear" @click="check($event)" /><span class="icon-name">el-icon-pear</span></span>
      </li>
      <li>
        <span><i class="el-icon-orange" @click="check($event)" /><span class="icon-name">el-icon-orange</span></span>
      </li>
      <li>
        <span><i class="el-icon-coffee" @click="check($event)" /><span class="icon-name">el-icon-coffee</span></span>
      </li>
      <li>
        <span><i class="el-icon-ice-tea" @click="check($event)" /><span class="icon-name">el-icon-ice-tea</span></span>
      </li>
      <li>
        <span><i class="el-icon-ice-drink" @click="check($event)" /><span class="icon-name">el-icon-ice-drink</span></span>
      </li>
      <li>
        <span><i class="el-icon-milk-tea" @click="check($event)" /><span class="icon-name">el-icon-milk-tea</span></span>
      </li>
      <li>
        <span><i class="el-icon-potato-strips" @click="check($event)" /><span class="icon-name">el-icon-potato-strips</span></span>
      </li>
      <li>
        <span><i class="el-icon-lollipop" @click="check($event)" /><span class="icon-name">el-icon-lollipop</span></span>
      </li>
      <li>
        <span><i class="el-icon-ice-cream-square" @click="check($event)" /><span class="icon-name">el-icon-ice-cream-square</span></span>
      </li>
      <li>
        <span><i class="el-icon-ice-cream-round" @click="check($event)" /><span class="icon-name">el-icon-ice-cream-round</span></span>
      </li>
    </ul>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      default() {
        return false
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    check(e) {
      this.$emit('close', { name: e.target.className })
    },
    // 取消数据操作
    cancel(done) {
      this.$emit('close', {})
    }
  }
}
</script>

<style>
.icon-list {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
}
.icon-list:not(.timeline) {
  margin: 10px 0;
  padding: 0 0 0 20px;
  font-size: 14px;
  color: #5e6d82;
  line-height: 2em;
}
.icon-list li {
  float: left;
  width: 50px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: #666;
  font-size: 13px;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-right: -1px;
  margin-bottom: -1px;
}
.icon-list li:hover {
  background-color: #ccc;
}
.icon-list li:after,
.icon-list li span {
  display: inline-block;
  vertical-align: middle;
}
ul.icon-list {
  overflow: hidden;
  list-style: none;
  padding: 0 !important;
  border: 1px solid #eaeefb;
  border-radius: 4px;
}
.icon-list li .icon-name {
  display: inline-block;
  display: none;
  padding: 0 3px;
  height: 1em;
}
.icon-list li span {
  line-height: normal;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  color: #666;
  transition: color 0.15s linear;
}
[class*=" el-icon-"],
[class^="el-icon-"] {
  font-family: element-icons !important;
  /* speak: none; */
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon-list li i {
  display: block;
  font-size: 32px;
  margin-bottom: 15px;
  color: #606266;
  transition: color 0.15s linear;
  cursor: pointer;
}
</style>
