"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_products = require("../../utils/products.js");
const utils_user = require("../../utils/user.js");
const _sfc_main = {
  data() {
    return {
      categories: [
        {
          id: "all",
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
      currentCategory: "all",
      products: [],
      userBalance: 0
    };
  },
  onLoad(options) {
    if (options.category) {
      this.currentCategory = options.category;
    }
    this.loadProducts();
    this.userBalance = utils_user.userData.getUserInfo().balance / 1e4;
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
        url: "/pages/detail/detail?id=" + productId
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.categories, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: index,
        c: $data.currentCategory === item.id ? 1 : "",
        d: common_vendor.o(($event) => $options.switchCategory(item.id), index)
      };
    }),
    b: common_vendor.f($data.products, (item, index, i0) => {
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
