<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-box">
			<input type="text" placeholder="搜索豪车/豪宅" class="search-input" />
		</view>
		
		<!-- 分类标签 -->
		<view class="category-tabs">
			<view class="tab-item" v-for="(item, index) in categories" :key="index" :class="{ active: currentCategory === item.id}" @tap="switchCategory(item.id)">
				<text>{{item.name}}</text>
			</view>
		</view>
		
		<!-- 商品列表 -->
		<view class="product-list">
			<view class="product-item" v-for="(item, index) in products" :key="index">
				<image :src="item.images[0]" mode="aspectFill" class="product-image" @tap="goToDetail(item.id)"></image>
				<view class="product-info">
					<text class="product-name" @tap="goToDetail(item.id)">{{item.name}}</text>
					<text class="product-price">¥{{item.skus[0].price}}万</text>
					<text class="product-desc">{{item.description}}</text>
					<view class="product-tags">
						<text class="tag" v-if="item.canBargain">可砍价</text>
						<text class="tag" v-for="(feature, fIndex) in item.skus[0].features.slice(0, 2)" :key="fIndex">{{feature}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import products from '@/utils/products.js'
	import userData from '@/utils/user.js'
	
	export default {
		data() {
			return {
				categories: [
					{
						id: 'all',
						name: '全部'
					},
					{
						id: 'car',
						name: '豪车'
					},
					{
						id: 'house',
						name: '豪宅'
					}
				],
				currentCategory: 'all',
				products: [],
				userBalance: 0
			}
		},
		onLoad(options) {
			if (options.category) {
				this.currentCategory = options.category
			}
			this.loadProducts()
			this.userBalance = userData.getUserInfo().balance/10000
		},
		methods: {
			switchCategory(category) {
				this.currentCategory = category
				this.loadProducts()
			},
			loadProducts() {
				this.products = products.getProductsByCategory(this.currentCategory)
			},
			goToDetail(productId) {
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + productId
				})
			}
		}
	}
</script>

<style>
	.container {
		padding: 20rpx;
		background-color: #f5f5f5;
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
	
	.category-tabs {
		display: flex;
		background-color: #fff;
		padding: 20rpx;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}
	
	.tab-item {
		flex: 1;
		text-align: center;
		font-size: 28rpx;
		color: #666;
		padding: 10rpx 0;
		position: relative;
	}
	
	.tab-item.active {
		color: #1a1a1a;
		font-weight: bold;
	}
	
	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 4rpx;
		background-color: #1a1a1a;
		border-radius: 2rpx;
	}
	
	.product-list {
		display: flex;
		flex-direction: column;
	}
	
	.product-item {
		display: flex;
		background-color: #fff;
		padding: 20rpx;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}
	
	.product-image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
	}
	
	.product-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	.product-name {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	
	.product-price {
		font-size: 36rpx;
		color: #FF4D4F;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	
	.product-desc {
		font-size: 24rpx;
		color: #666;
		margin-bottom: 10rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	
	.product-tags {
		display: flex;
		flex-wrap: wrap;
	}
	
	.tag {
		font-size: 22rpx;
		color: #666;
		background-color: #f5f5f5;
		padding: 4rpx 12rpx;
		border-radius: 4rpx;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
	}
</style> 