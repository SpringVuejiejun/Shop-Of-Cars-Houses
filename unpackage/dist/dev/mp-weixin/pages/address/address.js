"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_user = require("../../utils/user.js");
const _sfc_main = {
  data() {
    return {
      addressList: [],
      isEdit: false,
      editIndex: -1,
      formData: {
        name: "",
        phone: "",
        province: "",
        city: "",
        district: "",
        detail: "",
        isDefault: false
      },
      region: []
    };
  },
  onLoad() {
    this.loadAddressList();
  },
  methods: {
    loadAddressList() {
      this.addressList = utils_user.userData.getAddressList();
    },
    addAddress() {
      this.isEdit = false;
      this.editIndex = -1;
      this.formData = {
        name: "",
        phone: "",
        province: "",
        city: "",
        district: "",
        detail: "",
        isDefault: false
      };
      this.region = [];
      this.$refs.addressPopup.open();
    },
    editAddress(index) {
      this.isEdit = true;
      this.editIndex = index;
      const address = this.addressList[index];
      this.formData = { ...address };
      this.region = [address.province, address.city, address.district];
      this.$refs.addressPopup.open();
    },
    deleteAddress(index) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这个地址吗？",
        success: (res) => {
          if (res.confirm) {
            utils_user.userData.deleteAddress(index);
            this.loadAddressList();
          }
        }
      });
    },
    setDefault(index) {
      utils_user.userData.setDefaultAddress(index);
      this.loadAddressList();
    },
    handleRegionChange(e) {
      this.region = e.detail.value;
      this.formData.province = e.detail.value[0];
      this.formData.city = e.detail.value[1];
      this.formData.district = e.detail.value[2];
    },
    handleDefaultChange(e) {
      this.formData.isDefault = e.detail.value;
    },
    closePopup() {
      this.$refs.addressPopup.close();
    },
    saveAddress() {
      if (!this.formData.name) {
        common_vendor.index.showToast({
          title: "请输入收货人姓名",
          icon: "none"
        });
        return;
      }
      if (!this.formData.phone) {
        common_vendor.index.showToast({
          title: "请输入手机号码",
          icon: "none"
        });
        return;
      }
      if (!this.formData.detail) {
        common_vendor.index.showToast({
          title: "请输入详细地址",
          icon: "none"
        });
        return;
      }
      if (this.isEdit) {
        utils_user.userData.updateAddress(this.editIndex, this.formData);
      } else {
        utils_user.userData.addAddress(this.formData);
      }
      this.loadAddressList();
      this.closePopup();
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
  return {
    a: common_vendor.f($data.addressList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.phone),
        c: item.isDefault
      }, item.isDefault ? {} : {}, {
        d: common_vendor.t(item.province),
        e: common_vendor.t(item.city),
        f: common_vendor.t(item.district),
        g: common_vendor.t(item.detail),
        h: item.isDefault ? "https://img.picui.cn/free/2025/05/09/681e034c3cc49.jpg" : "/static/images/unchecked.png",
        i: common_vendor.o(($event) => $options.setDefault(index), index),
        j: common_vendor.o(($event) => $options.editAddress(index), index),
        k: common_vendor.o(($event) => $options.deleteAddress(index), index),
        l: index
      });
    }),
    b: common_vendor.o((...args) => $options.addAddress && $options.addAddress(...args)),
    c: common_vendor.t($data.isEdit ? "编辑地址" : "添加地址"),
    d: $data.formData.name,
    e: common_vendor.o(($event) => $data.formData.name = $event.detail.value),
    f: $data.formData.phone,
    g: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    h: common_vendor.t($data.region[0] || "请选择"),
    i: common_vendor.t($data.region[1] || ""),
    j: common_vendor.t($data.region[2] || ""),
    k: $data.region,
    l: common_vendor.o((...args) => $options.handleRegionChange && $options.handleRegionChange(...args)),
    m: $data.formData.detail,
    n: common_vendor.o(($event) => $data.formData.detail = $event.detail.value),
    o: $data.formData.isDefault,
    p: common_vendor.o((...args) => $options.handleDefaultChange && $options.handleDefaultChange(...args)),
    q: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args)),
    r: common_vendor.o((...args) => $options.saveAddress && $options.saveAddress(...args)),
    s: common_vendor.sr("addressPopup", "20550c7c-0"),
    t: common_vendor.p({
      type: "bottom"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/address/address.js.map
