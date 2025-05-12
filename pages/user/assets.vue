<template>
	<view class="container">
		<!-- 顶部卡片 -->
		<view class="header-card">
			<view class="total-assets">
				<text class="label">总资产</text>
				<text class="value">¥{{totalAssets}}万</text>
			</view>
			<view class="assets-breakdown">
				<view class="breakdown-item">
					<text class="label">可用余额</text>
					<text class="value">¥{{balance}}万</text>
				</view>
				<view class="breakdown-item">
					<text class="label">冻结金额</text>
					<text class="value">¥{{frozenAmount}}万</text>
				</view>
			</view>
		</view>
		
		<!-- 资产明细 -->
		<view class="assets-detail">
			<view class="section-title">资产明细</view>
			<view class="detail-list">
				<view class="detail-item" v-for="(item, index) in assetsList" :key="index">
					<view class="item-left">
						<text class="item-name">{{item.name}}</text>
						<text class="item-time">{{item.time}}</text>
					</view>
					<view class="item-right">
						<text class="item-amount" :class="{'income': item.type === 'income', 'expense': item.type === 'expense'}">
							{{item.type === 'income' ? '+' : '-'}}¥{{item.amount/10000}}万
						</text>
						<text class="item-status">{{item.status}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 底部按钮 -->
		<view class="bottom-buttons">
			<button class="recharge-btn" @tap="goToRecharge">充值</button>
			<button class="withdraw-btn" @tap="goToWithdraw">提现</button>
		</view>
	</view>
</template>

<script>
	import userData from '@/utils/user.js'
	
	export default {
		data() {
			return {
				totalAssets: 0,
				balance: 0,
				frozenAmount: 0,
				assetsList: []
			}
		},
		onLoad() {
			this.loadAssetsData()
		},
		methods: {
			loadAssetsData() {
				const userInfo = userData.getUserInfo()
				this.balance = userInfo.balance/10000
				this.frozenAmount = userInfo.frozenAmount/10000
				this.totalAssets = this.balance + this.frozenAmount
				
				// 资产明细列表
				this.assetsList = userData.getAssetsList()
			},
			goToRecharge() {
				uni.showToast({
					title: '充值功能开发中',
					icon: 'none'
				})
			},
			goToWithdraw() {
				uni.showToast({
					title: '提现功能开发中',
					icon: 'none'
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
	
	.header-card {
		background: linear-gradient(135deg, #FF4D4F, #FF8C42);
		border-radius: 20rpx;
		padding: 40rpx;
		color: #fff;
		margin-bottom: 30rpx;
	}
	
	.total-assets {
		margin-bottom: 40rpx;
	}
	
	.total-assets .label {
		font-size: 28rpx;
		opacity: 0.8;
	}
	
	.total-assets .value {
		font-size: 48rpx;
		font-weight: bold;
		display: block;
		margin-top: 10rpx;
	}
	
	.assets-breakdown {
		display: flex;
		justify-content: space-between;
	}
	
	.breakdown-item .label {
		font-size: 24rpx;
		opacity: 0.8;
	}
	
	.breakdown-item .value {
		font-size: 32rpx;
		font-weight: bold;
		display: block;
		margin-top: 10rpx;
	}
	
	.assets-detail {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
	}
	
	.detail-list {
		display: flex;
		flex-direction: column;
	}
	
	.detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
	}
	
	.detail-item:last-child {
		border-bottom: none;
	}
	
	.item-left {
		flex: 1;
	}
	
	.item-name {
		font-size: 28rpx;
		color: #333;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.item-time {
		font-size: 24rpx;
		color: #999;
	}
	
	.item-right {
		text-align: right;
	}
	
	.item-amount {
		font-size: 32rpx;
		font-weight: bold;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.item-amount.expense {
		color: #52c41a;
	}
	
	.item-amount.income {
		color: #ff4d4f;
	}
	
	.item-status {
		font-size: 24rpx;
		color: #999;
	}
	
	.bottom-buttons {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		padding: 20rpx;
		background-color: #fff;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.recharge-btn, .withdraw-btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
		margin: 0 10rpx;
	}
	
	.recharge-btn {
		background-color: #FF4D4F;
		color: #fff;
	}
	
	.withdraw-btn {
		background-color: #fff;
		color: #FF4D4F;
		border: 2rpx solid #FF4D4F;
	}
</style>