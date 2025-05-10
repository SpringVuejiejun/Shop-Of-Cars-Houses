<template>
    <view class="search-box">
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
    </view>
  </template>
  
  <script>
  export default {
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
        showSuggestions: false
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
      },
      selectSuggestion(item) {
        this.inputValue = item.name
        this.showSuggestions = false
        this.$emit('select', item)
      },
      onFocus() {
        this.showSuggestions = !!this.inputValue && this.suggestions.length > 0
      },
      onBlur() {
        setTimeout(() => {
          this.showSuggestions = false
        }, 200) // 延遲隱藏，避免點擊建議詞時無法觸發
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
  .search-input {
    flex: 1;
    background: #f5f5f5;
    border: none;
    border-radius: 8rpx;
    padding: 10rpx 20rpx;
    font-size: 28rpx;
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
  </style>