"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_user = require("../../utils/user.js");
const utils_products = require("../../utils/products.js");
const _sfc_main = {
  data() {
    return {
      currentStatus: "all",
      statusList: [
        { name: "全部", value: "all", count: 0 },
        { name: "待付款", value: "待付款", count: 0 },
        { name: "待发货", value: "待发货", count: 0 },
        { name: "待收货", value: "待收货", count: 0 },
        { name: "已完成", value: "已完成", count: 0 }
      ],
      orders: [],
      timers: {}
      // 用於存儲每個訂單的定時器
    };
  },
  computed: {
    filteredOrders() {
      if (this.currentStatus === "all") {
        return this.orders;
      }
      return this.orders.filter((order) => order.status === this.currentStatus);
    }
  },
  onLoad(options) {
    if (options.status) {
      this.currentStatus = options.status;
    }
    this.loadOrders();
  },
  onShow() {
    this.loadOrders();
  },
  methods: {
    loadOrders() {
      this.orders = utils_user.userData.getOrderList();
      this.updateStatusCount();
    },
    switchStatus(status) {
      this.currentStatus = status;
      common_vendor.index.navigateTo({
        url: "/pages/order/order?status=" + status
      });
    },
    updateStatusCount() {
      this.statusList.forEach((item) => {
        if (item.value === "all") {
          item.count = this.orders.length;
        } else {
          item.count = this.orders.filter((order) => order.status === item.value).length;
        }
      });
    },
    getProductImage(productId) {
      const product = utils_products.products.getProductById(productId);
      return product ? product.images[0] : "";
    },
    formatTime(time) {
      const date = new Date(time);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    },
    formatCountdown(deadline) {
      const now = /* @__PURE__ */ new Date();
      const end = new Date(deadline);
      const diff = end - now;
      if (diff <= 0)
        return "已超时";
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      return `${hours}小时${minutes}分钟`;
    },
    getStatusClass(status) {
      const statusMap = {
        "待付款": "status-pending",
        "待发货": "status-processing",
        "待收货": "status-shipping",
        "已完成": "status-completed",
        "已取消": "status-cancelled"
      };
      return statusMap[status] || "";
    },
    startDeliveryTimer(order) {
      if (this.timers[order.id]) {
        clearTimeout(this.timers[order.id]);
      }
      this.timers[order.id] = setTimeout(() => {
        order.status = "待收货";
        utils_user.userData.updateOrder(order);
        this.loadOrders();
        delete this.timers[order.id];
      }, 1e4);
    },
    payOrder(order) {
      if (utils_user.userData.getUserInfo().balance / 1e4 < order.price) {
        common_vendor.index.showToast({
          title: "余额不足",
          icon: "none"
        });
        return;
      }
      order.status = "待发货";
      utils_user.userData.updateOrder(order);
      utils_user.userData.updateBalance(-order.price * 1e4);
      utils_user.userData.addOrderExpense({
        amount: order.price * 1e4,
        name: order.productName
      });
      this.startDeliveryTimer(order);
      common_vendor.index.showToast({
        title: "支付成功",
        icon: "success"
      });
      this.loadOrders();
    },
    cancelOrder(order) {
      common_vendor.index.showModal({
        title: "取消订单",
        content: "确定要取消该订单吗？",
        success: (res) => {
          if (res.confirm) {
            order.status = "已取消";
            utils_user.userData.updateOrder(order);
            this.loadOrders();
          }
        }
      });
    },
    confirmReceive(order) {
      common_vendor.index.showModal({
        title: "确认收货",
        content: "请确认已收到商品并检查无误",
        success: (res) => {
          if (res.confirm) {
            order.status = "已完成";
            utils_user.userData.updateOrder(order);
            this.loadOrders();
          }
        }
      });
    },
    deleteOrder(order) {
      common_vendor.index.showModal({
        title: "删除订单",
        content: "确定要删除该订单记录吗？",
        success: (res) => {
          if (res.confirm) {
            utils_user.userData.deleteOrder(order.id);
            this.loadOrders();
          }
        }
      });
    },
    onUnload() {
      Object.values(this.timers).forEach((timer) => {
        clearTimeout(timer);
      });
      this.timers = {};
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.statusList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: item.count > 0
      }, item.count > 0 ? {
        c: common_vendor.t(item.count)
      } : {}, {
        d: index,
        e: $data.currentStatus === item.value ? 1 : "",
        f: common_vendor.o(($event) => $options.switchStatus(item.value), index)
      });
    }),
    b: common_vendor.f($options.filteredOrders, (order, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t($options.formatTime(order.createTime)),
        b: common_vendor.t(order.id),
        c: common_vendor.t(order.status),
        d: common_vendor.n($options.getStatusClass(order.status)),
        e: $options.getProductImage(order.productId),
        f: common_vendor.t(order.productName),
        g: common_vendor.f(order.sku.features, (feature, idx, i1) => {
          return {
            a: common_vendor.t(feature),
            b: idx
          };
        }),
        h: common_vendor.t(order.price),
        i: order.status === "待付款"
      }, order.status === "待付款" ? {
        j: common_vendor.t($options.formatCountdown(order.payDeadline))
      } : {}, {
        k: order.status === "待发货"
      }, order.status === "待发货" ? {
        l: common_vendor.t($options.formatTime(order.estimatedDelivery))
      } : {}, {
        m: order.status === "待付款"
      }, order.status === "待付款" ? {
        n: common_vendor.o(($event) => $options.payOrder(order), index)
      } : {}, {
        o: order.status === "待发货"
      }, order.status === "待发货" ? {
        p: common_vendor.o(($event) => $options.cancelOrder(order), index)
      } : {}, {
        q: order.status === "待收货"
      }, order.status === "待收货" ? {
        r: common_vendor.o(($event) => $options.confirmReceive(order), index)
      } : {}, {
        s: order.status === "已完成"
      }, order.status === "已完成" ? {
        t: common_vendor.o(($event) => $options.deleteOrder(order), index)
      } : {}, {
        v: index
      });
    }),
    c: $options.filteredOrders.length === 0
  }, $options.filteredOrders.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/order.js.map
