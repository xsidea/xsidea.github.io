const config = {
	version: '1.0.1',
	apiUrl: 'https://www.jincaijinshui.com/', // 接口地址mmgy.web.hedaweb.com   xcx.miaomiaogongyi.cn
	imgUrl: 'https://www.jincaijinshui.com/', // 图片地址
	platform: 'custom', //平台类型: default-默认三网 , custom-其他
	companyid: 10168, //三网企业ID
	apiKey: '501229D800A29D490249490A81C232AF', //站点ApiKey
	amap: '51a91af4d9dfc8b8d8ee4ed5e6383b5b', // 高德地图KEY
	qqmap: '6GWBZ-Z77WD-XSP4L-HJLGW-FHTTZ-FEBRQ', // 腾讯地图
	secretKey: '274652b02672e808', // AES密钥必须是16位
	request: {
		tokenStorage: 'xsToken', // 缓存token
		tokenPrefix: '', // token前缀
		tokenName: 'token', // Header
		memberStorage: 'xsMember', // Member缓存
		cookieStorage: 'xsCookie', // 缓存token
		configStorage: 'xsConfig', // 缓存配置
	},
	response: {
		statusName: 'code',
		statusCode: 1,
		msgName: 'msg', // 状态信息的字段名称
		dataName: 'data' // 数据详情的字段名称
	},
	share: {
		title: '妙妙公益',
		desc: '',
		imageUrl: 'https://xcx.miaomiaogongyi.cn/uploads/uniapp/share.jpg',
		path: '/pages/index/index?referrerId='
	}
};
