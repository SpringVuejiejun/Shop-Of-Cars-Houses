"use strict";
const common_vendor = require("../common/vendor.js");
const userData = {
  // 用户信息
  userInfo: {
    balance: 168e4,
    // 初始余额168万
    lastSignIn: null,
    // 上次签到时间
    orders: [],
    // 订单列表
    gameTimes: 10,
    // 游戏次数
    gameRecords: [],
    // 游戏记录
    coupons: [],
    // 优惠券列表
    avatar: "https://img.picui.cn/free/2025/05/09/681e03456a7b0.jpg",
    nickname: "福布斯在榜者",
    ID: "88888888",
    phone: "",
    frozenAmount: 3e6,
    // 冻结金额
    addresses: []
    // 地址列表
  },
  // 获取游戏记录
  getGameRecords() {
    const userInfo = this.getUserInfo();
    return userInfo.gameRecords || [];
  },
  // 获得游戏次数
  getGameTimes() {
    return this.userInfo.gameTimes;
  },
  // 获取用户信息
  getUserInfo() {
    try {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);
      }
      return this.userInfo;
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/user.js:42", "获取用戶信息失败：", e);
      return this.userInfo;
    }
  },
  updateUserInfo(userInfo) {
    this.userInfo = userInfo;
    this.saveUserInfo();
  },
  // 保存用户信息
  saveUserInfo() {
    try {
      common_vendor.index.setStorageSync("userInfo", JSON.stringify(this.userInfo));
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/user.js:57", "保存用戶信息失败：", e);
    }
  },
  // 签到
  signIn() {
    const today = (/* @__PURE__ */ new Date()).toDateString();
    if (this.userInfo.lastSignIn === today) {
      return {
        success: false,
        message: "今天已经签到过了"
      };
    }
    this.userInfo.balance += 5e4;
    this.userInfo.lastSignIn = today;
    this.saveUserInfo();
    return {
      success: true,
      message: "签到成功，获得5万奖励"
    };
  },
  // 更新余额
  updateBalance(amount) {
    this.userInfo.balance += amount;
    this.saveUserInfo();
  },
  // 添加订单
  addOrder(order) {
    const orderNo = "HC" + Date.now().toString().slice(-8);
    const payDeadline = new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString();
    const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1e3).toISOString();
    const newOrder = {
      id: orderNo,
      productId: order.productId,
      productName: order.productName,
      productImage: order.productImage,
      sku: order.sku,
      price: order.price,
      status: "待付款",
      createTime: (/* @__PURE__ */ new Date()).toISOString(),
      payDeadline,
      estimatedDelivery
    };
    this.userInfo.orders.unshift(newOrder);
    this.saveUserInfo();
    return newOrder;
  },
  // 获取订单列表
  getOrderList() {
    return this.userInfo.orders;
  },
  // 获取指定状态的订单列表
  getOrdersByStatus(status) {
    if (status === "all") {
      return this.userInfo.orders;
    }
    return this.userInfo.orders.filter((order) => order.status === status);
  },
  // 获取订单详情
  getOrderById(orderId) {
    return this.userInfo.orders.find((order) => order.id === orderId);
  },
  // 更新订单
  updateOrder(updatedOrder) {
    const index = this.userInfo.orders.findIndex((order) => order.id === updatedOrder.id);
    if (index !== -1) {
      this.userInfo.orders[index] = updatedOrder;
      this.saveUserInfo();
      return true;
    }
    return false;
  },
  // 删除订单
  deleteOrder(orderId) {
    const index = this.userInfo.orders.findIndex((order) => order.id === orderId);
    if (index !== -1) {
      this.userInfo.orders.splice(index, 1);
      this.saveUserInfo();
      return true;
    }
    return false;
  },
  // 取消订单
  cancelOrder(orderId) {
    const order = this.getOrderById(orderId);
    if (order && order.status === "待付款") {
      order.status = "已取消";
      this.updateOrder(order);
      return true;
    }
    return false;
  },
  // 确认收货
  confirmReceive(orderId) {
    const order = this.getOrderById(orderId);
    if (order && order.status === "待收货") {
      order.status = "已完成";
      this.updateOrder(order);
      return true;
    }
    return false;
  },
  // 获取订单状态统计
  getOrderStatusCount() {
    const counts = {
      all: this.userInfo.orders.length,
      待付款: 0,
      待发货: 0,
      待收货: 0,
      已完成: 0,
      已取消: 0
    };
    this.userInfo.orders.forEach((order) => {
      counts[order.status]++;
    });
    return counts;
  },
  // 更新游戏次数
  updateGameTimes(times) {
    const userInfo = this.getUserInfo();
    userInfo.gameTimes = times;
    this.saveUserInfo();
  },
  // 添加游戏记录
  addGameRecord(record) {
    const userInfo = this.getUserInfo();
    if (!userInfo.gameRecords) {
      userInfo.gameRecords = [];
    }
    userInfo.gameRecords.unshift(record);
    this.saveUserInfo();
  },
  // 添加优惠券
  addCoupon(coupon) {
    const userInfo = this.getUserInfo();
    if (!userInfo.coupons) {
      userInfo.coupons = [];
    }
    userInfo.coupons.push(coupon);
    this.saveUserInfo();
  },
  // 获取可用优惠券
  getValidCoupons() {
    const userInfo = this.getUserInfo();
    if (!userInfo.coupons)
      return [];
    const now = /* @__PURE__ */ new Date();
    return userInfo.coupons.filter((coupon) => {
      return new Date(coupon.expireTime) > now;
    });
  },
  // 使用优惠券
  useCoupon(couponId) {
    const userInfo = this.getUserInfo();
    if (!userInfo.coupons)
      return false;
    const index = userInfo.coupons.findIndex((coupon) => coupon.id === couponId);
    if (index === -1)
      return false;
    userInfo.coupons.splice(index, 1);
    this.saveUserInfo();
    return true;
  },
  // 获取地址列表
  getAddressList() {
    const userInfo = this.getUserInfo();
    return userInfo.addresses || [];
  },
  // 添加地址
  addAddress(address) {
    const userInfo = this.getUserInfo();
    if (!userInfo.addresses) {
      userInfo.addresses = [];
    }
    if (address.isDefault) {
      userInfo.addresses.forEach((addr) => addr.isDefault = false);
    }
    userInfo.addresses.push(address);
    this.saveUserInfo();
  },
  // 更新地址
  updateAddress(index, address) {
    const userInfo = this.getUserInfo();
    if (!userInfo.addresses || index >= userInfo.addresses.length) {
      return false;
    }
    if (address.isDefault) {
      userInfo.addresses.forEach((addr) => addr.isDefault = false);
    }
    userInfo.addresses[index] = address;
    this.saveUserInfo();
    return true;
  },
  // 删除地址
  deleteAddress(index) {
    const userInfo = this.getUserInfo();
    if (!userInfo.addresses || index >= userInfo.addresses.length) {
      return false;
    }
    userInfo.addresses.splice(index, 1);
    this.saveUserInfo();
    return true;
  },
  // 设置默认地址
  setDefaultAddress(index) {
    const userInfo = this.getUserInfo();
    if (!userInfo.addresses || index >= userInfo.addresses.length) {
      return false;
    }
    userInfo.addresses.forEach((addr, i) => {
      addr.isDefault = i === index;
    });
    this.saveUserInfo();
    return true;
  }
};
exports.userData = userData;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/user.js.map
