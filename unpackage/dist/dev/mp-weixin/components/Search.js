"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  props: {
    placeholder: {
      type: String,
      default: "搜索商品/类别"
    },
    suggestions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      inputValue: "",
      showSuggestions: false
    };
  },
  watch: {
    suggestions(val) {
      this.showSuggestions = !!this.inputValue && val.length > 0;
    }
  },
  methods: {
    onInput(e) {
      this.inputValue = e.detail.value;
      this.$emit("input", this.inputValue);
      this.showSuggestions = !!this.inputValue && this.suggestions.length > 0;
    },
    onSearch() {
      this.showSuggestions = false;
      this.$emit("search", this.inputValue);
    },
    selectSuggestion(item) {
      this.inputValue = item.name;
      this.showSuggestions = false;
      this.$emit("select", item);
    },
    onFocus() {
      this.showSuggestions = !!this.inputValue && this.suggestions.length > 0;
    },
    onBlur() {
      setTimeout(() => {
        this.showSuggestions = false;
      }, 200);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.placeholder,
    b: common_vendor.o([($event) => $data.inputValue = $event.detail.value, (...args) => $options.onInput && $options.onInput(...args)]),
    c: common_vendor.o((...args) => $options.onSearch && $options.onSearch(...args)),
    d: common_vendor.o((...args) => $options.onFocus && $options.onFocus(...args)),
    e: common_vendor.o((...args) => $options.onBlur && $options.onBlur(...args)),
    f: $data.inputValue,
    g: common_vendor.o((...args) => $options.onSearch && $options.onSearch(...args)),
    h: $data.showSuggestions && $props.suggestions.length
  }, $data.showSuggestions && $props.suggestions.length ? {
    i: common_vendor.f($props.suggestions, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: item.id || item.name,
        c: common_vendor.o(($event) => $options.selectSuggestion(item), item.id || item.name)
      };
    })
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/Search.js.map
