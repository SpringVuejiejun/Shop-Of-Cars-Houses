"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_products = require("../../utils/products.js");
const common_assets = require("../../common/assets.js");
const Search = () => "../../components/Search.js";
const _sfc_main = {
  components: { Search },
  data() {
    return {
      banners: [
        {
          image: "https://img.picui.cn/free/2025/05/09/681e035575fe1.jpg"
        },
        {
          image: "https://img.picui.cn/free/2025/05/09/681e0348c462c.jpg"
        },
        {
          image: "https://img.picui.cn/free/2025/05/09/681e03392eb6c.jpg"
        },
        {
          image: "https://img.picui.cn/free/2025/05/09/681e0340523c5.jpg"
        },
        {
          image: "https://img.picui.cn/free/2025/05/09/681e034c40ea5.jpg"
        },
        {
          image: "https://img.picui.cn/free/2025/05/09/681e03432edfb.jpg"
        },
        {
          image: "https://img.picui.cn/free/2025/05/09/681e033a9abb8.jpg"
        }
      ],
      categories: [
        {
          id: "luxury",
          name: "奢侈品",
          icon: "iconfont icon-luxury"
        },
        {
          id: "car",
          name: "豪车",
          icon: "iconfont icon-car"
        },
        {
          id: "house",
          name: "豪宅",
          icon: "iconfont icon-house"
        },
        {
          id: "game",
          name: "小游戏",
          icon: "iconfont icon-game"
        }
      ],
      hotProducts: [],
      current: 0,
      suggestions: [],
      showSuggestions: false,
      autoplay: true
    };
  },
  onLoad() {
    this.hotProducts = utils_products.products.getHotProducts();
  },
  methods: {
    handleSearch(keyword) {
      common_vendor.index.navigateTo({
        url: `/pages/menu/menu?keyword=${encodeURIComponent(keyword)}`
      });
    },
    handleSelect(item) {
      if (item.type === "product") {
        common_vendor.index.navigateTo({
          url: `/pages/son_pages/detail?id=${item.id}`
        });
      } else {
        common_vendor.index.navigateTo({
          url: `/pages/menu/menu?keyword=${encodeURIComponent(item.name)}`
        });
      }
    },
    goToMenu(categoryId) {
      if (categoryId === "game") {
        common_vendor.index.switchTab({
          url: "/pages/games/games"
        });
      } else {
        common_vendor.index.setStorageSync("menuCategory", categoryId);
        common_vendor.index.switchTab({
          url: "/pages/menu/menu"
        });
      }
    },
    goToDetail(productId) {
      common_vendor.index.navigateTo({
        url: "/pages/son_pages/detail?id=" + productId
      });
    },
    prevBanner() {
      this.current = (this.current - 1 + this.banners.length) % this.banners.length;
      this.resetAutoplay();
    },
    nextBanner() {
      this.current = (this.current + 1) % this.banners.length;
      this.resetAutoplay();
    },
    onBannerChange(e) {
      this.current = e.detail.current;
    },
    resetAutoplay() {
      this.autoplay = false;
      this.$nextTick(() => {
        this.autoplay = true;
      });
    },
    onInput(val) {
      this.suggestions = utils_products.products.getSuggestions(val);
      this.showSuggestions = !!val && this.suggestions.length > 0;
    },
    selectSuggestion(item) {
      this.inputValue = item.name;
      this.showSuggestions = false;
    }
  }
};
if (!Array) {
  const _component_Search = common_vendor.resolveComponent("Search");
  _component_Search();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.onInput),
    b: common_vendor.o($options.handleSearch),
    c: common_vendor.p({
      suggestions: $data.suggestions
    }),
    d: $data.showSuggestions
  }, $data.showSuggestions ? {
    e: common_vendor.f($data.suggestions, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: item.id,
        c: common_vendor.o(($event) => $options.selectSuggestion(item), item.id)
      };
    })
  } : {}, {
    f: common_assets._imports_0,
    g: common_vendor.o((...args) => $options.prevBanner && $options.prevBanner(...args)),
    h: common_vendor.f($data.banners, (item, index, i0) => {
      return {
        a: item.image,
        b: index
      };
    }),
    i: $data.current,
    j: common_vendor.o((...args) => $options.onBannerChange && $options.onBannerChange(...args)),
    k: $data.autoplay,
    l: common_assets._imports_1,
    m: common_vendor.o((...args) => $options.nextBanner && $options.nextBanner(...args)),
    n: common_vendor.f($data.categories, (item, index, i0) => {
      return {
        a: common_vendor.n(item.icon),
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.goToMenu(item.id), index)
      };
    }),
    o: common_vendor.o(($event) => $options.goToMenu("hot")),
    p: common_vendor.f($data.hotProducts, (item, index, i0) => {
      return {
        a: item.images[0],
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.skus[0].price),
        d: common_vendor.t(item.skus[0].name),
        e: index,
        f: common_vendor.o(($event) => $options.goToDetail(item.id), index)
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
