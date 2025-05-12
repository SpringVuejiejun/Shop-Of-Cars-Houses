// 清除本地缓存
uni.clearStorageSync();

// 用户数据管理工具
const userData = {
	// 用户信息
	userInfo: {
		balance: 1680000, // 初始余额168万
		lastSignIn: null, // 上次签到时间
		orders: [], // 订单列表
		gameTimes: 10, // 游戏次数
		gameRecords: [], // 游戏记录
		coupons: [], // 优惠券列表
		avatar: 'https://img.picui.cn/free/2025/05/09/681e03456a7b0.jpg',
		nickname: '福布斯在榜者',
		ID: '88888888',
		phone: '',
		frozenAmount: 3000000, // 冻结金额
		addresses: [], // 地址列表
		assetsList: [], // 资产明细列表
		lastGameTimesResetDate: null // 游戏次数重置日期
	},

	// 获取游戏记录
	getGameRecords() {
		const userInfo = this.getUserInfo()
		return userInfo.gameRecords || []
	},

	// 获得游戏次数
	getGameTimes(){
		this.checkAndResetGameTimes(); // 每次获取前检查是否需要重置
		return this.userInfo.gameTimes
	},
	
	// 获取用户信息
	getUserInfo() {
		try {
			const userInfo = uni.getStorageSync('userInfo')
			if (userInfo) {
				this.userInfo = JSON.parse(userInfo)
			}
			return this.userInfo
		} catch (e) {
			console.error('获取用戶信息失败：', e)
			return this.userInfo
		}
	},

	updateUserInfo(userInfo){
		this.userInfo = userInfo
		this.saveUserInfo()
	},
	
	// 保存用户信息
	saveUserInfo() {
		try {
			uni.setStorageSync('userInfo', JSON.stringify(this.userInfo))
		} catch (e) {
			console.error('保存用戶信息失败：', e)
		}
	},
	
	// 签到
	signIn() {
		const today = new Date().toDateString()
		if (this.userInfo.lastSignIn === today) {
			return {
				success: false,
				message: '今天已经签到过了'
			}
		}
		
		this.userInfo.balance += 50000 // 签到奖励5万
		this.userInfo.lastSignIn = today
		this.saveUserInfo()
		
		return {
			success: true,
			message: '签到成功，获得5万奖励'
		}
	},
	
	// 更新余额
	updateBalance(amount) {
		this.userInfo.balance += amount
		this.saveUserInfo()
	},
	
	// 添加订单
	addOrder(order) {
		// 生成订单号
		const orderNo = 'HC' + Date.now().toString().slice(-8)
		// 设置支付截止时间（24小时后）
		const payDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
		// 设置预计发货时间（支付后3天）
		const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
		
		const newOrder = {
			id: orderNo,
			productId: order.productId,
			productName: order.productName,
			productImage: order.productImage,
			sku: order.sku,
			price: order.price,
			status: '待付款',
			createTime: new Date().toISOString(),
			payDeadline: payDeadline,
			estimatedDelivery: estimatedDelivery
		}
		
		this.userInfo.orders.unshift(newOrder)
		this.saveUserInfo()
		return newOrder
	},
	
	// 获取订单列表
	getOrderList() {
		return this.userInfo.orders
	},
	
	// 获取指定状态的订单列表
	getOrdersByStatus(status) {
		if (status === 'all') {
			return this.userInfo.orders
		}
		return this.userInfo.orders.filter(order => order.status === status)
	},
	
	// 获取订单详情
	getOrderById(orderId) {
		return this.userInfo.orders.find(order => order.id === orderId)
	},
	
	// 更新订单
	updateOrder(updatedOrder) {
		const index = this.userInfo.orders.findIndex(order => order.id === updatedOrder.id)
		if (index !== -1) {
			this.userInfo.orders[index] = updatedOrder
			this.saveUserInfo()
			return true
		}
		return false
	},
	
	// 删除订单
	deleteOrder(orderId) {
		const index = this.userInfo.orders.findIndex(order => order.id === orderId)
		if (index !== -1) {
			this.userInfo.orders.splice(index, 1)
			this.saveUserInfo()
			return true
		}
		return false
	},
	
	// 取消订单
	cancelOrder(orderId) {
		const order = this.getOrderById(orderId)
		if (order && order.status === '待付款') {
			order.status = '已取消'
			this.updateOrder(order)
			return true
		}
		return false
	},
	
	// 确认收货
	confirmReceive(orderId) {
		const order = this.getOrderById(orderId)
		if (order && order.status === '待收货') {
			order.status = '已完成'
			this.updateOrder(order)
			return true
		}
		return false
	},
	
	// 获取订单状态统计
	getOrderStatusCount() {
		const counts = {
			all: this.userInfo.orders.length,
			待付款: 0,
			待发货: 0,
			待收货: 0,
			已完成: 0,
			已取消: 0
		}
		
		this.userInfo.orders.forEach(order => {
			counts[order.status]++
		})
		
		return counts
	},
	
	// 更新游戏次数
	updateGameTimes(times) {
		const userInfo = this.getUserInfo()
		userInfo.gameTimes = times
		this.saveUserInfo()
	},

	// 检查并重置游戏次数
	checkAndResetGameTimes() {
		const today = new Date().toDateString();
		const userInfo = this.getUserInfo();
		
		// 如果是新的一天或者从未重置过
		if (!userInfo.lastGameTimesResetDate || userInfo.lastGameTimesResetDate !== today) {
			userInfo.gameTimes = 10; // 重置游戏次数
			userInfo.lastGameTimesResetDate = today;
			this.saveUserInfo();
		}
	},
	
	// 添加游戏记录
	addGameRecord(record) {
		const userInfo = this.getUserInfo()
		if (!userInfo.gameRecords) {
			userInfo.gameRecords = []
		}
		userInfo.gameRecords.unshift(record)
		this.saveUserInfo()
	},
	
	// 添加优惠券
	addCoupon(coupon) {
		const userInfo = this.getUserInfo()
		if (!userInfo.coupons) {
			userInfo.coupons = []
		}
		userInfo.coupons.push(coupon)
		this.saveUserInfo()
	},
	
	// 获取可用优惠券
	getValidCoupons() {
		const userInfo = this.getUserInfo()
		if (!userInfo.coupons) return []
		const now = new Date()
		return userInfo.coupons.filter(coupon => {
			return new Date(coupon.expireTime) > now
		})
	},
	
	// 使用优惠券
	useCoupon(couponId) {
		const userInfo = this.getUserInfo()
		if (!userInfo.coupons) return false
		const index = userInfo.coupons.findIndex(coupon => coupon.id === couponId)
		if (index === -1) return false
		userInfo.coupons.splice(index, 1)
		this.saveUserInfo()
		return true
	},

	// 获取地址列表
	getAddressList() {
		const userInfo = this.getUserInfo()
		return userInfo.addresses || []
	},

	// 添加地址
	addAddress(address) {
		const userInfo = this.getUserInfo()
		if (!userInfo.addresses) {
			userInfo.addresses = []
		}
		
		// 如果设置为默认地址，将其他地址的默认状态设为false
		if (address.isDefault) {
			userInfo.addresses.forEach(addr => addr.isDefault = false)
		}
		
		userInfo.addresses.push(address)
		this.saveUserInfo()
	},

	// 更新地址
	updateAddress(index, address) {
		const userInfo = this.getUserInfo()
		if (!userInfo.addresses || index >= userInfo.addresses.length) {
			return false
		}
		
		// 如果设置为默认地址，将其他地址的默认状态设为false
		if (address.isDefault) {
			userInfo.addresses.forEach(addr => addr.isDefault = false)
		}
		
		userInfo.addresses[index] = address
		this.saveUserInfo()
		return true
	},

	// 删除地址
	deleteAddress(index) {
		const userInfo = this.getUserInfo()
		if (!userInfo.addresses || index >= userInfo.addresses.length) {
			return false
		}
		
		userInfo.addresses.splice(index, 1)
		this.saveUserInfo()
		return true
	},

	// 设置默认地址
	setDefaultAddress(index) {
		const userInfo = this.getUserInfo()
		if (!userInfo.addresses || index >= userInfo.addresses.length) {
			return false
		}
		
		userInfo.addresses.forEach((addr, i) => {
			addr.isDefault = i === index
		})
		
		this.saveUserInfo()
		return true
	},

	// 获取资产明细列表
	getAssetsList() {
		const userInfo = this.getUserInfo()
		return userInfo.assetsList || []
	},

	// 格式化时间的辅助函数
	formatDateTime(date) {
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		return `${year}-${month}-${day} ${hours}:${minutes}`
	},

	// 添加资产明细记录
	addAssetsRecord(record) {
		const userInfo = this.getUserInfo()
		if (!userInfo.assetsList) {
			userInfo.assetsList = []
		}

		// 添加格式化的时间戳
		record.time = this.formatDateTime(new Date())
		// 添加到记录开头
		userInfo.assetsList.unshift(record)

		this.saveUserInfo()
	},

	// 订单支付后添加支出记录
	addOrderExpense(orderInfo) {
		this.addAssetsRecord({
			name: orderInfo.name,
			amount: orderInfo.amount,
			type: 'expense',
			status: '已完成'
		})
	},

	// 游戏奖励添加收入记录
	addGameReward(rewardInfo) {
		this.addAssetsRecord({
			name: '游戏奖励',
			amount: rewardInfo.amount,
			type: 'income',
			status: '已完成'
		})
	}
}
export default userData 