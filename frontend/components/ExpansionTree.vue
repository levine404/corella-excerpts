<!-- Demonstrates implementation of 3rd party components, customization, and recurisve components -->

<template>
  <q-expansion-item
    expand-icon-toggle
    :label="node.label"
    :default-opened="!level"
    :expand-icon-class="
      node.children && node.children.length && !noArrow
        ? 'default'
        : 'invisible'
    "
  >
    <template v-slot:header="props">
      <div class="q-item__section column q-item__section--main justify-center clickable q-hoverable cursor-pointer">
        <div class="q-item__label">
          <slot
            :node="node"
            :level="level"
          ></slot>
        </div>
      </div>
    </template>
    <ExpansionTree
      v-for="child in node.children"
      :key="child.itemId"
      :node="child"
      :level="(level || 0) + 1"
    >
      <template v-slot="{
        node: subNode,
        level: subLevel
      }">
        <slot
          :node="subNode"
          :level="subLevel"
        ></slot>
      </template>
    </ExpansionTree>
  </q-expansion-item>
</template>

<script>
export default {
  name: 'ExpansionTree',
  props: {
    node: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      required: false
    },
    noArrow: {
      type: Boolean,
      required: false
    }
  }
}
</script>

<style lang="scss">
.invisible {
  opacity: 0;
}
</style>
