<template>
	<view class="container" v-if="product">
		<!-- 商品信息 -->
		<view class="product-info">
			<image :src="product.images[0]" mode="aspectFill" class="product-image"></image>
			<view class="info-right">
				<text class="product-name">{{product.name}}</text>
				<view class="price-info">
					<text class="current-price">¥{{currentPrice}}万</text>
					<text class="original-price">原价：¥{{product.skus[0].price}}万</text>
				</view>
				<text class="min-price">最低价：¥{{product.minPrice}}万</text>
			</view>
		</view>
		
		<!-- 砍价进度 -->
		<view class="bargain-progress">
			<view class="progress-title">
				<text>砍价进度</text>
				<text class="bargain-count">已砍{{bargainCount}}次</text>
			</view>
			<view class="progress-bar">
				<view class="progress-inner" :style="{width: progress + '%'}"></view>
			</view>
			<view class="progress-text">
				<text>已砍{{(product.skus[0].price - currentPrice).toFixed(2)}}万</text>
				<text>还需砍{{(currentPrice - product.minPrice).toFixed(2)}}万</text>
			</view>
		</view>
		
		<!-- 砍价记录 -->
		<view class="bargain-records">
			<view class="records-title">砍价记录</view>
			<view class="record-list">
				<view class="record-item" v-for="(item, index) in records" :key="index">
					<text class="record-name">{{item.name}}</text>
					<text class="record-amount">砍掉¥{{item.amount}}万</text>
					<text class="record-time">{{item.time}}</text>
				</view>
			</view>
		</view>
		
		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<button class="bargain-btn" @tap="doBargain" :disabled="isBargaining">立即砍价</button>
			<button class="buy-btn" @tap="buyNow">立即购买</button>
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
				currentPrice: 0,
				bargainCount: 0,
				records: [],
				isBargaining: false,
				selectedSku: null,
				userBalance: 0,
				maxBargainCount: 5 // 最大砍价次数
			}
		},
		computed: {
			progress() {
				if (!this.product) return 0
				const total = this.product.skus[0].price - this.product.minPrice
				const current = this.product.skus[0].price - this.currentPrice
				return (current / total) * 100
			}
		},
		onLoad(options) {
			this.product = products.getProductById(options.id)
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
			this.currentPrice = this.product.skus[0].price
			this.loadRecords()
		},
		methods: {
			loadRecords() {
				// 模拟加载砍价记录
				this.records = [
					{
						name: '用户A',
						amount: '5.00',
						time: '10:30'
					},
					{
						name: '用户B',
						amount: '3.50',
						time: '10:28'
					}
				]
			},
			doBargain() {
				if (this.isBargaining) return
				if (this.bargainCount >= this.maxBargainCount) {
					uni.showToast({
						title: '已达到最大砍价次数',
						icon: 'none'
					})
					return
				}
				if (this.currentPrice <= this.product.minPrice) {
					uni.showToast({
						title: '已砍到最低价',
						icon: 'none'
					})
					return
				}
				
				this.isBargaining = true
				
				// 模拟砍价过程
				setTimeout(() => {
					const minAmount = 5
					const maxAmount = 30
					const amount = (Math.random() * (maxAmount - minAmount) + minAmount).toFixed(0)
					
					this.currentPrice = Math.max(this.product.minPrice, this.currentPrice - parseFloat(amount))
					this.bargainCount++
					
					// 添加砍价记录
					this.records.unshift({
						name: '我',
						amount: amount,
						time: new Date().toLocaleTimeString()
					})
					
					this.isBargaining = false
					
					if (this.currentPrice <= this.product.minPrice) {
						uni.showToast({
							title: '恭喜砍到最低价！',
							icon: 'success'
						})
					}

					if (this.bargainCount >= this.maxBargainCount) {
						this.isBargaining = true // 禁用砍价按钮
					}
				}, 150)
			},
			buyNow() {
				if (this.userBalance < this.selectedSku.price) {
					uni.showModal({
						title: '余额不足',
						content: '您的账户余额不足，请继续努力',
						showCancel: false,
						confirmText: '好的',
						success: (res) => {
							if(res.confirm)
								uni.navigateBack()
						}
					})
					return
				}
				
				// 创建订单
				const order = {
					id: Date.now(),
					productId: this.product.id,
					productName: this.product.name,
					productImage: this.product.images[0],
					sku: this.selectedSku,
					price: this.currentPrice,
					status: '待付款',
					createTime: new Date().toISOString()
				}
				
				// 添加订单
				userData.addOrder(order)
				
				uni.showToast({
					title: '订单已提交',
					icon: 'success'
				})
				
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)

				// uni.navigateTo({
				// 	url: '/pages/detail/detail?id=' + this.product.id
				// })
			}
		}
	}
</script>

<style>
	.container {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
		padding-bottom: 120rpx;
	}
	
	.product-info {
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
	
	.info-right {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.product-name {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}
	
	.price-info {
		display: flex;
		align-items: baseline;
	}
	
	.current-price {
		font-size: 36rpx;
		color: #FF4D4F;
		font-weight: bold;
		margin-right: 20rpx;
	}
	
	.original-price {
		font-size: 24rpx;
		color: #999;
		text-decoration: line-through;
	}
	
	.min-price {
		font-size: 24rpx;
		color: #666;
	}
	
	.bargain-progress {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}
	
	.progress-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.bargain-count {
		font-size: 24rpx;
		color: #666;
	}
	
	.progress-bar {
		height: 20rpx;
		background-color: #f5f5f5;
		border-radius: 10rpx;
		overflow: hidden;
		margin-bottom: 10rpx;
	}
	
	.progress-inner {
		height: 100%;
		background-color: #FF4D4F;
		border-radius: 10rpx;
		transition: width 0.3s;
	}
	
	.progress-text {
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #666;
	}
	
	.bargain-records {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 10rpx;
	}
	
	.records-title {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	
	.record-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
	}
	
	.record-name {
		font-size: 28rpx;
		color: #333;
	}
	
	.record-amount {
		font-size: 28rpx;
		color: #FF4D4F;
	}
	
	.record-time {
		font-size: 24rpx;
		color: #999;
	}
	
	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.1);
	}
	
	.bargain-btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background-color: #FF4D4F;
		color: #fff;
		border-radius: 40rpx;
		margin-right: 20rpx;
	}
	
	.buy-btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background-color: #1a1a1a;
		color: #fff;
		border-radius: 40rpx;
	}
	
	.bargain-btn[disabled] {
		background-color: #ccc;
	}
</style> 