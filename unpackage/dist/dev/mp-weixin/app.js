"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/menu/menu.js";
  "./pages/games/games.js";
  "./pages/order/order.js";
  "./pages/user/user.js";
  "./pages/user/assets.js";
  "./pages/user/coupon.js";
  "./pages/user/address.js";
  "./pages/user/service.js";
  "./pages/user/settings.js";
  "./pages/son_pages/detail.js";
  "./pages/son_pages/bargain.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
