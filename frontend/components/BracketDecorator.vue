<!-- Demonstrates implementation of a functional component -->

<template functional>
  <span
    class="bracket"
    :class="{
      left: props.brackets[0].left,
      right: props.brackets[0].right,
      [props.className]: true,
    }"
    :style="{
      'border-top-color': props.brackets[0].color,
      'border-top-style': props.brackets[0].style,
    }"
  ><template
    v-if="props.brackets.length && props.brackets.length > 1"
    ><BracketDecorator
      :brackets="props.brackets.slice(1)"
      :className="props.className"
    ><slot></slot></BracketDecorator></template><template
    v-else
    ><slot></slot></template></span>
</template>

<script>
export default {
  name: 'BracketDecorator',
  props: {
    brackets: {
      type: Array,
      required: true
    },
    className: {
      type: String,
      required: false
    }
  }
}
</script>

<style lang="scss">
.bracket {
  border-top-width: 2px;
  border-top-style: solid;
  &.left {
    border-top-left-radius: 6px;
  }
  &.right {
    border-top-right-radius: 6px;
  }
}
</style>
