<template>
  <q-page class="master-node-page" style="min-height: unset">
    <div v-if="toggleVisible" class="header row items-center justify-left ">
      <q-btn-toggle
        v-model="screen"
        toggle-color="primary"
        color="accent"
        :options="[
          {
            label: $t('titles.masterNode.myStakes'),
            value: 'myStakes'
          },
          {
            label: $t('titles.masterNode.staking'),
            value: 'staking'
          },
          {
            label: $t('titles.masterNode.registration'),
            value: 'registration'
          }
        ]"
      />
    </div>
    <MasterNodeUnlock
      v-if="screen === 'myStakes'"
      @onChangeVisible="onChangeVisible"
    />
    <MasterNodeStaking
      v-if="screen === 'staking'"
      :toggle-visible="toggleVisible"
      @onChangeVisible="onChangeVisible"
    />
    <MasterNodeRegistration v-if="screen === 'registration'" />
  </q-page>
</template>

<script>
import MasterNodeStaking from "components/master_node/master_node_staking";
import MasterNodeRegistration from "components/master_node/master_node_registration";
import MasterNodeUnlock from "components/master_node/master_node_unlock";

export default {
  components: {
    MasterNodeStaking,
    MasterNodeRegistration,
    MasterNodeUnlock
  },

  data() {
    return {
      screen: "staking",
      toggleVisible: true
    };
  },
  methods: {
    onChangeVisible(value) {
      this.toggleVisible = value;
    }
  }
};
</script>

<style lang="scss">
// .master-node-page {
// height: 51vh;
// overflow: auto;
// background-color: #242433;
// padding: 15px;
// border-radius: 20px;
// -webkit-box-shadow: 0px 6px 24px rgba(0, 0, 0, 0.2);
// box-shadow: 0px 6px 24px rgba(0, 0, 0, 0.2);
// width: 100%;
/* MARGIN: 90PX AUTO 0; */
// }
</style>
