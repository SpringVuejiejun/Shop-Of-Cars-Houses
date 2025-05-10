<template>
	<view class="container">
		<!-- 客服頭像和歡迎語 -->
		<view class="service-header">
			<image class="service-avatar" src="https://img.picui.cn/free/2025/05/09/681e034d3c846.jpg" mode="aspectFit"></image>
			<text class="welcome-text">您好，请问有什么可以帮您？</text>
		</view>
		
		<!-- 客服功能列表 -->
		<view class="service-list">
			<view class="service-item" @tap="contactOnline">
				<image class="service-icon" src="https://img.picui.cn/free/2025/05/09/681e03508bbe4.jpg" mode="aspectFit"></image>
				<view class="service-info">
					<text class="service-title">在线客服</text>
					<text class="service-desc">7x24小时在线服务</text>
				</view>
				<image class="arrow" src="/static/images/svg/setting-right.svg" mode="aspectFit"></image>
			</view>
			
			<view class="service-item" @tap="callService">
				<image class="service-icon" src="https://img.picui.cn/free/2025/05/09/681e034f1d1f2.jpg" mode="aspectFit"></image>
				<view class="service-info">
					<text class="service-title">电话客服</text>
					<text class="service-desc">182-0818-3998</text>
				</view>
				<image class="arrow" src="/static/images/svg/setting-right.svg" mode="aspectFit"></image>
			</view>
		</view>
		
		<!-- 常見問題 -->
		<view class="faq-section">
			<view class="section-title">常见问题</view>
			<view class="faq-list">
				<view class="faq-item" v-for="(item, index) in faqList" :key="index" @tap="toggleFaq(index)">
					<view class="faq-question">
						<text>{{item.question}}</text>
						<image class="arrow" :class="{'rotate': item.show}" src="/static/images/svg/setting-right.svg" mode="aspectFit"></image>
					</view>
					<view class="faq-answer" v-if="item.show">
						<text>{{item.answer}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 聯繫我們 -->
		<view class="contact-section">
			<view class="section-title">联系我们</view>
			<view class="contact-info">
				<view class="contact-item">
					<image class="contact-icon" src="https://img.picui.cn/free/2025/05/09/681e034c3cc49.jpg" mode="aspectFit"></image>
					<text>jiejundeng2@gmail.com</text>
				</view>
				<view class="contact-item">
					<image class="contact-icon" src="https://img.picui.cn/free/2025/05/09/681e034c3cc49.jpg" mode="aspectFit"></image>
					<text>四川省成都市新都区油专不知名小生</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				faqList: [
					{
						question: '如何修改收货地址？',
						answer: '进入"我的"页面，点击"收货地址"，可以添加、编辑或刪除收货地址。',
						show: false
					},
					{
						question: '如何查看订单状态？',
						answer: '进入"我的"页面，点击"我的订单"，可以查看所有订单的状态。',
						show: false
					},
					{
						question: '如何申请退款？',
						answer: '进入订单详情页面，点击"申请退款"按鈕，填写退款原因后提交即可。',
						show: false
					},
					{
						question: '优惠券如何使用？',
						answer: '在购买商品时可以选择使用优惠券抵扣',
						show: false
					}
				]
			}
		},
		methods: {
			contactOnline() {
				uni.navigateTo({
					url: '/pages/service/chat'
				})
			},
			callService() {
				uni.makePhoneCall({
					phoneNumber: '4001234567'
				})
			},
			toggleFaq(index) {
				this.faqList[index].show = !this.faqList[index].show
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
	
	.service-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40rpx 0;
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}
	
	.service-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		margin-bottom: 20rpx;
	}
	
	.welcome-text {
		font-size: 32rpx;
		color: #333;
	}
	
	.service-list {
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}
	
	.service-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #f5f5f5;
	}
	
	.service-item:last-child {
		border-bottom: none;
	}
	
	.service-icon {
		width: 48rpx;
		height: 48rpx;
		margin-right: 20rpx;
	}
	
	.service-info {
		flex: 1;
	}
	
	.service-title {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 8rpx;
		display: block;
	}
	
	.service-desc {
		font-size: 24rpx;
		color: #999;
	}
	
	.arrow {
		width: 32rpx;
		height: 32rpx;
	}
	
	.arrow.rotate {
		transform: rotate(180deg);
	}
	
	.faq-section, .contact-section {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 30rpx;
	}
	
	.faq-item {
		margin-bottom: 20rpx;
	}
	
	.faq-question {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
	}
	
	.faq-question text {
		font-size: 28rpx;
		color: #333;
	}
	
	.faq-answer {
		padding: 20rpx;
		background-color: #f5f5f5;
		border-radius: 8rpx;
		margin-top: 10rpx;
	}
	
	.faq-answer text {
		font-size: 26rpx;
		color: #666;
		line-height: 1.5;
	}
	
	.contact-info {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	
	.contact-item {
		display: flex;
		align-items: center;
	}
	
	.contact-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 20rpx;
	}
	
	.contact-item text {
		font-size: 28rpx;
		color: #666;
	}
</style> 