<template>
	<view class="container">
		<!-- 用戶信息卡片 -->
		<view class="user-card">
			<view class="user-info">
				<image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
				<view class="info">
					<text class="nickname">{{ userInfo.nickname }}</text>
					<text class="id">ID: {{ userInfo.ID }}   </text>
					<text class="phone" v-if="userInfo.phone"> &ensp;&ensp;Phone: {{ userInfo.phone }}</text>
				</view>
			</view>
			<view class="balance">
				<text class="label">账户余额：</text>
				<text class="value">¥{{userInfo.balance}}</text>
			</view>
		</view>
		
		<!-- 功能菜單 -->
		<view class="menu-list">
			<view class="menu-item" @tap="goToOrders('待付款')">
				<view class="left">
					<image class="icon" src="https://img.picui.cn/free/2025/05/09/681e034f1d1f2.jpg"></image>
					<text>待付款</text>
				</view>
				<view class="right">
					<text class="count">{{orderCounts['待付款']}}</text>
					<text class="arrow">></text>
				</view>
			</view>
			<view class="menu-item" @tap="goToOrders('待发货')">
				<view class="left">
					<image class="icon" src="https://img.picui.cn/free/2025/05/09/681e034ec681d.webp"></image>
					<text>待发货</text>
				</view>
				<view class="right">
					<text class="count">{{orderCounts['待发货']}}</text>
					<text class="arrow">></text>
				</view>
			</view>
			<view class="menu-item" @tap="goToOrders('待收货')">
				<view class="left">
					<image class="icon" src="https://img.picui.cn/free/2025/05/09/681e034f790dc.jpg"></image>
					<text>待收货</text>
				</view>
				<view class="right">
					<text class="count">{{orderCounts['待收货']}}</text>
					<text class="arrow">></text>
				</view>
			</view>
			<view class="menu-item" @tap="goToOrders('已完成')">
				<view class="left">
					<image class="icon" src="https://img.picui.cn/free/2025/05/09/681e034c3cc49.jpg"></image>
					<text>已完成</text>
				</view>
				<view class="right">
					<text class="count">{{orderCounts['已完成']}}</text>
					<text class="arrow">></text>
				</view>
			</view>
		</view>
		
		<!-- 我的资产 -->
		<view class="history-section">
			<view class="section-header">
				<text class="title">我的资产</text>
				<text class="more" @tap="viewAllHistory">查看全部 ></text>
			</view>
			<view class="history-list">
				<view class="history-item" v-for="(item, index) in historyOrders" :key="index" @tap="viewOrderDetail(item)">
					<image :src="item.productImage" mode="aspectFill" class="product-image"></image>
					<view class="product-info">
						<text class="product-name">{{item.productName}}</text>
						<text class="product-sku">{{item.sku.name}}</text>
						<text class="purchase-time">{{formatDate(item.createTime)}}</text>
					</view>
					<view class="price-info">
						<view class="price-row">
							<text class="price" v-if="item.price > 0">¥{{item.price}}万</text>
							<text class="type-tag" v-if="item.type === 'game'">游戏奖品</text>
						</view>
						<text class="status" :class="item.status === '已完成' ? 'completed' : item.status">{{item.status}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 优惠券 -->
		<view class="coupon-section">
			<view class="section-header">
				<text class="title">我的优惠券</text>
				<text class="more" @tap="goToCoupons">查看全部</text>
			</view>
			<view class="coupon-list">
				<view class="coupon-item" v-for="(coupon, index) in validCoupons.slice(0, 2)" :key="index">
					<view class="left">
						<text class="value">¥{{coupon.value}}</text>
						<text class="condition">满{{coupon.value * 2 / 10000}}万可用</text>
					</view>
					<view class="right">
						<text class="expire">有效期至：{{formatDate(coupon.expireTime)}}</text>
						<button class="use-btn" @tap="useCoupon(coupon.id)">立即使用</button>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 其他功能 -->
		<view class="other-functions">
			<view class="function-item" @tap="goToAddress">
				<span class="iconfont">&#xe61d;</span>
				<text>收货地址</text>
			</view>
			<view class="function-item" @tap="goToService">
				<span class="iconfont">&#xe816;</span>
				<text>客服中心</text>
			</view>
			<view class="function-item" @tap="goToSettings">
				<span class="iconfont">&#xe646;</span>
				<text>设置</text>
			</view>
		</view>
	</view>
</template>

<script>
	import userData from '@/utils/user.js'
	
	export default {
		data() {
			return {
				userInfo: {},
				orderCounts: {
					'待付款': 0,
					'待发货': 0,
					'待收货': 0,
					'已完成': 0
				},
				historyOrders: [],
				validCoupons: []
			}
		},
		onShow() {
			this.loadUserData()
		},
		methods: {
			loadUserData() {
				this.userInfo = userData.getUserInfo()
				this.calculateOrderCounts()
				this.loadHistoryOrders()
				this.validCoupons = userData.getValidCoupons()
			},
			calculateOrderCounts() {
				const orders = userData.getOrderList()
				this.orderCounts = {
					'待付款': 0,
					'待发货': 0,
					'待收货': 0,
					'已完成': 0
				}
				orders.forEach(order => {
					if (this.orderCounts.hasOwnProperty(order.status)) {
						this.orderCounts[order.status]++
					}
				})
			},
			loadHistoryOrders() {
				const orders = userData.getOrderList()
				console.log(orders)
				const gameRecords = userData.getGameRecords()
				
				// 将游戏记录转换为订单格式，过滤掉优惠券类型
				const gameOrders = gameRecords
					.filter(record => record.type !== 'coupon')
					.map(record => ({
						id: record.id,
						productName: record.prize,
						productImage: this.getPrizeImage(record.prize),
						price: 0,
						status: '已完成',
						createTime: record.time,
						type: 'game',
						sku: {
							name: '游戏奖品'
						}
					}))
				
				// 合并订单和游戏记录，按时间排序
				this.historyOrders = [...orders, ...gameOrders]
					.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
					.slice(0, 5)
					.map(order => ({
						...order,
						productImage: order.productImage || 'https://img.picui.cn/free/2025/05/09/681e034c3cc49.jpg'
					}))
			},
			getPrizeImage(prizeName) {
				if (prizeName.includes('五菱宏光')) {
					return 'https://img.picui.cn/free/2025/05/09/681e033a9abb8.jpg'
				} else if (prizeName.includes('百万豪宅')) {
					return 'https://img.picui.cn/free/2025/05/09/681e033395341.jpeg'
				} else if (prizeName.includes('小米SU7')) {
					return 'https://img.picui.cn/free/2025/05/09/681e03432edfb.jpg'
				} else if (prizeName.includes('10万优惠券')) {
					return 'https://img.picui.cn/free/2025/05/09/681e034c3cc49.jpg'
				} else if (prizeName.includes('5万优惠券')) {
					return 'https://img.picui.cn/free/2025/05/09/681e034c3cc49.jpg'
				} else if (prizeName.includes('现金红包')) {
					return 'https://img.picui.cn/free/2025/05/09/681e034f1d1f2.jpg'
				} else if (prizeName.includes('迈巴赫S级')) {
					return 'https://img.picui.cn/free/2025/05/09/681e034c40ea5.jpg'
				} 
				return 'https://img.picui.cn/free/2025/05/09/681e034f790dc.jpg'
			},
			goToOrders(status) {
				uni.switchTab({
					url: '/pages/order/order?status=' + status
				})
			},
			viewAllHistory() {
				uni.navigateTo({
					url: '/pages/user/assets'
				})
			},
			viewOrderDetail(order) {
				uni.switchTab({
					url: '/pages/order/detail?id=' + order.id
				})
			},
			goToCoupons() {
				uni.navigateTo({
					url: '/pages/coupon/coupon'
				})
			},
			formatDate(dateStr) {
				const date = new Date(dateStr)
				return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
			},
			useCoupon(couponId) {
				if (userData.useCoupon(couponId)) {
					uni.showToast({
						title: '使用成功',
						icon: 'success'
					})
					this.loadUserData()
				} else {
					uni.showToast({
						title: '使用失败',
						icon: 'error'
					})
				}
			},
			goToAddress() {
				uni.navigateTo({
					url: '/pages/address/address'
				})
			},
			goToService() {
				uni.navigateTo({
					url: '/pages/service/service'
				})
			},
			goToSettings() {
				uni.navigateTo({
					url: '/pages/settings/settings'
				})
			}
		}
	}
</script>

<style>
	.container {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}
	
	.user-card {
		background-color: #1a1a1a;
		border-radius: 20rpx;
		padding: 40rpx;
		margin-bottom: 20rpx;
	}
	
	.user-info {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
	}
	
	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		margin-right: 20rpx;
	}
	
	.info {
		flex: 1;
	}
	
	.nickname {
		font-size: 36rpx;
		color: #fff;
		font-weight: bold;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.id {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.7);
	}	
	
	.phone {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.7);
	}
	
	.balance {
		text-align: center;
	}
	
	.balance .label {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.7);
		display: block;
		margin-bottom: 10rpx;
	}
	
	.balance .value {
		font-size: 48rpx;
		color: #fff;
		font-weight: bold;
	}
	
	.menu-list {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 0 20rpx;
		margin-bottom: 20rpx;
	}
	
	.menu-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
	}
	
	.menu-item:last-child {
		border-bottom: none;
	}
	
	.menu-item .left {
		display: flex;
		align-items: center;
	}
	
	.menu-item .icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}
	
	.menu-item text {
		font-size: 28rpx;
		color: #333;
	}
	
	.menu-item .right {
		display: flex;
		align-items: center;
	}
	
	.menu-item .count {
		font-size: 24rpx;
		color: #FF4D4F;
		margin-right: 10rpx;
	}
	
	.menu-item .arrow {
		font-size: 24rpx;
		color: #999;
	}
	
	.history-section {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.section-header .title {
		font-size: 32rpx;
		color: #1a1a1a;
		font-weight: bold;
	}
	
	.section-header .more {
		font-size: 24rpx;
		color: #999;
	}
	
	.history-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	
	.history-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: #f5f5f5;
		border-radius: 10rpx;
	}
	
	.history-item .product-image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
	}
	
	.history-item .product-info {
		flex: 1;
	}
	
	.history-item .product-name {
		font-size: 28rpx;
		color: #1a1a1a;
		font-weight: bold;
		margin-bottom: 10rpx;
		display: block;
	}
	
	.history-item .product-sku {
		font-size: 24rpx;
		color: #666;
		margin-bottom: 10rpx;
		display: block;
	}
	
	.history-item .purchase-time {
		font-size: 22rpx;
		color: #999;
	}
	
	.history-item .price-info {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
	}
	
	.history-item .price-row {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}
	
	.history-item .price {
		font-size: 32rpx;
		color: #FF4D4F;
		font-weight: bold;
	}
	
	.history-item .type-tag {
		font-size: 24rpx;
		color: #fff;
		background-color: #4CAF50;
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
	}
	
	.history-item .status {
		font-size: 24rpx;
		color: #999;
		margin-top: 8rpx;
	}
	
	.history-item .status.completed {
		color: #52c41a;
	}
	
	.history-item .status.pending {
		color: #faad14;
	}
	
	.history-item .status.failed {
		color: #ff4d4f;
	}
	
	.coupon-section {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.section-header .title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}
	
	.section-header .more {
		font-size: 24rpx;
		color: #999;
	}
	
	.coupon-list {
		display: flex;
		flex-direction: column;
	}
	
	.coupon-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		background-color: #FFF5F5;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}
	
	.coupon-item:last-child {
		margin-bottom: 0;
	}
	
	.coupon-item .left {
		text-align: center;
	}
	
	.coupon-item .value {
		font-size: 40rpx;
		color: #FF4D4F;
		font-weight: bold;
		display: block;
	}
	
	.coupon-item .condition {
		font-size: 24rpx;
		color: #666;
	}
	
	.coupon-item .right {
		text-align: right;
	}
	
	.coupon-item .expire {
		font-size: 24rpx;
		color: #999;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.coupon-item .use-btn {
		width: 160rpx;
		height: 50rpx;
		line-height: 50rpx;
		background-color: #FF4D4F;
		color: #fff;
		font-size: 24rpx;
		border-radius: 25rpx;
	}
	
	.other-functions {
		display: flex;
		justify-content: space-around;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
	}
	
	.function-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.function-item .icon {
		width: 60rpx;
		height: 60rpx;
		margin-bottom: 10rpx;
	}
	
	.function-item text {
		font-size: 24rpx;
		color: #333;
	}
</style> 