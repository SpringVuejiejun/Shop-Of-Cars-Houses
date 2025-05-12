"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_products = require("../../utils/products.js");
const utils_user = require("../../utils/user.js");
const Search = () => "../../components/Search.js";
const _sfc_main = {
  components: { Search },
  data() {
    return {
      categories: [
        {
          id: "luxury",
          name: "全部"
        },
        {
          id: "car",
          name: "豪车"
        },
        {
          id: "house",
          name: "豪宅"
        }
      ],
      currentCategory: "luxury",
      products: [],
      userBalance: 0,
      suggestions: []
    };
  },
  onLoad(options) {
    if (options.category) {
      this.currentCategory = options.category;
    }
    this.loadProducts();
    this.userBalance = utils_user.userData.getUserInfo().balance / 1e4;
  },
  onShow() {
    const category = common_vendor.index.getStorageSync("menuCategory");
    if (category) {
      this.currentCategory = category;
      this.loadProducts();
      common_vendor.index.removeStorageSync("menuCategory");
    }
  },
  methods: {
    switchCategory(category) {
      this.currentCategory = category;
      this.loadProducts();
    },
    loadProducts() {
      this.products = utils_products.products.getProductsByCategory(this.currentCategory);
    },
    goToDetail(productId) {
      common_vendor.index.navigateTo({
        url: "/pages/son_pages/detail?id=" + productId
      });
    },
    // 搜索組件相關
    onInput(val) {
      this.suggestions = utils_products.products.getSuggestions ? utils_products.products.getSuggestions(val) : [];
    },
    handleSearch(keyword) {
    }
  }
};
if (!Array) {
  const _component_Search = common_vendor.resolveComponent("Search");
  _component_Search();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.onInput),
    b: common_vendor.o($options.handleSearch),
    c: common_vendor.p({
      suggestions: $data.suggestions
    }),
    d: common_vendor.f($data.categories, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: index,
        c: $data.currentCategory === item.id ? 1 : "",
        d: common_vendor.o(($event) => $options.switchCategory(item.id), index)
      };
    }),
    e: common_vendor.f($data.products, (item, index, i0) => {
      return common_vendor.e({
        a: item.images[0],
        b: common_vendor.o(($event) => $options.goToDetail(item.id), index),
        c: common_vendor.t(item.name),
        d: common_vendor.o(($event) => $options.goToDetail(item.id), index),
        e: common_vendor.t(item.skus[0].price),
        f: common_vendor.t(item.description),
        g: item.canBargain
      }, item.canBargain ? {} : {}, {
        h: common_vendor.f(item.skus[0].features.slice(0, 2), (feature, fIndex, i1) => {
          return {
            a: common_vendor.t(feature),
            b: fIndex
          };
        }),
        i: index
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/menu/menu.js.map
