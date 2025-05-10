"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_user = require("../../utils/user.js");
const utils_products = require("../../utils/products.js");
const _sfc_main = {
  data() {
    return {
      product: null,
      currentPrice: 0,
      bargainCount: 0,
      records: [],
      isBargaining: false,
      selectedSku: null,
      userBalance: 0,
      maxBargainCount: 5
      // 最大砍价次数
    };
  },
  computed: {
    progress() {
      if (!this.product)
        return 0;
      const total = this.product.skus[0].price - this.product.minPrice;
      const current = this.product.skus[0].price - this.currentPrice;
      return current / total * 100;
    }
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
    this.currentPrice = this.product.skus[0].price;
    this.loadRecords();
  },
  methods: {
    loadRecords() {
      this.records = [
        {
          name: "用户A",
          amount: "5.00",
          time: "10:30"
        },
        {
          name: "用户B",
          amount: "3.50",
          time: "10:28"
        }
      ];
    },
    doBargain() {
      if (this.isBargaining)
        return;
      if (this.bargainCount >= this.maxBargainCount) {
        common_vendor.index.showToast({
          title: "已达到最大砍价次数",
          icon: "none"
        });
        return;
      }
      if (this.currentPrice <= this.product.minPrice) {
        common_vendor.index.showToast({
          title: "已砍到最低价",
          icon: "none"
        });
        return;
      }
      this.isBargaining = true;
      setTimeout(() => {
        const minAmount = 5;
        const maxAmount = 30;
        const amount = (Math.random() * (maxAmount - minAmount) + minAmount).toFixed(0);
        this.currentPrice = Math.max(this.product.minPrice, this.currentPrice - parseFloat(amount));
        this.bargainCount++;
        this.records.unshift({
          name: "我",
          amount,
          time: (/* @__PURE__ */ new Date()).toLocaleTimeString()
        });
        this.isBargaining = false;
        if (this.currentPrice <= this.product.minPrice) {
          common_vendor.index.showToast({
            title: "恭喜砍到最低价！",
            icon: "success"
          });
        }
        if (this.bargainCount >= this.maxBargainCount) {
          this.isBargaining = true;
        }
      }, 150);
    },
    buyNow() {
      if (this.userBalance < this.selectedSku.price) {
        common_vendor.index.showModal({
          title: "余额不足",
          content: "您的账户余额不足，请继续努力",
          showCancel: false,
          confirmText: "好的",
          success: (res) => {
            if (res.confirm)
              common_vendor.index.navigateBack();
          }
        });
        return;
      }
      const order = {
        id: Date.now(),
        productId: this.product.id,
        productName: this.product.name,
        productImage: this.product.images[0],
        sku: this.selectedSku,
        price: this.currentPrice,
        status: "待付款",
        createTime: (/* @__PURE__ */ new Date()).toISOString()
      };
      utils_user.userData.updateBalance(-this.selectedSku.price * 1e4);
      utils_user.userData.addOrder(order);
      common_vendor.index.showToast({
        title: "订单已提交",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.product
  }, $data.product ? {
    b: $data.product.images[0],
    c: common_vendor.t($data.product.name),
    d: common_vendor.t($data.currentPrice),
    e: common_vendor.t($data.product.skus[0].price),
    f: common_vendor.t($data.product.minPrice),
    g: common_vendor.t($data.bargainCount),
    h: $options.progress + "%",
    i: common_vendor.t(($data.product.skus[0].price - $data.currentPrice).toFixed(2)),
    j: common_vendor.t(($data.currentPrice - $data.product.minPrice).toFixed(2)),
    k: common_vendor.f($data.records, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.amount),
        c: common_vendor.t(item.time),
        d: index
      };
    }),
    l: common_vendor.o((...args) => $options.doBargain && $options.doBargain(...args)),
    m: $data.isBargaining,
    n: common_vendor.o((...args) => $options.buyNow && $options.buyNow(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/bargain/bargain.js.map
