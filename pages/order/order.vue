<template>
	<view class="container">
		<!-- 顶部状态栏 -->
		<view class="status-bar">
			<view class="status-item" v-for="(item, index) in statusList" :key="index"
				:class="{ active: currentStatus === item.value }"
				@tap="switchStatus(item.value)">
				<text class="status-name">{{item.name}}</text>
				<text class="status-count" v-if="item.count > 0">{{item.count}}</text>
			</view>
		</view>
		
		<!-- 订单列表 -->
		<scroll-view class="order-list" scroll-y>
			<view class="order-card" v-for="(order, index) in filteredOrders" :key="index">
				<!-- 订单头部 -->
				<view class="order-header">
					<view class="order-info">
						<text class="order-time">{{formatTime(order.createTime)}}</text>
						<text class="order-no">订单号：{{order.id}}</text>
					</view>
					<text class="order-status" :class="getStatusClass(order.status)">{{order.status}}</text>
				</view>
				
				<!-- 商品信息 -->
				<view class="product-section">
					<image :src="getProductImage(order.productId)" mode="aspectFill" class="product-image"></image>
					<view class="product-detail">
						<text class="product-name">{{order.productName}}</text>
						<view class="sku-info">
							<text class="sku-item" v-for="(feature, idx) in order.sku.features" :key="idx">{{feature}}</text>
						</view>
						<view class="price-section">
							<text class="price-label">成交价</text>
							<text class="price-value">¥{{order.price}}万</text>
						</view>
					</view>
				</view>
				
				<!-- 订单操作 -->
				<view class="order-actions">
					<view class="action-left">
						<text class="action-text" v-if="order.status === '待付款'">剩余支付时间：{{formatCountdown(order.payDeadline)}}</text>
						<text class="action-text" v-if="order.status === '待发货'">预计发货时间：{{formatTime(order.estimatedDelivery)}}</text>
					</view>
					<view class="action-right">
						<button class="action-btn primary" v-if="order.status === '待付款'" @tap="payOrder(order)">立即支付</button>
						<button class="action-btn" v-if="order.status === '待发货'" @tap="cancelOrder(order)">取消订单</button>
						<button class="action-btn primary" v-if="order.status === '待收货'" @tap="confirmReceive(order)">确认收货</button>
						<button class="action-btn" v-if="order.status === '已完成'" @tap="deleteOrder(order)">删除订单</button>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 空状态 -->
		<view class="empty-state" v-if="filteredOrders.length === 0">
			<image src="https://img.picui.cn/free/2025/05/09/681e034f1d1f2.jpg" mode="aspectFit" class="empty-image"></image>
			<text class="empty-text">暂无相关订单</text>
		</view>
	</view>
</template>

<script>
	import userData from '@/utils/user.js'
	import products from '@/utils/products.js'
	
	export default {
		data() {
			return {
				currentStatus: 'all',
				statusList: [
					{ name: '全部', value: 'all', count: 0 },
					{ name: '待付款', value: '待付款', count: 0 },
					{ name: '待发货', value: '待发货', count: 0 },
					{ name: '待收货', value: '待收货', count: 0 },
					{ name: '已完成', value: '已完成', count: 0 }
				],
				orders: [],
				timers: {} // 用於存儲每個訂單的定時器
			}
		},
		computed: {
			filteredOrders() {
				if (this.currentStatus === 'all') {
					return this.orders
				}
				return this.orders.filter(order => order.status === this.currentStatus)
			}
		},
		onLoad(options) {
        	if (options.status) {
        	    this.currentStatus = options.status;
        	}
        	this.loadOrders();
    	},
		onShow() {
			this.loadOrders()
		},
		methods: {
			loadOrders() {
				this.orders = userData.getOrderList()
				this.updateStatusCount()
			},
			switchStatus(status) {
				this.currentStatus = status
				uni.navigateTo({
            		url: '/pages/order/order?status=' + status
        		})
			},
			updateStatusCount() {
				this.statusList.forEach(item => {
					if (item.value === 'all') {
						item.count = this.orders.length
					} else {
						item.count = this.orders.filter(order => order.status === item.value).length
					}
				})
			},
			getProductImage(productId) {
				const product = products.getProductById(productId)
				return product ? product.images[0] : ''
			},
			formatTime(time) {
				const date = new Date(time)
				return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
			},
			formatCountdown(deadline) {
				const now = new Date()
				const end = new Date(deadline)
				const diff = end - now
				if (diff <= 0) return '已超时'
				
				const hours = Math.floor(diff / (1000 * 60 * 60))
				const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
				return `${hours}小时${minutes}分钟`
			},
			getStatusClass(status) {
				const statusMap = {
					'待付款': 'status-pending',
					'待发货': 'status-processing',
					'待收货': 'status-shipping',
					'已完成': 'status-completed',
					'已取消': 'status-cancelled'
				}
				return statusMap[status] || ''
			},
			startDeliveryTimer(order) {
				// 如果已经有定時器，先清除
				if (this.timers[order.id]) {
					clearTimeout(this.timers[order.id]);
				}
				
				// 设置10秒的定时器
				this.timers[order.id] = setTimeout(() => {
					order.status = '待收货';
					userData.updateOrder(order);
					this.loadOrders();
					delete this.timers[order.id];
				}, 10000);
			},
			payOrder(order) {
				if (userData.getUserInfo().balance/10000 < order.price) {
					uni.showToast({
						title: '余额不足',
						icon: 'none'
					})
					return
				}
				
				order.status = '待发货'
				userData.updateOrder(order)
				userData.updateBalance(-order.price*10000)
				
				// 啟動發貨定時器
				this.startDeliveryTimer(order);
				
				uni.showToast({
					title: '支付成功',
					icon: 'success'
				})
				
				this.loadOrders()
			},
			cancelOrder(order) {
				uni.showModal({
					title: '取消订单',
					content: '确定要取消该订单吗？',
					success: (res) => {
						if (res.confirm) {
							order.status = '已取消'
							userData.updateOrder(order)
							this.loadOrders()
						}
					}
				})
			},
			confirmReceive(order) {
				uni.showModal({
					title: '确认收货',
					content: '请确认已收到商品并检查无误',
					success: (res) => {
						if (res.confirm) {
							order.status = '已完成'
							userData.updateOrder(order)
							this.loadOrders()
						}
					}
				})
			},
			deleteOrder(order) {
				uni.showModal({
					title: '删除订单',
					content: '确定要删除该订单记录吗？',
					success: (res) => {
						if (res.confirm) {
							userData.deleteOrder(order.id)
							this.loadOrders()
						}
					}
				})
			},
			onUnload() {
				// 組件卸載時清除所有定時器
				Object.values(this.timers).forEach(timer => {
					clearTimeout(timer);
				});
				this.timers = {};
			}
		}
	}
