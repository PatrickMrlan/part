<template>
  <div>
    <EnterpriseView v-if="$store.state.bigScreenView.enterpriseView" />
    <RiskView v-if="$store.state.bigScreenView.riskView" />
    <!-- <Hidden v-if="$store.state.bigScreenView.hiddenView" /> -->
    <EmergencyView v-if="$store.state.bigScreenView.emergencyView" />
  </div>
</template>

<script>
import EnterpriseView from "./enterprise/index.vue";
import RiskView from "./risk/index.vue";
import Hidden from "./hidden/index.vue";
import EmergencyView from "./emergencyView/index.vue";
export default {
  components: { EnterpriseView, RiskView, EmergencyView, Hidden },
};
</script>

<style>
</style>