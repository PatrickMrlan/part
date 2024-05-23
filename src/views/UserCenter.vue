<template>
  <div class="user-center-wrapper clear-fix">
    <el-card shadow="always" :body-style="{ padding: '50px' }">
      <div class="user-avatar">
        <img
          width="50"
          v-if="userInfo.picture"
          :src="serverUrl + userInfo.picture"
          alt="avatar"
        />
        <img v-else src="../assets/img/avatar.png" alt="avatar" />
      </div>
      <ul class="user-info">
        <li>
          <label>公司：</label>
          <span>{{ ent.entShortName || ent.entFullName }}</span>
        </li>
        <li>
          <label>部门：</label>
          <span>{{ dep }}</span>
        </li>
        <li>
          <label>登录账号：</label>
          <span>{{ userInfo.account }}</span>
        </li>
        <li>
          <label>用户名：</label>
          <span>{{ userInfo.userName }}</span>
        </li>
        <li>
          <label>电话号码：</label>
          <span>{{ userInfo.tel }}</span>
        </li>
        <li>
          <label>角色：</label>
          <span>{{ userInfo.roleNameStr }}</span>
        </li>
        <li>
          <label>创建时间：</label>
          <span>{{ userInfo.addTime }}</span>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script>
import { getUserInfo } from "../api/login";

export default {
  name: "UserCenter",
  data() {
    return {
      serverUrl: process.env.VUE_APP_BASE_API,
      userInfo: {},
      dep: null,
      ent: {},
    };
  },
  created() {
    getUserInfo().then((res) => {
      console.log(res);
      this.userInfo = res.user;
      this.dep = res.dep || res.user.cloudDepartment.depName;
      this.ent = res.ent;
    });
  },
};
</script>

<style lang="less" scoped>
.user-center-wrapper {
  .user-avatar img {
    float: left;
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
  .user-info {
    float: left;
    width: 800px;
    margin-left: 50px;
    margin-bottom: 50px;
    li {
      height: 34px;
      line-height: 34px;
      label,
      span {
        display: inline-block;
        vertical-align: middle;
      }
      label {
        width: 80px;
        margin-right: 12px;
        text-align: right;
      }
    }
  }
}
</style>