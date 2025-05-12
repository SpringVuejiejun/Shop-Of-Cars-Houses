<template>
	<view class="container">
		<!-- 地址列表 -->
		<view class="address-list">
			<view class="address-item" v-for="(item, index) in addressList" :key="index">
				<view class="address-info">
					<view class="user-info">
						<text class="name">{{item.name}}</text>
						<text class="phone">{{item.phone}}</text>
						<text class="default-tag" v-if="item.isDefault">默认</text>
					</view>
					<view class="address-detail">
						<text>{{item.province}}{{item.city}}{{item.district}}{{item.detail}}</text>
					</view>
				</view>
				<view class="address-actions">
					<view class="action-item" @tap="setDefault(index)">
						<image :src="item.isDefault ? 'https://img.picui.cn/free/2025/05/09/681e034c3cc49.jpg' : '/static/images/unchecked.png'" mode="aspectFit"></image>
						<text>设为默认</text>
					</view>
					<view class="action-item" @tap="editAddress(index)">
						<image src="https://img.picui.cn/free/2025/05/09/681e034c3cc49.jpg" mode="aspectFit"></image>
						<text>编辑</text>
					</view>
					<view class="action-item" @tap="deleteAddress(index)">
						<image src="https://img.picui.cn/free/2025/05/09/681e034c3cc49.jpg" mode="aspectFit"></image>
						<text>删除</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 添加地址按钮 -->
		<view class="add-btn" @tap="addAddress">
			<text>+ 添加新地址</text>
		</view>
		
		<!-- 地址编辑弹窗 -->
		<uni-popup ref="addressPopup" type="bottom">
			<view class="address-form">
				<view class="form-title">{{isEdit ? '编辑地址' : '添加地址'}}</view>
				<view class="form-item">
					<text class="label">收货人</text>
					<input type="text" v-model="formData.name" placeholder="请输入收货人姓名" />
				</view>
				<view class="form-item">
					<text class="label">手机号码</text>
					<input type="number" v-model="formData.phone" placeholder="请输入手机号码" />
				</view>
				<view class="form-item">
					<text class="label">所在地区</text>
					<picker mode="region" :value="region" @change="handleRegionChange">
						<view class="picker">
							<text>{{region[0] || '请选择'}} {{region[1] || ''}} {{region[2] || ''}}</text>
						</view>
					</picker>
				</view>
				<view class="form-item">
					<text class="label">详细地址</text>
					<textarea v-model="formData.detail" placeholder="请输入详细地址" />
				</view>
				<view class="form-item">
					<view class="default-switch">
						<text>设为默认地址</text>
						<switch :checked="formData.isDefault" @change="handleDefaultChange" />
					</view>
				</view>
				<view class="form-buttons">
					<button class="cancel-btn" @tap="closePopup">取消</button>
					<button class="confirm-btn" @tap="saveAddress">保存</button>
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
				addressList: [],
				isEdit: false,
				editIndex: -1,
				formData: {
					name: '',
					phone: '',
					province: '',
					city: '',
					district: '',
					detail: '',
					isDefault: false
				},
				region: []
			}
		},
		onLoad() {
			this.loadAddressList()
		},
		methods: {
			loadAddressList() {
				this.addressList = userData.getAddressList()
			},
			addAddress() {
				this.isEdit = false
				this.editIndex = -1
				this.formData = {
					name: '',
					phone: '',
					province: '',
					city: '',
					district: '',
					detail: '',
					isDefault: false
				}
				this.region = []
				this.$refs.addressPopup.open()
			},
			editAddress(index) {
				this.isEdit = true
				this.editIndex = index
				const address = this.addressList[index]
				this.formData = { ...address }
				this.region = [address.province, address.city, address.district]
				this.$refs.addressPopup.open()
			},
			deleteAddress(index) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这个地址吗？',
					success: (res) => {
						if (res.confirm) {
							userData.deleteAddress(index)
							this.loadAddressList()
						}
					}
				})
			},
			setDefault(index) {
				userData.setDefaultAddress(index)
				this.loadAddressList()
			},
			handleRegionChange(e) {
				this.region = e.detail.value
				this.formData.province = e.detail.value[0]
				this.formData.city = e.detail.value[1]
				this.formData.district = e.detail.value[2]
			},
			handleDefaultChange(e) {
				this.formData.isDefault = e.detail.value
			},
			closePopup() {
				this.$refs.addressPopup.close()
			},
			saveAddress() {
				if (!this.formData.name) {
					uni.showToast({
						title: '请输入收货人姓名',
						icon: 'none'
					})
					return
				}
				if (!this.formData.phone) {
					uni.showToast({
						title: '请输入手机号码',
						icon: 'none'
					})
					return
				}
				if (!this.formData.detail) {
					uni.showToast({
						title: '请输入详细地址',
						icon: 'none'
					})
					return
				}
				
				if (this.isEdit) {
					userData.updateAddress(this.editIndex, this.formData)
				} else {
					userData.addAddress(this.formData)
				}
				
				this.loadAddressList()
				this.closePopup()
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
	
	.address-list {
		margin-bottom: 120rpx;
	}
	
	.address-item {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}
	
	.user-info {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.name {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-right: 20rpx;
	}
	
	.phone {
		font-size: 28rpx;
		color: #666;
	}
	
	.default-tag {
		font-size: 24rpx;
		color: #FF4D4F;
		background-color: rgba(255, 77, 79, 0.1);
		padding: 4rpx 12rpx;
		border-radius: 4rpx;
		margin-left: 20rpx;
	}
	
	.address-detail {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}
	
	.address-actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #f5f5f5;
	}
	
	.action-item {
		display: flex;
		align-items: center;
		margin-left: 40rpx;
	}
	
	.action-item image {
		width: 32rpx;
		height: 32rpx;
		margin-right: 8rpx;
	}
	
	.action-item text {
		font-size: 24rpx;
		color: #666;
	}
	
	.add-btn {
		position: fixed;
		bottom: 40rpx;
		left: 40rpx;
		right: 40rpx;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #FF4D4F;
		color: #fff;
		text-align: center;
		border-radius: 40rpx;
		font-size: 28rpx;
	}
	
	.address-form {
		background-color: #fff;
		padding: 30rpx;
		border-radius: 20rpx;
	}
	
	.form-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
		text-align: center;
	}
	
	.form-item {
		margin-bottom: 30rpx;
	}
	
	.label {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 10rpx;
		display: block;
	}
	
	input, textarea, .picker {
		width: 100%;
		height: 80rpx;
		background-color: #f5f5f5;
		border-radius: 8rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		color: #333;
	}
	
	textarea {
		height: 160rpx;
		padding: 20rpx;
	}
	
	.default-switch {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.form-buttons {
		display: flex;
		margin-top: 40rpx;
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