</script>

<style>
	.container {
		padding: 20rpx;
		background-color: #f8f8f8;
		min-height: 100vh;
	}
	
	.status-bar {
		display: flex;
		background-color: #fff;
		padding: 20rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	}
	
	.status-item {
		flex: 1;
		text-align: center;
		position: relative;
		padding: 10rpx 0;
	}
	
	.status-name {
		font-size: 28rpx;
		color: #666;
	}
	
	.status-count {
		position: absolute;
		top: -10rpx;
		right: 20rpx;
		background-color: #FF4D4F;
		color: #fff;
		font-size: 20rpx;
		padding: 2rpx 8rpx;
		border-radius: 20rpx;
	}
	
	.status-item.active .status-name {
		color: #1a1a1a;
		font-weight: bold;
	}
	
	.status-item.active::after {
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
	
	.order-list {
		height: calc(100vh - 180rpx);
	}
	
	.order-card {
		background-color: #fff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	}
	
	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}
	
	.order-info {
		display: flex;
		flex-direction: column;
	}
	
	.order-time {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 8rpx;
	}
	
	.order-no {
		font-size: 24rpx;
		color: #666;
	}
	
	.order-status {
		font-size: 28rpx;
		padding: 6rpx 20rpx;
		border-radius: 30rpx;
	}
	
	.status-pending {
		color: #FF4D4F;
		background-color: rgba(255,77,79,0.1);
	}
	
	.status-processing {
		color: #1890FF;
		background-color: rgba(24,144,255,0.1);
	}
	
	.status-shipping {
		color: #52C41A;
		background-color: rgba(82,196,26,0.1);
	}
	
	.status-completed {
		color: #666;
		background-color: rgba(102,102,102,0.1);
	}
	
	.status-cancelled {
		color: #999;
		background-color: rgba(153,153,153,0.1);
	}
	
	.product-section {
		display: flex;
		margin-bottom: 30rpx;
	}
	
	.product-image {
		width: 180rpx;
		height: 180rpx;
		border-radius: 12rpx;
		margin-right: 30rpx;
	}
	
	.product-detail {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.product-name {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	
	.sku-info {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 20rpx;
	}
	
	.sku-item {
		font-size: 24rpx;
		color: #666;
		background-color: #f5f5f5;
		padding: 6rpx 16rpx;
		border-radius: 20rpx;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
	}
	
	.price-section {
		display: flex;
		align-items: baseline;
	}
	
	.price-label {
		font-size: 24rpx;
		color: #999;
		margin-right: 10rpx;
	}
	
	.price-value {
		font-size: 36rpx;
		color: #FF4D4F;
		font-weight: bold;
	}
	
	.order-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 30rpx;
		border-top: 1rpx solid #f5f5f5;
	}
	
	.action-left {
		flex: 1;
	}
	
	.action-text {
		font-size: 24rpx;
		color: #999;
	}
	
	.action-right {
		display: flex;
	}
	
	.action-btn {
		margin-left: 20rpx;
		padding: 0 30rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		background-color: #f5f5f5;
		color: #666;
		border-radius: 30rpx;
		font-size: 24rpx;
	}
	
	.action-btn.primary {
		background-color: #1a1a1a;
		color: #fff;
	}
	
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 100rpx 0;
	}
	
	.empty-image {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #999;
	}
</style> 