<!-- 在manifest.json下给微信小程序配置分包上传 -->
"mp-weixin": {
    "appid": "",
    "setting": {
        "urlCheck": false
    },
    "usingComponents": true,
    "subpackages": [
        {
            "root": "packageA",
            "pages": [
                "pages/index/index"
            ]
        },
        {
            "root": "packageB",
            "pages": [
                "pages/index/index"
            ]
        }
    ]
}