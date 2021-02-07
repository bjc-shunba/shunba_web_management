<template>
  <div>
    <span class="query-item-label" :style='{"minWidth": minWidth}'>{{ label }}</span>
    <slot ref="item"></slot>
  </div>
</template>

<script>
function getComponentValue(vm) {
  if (!vm.$slots.default || vm.$slots.default.length === 0) {
    throw new Error("unknow item: " + vm.prop);
  }

  const model = vm.$slots.default[0];
  if (!model.data || !model.data.model) {
    throw new Error("unknow item: " + vm.prop);
  }

  return model.data.model.value;
}

function trim(value) {
  if (typeof value !== 'string') {
    return value;
  }

  let reg = /(^\s+)|(\s+$)/mg;

  return value.trim(reg, '');
}

export default {
  name: "QueryItem",
  props: {
    label: String,
    queryType: String,
    prop: String,
    labelWidth: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      value: null,
      minWidth: this.labelWidth || this.$parent.labelWidth
    };
  },
  methods: {
    isEmpty() {
      let value = getComponentValue(this);

      if (value === 0 || value === false) return false;

      value = trim(value);

      let flag = !value;

      if (flag) {
        return true;
      }

      if (this.queryType === "in") {
        return value.length === 0;
      }

      return flag;
    },
    getValue() {
      const obj = {};

      const value = trim(getComponentValue(this));
      const propName = this.prop;

      const componentInstance = this.$slots.default[0].componentInstance;
      if (componentInstance.filterValue) {
        obj[propName] = componentInstance.filterValue();
        return obj;
      }

      obj[propName] = {};
      obj[propName][this.queryType] = value;

      return obj;
    }
  }
};
</script>

<style scoped>
  .query-item-label {
    display: inline-block;
    text-align: right;
  }
</style>
