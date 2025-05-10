<template>
	<view class="container">
		<!-- 优惠券标签页 -->
		<view class="tabs">
			<view class="tab-item" :class="{ active: currentTab === 'valid' }" @tap="switchTab('valid')">
				<text>可用优惠券</text>
				<text class="count">({{validCoupons.length}})</text>
			</view>
			<view class="tab-item" :class="{ active: currentTab === 'used' }" @tap="switchTab('used')">
				<text>已使用</text>
				<text class="count">({{usedCoupons.length}})</text>
			</view>
			<view class="tab-item" :class="{ active: currentTab === 'expired' }" @tap="switchTab('expired')">
				<text>已过期</text>
				<text class="count">({{expiredCoupons.length}})</text>
			</view>
		</view>
		
		<!-- 优惠券列表 -->
		<view class="coupon-list">
			<view class="coupon-item" v-for="(coupon, index) in currentCoupons" :key="index">
				<view class="left">
					<text class="value">¥{{coupon.value / 10000}}万</text>
					<text class="condition">满{{coupon.value * 2 / 10000}}万可用</text>
				</view>
				<view class="right">
					<text class="expire">有效期至：{{formatDate(coupon.expireTime)}}</text>
					<button class="use-btn" v-if="currentTab === 'valid'" @tap="useCoupon(coupon.id)">立即使用</button>
					<text class="status" v-else>{{currentTab === 'used' ? '已使用' : '已过期'}}</text>
				</view>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view class="empty" v-if="currentCoupons.length === 0">
			<image class="empty-image" src="/static/images/empty-coupon.png"></image>
			<text class="empty-text">暂无优惠券</text>
		</view>
	</view>
</template>

<script>
	import userData from '@/utils/user.js'
	
	export default {
		data() {
			return {
				currentTab: 'valid',
				validCoupons: [],
				usedCoupons: [],
				expiredCoupons: []
			}
		},
		computed: {
			currentCoupons() {
				switch(this.currentTab) {
					case 'valid':
						return this.validCoupons
					case 'used':
						return this.usedCoupons
					case 'expired':
						return this.expiredCoupons
					default:
						return []
				}
			}
		},
		onShow() {
			this.loadCoupons()
		},
		methods: {
			loadCoupons() {
				const userInfo = userData.getUserInfo()
				const now = new Date()
				
				// 获取所有优惠券
				const allCoupons = userInfo.coupons || []
				
				// 分类优惠券
				this.validCoupons = allCoupons.filter(coupon => {
					return new Date(coupon.expireTime) > now && !coupon.used
				})
				
				this.usedCoupons = allCoupons.filter(coupon => coupon.used)
				
				this.expiredCoupons = allCoupons.filter(coupon => {
					return new Date(coupon.expireTime) <= now && !coupon.used
				})
			},
			switchTab(tab) {
				this.currentTab = tab
			},
			formatDate(dateStr) {
				const date = new Date(dateStr)
				return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
			},
			useCoupon(couponId) {
				if (userData.useCoupon(couponId)) {
					uni.showToast({
						title: '使用成功',
						icon: 'success'
					})
					this.loadCoupons()
				} else {
					uni.showToast({
						title: '使用失败',
						icon: 'error'
					})
				}
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
	
	.tabs {
		display: flex;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
	}
	
	.tab-item {
		flex: 1;
		text-align: center;
		font-size: 28rpx;
		color: #666;
		position: relative;
	}
	
	.tab-item.active {
		color: #1a1a1a;
		font-weight: bold;
	}
	
	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: -10rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 4rpx;
		background-color: #1a1a1a;
		border-radius: 2rpx;
	}
	
	.tab-item .count {
		font-size: 24rpx;
		color: #999;
		margin-left: 4rpx;
	}
	
	.coupon-list {
		display: flex;
		flex-direction: column;
	}
	
	.coupon-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}
	
	.coupon-item:last-child {
		margin-bottom: 0;
	}
	
	.coupon-item .left {
		text-align: center;
	}
	
	.coupon-item .value {
		font-size: 48rpx;
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
	
	.coupon-item .status {
		font-size: 24rpx;
		color: #999;
	}
	
	.empty {
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