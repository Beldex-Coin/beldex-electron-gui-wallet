<template>
  <q-menu
    context-menu
    :content-class="`beldex-menu beldex-menu--compact ${menuClass}`.trim()"
  >
    <q-list separator class="context-menu-list">
      <div v-for="(item, index) in menuItems" :key="index">
        <ContextMenuItem
          :action="item.action"
          :i18n="item.i18n"
          :icon="item.icon"
          :danger="item.danger"
          @clicked="clickedMenu(item, $event)"
        />
      </div>
    </q-list>
  </q-menu>
</template>

<script>
import ContextMenuItem from "./contextmenu_item";

export default {
  name: "ContextMenu",
  components: {
    ContextMenuItem
  },
  props: {
    menuItems: {
      type: Array,
      required: true
    },
    menuClass: {
      type: String,
      default: ""
    }
  },
  methods: {
    clickedMenu(item, event) {
      this.$emit(item.action, event);
    }
  }
};
</script>

<style></style>
