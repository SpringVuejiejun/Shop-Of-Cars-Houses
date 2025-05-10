<template>
	<view class="container">
		<!-- 游戏标题 -->
		<view class="game-title">
			<text class="title-text">幸运大转盘</text>
			<text class="subtitle">转动幸运，赢取大奖</text>
		</view>
		
		<!-- 转盘区域 -->
		<view class="turntable-container">
			<view class="turntable" :style="{ transform: `rotate(${rotateDeg}deg)` }">
				<view class="prize-item" v-for="(prize, index) in prizes" :key="prize.id" 
					:style="{ 
						transform: `rotate(${index * 45}deg)`,
						'background-color': getPrizeColor(prize.type)
					}">
					<view class="prize-content">
						<image class="prize-icon" :src="getPrizeIcon(prize.type)" mode="aspectFit"></image>
						<text class="prize-name">{{prize.name}}</text>
						<text class="prize-value" v-if="prize.type === 'cash'">¥{{prize.value/10000}}万</text>
					</view>
				</view>
			</view>
			<view class="pointer" :class="{ 'pointer-active': isRotating }"></view>
		</view>
		
		<!-- 游戏信息 -->
		<view class="game-info">
			<view class="info-item">
				<text class="label">剩余次数</text>
				<text class="value highlight">{{gameTimes}}次</text>
			</view>
			<view class="info-item">
				<text class="label">今日奖品</text>
				<text class="value">{{todayPrizes}}个</text>
			</view>
			<text class="rule" @tap="showRules">游戏规则</text>
		</view>
		
		<!-- 开始按钮 -->
		<button class="start-btn" :class="{ 'btn-disabled': isRotating || gameTimes <= 0 }" 
			:disabled="isRotating || gameTimes <= 0" @tap="startGame">
			<text class="btn-text">{{getButtonText()}}</text>
		</button>
		
		<!-- 游戏规则弹窗 -->
		<uni-popup ref="rulesPopup" type="center">
			<view class="rules-content">
				<view class="rules-header">
					<text class="rules-title">游戏规则</text>
					<text class="close-icon" @tap="closeRules">×</text>
				</view>
				<scroll-view class="rules-list" scroll-y>
					<view class="rule-item" v-for="(rule, index) in gameRules" :key="index">
						<text class="rule-number">{{index + 1}}</text>
						<text class="rule-text">{{rule}}</text>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		
		<!-- 中奖记录 -->
		<view class="records">
			<view class="records-header">
				<text class="records-title">中奖记录</text>
				<text class="refresh" @tap="refreshRecords">刷新</text>
			</view>
			<scroll-view class="records-list" scroll-y>
				<view class="record-item" v-for="(record, index) in gameRecords" :key="index"
					:class="{ 'record-item-new': isNewRecord(record) }">
					<view class="record-info">
						<text class="prize">{{record.prize}}</text>
					<text class="time">{{formatDate(record.time)}}</text>
					</view>
					<view class="record-type" :class="record.type">{{getTypeText(record.type)}}</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import userData from '@/utils/user.js'
	
	export default {
		data() {
			return {
				prizes: [
					{
						id: 1,
						name: '现金红包',
						type: 'cash',
						value: 5000000,
						probability: 0.1
					},
					{
						id: 2,
						name: '迈巴赫S级',
						type: 'car',
						value: 1500000,
						probability: 0.1
					},
					{
						id: 3,
						name: '10万优惠券',
						type: 'coupon',
						value: 100000,
						probability: 0.1
					},
					{
						id: 4,
						name: '小米SU7',
						type: 'car',
						value: 500000,
						probability: 0.1
					},
					{
						id: 5,
						name: '现金红包',
						type: 'cash',
						value: 1000000,
						probability: 0.2
					},
					{
						id: 6,
						name: '五菱宏光',
						type: 'car',
						value: 5000,
						probability: 0.2
					},
					{
						id: 7,
						name: '5万优惠券',
						type: 'coupon',
						value: 50000,
						probability: 0.1
					},
					{
						id: 8,
						name: '百万豪宅',
						type: 'house',
						value: 1000000,
						probability: 0.1
					}
				],
				gameRules: [
					'每天可免费抽奖10次',
					'抽中优惠券可在购物时使用',
					'优惠券有效期为30天',
					'每人每天最多获得3张优惠券',
					'实物奖品需联系客服领取',
					'现金奖励将直接转入账户'
				],
				isRotating: false,
				gameTimes: 0,
				gameRecords: [],
				rotateDeg: 0,
				todayPrizes: 0,
				lastRefreshTime: null
			}
		},
		onShow() {
			this.loadGameData()
		},
		methods: {
			loadGameData() {
				this.gameTimes = userData.getGameTimes()
				this.gameRecords = userData.getGameRecords().slice(0, 8)
				this.todayPrizes = this.calculateTodayPrizes()
				this.lastRefreshTime = new Date()
			},
			calculateTodayPrizes() {
				const today = new Date().toDateString()
				return this.gameRecords.filter(record => 
					new Date(record.time).toDateString() === today
				).length
			},
			getButtonText() {
				if (this.isRotating) return '抽奖中...'
				if (this.gameTimes <= 0) return '今日次数已用完'
				return '开始抽奖'
			},
			startGame() {
				if (this.isRotating || this.gameTimes <= 0) return

				// 先扣除游戏次数
				this.gameTimes = this.gameTimes - 1
				userData.updateGameTimes(this.gameTimes)
				
				this.isRotating = true

				// 计算新的旋转角度：当前角度 + 随机圈数(5-10圈)
				const extraDeg = Math.ceil(Math.random() * 1800) + 1800 // 5-10圈之间的随机角度
				const targetDeg = this.rotateDeg + extraDeg
				
				// 添加音效
				this.playSound('start')
				
				// 重置指针动画状态
				this.isRotating = false
				setTimeout(() => {
					this.isRotating = true
					this.rotateDeg = targetDeg
					
					setTimeout(() => {
						this.isRotating = false
						// 在转盘停止时计算指针指向的奖品
						const currentDeg = this.rotateDeg % 360
						const pointerDeg = (currentDeg + 225) % 360
						const prizeIndex = Math.floor(pointerDeg / 45)
						const prize = this.prizes[prizeIndex]
						
						this.handlePrizeResult(prize)
						this.playSound('end')
					}, 5000)
				}, 50)
			},
			playSound(type) {
				// 这里可以添加音效播放逻辑
				console.log(`Playing ${type} sound`)
			},
			selectPrize() {
				const random = Math.random()
				let sum = 0
				for (const prize of this.prizes) {
					sum += prize.probability
					if (random <= sum) {
						return prize
					}
				}
				return this.prizes[this.prizes.length - 1]
			},
			handlePrizeResult(prize) {
				let message = ''
				switch(prize.type) {
					case 'cash':
						message = `恭喜您获得${prize.name}！奖金将直接转入您的账户。`
						userData.updateBalance(prize.value)
						break
					case 'house':
						message = `恭喜您获得${prize.name}！我们的客服将尽快与您联系。`
						break
					case 'car':
						message = `恭喜您获得${prize.name}！请前往指定门店提车。`
						break
					case 'coupon':
						message = `恭喜您获得${prize.name}！可在购物时使用。`
						const coupon = {
							id: 'C' + Date.now(),
							value: prize.value,
							expireTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
							used: false
						}
						userData.addCoupon(coupon)
						break
				}
				
				// 添加游戏记录
				const gameRecord = {
					id: 'G' + Date.now(),
					time: new Date().toISOString(),
					prize: prize.name,
					type: prize.type
				}
				userData.addGameRecord(gameRecord)
				
				// 显示中奖信息
				uni.showToast({
					title: message,
					icon: 'none',
					duration: 3000
				})
				
				// 刷新游戏数据
				this.loadGameData()
			},
			showRules() {
				this.$refs.rulesPopup.open()
			},
			closeRules() {
				this.$refs.rulesPopup.close()
			},
			refreshRecords() {
				this.loadGameData()
				uni.showToast({
					title: '刷新成功',
					icon: 'success'
				})
			},
			formatDate(dateStr) {
				const date = new Date(dateStr)
				return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
			},
			isNewRecord(record) {
				return new Date(record.time) > this.lastRefreshTime
			},
			getTypeText(type) {
				const typeMap = {
					'cash': '现金',
					'house': '房产',
					'car': '汽车',
					'coupon': '优惠券'
				}
				return typeMap[type] || type
			},
			getPrizeIcon(type) {
				const iconMap = {
					'cash': '/static/images/test/fly.jpg',
					'house': '/static/images/test/fly.jpg',
					'car': '/static/images/test/fly.jpg',
					'coupon': '/static/images/test/fly.jpg'
				}
				return iconMap[type] || ''
			},
			getPrizeColor(type) {
				const colorMap = {
					'cash': '#FF4D4F',
					'house': '#FF4D4F',
					'car': '#FF4D4F',
					'coupon': '#FF4D4F'
				}
				return colorMap[type] || '#FF4D4F'
			}
		}
	}
