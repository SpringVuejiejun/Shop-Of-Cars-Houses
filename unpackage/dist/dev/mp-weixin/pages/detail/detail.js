"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_user = require("../../utils/user.js");
const utils_products = require("../../utils/products.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      product: null,
      selectedSku: null,
      userBalance: 0
    };
  },
  onLoad(options) {
    this.product = utils_products.products.getProductById(options.id);
    if (!this.product) {
      common_vendor.index.showToast({
        title: "商品不存在",
        icon: "none"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
      return;
    }
    this.selectedSku = this.product.skus[0];
    this.userBalance = utils_user.userData.getUserInfo().balance / 1e4;
  },
  methods: {
    selectSku(sku) {
      this.selectedSku = sku;
    },
    startBargain() {
      common_vendor.index.navigateTo({
        url: "/pages/bargain/bargain?id=" + this.product.id
      });
    },
    buyNow() {
      if (this.userBalance < this.selectedSku.price) {
        common_vendor.index.showModal({
          title: "余额不足",
          content: "您的账户余额不足，请继续努力",
          showCancel: false,
          confirmText: "好的"
        });
        return;
      }
      const order = {
        id: Date.now(),
        productId: this.product.id,
        productName: this.product.name,
        productImage: this.product.images[0],
        // image: this.product.image,
        sku: this.selectedSku,
        price: this.selectedSku.price,
        status: "待付款",
        createTime: (/* @__PURE__ */ new Date()).toISOString()
      };
      utils_user.userData.updateBalance(-this.selectedSku.price * 1e4);
      utils_user.userData.addOrder(order);
      common_vendor.index.showToast({
        title: "已加入订单，请前往订单页面付款",
        icon: "success"
      });
    },
    goToBargain() {
      common_vendor.index.navigateTo({
        url: "/pages/bargain/bargain?id=" + this.product.id
      });
    },
    goToMenu() {
      common_vendor.index.switchTab({
        url: "/pages/menu/menu"
      });
    },
    goToUser() {
      common_vendor.index.switchTab({
        url: "/pages/user/user"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.product.images, (image, index, i0) => {
      return {
        a: image,
        b: index
      };
    }),
    b: common_vendor.t($data.product.name),
    c: common_vendor.t($data.selectedSku.price),
    d: common_vendor.t($data.product.description),
    e: common_vendor.f($data.product.skus, (sku, index, i0) => {
      return {
        a: common_vendor.t(sku.name),
        b: index,
        c: $data.selectedSku.id === sku.id ? 1 : "",
        d: common_vendor.o(($event) => $options.selectSku(sku), index)
      };
    }),
    f: common_vendor.f($data.selectedSku.features, (feature, index, i0) => {
      return {
        a: common_vendor.t(feature),
        b: index
      };
    }),
    g: common_assets._imports_0$1,
    h: common_vendor.o((...args) => $options.goToMenu && $options.goToMenu(...args)),
    i: common_assets._imports_1$1,
    j: common_vendor.o((...args) => $options.goToUser && $options.goToUser(...args)),
    k: common_vendor.o((...args) => $options.startBargain && $options.startBargain(...args)),
    l: common_vendor.o((...args) => $options.buyNow && $options.buyNow(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
