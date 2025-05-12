<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "@/static/iconfont/iconfont.css";
	@font-face {
		font-family: "iconfont";
		src: url('static/iconfont/iconfont.woff2') format('woff2'),
			 url('static/iconfont/iconfont.woff') format('woff'),
			 url('static/iconfont/iconfont.ttf') format('truetype');
	}
	
	.iconfont {
	  font-family: "iconfont" !important;
	  font-size: 36rpx;
	  color: #333;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
</style>