</script>

<style>
	.container {
		padding: 20rpx;
		min-height: 100vh;
		background-color: #f8f9fa;
	}
	
	.game-title {
		text-align: center;
		margin-bottom: 40rpx;
	}
	
	.title-text {
		font-size: 48rpx;
		font-weight: bold;
		color: #1a1a1a;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.subtitle {
		font-size: 28rpx;
		color: #666;
	}
	
	.turntable-container {
		position: relative;
		width: 650rpx;
		height: 650rpx;
		margin: 0 auto 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.turntable {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		transition: transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99);
		overflow: hidden;
		box-shadow: 0 0 0 10rpx #333,
			0 0 0 30rpx #fff,
			0 0 0 36rpx #111;
	}
	
	.prize-item {
		position: absolute;
		width: 50%;
		height: 50%;
		left: 0;
		top: 0;
		transform-origin: bottom right;
		background-color: var(--prize-color);
		clip-path: polygon(0 0, 56% 0, 100% 100%, 0 56%);
	}
	
	.prize-content {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		transform-origin: center;
		padding: 30rpx 20rpx;
		user-select: none;
	}
	
	.prize-icon {
		width: 48rpx;
		height: 48rpx;
		margin-bottom: 8rpx;
		filter: drop-shadow(0 2rpx 4rpx rgba(0,0,0,0.2));
	}
	
	.prize-name {
		position: relative;
		transform: rotate(45deg);
		font-size: 26rpx;
		color: #FFFFFF;
		text-align: center;
		margin-bottom: 6rpx;
		line-height: 1.3;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 90%;
		text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
		font-weight: 600;
		letter-spacing: 1rpx;
	}
	
	.prize-value {
		position: relative;
		transform: rotate(45deg);
		font-size: 32rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 1.2;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 90%;
		text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
		font-weight: bold;
		letter-spacing: 1rpx;
	}
	
	.pointer {
		position: absolute;
		width: 120rpx;
		height: 120rpx;
		background-color: #fff;
		border-radius: 50%;
		z-index: 10;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 600;
		color: #333;
		border: 8rpx solid rgba(0, 0, 0, .75);
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.2);
		transition: transform 0.2s ease;
	}
	
	.pointer::before {
		content: '';
		position: absolute;
		top: -56rpx;
		width: 40rpx;
		height: 60rpx;
		background-color: #fff;
		clip-path: polygon(50% 0%, 15% 100%, 85% 100%);
		box-shadow: 0 -2rpx 4rpx rgba(0,0,0,0.1);
	}
	
	.pointer-active {
		transform: scale(0.95);
	}
	
	.turntable::before {
		content: '';
		position: absolute;
		top: -6rpx;
		left: -6rpx;
		right: -6rpx;
		bottom: -6rpx;
		border: 2rpx solid rgba(255,255,255,0.3);
		border-radius: 50%;
	}
	
	.game-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;
		padding: 20rpx 40rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
	}
	
	.info-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.label {
		font-size: 24rpx;
		color: #666;
		margin-bottom: 4rpx;
	}
	
	.value {
		font-size: 32rpx;
		color: #1a1a1a;
		font-weight: bold;
	}
	
	.highlight {
		color: #FF4D4F;
	}
	
	.rule {
		font-size: 28rpx;
		color: #1890FF;
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
		background-color: rgba(24,144,255,0.1);
	}
	
	.start-btn {
		width: 400rpx;
		height: 88rpx;
		line-height: 88rpx;
		background: linear-gradient(135deg, #FF4D4F 0%, #FF7875 100%);
		color: #fff;
		font-size: 32rpx;
		border-radius: 44rpx;
		margin: 0 auto 40rpx;
		box-shadow: 0 4rpx 16rpx rgba(255,77,79,0.3);
		transition: all 0.3s ease;
	}
	
	.start-btn:active {
		transform: scale(0.98);
	}
	
	.btn-disabled {
		background: #ccc;
		box-shadow: none;
	}
	
	.rules-content {
		width: 600rpx;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 40rpx;
	}
	
	.rules-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}
	
	.rules-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #1a1a1a;
	}
	
	.close-icon {
		font-size: 40rpx;
		color: #999;
		padding: 10rpx;
	}
	
	.rules-list {
		max-height: 600rpx;
	}
	
	.rule-item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 20rpx;
	}
	
	.rule-number {
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		background-color: #FF4D4F;
		color: #fff;
		border-radius: 50%;
		margin-right: 20rpx;
		font-size: 24rpx;
	}
	
	.rule-text {
		flex: 1;
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}
	
	.records {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
	}
	
	.records-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.records-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #1a1a1a;
	}
	
	.refresh {
		font-size: 24rpx;
		color: #1890FF;
		padding: 6rpx 20rpx;
		border-radius: 20rpx;
		background-color: rgba(24,144,255,0.1);
	}
	
	.records-list {
		max-height: 400rpx;
	}
	
	.record-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		background-color: #f8f9fa;
		border-radius: 10rpx;
		margin-bottom: 16rpx;
		transition: all 0.3s ease;
	}
	
	.record-item-new {
		background-color: #fff7e6;
		animation: highlight 2s ease;
	}
	
	@keyframes highlight {
		0% { background-color: #fff7e6; }
		100% { background-color: #f8f9fa; }
	}
	
	.record-info {
		flex: 1;
	}
	
	.record-item .prize {
		font-size: 28rpx;
		color: #1a1a1a;
		margin-bottom: 4rpx;
		display: block;
	}
	
	.record-item .time {
		font-size: 24rpx;
		color: #999;
	}
	
	.record-type {
		font-size: 24rpx;
		padding: 4rpx 16rpx;
		border-radius: 20rpx;
	}
	
	.record-type.cash {
		background-color: #f6ffed;
		color: #52c41a;
	}
	
	.record-type.house {
		background-color: #e6f7ff;
		color: #1890ff;
	}
	
	.record-type.car {
		background-color: #fff7e6;
		color: #fa8c16;
	}
	
	.record-type.coupon {
		background-color: #f9f0ff;
		color: #722ed1;
	}
</style> 