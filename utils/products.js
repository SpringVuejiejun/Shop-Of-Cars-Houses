// 商品数据管理
const products = {
	// 产品列表
	productList: [
		// 豪华汽车
		{
			id: 1,
			name: '劳斯莱斯幻影',
			description: '劳斯莱斯幻影是劳斯莱斯汽车公司生产的一款豪华轿车，以其卓越的工艺和奢华的内饰闻名于世。',
			images: [
				'https://img.picui.cn/free/2025/05/09/681e0348c462c.jpg',
				'https://img.picui.cn/free/2025/05/09/681e0348c462c.jpg',
				'https://img.picui.cn/free/2025/05/09/681e0348c462c.jpg',
			],
			price: 150,
			canBargain: true,
			minPrice: 50,
			type: 'car',
			skus: [
				{
					features: ['标准版', '黑色', '真皮座椅'],
					price: 150
				},
				{
					features: ['加长版', '银色', '定制内饰'],
					price: 200
				},
				{
					features: ['定制版', '双色', '星空顶'],
					price: 350
				}
			]
		},
		{
			id: 2,
			name: '宾利慕尚',
			description: '宾利慕尚是宾利汽车公司生产的一款豪华轿车，以其优雅的设计和卓越的性能著称。',
			images: [
				'https://img.picui.cn/free/2025/05/09/681e03392eb6c.jpg',
				'https://img.picui.cn/free/2025/05/09/681e03392eb6c.jpg',
				'https://img.picui.cn/free/2025/05/09/681e03392eb6c.jpg',
			],
			price: 200,
			canBargain: true,
			minPrice: 100,
			type: 'car',
			skus: [
				{
					features: ['标准版', '深蓝色', '豪华内饰'],
					price: 200
				},
				{
					features: ['运动版', '红色', '运动套件'],
					price: 300
				},
				{
					features: ['定制版', '双色', '手工缝制'],
					price: 500
				}
			]
		},
		{
			id: 3,
			name: '迈巴赫S级',
			description: '迈巴赫S级是梅赛德斯-奔驰旗下的顶级豪华轿车，以其极致的舒适性和奢华配置闻名。',
			images: [
				'https://img.picui.cn/free/2025/05/09/681e034c40ea5.jpg',
				'https://img.picui.cn/free/2025/05/09/681e034c40ea5.jpg',
				'https://img.picui.cn/free/2025/05/09/681e034c40ea5.jpg',
			],
			price: 150,
			canBargain: true,
			minPrice: 20,
			type: 'car',
			skus: [
				{
					features: ['标准版', '黑色', '豪华配置'],
					price: 150
				},
				{
					features: ['加长版', '银色', '后排娱乐'],
					price: 280
				},
				{
					features: ['定制版', '双色', '专属服务'],
					price: 350
				}
			]
		},
		{
			id: 4,
			name: '法拉利SF90',
			description: '法拉利SF90是法拉利公司推出的首款插电式混合动力超级跑车，集成了最先进的动力技术。',
			images: [
				'https://img.picui.cn/free/2025/05/09/681e0340523c5.jpg',
				'https://img.picui.cn/free/2025/05/09/681e0340523c5.jpg',
				'https://img.picui.cn/free/2025/05/09/681e0340523c5.jpg',
			],
			price: 300,
			canBargain: false,
			minPrice: 300,
			type: 'car',
			skus: [
				{
					features: ['标准版', '红色', '碳纤维套件'],
					price: 300
				},
				{
					features: ['赛道版', '黄色', '赛道套件'],
					price: 400
				},
				{
					features: ['限量版', '定制色', '专属编号'],
					price: 650
				}
			]
		},
		{
			id: 5,
			name: '兰博基尼Urus',
			description: '兰博基尼Urus是兰博基尼公司推出的首款SUV，完美融合了超级跑车的性能和SUV的实用性。',
			images: [
				'https://img.picui.cn/free/2025/05/09/681e03432edfb.jpg',
				'https://img.picui.cn/free/2025/05/09/681e03432edfb.jpg',
				'https://img.picui.cn/free/2025/05/09/681e03432edfb.jpg',
			],
			price: 450,
			canBargain: false,
			minPrice: 450,
			type: 'car',
			skus: [
				{
					features: ['标准版', '黑色', '豪华配置'],
					price: 450
				},
				{
					features: ['运动版', '橙色', '运动套件'],
					price: 550
				},
				{
					features: ['定制版', '双色', '专属服务'],
					price: 650
				}
			]
		},
		// 豪宅
		{
			id: 6,
			name: '上海汤臣一品',
			description: '上海汤臣一品是位于陆家嘴核心地段的顶级豪宅，拥有360度无敌江景，是上海最著名的豪宅之一。',
			images: [
				'https://img.picui.cn/free/2025/05/09/681e033878d33.jpg',
				'https://img.picui.cn/free/2025/05/09/681e033878d33.jpg',
				'https://img.picui.cn/free/2025/05/09/681e033878d33.jpg',
			],
			price: 1500,
			canBargain: true,
			minPrice: 1300,
			type: 'house',
			skus: [
				{
					features: ['A栋', '400平米', '江景房'],
					price: 1500
				},
				{
					features: ['B栋', '500平米', '全景房'],
					price: 1800
				},
				{
					features: ['C栋', '600平米', '顶层复式'],
					price: 2200
				}
			]
		},
		{
			id: 7,
			name: '北京壹号院',
			description: '北京壹号院位于北京朝阳区核心地段，是融创中国打造的顶级豪宅项目，以其独特的设计和奢华的配置闻名。',
			images: [
				'https://img.picui.cn/free/2025/05/09/681e032d4533e.jpg',
				'https://img.picui.cn/free/2025/05/09/681e032d4533e.jpg',
				'https://img.picui.cn/free/2025/05/09/681e032d4533e.jpg',
			],
			price: 1200,
			canBargain: true,
			minPrice: 1000,
			type: 'house',
			skus: [
				{
					features: ['A区', '350平米', '花园洋房'],
					price: 1200
				},
				{
					features: ['B区', '450平米', '空中别墅'],
					price: 1500
				},
				{
					features: ['C区', '550平米', '独栋别墅'],
					price: 1800
				}
			]
		},
		{
			id: 8,
			name: '深圳湾一号',
			description: '深圳湾一号是深圳湾超级总部基地的顶级豪宅，拥有无敌海景和城市景观，是深圳最奢华的住宅项目之一。',
			images: [
				'https://img.picui.cn/free/2025/05/09/681e0331acdd9.jpg',
				'https://img.picui.cn/free/2025/05/09/681e0331acdd9.jpg',
				'https://img.picui.cn/free/2025/05/09/681e0331acdd9.jpg',
			],
			price: 1000,
			canBargain: true,
			minPrice: 900,
			type: 'house',
			skus: [
				{
					features: ['A栋', '300平米', '海景房'],
					price: 1000
				},
				{
					features: ['B栋', '400平米', '全景房'],
					price: 1300
				},
				{
					features: ['C栋', '500平米', '顶层复式'],
					price: 1600
				}
			]
		},
		{
			id: 9,
			name: '广州珠江新城',
			description: '广州珠江新城是广州CBD核心区的顶级豪宅，拥有绝佳的城市景观和便利的交通条件。',
			images: [
				'https://img.picui.cn/free/2025/05/09/681e0330f2780.jpg',
				'https://img.picui.cn/free/2025/05/09/681e0330f2780.jpg',
				'https://img.picui.cn/free/2025/05/09/681e0330f2780.jpg',
			],
			price: 800,
			canBargain: true,
			minPrice: 700,
			type: 'house',
			skus: [
				{
					features: ['A区', '250平米', '城市景观'],
					price: 800
				},
				{
					features: ['B区', '350平米', '江景房'],
					price: 1000
				},
				{
					features: ['C区', '450平米', '空中别墅'],
					price: 1200
				}
			]
		},
		{
			id: 10,
			name: '杭州西湖壹号',
			description: '杭州西湖壹号位于西湖景区核心位置，是杭州最顶级的豪宅项目，拥有绝佳的西湖景观。',
			images: [
				'https://img.picui.cn/free/2025/05/09/681e033395341.jpeg',
				'https://img.picui.cn/free/2025/05/09/681e033395341.jpeg',
				'https://img.picui.cn/free/2025/05/09/681e033395341.jpeg',
			],
			price: 900,
			canBargain: true,
			minPrice: 800,
			type: 'house',
			skus: [
				{
					features: ['A区', '280平米', '湖景房'],
					price: 900
				},
				{
					features: ['B区', '380平米', '全景房'],
					price: 1100
				},
				{
					features: ['C区', '480平米', '独栋别墅'],
					price: 1400
				}
			]
		}
	],

	// 获取搜索框联想列表
	getSuggestions(keyword) {
		if (!keyword) return [];
		const kw = keyword.trim().toLowerCase();
		const result = [];

		this.productList.forEach(product => {
			if (product.name.toLowerCase().includes(kw)) {
				result.push({
					id: product.id,
					name: product.name,
					type: 'product'
				});
			}
		});

		const categories = [
			{ id: 'car', name: '豪车', type: 'category' },
			{ id: 'house', name: '豪宅', type: 'category' }
		];
		categories.forEach(cat => {
			if (cat.name.includes(keyword)) {
				result.push(cat);
			}
		});

		const unique = [];
		const map = {};
		for (const item of result) {
			const key = item.type + '-' + item.id;
			if (!map[key]) {
				unique.push(item);
				map[key] = true;
			}
			if (unique.length >= 8) break;
		}
		return unique;
	},
	
	// 获取所有产品
	getAllProducts() {
		return this.productList
	},
	
	// 获取热门产品
	getHotProducts() {
		return this.productList.slice(0, 10)
	},
	
	// 根据ID获取产品
	getProductById(id) {
		if (typeof id === 'string') {
			id = parseInt(id)
		}
		// console.log('查找商品ID：', id)
		const product = this.productList.find(product => product.id === id)
		// console.log('找到的商品：', product)
		return product
	},
	
	// 根据类型获取产品
	getProductsByType(type) {
		return this.productList.filter(product => product.type === type)
	},
	
	// 获取可议价产品
	getBargainableProducts() {
		return this.productList.filter(product => product.canBargain)
	},
	
	// 根据类别获取商品
	getProductsByCategory(category) {
		if (category === 'luxury') {
			return this.productList
		}
		return this.productList.filter(product => product.type === category)
	}
}

export default products 