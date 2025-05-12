<template>
	<view class="container" v-if="product">
		<!-- 商品圖片 -->
		<swiper class="product-images" indicator-dots autoplay circular>
			<swiper-item v-for="(image, index) in product.images" :key="index">
				<image :src="image" mode="aspectFill" class="product-image"></image>
			</swiper-item>
		</swiper>
		
		<!-- 商品信息 -->
		<view class="product-info">
			<text class="product-name">{{product.name}}</text>
			<text class="product-price">¥{{selectedSku.price}}万</text>
			<text class="product-desc">{{product.description}}</text>
		</view>
		
		<!-- 商品規格 -->
		<view class="sku-section">
			<view class="section-title">商品规格</view>
			<view class="sku-list">
				<view class="sku-item" v-for="(sku, index) in product.skus" :key="index" 
					:class="{ active: selectedSku.id === sku.id }"
					@tap="selectSku(sku)">
					<text>{{sku.name}}</text>
				</view>
			</view>
		</view>
		
		<!-- 商品特點 -->
		<view class="features-section">
			<view class="section-title">商品特点</view>
			<view class="features-list">
				<view class="feature-item" v-for="(feature, index) in selectedSku.features" :key="index">
					<text>{{feature}}</text>
				</view>
			</view>
		</view>
		
		<!-- 底部操作欄 -->
		<view class="bottom-bar">
			<view class="left">
				<view class="icon-btn" @tap="goToMenu">
					<image src="/static/tabs/home.png" mode="aspectFit"></image>
					<text>首页</text>
				</view>
				<view class="icon-btn" @tap="goToUser">
					<image src="/static/tabs/user.png" mode="aspectFit"></image>
					<text>我的</text>
				</view>
			</view>
			<view class="right">
				<button class="bargain-btn" @tap="goToBargain">砍价</button>
				<button class="buy-btn" @tap="buyNow">立即购买</button>
			</view>
		</view>
	</view>
</template>

<script>
	import userData from '@/utils/user.js'
	import products from '@/utils/products.js'
	
	export default {
		data() {
			return {
				product: null,
				selectedSku: null,
				userBalance: 0
			}
		},
		onLoad(options) {
			// console.log('详情页参数：', options)
			this.product = products.getProductById(options.id)
			// console.log('获取到的商品数据：', this.product)
			if (!this.product) {
				uni.showToast({
					title: '商品不存在',
					icon: 'none'
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
				return
			}
			this.selectedSku = this.product.skus[0]
			this.userBalance = userData.getUserInfo().balance / 10000
		},
		methods: {
			selectSku(sku) {
				this.selectedSku = sku
			},
			buyNow() {
				if (this.userBalance < this.selectedSku.price) {
					uni.showModal({
						title: '余额不足',
						content: '您的账户余额不足，请继续努力',
						showCancel: false,
						confirmText: '好的',
					})
					return
				}
				
				// 创建订单
				const order = {
					id: Date.now(),
					productId: this.product.id,
					productName: this.product.name,
					productImage: this.product.images[0],
					// image: this.product.image,
					sku: this.selectedSku,
					price: this.selectedSku.price,
					status: '待付款',
					createTime: new Date().toISOString()
				}
				// console.log(this.product.images[0])
				
				// 添加订单
				userData.addOrder(order)
				
				uni.showModal({
					title: '订单',
					content: '已提交订单，请前往订单页面付款',
					icon: 'success',
					showCancel: false,
					confirmText: '好的'
				})
				
				// setTimeout(() => {
				// 	uni.navigateBack()
				// }, 1500)
			},
			goToBargain() {
				uni.navigateTo({
					url: '/pages/son_pages/bargain?id=' + this.product.id
				})
			},
			goToMenu() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			goToUser() {
				uni.switchTab({
					url: '/pages/user/user'
				})
			}
		}
	}
</script>

<style>
	.container {
		padding-bottom: 120rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}
	
	.product-images {
		width: 100%;
		height: 600rpx;
	}
	
	.product-image {
		width: 100%;
		height: 100%;
	}
	
	.product-info {
		background-color: #fff;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}
	
	.product-name {
		font-size: 36rpx;
		color: #1a1a1a;
		font-weight: bold;
		margin-bottom: 20rpx;
		display: block;
	}
	
	.product-price {
		font-size: 48rpx;
		color: #FF4D4F;
		font-weight: bold;
		margin-bottom: 20rpx;
		display: block;
	}
	
	.product-desc {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}
	
	.sku-section, .features-section {
		background-color: #fff;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		color: #1a1a1a;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	
	.sku-list {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}
	
	.sku-item {
		padding: 10rpx 30rpx;
		background-color: #f5f5f5;
		border-radius: 8rpx;
		font-size: 28rpx;
		color: #666;
	}
	
	.sku-item.active {
		background-color: #FF4D4F;
		color: #fff;
	}
	
	.features-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	
	.feature-item {
		font-size: 28rpx;
		color: #666;
		padding: 10rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
	}
	
	.feature-item:last-child {
		border-bottom: none;
	}
	
	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.bottom-bar .left {
		display: flex;
		gap: 40rpx;
	}
	
	.icon-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.icon-btn image {
		width: 40rpx;
		height: 40rpx;
		margin-bottom: 6rpx;
	}
	
	.icon-btn text {
		font-size: 20rpx;
		color: #666;
	}
	
	.bottom-bar .right {
		display: flex;
		gap: 20rpx;
	}
	
	.bargain-btn, .buy-btn {
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 40rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
	}
	
	.bargain-btn {
		background-color: #FFA940;
		color: #fff;
	}
	
	.buy-btn {
		background-color: #FF4D4F;
		color: #fff;
	}
</style> 