"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_user = require("../../utils/user.js");
const _sfc_main = {
  data() {
    return {
      prizes: [
        {
          id: 1,
          name: "现金红包",
          type: "cash",
          value: 5e6,
          probability: 0.1
        },
        {
          id: 2,
          name: "迈巴赫S级",
          type: "car",
          value: 15e5,
          probability: 0.1
        },
        {
          id: 3,
          name: "10万优惠券",
          type: "coupon",
          value: 1e5,
          probability: 0.1
        },
        {
          id: 4,
          name: "小米SU7",
          type: "car",
          value: 5e5,
          probability: 0.1
        },
        {
          id: 5,
          name: "现金红包",
          type: "cash",
          value: 1e6,
          probability: 0.2
        },
        {
          id: 6,
          name: "五菱宏光",
          type: "car",
          value: 5e3,
          probability: 0.2
        },
        {
          id: 7,
          name: "5万优惠券",
          type: "coupon",
          value: 5e4,
          probability: 0.1
        },
        {
          id: 8,
          name: "百万豪宅",
          type: "house",
          value: 1e6,
          probability: 0.1
        }
      ],
      gameRules: [
        "每天可免费抽奖10次",
        "抽中优惠券可在购物时使用",
        "优惠券有效期为30天",
        "每人每天最多获得3张优惠券",
        "实物奖品需联系客服领取",
        "现金奖励将直接转入账户"
      ],
      isRotating: false,
      gameTimes: 0,
      gameRecords: [],
      rotateDeg: 0,
      todayPrizes: 0,
      lastRefreshTime: null
    };
  },
  onShow() {
    this.loadGameData();
  },
  methods: {
    loadGameData() {
      this.gameTimes = utils_user.userData.getGameTimes();
      this.gameRecords = utils_user.userData.getGameRecords().slice(0, 8);
      this.todayPrizes = this.calculateTodayPrizes();
      this.lastRefreshTime = /* @__PURE__ */ new Date();
    },
    calculateTodayPrizes() {
      const today = (/* @__PURE__ */ new Date()).toDateString();
      return this.gameRecords.filter(
        (record) => new Date(record.time).toDateString() === today
      ).length;
    },
    getButtonText() {
      if (this.isRotating)
        return "抽奖中...";
      if (this.gameTimes <= 0)
        return "今日次数已用完";
      return "开始抽奖";
    },
    startGame() {
      if (this.isRotating || this.gameTimes <= 0)
        return;
      this.isRotating = true;
      const prize = this.selectPrize();
      const targetDeg = 360 * 5 + this.prizes.findIndex((p) => p.id === prize.id) * 45;
      this.playSound("start");
      setTimeout(() => {
        this.rotateDeg = targetDeg;
        setTimeout(() => {
          this.isRotating = false;
          this.handlePrizeResult(prize);
          setTimeout(() => {
            this.rotateDeg = 0;
            this.playSound("end");
          }, 500);
        }, 5e3);
      }, 50);
    },
    playSound(type) {
      common_vendor.index.__f__("log", "at pages/games/games.vue:204", `Playing ${type} sound`);
    },
    selectPrize() {
      const random = Math.random();
      let sum = 0;
      for (const prize of this.prizes) {
        sum += prize.probability;
        if (random <= sum) {
          return prize;
        }
      }
      return this.prizes[this.prizes.length - 1];
    },
    handlePrizeResult(prize) {
      let message = "";
      switch (prize.type) {
        case "cash":
          message = `恭喜您获得${prize.name}！奖金将直接转入您的账户。`;
          utils_user.userData.updateBalance(prize.value);
          break;
        case "house":
          message = `恭喜您获得${prize.name}！我们的客服将尽快与您联系。`;
          break;
        case "car":
          message = `恭喜您获得${prize.name}！请前往指定门店提车。`;
          break;
        case "coupon":
          message = `恭喜您获得${prize.name}！可在购物时使用。`;
          const coupon = {
            id: "C" + Date.now(),
            value: prize.value,
            expireTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString(),
            used: false
          };
          utils_user.userData.addCoupon(coupon);
          break;
      }
      utils_user.userData.updateGameTimes(this.gameTimes - 1);
      const gameRecord = {
        id: "G" + Date.now(),
        time: (/* @__PURE__ */ new Date()).toISOString(),
        prize: prize.name,
        type: prize.type
      };
      utils_user.userData.addGameRecord(gameRecord);
      common_vendor.index.showModal({
        title: "中奖啦！",
        content: message,
        showCancel: false,
        success: () => {
          this.loadGameData();
        }
      });
    },
    showRules() {
      this.$refs.rulesPopup.open();
    },
    closeRules() {
      this.$refs.rulesPopup.close();
    },
    refreshRecords() {
      this.loadGameData();
      common_vendor.index.showToast({
        title: "刷新成功",
        icon: "success"
      });
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    },
    isNewRecord(record) {
      return new Date(record.time) > this.lastRefreshTime;
    },
    getTypeText(type) {
      const typeMap = {
        "cash": "现金",
        "house": "房产",
        "car": "汽车",
        "coupon": "优惠券"
      };
      return typeMap[type] || type;
    },
    getPrizeIcon(type) {
      const iconMap = {
        "cash": "/static/images/test/fly.jpg",
        "house": "/static/images/test/fly.jpg",
        "car": "/static/images/test/fly.jpg",
        "coupon": "/static/images/test/fly.jpg"
      };
      return iconMap[type] || "";
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
    a: common_vendor.f($data.prizes, (prize, index, i0) => {
      return common_vendor.e({
        a: $options.getPrizeIcon(prize.type),
        b: common_vendor.t(prize.name),
        c: prize.type === "cash"
      }, prize.type === "cash" ? {
        d: common_vendor.t(prize.value / 1e4)
      } : {}, {
        e: `rotate(${-index * 45}deg)`,
        f: prize.id,
        g: `rotate(${index * 45}deg)`
      });
    }),
    b: `rotate(${$data.rotateDeg}deg)`,
    c: $data.isRotating ? 1 : "",
    d: common_vendor.t($data.gameTimes),
    e: common_vendor.t($data.todayPrizes),
    f: common_vendor.o((...args) => $options.showRules && $options.showRules(...args)),
    g: common_vendor.t($options.getButtonText()),
    h: $data.isRotating || $data.gameTimes <= 0 ? 1 : "",
    i: $data.isRotating || $data.gameTimes <= 0,
    j: common_vendor.o((...args) => $options.startGame && $options.startGame(...args)),
    k: common_vendor.o((...args) => $options.closeRules && $options.closeRules(...args)),
    l: common_vendor.f($data.gameRules, (rule, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(rule),
        c: index
      };
    }),
    m: common_vendor.sr("rulesPopup", "0a40fb48-0"),
    n: common_vendor.p({
      type: "center"
    }),
    o: common_vendor.o((...args) => $options.refreshRecords && $options.refreshRecords(...args)),
    p: common_vendor.f($data.gameRecords, (record, index, i0) => {
      return {
        a: common_vendor.t(record.prize),
        b: common_vendor.t($options.formatDate(record.time)),
        c: common_vendor.t($options.getTypeText(record.type)),
        d: common_vendor.n(record.type),
        e: index,
        f: $options.isNewRecord(record) ? 1 : ""
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/games/games.js.map
