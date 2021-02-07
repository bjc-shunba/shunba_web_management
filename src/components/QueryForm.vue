<template>
  <div>
    <slot ref="childNodes" :labelWidth="labelWidth"></slot>
  </div>
</template>

<script>
function getQueryItems(vm) {
  const queryItems = [];

  vm.$children.forEach(vmNode => {
    if (vmNode.$options.name === "QueryItem") {
      queryItems.push(vmNode);
    }
  });

  return queryItems;
}

export default {
  name: "QueryForm",
  props: {
    labelWidth: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      queryItems: []
    };
  },
  methods: {
    value() {
      const query = {};

      getQueryItems(this).forEach(item => {
        try {
          if (item.isEmpty()) {
            return;
          }

          const value = item.getValue();

          Object.assign(query, value);
        } catch (e) {
          console.error(e);
        }
      });

      return query;
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.queryItems = getQueryItems(this);
      });
    });
  }
};
</script>

<style scoped>
</style>
