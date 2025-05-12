"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      faqList: [
        {
          question: "如何修改收货地址？",
          answer: '进入"我的"页面，点击"收货地址"，可以添加、编辑或刪除收货地址。',
          show: false
        },
        {
          question: "如何查看订单状态？",
          answer: '进入"我的"页面，点击"我的订单"，可以查看所有订单的状态。',
          show: false
        },
        {
          question: "如何申请退款？",
          answer: '进入订单详情页面，点击"申请退款"按鈕，填写退款原因后提交即可。',
          show: false
        },
        {
          question: "优惠券如何使用？",
          answer: "在购买商品时可以选择使用优惠券抵扣",
          show: false
        }
      ]
    };
  },
  methods: {
    contactOnline() {
      common_vendor.index.navigateTo({
        url: "/pages/service/chat"
      });
    },
    callService() {
      common_vendor.index.makePhoneCall({
        phoneNumber: "4001234567"
      });
    },
    toggleFaq(index) {
      this.faqList[index].show = !this.faqList[index].show;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$1,
    b: common_vendor.o((...args) => $options.contactOnline && $options.contactOnline(...args)),
    c: common_assets._imports_0$1,
    d: common_vendor.o((...args) => $options.callService && $options.callService(...args)),
    e: common_vendor.f($data.faqList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.question),
        b: item.show ? 1 : "",
        c: item.show
      }, item.show ? {
        d: common_vendor.t(item.answer)
      } : {}, {
        e: index,
        f: common_vendor.o(($event) => $options.toggleFaq(index), index)
      });
    }),
    f: common_assets._imports_0$1
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/service.js.map
