"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_user = require("../../utils/user.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {},
      orderCounts: {
        "待付款": 0,
        "待发货": 0,
        "待收货": 0,
        "已完成": 0
      },
      historyOrders: [],
      validCoupons: []
    };
  },
  onShow() {
    this.loadUserData();
  },
  methods: {
    loadUserData() {
      this.userInfo = utils_user.userData.getUserInfo();
      this.calculateOrderCounts();
      this.loadHistoryOrders();
      this.validCoupons = utils_user.userData.getValidCoupons();
    },
    calculateOrderCounts() {
      const orders = utils_user.userData.getOrderList();
      this.orderCounts = {
        "待付款": 0,
        "待发货": 0,
        "待收货": 0,
        "已完成": 0
      };
      orders.forEach((order) => {
        if (this.orderCounts.hasOwnProperty(order.status)) {
          this.orderCounts[order.status]++;
        }
      });
    },
    loadHistoryOrders() {
      const orders = utils_user.userData.getOrderList();
      common_vendor.index.__f__("log", "at pages/user/user.vue:169", orders);
      const gameRecords = utils_user.userData.getGameRecords();
      const gameOrders = gameRecords.filter((record) => record.type !== "coupon").map((record) => ({
        id: record.id,
        productName: record.prize,
        productImage: this.getPrizeImage(record.prize),
        price: 0,
        status: "已完成",
        createTime: record.time,
        type: "game",
        sku: {
          name: "游戏奖品"
        }
      }));
      this.historyOrders = [...orders, ...gameOrders].sort((a, b) => new Date(b.createTime) - new Date(a.createTime)).slice(0, 5).map((order) => ({
        ...order,
        productImage: order.productImage || "https://img.picui.cn/free/2025/05/09/681e034c3cc49.jpg"
      }));
    },
    getPrizeImage(prizeName) {
      if (prizeName.includes("五菱宏光")) {
        return "https://img.picui.cn/free/2025/05/09/681e033a9abb8.jpg";
      } else if (prizeName.includes("百万豪宅")) {
        return "https://img.picui.cn/free/2025/05/09/681e033395341.jpeg";
      } else if (prizeName.includes("小米SU7")) {
        return "https://img.picui.cn/free/2025/05/09/681e03432edfb.jpg";
      } else if (prizeName.includes("10万优惠券")) {
        return "https://img.picui.cn/free/2025/05/09/681e034c3cc49.jpg";
      } else if (prizeName.includes("5万优惠券")) {
        return "https://img.picui.cn/free/2025/05/09/681e034c3cc49.jpg";
      } else if (prizeName.includes("现金红包")) {
        return "https://img.picui.cn/free/2025/05/09/681e034f1d1f2.jpg";
      } else if (prizeName.includes("迈巴赫S级")) {
        return "https://img.picui.cn/free/2025/05/09/681e034c40ea5.jpg";
      }
      return "https://img.picui.cn/free/2025/05/09/681e034f790dc.jpg";
    },
    goToOrders(status) {
      common_vendor.index.switchTab({
        url: "/pages/order/order?status=" + status
      });
    },
    viewAllHistory() {
      common_vendor.index.navigateTo({
        url: "/pages/user/assets"
      });
    },
    viewOrderDetail(order) {
      common_vendor.index.switchTab({
        url: "/pages/order/detail?id=" + order.id
      });
    },
    goToCoupons() {
      common_vendor.index.navigateTo({
        url: "/pages/coupon/coupon"
      });
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    },
    useCoupon(couponId) {
      if (utils_user.userData.useCoupon(couponId)) {
        common_vendor.index.showToast({
          title: "使用成功",
          icon: "success"
        });
        this.loadUserData();
      } else {
        common_vendor.index.showToast({
          title: "使用失败",
          icon: "error"
        });
      }
    },
    goToAddress() {
      common_vendor.index.navigateTo({
        url: "/pages/address/address"
      });
    },
    goToService() {
      common_vendor.index.navigateTo({
        url: "/pages/service/service"
      });
    },
    goToSettings() {
      common_vendor.index.navigateTo({
        url: "/pages/settings/settings"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo.avatar,
    b: common_vendor.t($data.userInfo.nickname),
    c: common_vendor.t($data.userInfo.ID),
    d: $data.userInfo.phone
  }, $data.userInfo.phone ? {
    e: common_vendor.t($data.userInfo.phone)
  } : {}, {
    f: common_vendor.t($data.userInfo.balance),
    g: common_vendor.t($data.orderCounts["待付款"]),
    h: common_vendor.o(($event) => $options.goToOrders("待付款")),
    i: common_vendor.t($data.orderCounts["待发货"]),
    j: common_vendor.o(($event) => $options.goToOrders("待发货")),
    k: common_vendor.t($data.orderCounts["待收货"]),
    l: common_vendor.o(($event) => $options.goToOrders("待收货")),
    m: common_vendor.t($data.orderCounts["已完成"]),
    n: common_vendor.o(($event) => $options.goToOrders("已完成")),
    o: common_vendor.o((...args) => $options.viewAllHistory && $options.viewAllHistory(...args)),
    p: common_vendor.f($data.historyOrders, (item, index, i0) => {
      return common_vendor.e({
        a: item.productImage,
        b: common_vendor.t(item.productName),
        c: common_vendor.t(item.sku.name),
        d: common_vendor.t($options.formatDate(item.createTime)),
        e: item.price > 0
      }, item.price > 0 ? {
        f: common_vendor.t(item.price)
      } : {}, {
        g: item.type === "game"
      }, item.type === "game" ? {} : {}, {
        h: common_vendor.t(item.status),
        i: common_vendor.n(item.status === "已完成" ? "completed" : item.status),
        j: index,
        k: common_vendor.o(($event) => $options.viewOrderDetail(item), index)
      });
    }),
    q: common_vendor.o((...args) => $options.goToCoupons && $options.goToCoupons(...args)),
    r: common_vendor.f($data.validCoupons.slice(0, 2), (coupon, index, i0) => {
      return {
        a: common_vendor.t(coupon.value),
        b: common_vendor.t(coupon.value * 2 / 1e4),
        c: common_vendor.t($options.formatDate(coupon.expireTime)),
        d: common_vendor.o(($event) => $options.useCoupon(coupon.id), index),
        e: index
      };
    }),
    s: common_vendor.o((...args) => $options.goToAddress && $options.goToAddress(...args)),
    t: common_vendor.o((...args) => $options.goToService && $options.goToService(...args)),
    v: common_vendor.o((...args) => $options.goToSettings && $options.goToSettings(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
