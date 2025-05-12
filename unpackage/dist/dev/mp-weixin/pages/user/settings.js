"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_user = require("../../utils/user.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {},
      settings: {
        orderNotify: true,
        activityNotify: true,
        systemNotify: true,
        showDynamic: false,
        allowMessage: false
      },
      cacheSize: "0KB",
      version: "1.0.1",
      editType: "",
      editValue: "",
      tempAvatar: ""
    };
  },
  onLoad() {
    this.loadUserInfo();
    this.loadSettings();
    this.calculateCache();
  },
  methods: {
    loadUserInfo() {
      this.userInfo = utils_user.userData.getUserInfo();
    },
    loadSettings() {
      const settings = common_vendor.index.getStorageSync("userSettings");
      if (settings) {
        this.settings = JSON.parse(settings);
      }
    },
    saveSettings() {
      common_vendor.index.setStorageSync("userSettings", JSON.stringify(this.settings));
    },
    calculateCache() {
      this.cacheSize = "2.5MB";
    },
    editAvatar() {
      this.editType = "avatar";
      this.$refs.editPopup.open();
    },
    editNickname() {
      this.editType = "nickname";
      this.editValue = this.userInfo.nickname || "";
      this.$refs.editPopup.open();
    },
    editPhone() {
      this.editType = "phone";
      this.editValue = this.userInfo.phone || "";
      this.$refs.editPopup.open();
    },
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          this.tempAvatar = res.tempFilePaths[0];
        }
      });
    },
    closeEditPopup() {
      this.$refs.editPopup.close();
      this.tempAvatar = "";
      this.editValue = "";
    },
    saveEdit() {
      if (this.editType === "avatar") {
        if (!this.tempAvatar) {
          common_vendor.index.showToast({
            title: "请选择头像",
            icon: "none"
          });
          return;
        }
        this.userInfo.avatar = this.tempAvatar;
      } else {
        if (!this.editValue) {
          common_vendor.index.showToast({
            title: "请输入内容",
            icon: "none"
          });
          return;
        }
        if (this.editType === "phone" && !/^1[3-9]\d{9}$/.test(this.editValue)) {
          common_vendor.index.showToast({
            title: "请输入正确的手机号",
            icon: "none"
          });
          return;
        }
        this.userInfo[this.editType] = this.editValue;
      }
      utils_user.userData.updateUserInfo(this.userInfo);
      this.closeEditPopup();
    },
    toggleOrderNotify(e) {
      this.settings.orderNotify = e.detail.value;
      this.saveSettings();
    },
    toggleActivityNotify(e) {
      this.settings.activityNotify = e.detail.value;
      this.saveSettings();
    },
    toggleSystemNotify(e) {
      this.settings.systemNotify = e.detail.value;
      this.saveSettings();
    },
    toggleShowDynamic(e) {
      this.settings.showDynamic = e.detail.value;
      this.saveSettings();
    },
    toggleAllowMessage(e) {
      this.settings.allowMessage = e.detail.value;
      this.saveSettings();
    },
    clearCache() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要清除缓存吗？",
        success: (res) => {
          if (res.confirm) {
            this.cacheSize = "0KB";
            common_vendor.index.showToast({
              title: "清除成功",
              icon: "success"
            });
          }
        }
      });
    },
    checkUpdate() {
      common_vendor.index.showToast({
        title: "当前已是最新版本",
        icon: "none"
      });
    },
    showAbout() {
      common_vendor.index.navigateTo({
        url: "/pages/settings/about"
      });
    },
    logout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            utils_user.userData.logout();
            common_vendor.index.reLaunch({
              url: "/pages/login/login"
            });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo.avatar || "https://img.picui.cn/free/2025/05/09/681e03456a7b0.jpg",
    b: common_assets._imports_0$1,
    c: common_vendor.o((...args) => $options.editAvatar && $options.editAvatar(...args)),
    d: common_vendor.t($data.userInfo.nickname || "未设置"),
    e: common_assets._imports_0$1,
    f: common_vendor.o((...args) => $options.editNickname && $options.editNickname(...args)),
    g: common_vendor.t($data.userInfo.phone || "未绑定"),
    h: common_assets._imports_0$1,
    i: common_vendor.o((...args) => $options.editPhone && $options.editPhone(...args)),
    j: $data.settings.orderNotify,
    k: common_vendor.o((...args) => $options.toggleOrderNotify && $options.toggleOrderNotify(...args)),
    l: $data.settings.activityNotify,
    m: common_vendor.o((...args) => $options.toggleActivityNotify && $options.toggleActivityNotify(...args)),
    n: $data.settings.systemNotify,
    o: common_vendor.o((...args) => $options.toggleSystemNotify && $options.toggleSystemNotify(...args)),
    p: $data.settings.showDynamic,
    q: common_vendor.o((...args) => $options.toggleShowDynamic && $options.toggleShowDynamic(...args)),
    r: $data.settings.allowMessage,
    s: common_vendor.o((...args) => $options.toggleAllowMessage && $options.toggleAllowMessage(...args)),
    t: common_vendor.t($data.cacheSize),
    v: common_assets._imports_0$1,
    w: common_vendor.o((...args) => $options.clearCache && $options.clearCache(...args)),
    x: common_vendor.t($data.version),
    y: common_assets._imports_0$1,
    z: common_vendor.o((...args) => $options.checkUpdate && $options.checkUpdate(...args)),
    A: common_assets._imports_0$1,
    B: common_vendor.o((...args) => $options.showAbout && $options.showAbout(...args)),
    C: common_vendor.o((...args) => $options.logout && $options.logout(...args)),
    D: common_vendor.t($data.editType === "avatar" ? "更换头像" : $data.editType === "nickname" ? "修改昵称" : "修改手机号"),
    E: $data.editType === "avatar"
  }, $data.editType === "avatar" ? {
    F: $data.tempAvatar || $data.userInfo.avatar || "https://img.picui.cn/free/2025/05/09/681e03456a7b0.jpg",
    G: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {
    H: $data.editType === "nickname" ? "请输入昵称" : "请输入手机号",
    I: $data.editValue,
    J: common_vendor.o(($event) => $data.editValue = $event.detail.value)
  }, {
    K: common_vendor.o((...args) => $options.closeEditPopup && $options.closeEditPopup(...args)),
    L: common_vendor.o((...args) => $options.saveEdit && $options.saveEdit(...args)),
    M: common_vendor.sr("editPopup", "01b04301-0"),
    N: common_vendor.p({
      type: "bottom"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/settings.js.map
