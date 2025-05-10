"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_user = require("../../utils/user.js");
const _sfc_main = {
  data() {
    return {
      currentTab: "valid",
      validCoupons: [],
      usedCoupons: [],
      expiredCoupons: []
    };
  },
  computed: {
    currentCoupons() {
      switch (this.currentTab) {
        case "valid":
          return this.validCoupons;
        case "used":
          return this.usedCoupons;
        case "expired":
          return this.expiredCoupons;
        default:
          return [];
      }
    }
  },
  onShow() {
    this.loadCoupons();
  },
  methods: {
    loadCoupons() {
      const userInfo = utils_user.userData.getUserInfo();
      const now = /* @__PURE__ */ new Date();
      const allCoupons = userInfo.coupons || [];
      this.validCoupons = allCoupons.filter((coupon) => {
        return new Date(coupon.expireTime) > now && !coupon.used;
      });
      this.usedCoupons = allCoupons.filter((coupon) => coupon.used);
      this.expiredCoupons = allCoupons.filter((coupon) => {
        return new Date(coupon.expireTime) <= now && !coupon.used;
      });
    },
    switchTab(tab) {
      this.currentTab = tab;
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    },
    useCoupon(couponId) {
      if (utils_user.userData.useCoupon(couponId)) {
        common_vendor.index.showToast({
          title: "使用成功",
          icon: "success"
        });
        this.loadCoupons();
      } else {
        common_vendor.index.showToast({
          title: "使用失败",
          icon: "error"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.validCoupons.length),
    b: $data.currentTab === "valid" ? 1 : "",
    c: common_vendor.o(($event) => $options.switchTab("valid")),
    d: common_vendor.t($data.usedCoupons.length),
    e: $data.currentTab === "used" ? 1 : "",
    f: common_vendor.o(($event) => $options.switchTab("used")),
    g: common_vendor.t($data.expiredCoupons.length),
    h: $data.currentTab === "expired" ? 1 : "",
    i: common_vendor.o(($event) => $options.switchTab("expired")),
    j: common_vendor.f($options.currentCoupons, (coupon, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(coupon.value / 1e4),
        b: common_vendor.t(coupon.value * 2 / 1e4),
        c: common_vendor.t($options.formatDate(coupon.expireTime))
      }, $data.currentTab === "valid" ? {
        d: common_vendor.o(($event) => $options.useCoupon(coupon.id), index)
      } : {
        e: common_vendor.t($data.currentTab === "used" ? "已使用" : "已过期")
      }, {
        f: index
      });
    }),
    k: $data.currentTab === "valid",
    l: $options.currentCoupons.length === 0
  }, $options.currentCoupons.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/coupon/coupon.js.map
