<template>
    <view class="search-box">
      <text class="iconfont search-icon" @tab="onSearch">&#xe6b0;</text>
      <input
        class="search-input"
        type="text"
        v-model="inputValue"
        :placeholder="placeholder"
        @input="onInput"
        @confirm="onSearch"
        @focus="onFocus"
        @blur="onBlur"
      />
      <button class="search-btn" @tap="onSearch">搜索</button>
      <view v-if="showSuggestions && suggestions.length" class="suggestion-list">
        <view
          class="suggestion-item"
          v-for="item in suggestions"
          :key="item.id || item.name"
          @tap="selectSuggestion(item)"
        >
          {{ item.name }}
        </view>
      </view>
      <uni-popup ref="searchPopup" type="center">
        <view class="popup-content">
          <view class="popup-title">搜索结果</view>
          <view>
            <view class="product-item" v-for="item in productList" :key="item.id" @tap="goToDetail(item)">
              <image :src="item.images[0]" mode="aspectFill" class="product-image"></image>
              <view class="product-info">
                <text class="product-name">{{item.name}}</text>
                <text class="product-price">¥{{item.skus[0].price}}万</text>
                <text class="product-desc">{{item.description}}</text>
              </view>
            </view>
          </view>
          <button class="close-btn" @tap="closePopup">关闭</button>
        </view>
      </uni-popup>
    </view>
  </template>
  
  <script>
  import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue'
  import products from '@/utils/products.js'
  
  export default {
    components: { uniPopup },
    props: {
      placeholder: {
        type: String,
        default: '搜索商品/类别'
      },
      suggestions: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        inputValue: '',
        showSuggestions: false,
        productList: []
      }
    },
    watch: {
      suggestions(val) {
        this.showSuggestions = !!this.inputValue && val.length > 0
      }
    },
    methods: {
      onInput(e) {
        this.inputValue = e.detail.value
        this.$emit('input', this.inputValue)
        this.showSuggestions = !!this.inputValue && this.suggestions.length > 0
      },
      onSearch() {
        this.showSuggestions = false
        this.$emit('search', this.inputValue)
        this.productList = products.getHotProducts ? products.getHotProducts() : (products.getHotProducts ? products.getHotProducts() : [])
        this.$refs.searchPopup.open()
      },
      selectSuggestion(item) {
        this.inputValue = item.name
        this.showSuggestions = false
      },
      goToDetail(item) {
        uni.navigateTo({
          url: `/pages/detail/detail?id=${item.id}`
        })
      },
      onFocus() {
        this.showSuggestions = !!this.inputValue && this.suggestions.length > 0
      },
      onBlur() {
        setTimeout(() => {
          this.showSuggestions = false
        }, 200)
      },
      closePopup() {
        this.$refs.searchPopup.close()
      }
    }
  }
  </script>
  
  <style>
  .search-box {
    position: relative;
    background: #fff;
    border-radius: 10rpx;
    padding: 10rpx 20rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
  }
  .search-icon {
    font-size: 36rpx;
    color: #999;
    margin-right: 16rpx;
  }
  .search-input {
    flex: 1;
    background: #f5f5f5;
    border: none;
    border-radius: 8rpx;
    padding: 10rpx 20rpx;
    font-size: 28rpx;
    outline: none;
  }
  .search-btn {
    margin-left: 10rpx;
    background: #FF4D4F;
    color: #fff;
    border-radius: 8rpx;
    font-size: 28rpx;
    padding: 0 20rpx;
  }
  .suggestion-list {
    position: absolute;
    left: 0; right: 0; top: 80rpx;
    background: #fff;
    z-index: 99;
    border-radius: 0 0 10rpx 10rpx;
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.08);
  }
  .suggestion-item {
    padding: 20rpx;
    border-bottom: 1rpx solid #f5f5f5;
    font-size: 28rpx;
  }
  .suggestion-item:last-child { border-bottom: none; }
  .popup-content {
    padding: 40rpx 20rpx 20rpx 20rpx;
    background: #fff;
    border-radius: 16rpx;
    min-width: 500rpx;
    max-width: 90vw;
    max-height: 70vh;
    overflow-y: auto;
  }
  .popup-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    text-align: center;
  }
  .product-item {
    display: flex;
    background-color: #f5f5f5;
    border-radius: 10rpx;
    margin-bottom: 20rpx;
    padding: 10rpx;
  }
  .product-image {
    width: 120rpx;
    height: 120rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
  }
  .product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .product-name {
    font-size: 28rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 8rpx;
  }
  .product-price {
    font-size: 28rpx;
    color: #FF4D4F;
    margin-bottom: 8rpx;
  }
  .product-desc {
    font-size: 24rpx;
    color: #666;
  }
  .close-btn {
    margin-top: 20rpx;
    width: 100%;
    background: #FF4D4F;
    color: #fff;
    border-radius: 8rpx;
    font-size: 28rpx;
  }
  </style>