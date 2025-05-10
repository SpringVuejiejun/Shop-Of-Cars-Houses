<template>
	<view class="container">
		<!-- 個人信息設置 -->
		<view class="settings-section">
			<view class="section-title">个人信息</view>
			<view class="settings-list">
				<view class="settings-item" @tap="editAvatar">
					<text class="item-label">头像</text>
					<view class="item-value">
						<image class="avatar" :src="userInfo.avatar || 'https://img.picui.cn/free/2025/05/09/681e03456a7b0.jpg'" mode="aspectFit"></image>
						<image class="arrow" src="/static/images/svg/setting-right.svg" mode="aspectFit"></image>
					</view>
				</view>
				<view class="settings-item" @tap="editNickname">
					<text class="item-label">昵称</text>
					<view class="item-value">
						<text>{{userInfo.nickname || '未设置'}}</text>
						<image class="arrow" src="/static/images/svg/setting-right.svg" mode="aspectFit"></image>
					</view>
				</view>
				<view class="settings-item" @tap="editPhone">
					<text class="item-label">手机号</text>
					<view class="item-value">
						<text>{{userInfo.phone || '未绑定'}}</text>
						<image class="arrow" src="/static/images/svg/setting-right.svg" mode="aspectFit"></image>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 通知設置 -->
		<view class="settings-section">
			<view class="section-title">通知设置</view>
			<view class="settings-list">
				<view class="settings-item">
					<text class="item-label">订单通知</text>
					<switch :checked="settings.orderNotify" @change="toggleOrderNotify" />
				</view>
				<view class="settings-item">
					<text class="item-label">活动通知</text>
					<switch :checked="settings.activityNotify" @change="toggleActivityNotify" />
				</view>
				<view class="settings-item">
					<text class="item-label">系统通知</text>
					<switch :checked="settings.systemNotify" @change="toggleSystemNotify" />
				</view>
			</view>
		</view>
		
		<!-- 隱私設置 -->
		<view class="settings-section">
			<view class="section-title">隐私设置</view>
			<view class="settings-list">
				<view class="settings-item">
					<text class="item-label">允许陌生人查看我的动态</text>
					<switch :checked="settings.showDynamic" @change="toggleShowDynamic" />
				</view>
				<view class="settings-item">
					<text class="item-label">允许陌生人发送消息</text>
					<switch :checked="settings.allowMessage" @change="toggleAllowMessage" />
				</view>
			</view>
		</view>
		
		<!-- 其他設置 -->
		<view class="settings-section">
			<view class="section-title">其他设置</view>
			<view class="settings-list">
				<view class="settings-item" @tap="clearCache">
					<text class="item-label">清除缓存</text>
					<view class="item-value">
						<text>{{cacheSize}}</text>
						<image class="arrow" src="/static/images/svg/setting-right.svg" mode="aspectFit"></image>
					</view>
				</view>
				<view class="settings-item" @tap="checkUpdate">
					<text class="item-label">检查更新</text>
					<view class="item-value">
						<text>当前版本 {{version}}</text>
						<image class="arrow" src="/static/images/svg/setting-right.svg" mode="aspectFit"></image>
					</view>
				</view>
				<view class="settings-item" @tap="showAbout">
					<text class="item-label">关于我们</text>
					<view class="item-value">
						<image class="arrow" src="/static/images/svg/setting-right.svg" mode="aspectFit"></image>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 退出登錄 -->
		<view class="logout-btn" @tap="logout">
			<text>退出登录</text>
		</view>
		
		<!-- 編輯彈窗 -->
		<uni-popup ref="editPopup" type="bottom">
			<view class="edit-form">
				<view class="form-title">{{editType === 'avatar' ? '更换头像' : editType === 'nickname' ? '修改昵称' : '修改手机号'}}</view>
				<view class="form-content">
					<template v-if="editType === 'avatar'">
						<view class="avatar-upload">
							<image class="preview" :src="tempAvatar || userInfo.avatar || 'https://img.picui.cn/free/2025/05/09/681e03456a7b0.jpg'" mode="aspectFit"></image>
							<button class="upload-btn" @tap="chooseImage">选择图片</button>
						</view>
					</template>
					<template v-else>
						<input type="text" v-model="editValue" :placeholder="editType === 'nickname' ? '请输入昵称' : '请输入手机号'" />
					</template>
				</view>
				<view class="form-buttons">
					<button class="cancel-btn" @tap="closeEditPopup">取消</button>
					<button class="confirm-btn" @tap="saveEdit">确定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import userData from '@/utils/user.js'
	
	export default {
		data() {
			return {
				userInfo: {},
				settings: {
					orderNotify: true,
					activityNotify: true,
					systemNotify: true,
					showDynamic: false,
					allowMessage: false
				},
				cacheSize: '0KB',
				version: '1.0.1',
				editType: '',
				editValue: '',
				tempAvatar: '',
			}
		},
		onLoad() {
			this.loadUserInfo()
			this.loadSettings()
			this.calculateCache()
		},
		methods: {
			loadUserInfo() {
				this.userInfo = userData.getUserInfo()
			},
			loadSettings() {
				const settings = uni.getStorageSync('userSettings')
				if (settings) {
					this.settings = JSON.parse(settings)
				}
			},
			saveSettings() {
				uni.setStorageSync('userSettings', JSON.stringify(this.settings))
			},
			calculateCache() {
				// 這裡應該調用實際的緩存計算方法
				this.cacheSize = '2.5MB'
			},
			editAvatar() {
				this.editType = 'avatar'
				this.$refs.editPopup.open()
			},
			editNickname() {
				this.editType = 'nickname'
				this.editValue = this.userInfo.nickname || ''
				this.$refs.editPopup.open()
			},
			editPhone() {
				this.editType = 'phone'
				this.editValue = this.userInfo.phone || ''
				this.$refs.editPopup.open()
			},
			chooseImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.tempAvatar = res.tempFilePaths[0]
					}
				})
			},
			closeEditPopup() {
				this.$refs.editPopup.close()
				this.tempAvatar = ''
				this.editValue = ''
			},
			saveEdit() {
				if (this.editType === 'avatar') {
					if (!this.tempAvatar) {
						uni.showToast({
							title: '请选择头像',
							icon: 'none'
						})
						return
					}
					// 这里应该调用上传头像的API
					this.userInfo.avatar = this.tempAvatar
				} else {
					if (!this.editValue) {
						uni.showToast({
							title: '请输入内容',
							icon: 'none'
						})
						return
					}
					if (this.editType === 'phone' && !/^1[3-9]\d{9}$/.test(this.editValue)) {
						uni.showToast({
							title: '请输入正确的手机号',
							icon: 'none'
						})
						return
					}
					this.userInfo[this.editType] = this.editValue
				}
				userData.updateUserInfo(this.userInfo)
				this.closeEditPopup()
			},
			toggleOrderNotify(e) {
				this.settings.orderNotify = e.detail.value
				this.saveSettings()
			},
			toggleActivityNotify(e) {
				this.settings.activityNotify = e.detail.value
				this.saveSettings()
			},
			toggleSystemNotify(e) {
				this.settings.systemNotify = e.detail.value
				this.saveSettings()
			},
			toggleShowDynamic(e) {
				this.settings.showDynamic = e.detail.value
				this.saveSettings()
			},
			toggleAllowMessage(e) {
				this.settings.allowMessage = e.detail.value
				this.saveSettings()
			},
			clearCache() {
				uni.showModal({
					title: '提示',
					content: '确定要清除缓存吗？',
					success: (res) => {
						if (res.confirm) {
							// 這裡應該調用實際的清除緩存方法
							this.cacheSize = '0KB'
							uni.showToast({
								title: '清除成功',
								icon: 'success'
							})
						}
					}
				})
			},
			checkUpdate() {
				// 這裡應該調用實際的檢查更新方法
				uni.showToast({
					title: '当前已是最新版本',
					icon: 'none'
				})
			},
			showAbout() {
				uni.navigateTo({
					url: '/pages/settings/about'
				})
			},
			logout() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							userData.logout()
							uni.reLaunch({
								url: '/pages/login/login'
							})
						}
					}
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
	
	.settings-section {
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		padding: 30rpx;
		border-bottom: 1rpx solid #f5f5f5;
	}
	
	.settings-list {
		padding: 0 30rpx;
	}
	
	.settings-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
		transition: background-color 0.3s ease;
	}
	
	.settings-item:last-child {
		border-bottom: none;
	}
	
	.item-label {
		font-size: 28rpx;
		color: #333;
	}
	
	.item-value {
		display: flex;
		align-items: center;
	}
	
	.item-value text {
		font-size: 28rpx;
		color: #999;
		margin-right: 10rpx;
	}
	
	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
		margin-right: 10rpx;
	}
	
	.arrow {
		width: 32rpx;
		height: 32rpx;
		opacity: 0.6;
		transition: all 0.3s ease;
	}

	.settings-item:active .arrow {
    	opacity: 1;
    	transform: translateX(4rpx);
	}

	.settings-item:active {
    	background-color: #f9f9f9;
	}
	
	.logout-btn {
		margin: 40rpx 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #FF4D4F;
		color: #fff;
		text-align: center;
		border-radius: 40rpx;
		font-size: 28rpx;
	}
	
	.edit-form {
		background-color: #fff;
		padding: 30rpx;
		border-radius: 20rpx 20rpx 0 0;
	}
	
	.form-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		text-align: center;
		margin-bottom: 30rpx;
	}
	
	.form-content {
		margin-bottom: 30rpx;
	}
	
	.avatar-upload {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.preview {
		width: 160rpx;
		height: 160rpx;
		border-radius: 80rpx;
		margin-bottom: 30rpx;
	}
	
	.upload-btn {
		width: 200rpx;
		height: 60rpx;
		line-height: 60rpx;
		background-color: #f5f5f5;
		color: #333;
		font-size: 28rpx;
		border-radius: 30rpx;
	}
	
	input {
		width: 100%;
		height: 80rpx;
		background-color: #f5f5f5;
		border-radius: 8rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		color: #333;
	}
	
	.form-buttons {
		display: flex;
	}
	
	.cancel-btn, .confirm-btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
		margin: 0 10rpx;
	}
	
	.cancel-btn {
		background-color: #f5f5f5;
		color: #666;
	}
	
	.confirm-btn {
		background-color: #FF4D4F;
		color: #fff;
	}
</style> 