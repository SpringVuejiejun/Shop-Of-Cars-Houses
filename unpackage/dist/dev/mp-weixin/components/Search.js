"use strict";
const common_vendor = require("../common/vendor.js");
const utils_products = require("../utils/products.js");
const uniPopup = () => "../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
const _sfc_main = {
  components: { uniPopup },
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
      showSuggestions: false,
      productList: []
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
      this.productList = utils_products.products.getHotProducts ? utils_products.products.getHotProducts() : utils_products.products.getHotProducts ? utils_products.products.getHotProducts() : [];
      this.$refs.searchPopup.open();
    },
    selectSuggestion(item) {
      this.inputValue = item.name;
      this.showSuggestions = false;
    },
    goToDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?id=${item.id}`
      });
    },
    onFocus() {
      this.showSuggestions = !!this.inputValue && this.suggestions.length > 0;
    },
    onBlur() {
      setTimeout(() => {
        this.showSuggestions = false;
      }, 200);
    },
    closePopup() {
      this.$refs.searchPopup.close();
    }
  }
};
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.onSearch && $options.onSearch(...args)),
    b: $props.placeholder,
    c: common_vendor.o([($event) => $data.inputValue = $event.detail.value, (...args) => $options.onInput && $options.onInput(...args)]),
    d: common_vendor.o((...args) => $options.onSearch && $options.onSearch(...args)),
    e: common_vendor.o((...args) => $options.onFocus && $options.onFocus(...args)),
    f: common_vendor.o((...args) => $options.onBlur && $options.onBlur(...args)),
    g: $data.inputValue,
    h: common_vendor.o((...args) => $options.onSearch && $options.onSearch(...args)),
    i: $data.showSuggestions && $props.suggestions.length
  }, $data.showSuggestions && $props.suggestions.length ? {
    j: common_vendor.f($props.suggestions, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: item.id || item.name,
        c: common_vendor.o(($event) => $options.selectSuggestion(item), item.id || item.name)
      };
    })
  } : {}, {
    k: common_vendor.f($data.productList, (item, k0, i0) => {
      return {
        a: item.images[0],
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.skus[0].price),
        d: common_vendor.t(item.description),
        e: item.id,
        f: common_vendor.o(($event) => $options.goToDetail(item), item.id)
      };
    }),
    l: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args)),
    m: common_vendor.sr("searchPopup", "5af20fc6-0"),
    n: common_vendor.p({
      type: "center"
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/Search.js.map
