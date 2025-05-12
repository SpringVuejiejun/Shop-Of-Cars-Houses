<template>
	<view class="container">
		<!-- 搜索框 -->
		<Search
			:suggestions="suggestions"
			@input="onInput"
			@search="handleSearch"
		/>
		<!-- @select="handleSelect" 点击联想词跳转-->

		<view v-if="showSuggestions" class="suggestion-list">
			<view class="suggestion-item" v-for="item in suggestions" :key="item.id" @tap="selectSuggestion(item)">
				{{item.name}}
			</view>
		</view>
		
		<!-- 轮播图 -->
		<view class="banner-wrapper">
			<view class="arrow left-arrow" @tap="prevBanner">
				<image src="/static/images/svg/arrow-left.svg" mode="aspectFit" class="arrow-icon"></image>
			</view>
			<swiper class="banner" :current="current" @change="onBannerChange" indicator-dots :autoplay="autoplay" circular :interval="4000" :duration="500">
				<swiper-item v-for="(item, index) in banners" :key="index">
					<image :src="item.image" mode="aspectFill" class="banner-image"></image>
				</swiper-item>
			</swiper>
			<view class="arrow right-arrow" @tap="nextBanner">
				<image src="/static/images/svg/arrow-right.svg" mode="aspectFit" class="arrow-icon"></image>
			</view>
		</view>
		
		<!-- 分类导航 -->
		<view class="category-nav">
			<view class="category-item" v-for="(item, index) in categories" :key="index" @tap="goToMenu(item.id)">
				<text :class="item.icon"></text>
				<text class="category-name">{{item.name}}</text>
			</view>
		</view>
		
		<!-- 热门推荐 -->
		<view class="hot-section">
			<view class="section-title">
				<text class="title-text">热门推荐</text>
				<text class="more-text" @tap="goToMenu('hot')">查看更多 ></text>
			</view>
			<view class="hot-list">
				<view class="hot-item" v-for="(item, index) in hotProducts" :key="index" @tap="goToDetail(item.id)">
					<image :src="item.images[0]" mode="aspectFill" class="hot-image"></image>
					<view class="hot-info">
						<text class="hot-name">{{item.name}}</text>
						<text class="hot-price">¥{{item.skus[0].price}}万</text>
						<text class="hot-config">{{item.skus[0].name}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Search from '@/components/Search.vue'
	import products from '@/utils/products.js'	
	export default {
		components: { Search },
		data() {
			return {
				banners: [
					{
						image: 'https://img.picui.cn/free/2025/05/09/681e035575fe1.jpg'
					},
					{
						image: 'https://img.picui.cn/free/2025/05/09/681e0348c462c.jpg'
					},					
					{
						image: 'https://img.picui.cn/free/2025/05/09/681e03392eb6c.jpg'
					},					
					{
						image: 'https://img.picui.cn/free/2025/05/09/681e0340523c5.jpg'
					},					
					{
						image: 'https://img.picui.cn/free/2025/05/09/681e034c40ea5.jpg'
					},					
					{
						image: 'https://img.picui.cn/free/2025/05/09/681e03432edfb.jpg'
					},					
					{
						image: 'https://img.picui.cn/free/2025/05/09/681e033a9abb8.jpg'
					},
				],
				categories: [
					{
						id: 'luxury',
						name: '奢侈品',
						icon: 'iconfont icon-luxury'
					},
					{
						id: 'car',
						name: '豪车',
						icon: 'iconfont icon-car'
					},
					{
						id: 'house',
						name: '豪宅',
						icon: 'iconfont icon-house'
					},
					{
						id: 'game',
						name: '小游戏',
						icon: 'iconfont icon-game'
					}
				],
				hotProducts: [],
				current: 0,
				suggestions: [],
				showSuggestions: false,
				autoplay: true
			}
		},
		onLoad() {
			this.hotProducts = products.getHotProducts()
		},
		methods: {
			handleSearch(keyword) {
				uni.navigateTo({
					url: `/pages/menu/menu?keyword=${encodeURIComponent(keyword)}`
				})
			},
			handleSelect(item) {
				if (item.type === 'product') {
					uni.navigateTo({
						url: `/pages/son_pages/detail?id=${item.id}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/menu/menu?keyword=${encodeURIComponent(item.name)}`
					})
				}
			},
			goToMenu(categoryId) {
				if(categoryId === 'game'){
					uni.switchTab({
						url: '/pages/games/games'
					})
				}  else {
					uni.setStorageSync('menuCategory', categoryId)
					uni.switchTab({
						url: '/pages/menu/menu'
					})
				}
			},
			goToDetail(productId) {
				// console.log('跳轉到詳情頁，商品ID：', productId)
				uni.navigateTo({
					url: '/pages/son_pages/detail?id=' + productId
				})
			},
			prevBanner() {
				this.current = (this.current - 1 + this.banners.length) % this.banners.length
				this.resetAutoplay()
			},
			nextBanner() {
				this.current = (this.current + 1) % this.banners.length
				this.resetAutoplay()
			},
			onBannerChange(e) {
				this.current = e.detail.current
			},
			resetAutoplay() {
				// 先关闭自动播放
				this.autoplay = false
				// 在下一个事件循环中重新开启自动播放
				this.$nextTick(() => {
					this.autoplay = true
				})
			},
			onInput(val) {
				this.suggestions = products.getSuggestions(val)
				this.showSuggestions = !!val && this.suggestions.length > 0
			},
			selectSuggestion(item) {
				this.inputValue = item.name
				this.showSuggestions = false
			}
		}
	}
</script>

<style>
	.container {
		background-color: #121212;
		min-height: 100vh;
	}
	
	.content {
		padding: 20rpx;
	}
	
	.search-box {
		padding: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}
	
	.search-input {
		background-color: #f5f5f5;
		padding: 10rpx 20rpx;
		border-radius: 8rpx;
	}
	
	.banner-wrapper {
		position: relative;
	}
	
	.arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 60rpx;
		height: 60rpx;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 50%;
	}
	
	.arrow-icon {
		width: 40rpx;
		height: 40rpx;
	}
	
	.left-arrow { left: 20rpx; }
	.right-arrow { right: 20rpx; }
	
	.banner {
		height: 300rpx;
		margin-bottom: 20rpx;
	}
	
	.banner-image {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}
	
	.category-nav {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		padding: 30rpx;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}
	
	.category-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.category-item .iconfont {
		font-size: 48rpx;
		color: #333;
		margin-bottom: 10rpx;
	}
	
	.category-name {
		font-size: 24rpx;
		color: #333;
	}
	
	.hot-section {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 10rpx;
	}
	
	.section-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.title-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.more-text {
		font-size: 24rpx;
		color: #999;
	}
	
	.hot-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	
	.hot-item {
		width: 48%;
		margin-bottom: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		overflow: hidden;
	}
	
	.hot-image {
		width: 100%;
		height: 200rpx;
		margin-bottom: 10rpx;
	}
	
	.hot-info {
		padding: 10rpx;
	}
	
	.hot-name {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 5rpx;
	}
	
	.hot-price {
		font-size: 32rpx;
		color: #FF4D4F;
		font-weight: bold;
		margin-bottom: 5rpx;
	}
	
	.hot-config {
		font-size: 24rpx;
		color: #666;
	}
	
	.suggestion-list {
		position: absolute;
		left: 0; 
		right: 0;
		top: 70rpx; /* 根据实际输入框高度微调 */
		background: #fff;
		z-index: 99;
		border-radius: 0 0 12rpx 12rpx;
		box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.10);
		overflow: hidden;
		max-height: 300rpx;
		overflow-y: auto;
		margin-top: 2rpx;
	}
	
	.suggestion-item {
		padding: 24rpx 32rpx;
		font-size: 28rpx;
		color: #222;
		cursor: pointer;
		transition: background 0.2s;
	}
	
	.suggestion-item:hover {
		background: #f5f7fa;
	}
	
	.suggestion-item:not(:last-child) {
		border-bottom: 1rpx solid #f0f0f0;
	}

	.icon-car:before {
    content: "\e633";
}
.icon-house:before {
    content: "\e62c";  /* 替換為實際的 Unicode */
}
.icon-luxury:before {
    content: "\e62e";  /* 替換為實際的 Unicode */
}
.icon-game:before {
    content: "\e60d";  /* 替換為實際的 Unicode */
}
</style>
