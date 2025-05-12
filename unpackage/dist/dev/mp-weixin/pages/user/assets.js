"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_user = require("../../utils/user.js");
const _sfc_main = {
  data() {
    return {
      totalAssets: 0,
      balance: 0,
      frozenAmount: 0,
      assetsList: []
    };
  },
  onLoad() {
    this.loadAssetsData();
  },
  methods: {
    loadAssetsData() {
      const userInfo = utils_user.userData.getUserInfo();
      this.balance = userInfo.balance / 1e4;
      this.frozenAmount = userInfo.frozenAmount / 1e4;
      this.totalAssets = this.balance + this.frozenAmount;
      this.assetsList = utils_user.userData.getAssetsList();
    },
    goToRecharge() {
      common_vendor.index.showToast({
        title: "充值功能开发中",
        icon: "none"
      });
    },
    goToWithdraw() {
      common_vendor.index.showToast({
        title: "提现功能开发中",
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.totalAssets),
    b: common_vendor.t($data.balance),
    c: common_vendor.t($data.frozenAmount),
    d: common_vendor.f($data.assetsList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.time),
        c: common_vendor.t(item.type === "income" ? "+" : "-"),
        d: common_vendor.t(item.amount / 1e4),
        e: item.type === "income" ? 1 : "",
        f: item.type === "expense" ? 1 : "",
        g: common_vendor.t(item.status),
        h: index
      };
    }),
    e: common_vendor.o((...args) => $options.goToRecharge && $options.goToRecharge(...args)),
    f: common_vendor.o((...args) => $options.goToWithdraw && $options.goToWithdraw(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/assets.js.map
