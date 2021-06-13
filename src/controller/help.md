# 消息推送平台使用文档

## 任务推送
### **任务列表 提供任务列表的查询功能**


<div align=center><img src="http://qiniu.canyuegongzi.xyz/taskLiST.png"/></div>

### **通过restFul请求注入开启一个任务**

<div align=center><img src="http://qiniu.canyuegongzi.xyz/addTask.png"/></div>

### 特殊选项描述

1. 推送配置模板 用户在配置中心中添加额配置信息（下一节有关于配置信息的描述）
2. 执行类型 每一个任务都会有最大执行次数，单次任务（最大执行次数为1）执行后任务标记为成功，循环执行（最大执行执行次数自定义），定时执行任务直到执行次数达到最大执行次数。
3. 循环执行中的时间定义
    1. 每小时
        开始任务从下一时刻开始执行，例如现在时刻为5：25， 任务为每小时的45分，则任务在6：45执行第一次任务
    2. 每天
4. 推送内容 邮件推送内容较为随意，可以是html, md, 字符等,短信推送内容必循遵循阿里短信服务规范   
   
[阿里短信服务Sdk使用](https://help.aliyun.com/product/44282.html?spm=5176.12438469.0.0.56f41cbewO7AAE)
   
### 消息触发

消息生产者发送消息 --->  kafka ----> 消息消费者订阅消息   ----> 触发开始任务

### restFul触发

post请求 ----> 触发开始任务

## 推送配置
### 邮件配置

<div align=center><img src="http://qiniu.canyuegongzi.xyz/CONFIG4.png"/></div>

### 特殊选项描述

1. authUser 邮件发送方的邮件地址
2. authPass 邮件发送方的授权码（以qq邮件为例），其他邮件配置类似。

<div align=center><img src="http://qiniu.canyuegongzi.xyz/qqUserPass.png"/></div>

3. service、post、host列表
以qq为例
```
// service: 'QQ'
// host: 'smtp.qq.com'
// port: 465
"QQ": {
        "domains": [
            "qq.com"
        ],
        "host": "smtp.qq.com",
        "port": 465,
        "secure": true
    },
```
```
{
    "1und1": {
        "host": "smtp.1und1.de",
        "port": 465,
        "secure": true,
        "authMethod": "LOGIN"
    },

    "AOL": {
        "domains": [
            "aol.com"
        ],
        "host": "smtp.aol.com",
        "port": 587
    },

    "DebugMail": {
        "host": "debugmail.io",
        "port": 25
    },

    "DynectEmail": {
        "aliases": ["Dynect"],
        "host": "smtp.dynect.net",
        "port": 25
    },

    "FastMail": {
        "domains": [
            "fastmail.fm"
        ],
        "host": "mail.messagingengine.com",
        "port": 465,
        "secure": true
    },

    "GandiMail": {
        "aliases": [
            "Gandi",
            "Gandi Mail"
        ],
        "host": "mail.gandi.net",
        "port": 587
    },

    "Gmail": {
        "aliases": [
            "Google Mail"
        ],
        "domains": [
            "gmail.com",
            "googlemail.com"
        ],
        "host": "smtp.gmail.com",
        "port": 465,
        "secure": true
    },

    "Godaddy": {
        "host": "smtpout.secureserver.net",
        "port": 25
    },

    "GodaddyAsia": {
        "host": "smtp.asia.secureserver.net",
        "port": 25
    },

    "GodaddyEurope": {
        "host": "smtp.europe.secureserver.net",
        "port": 25
    },

    "hot.ee": {
        "host": "mail.hot.ee"
    },

    "Hotmail": {
        "aliases": [
            "Outlook",
            "Outlook.com",
            "Hotmail.com"
        ],
        "domains": [
            "hotmail.com",
            "outlook.com"
        ],
        "host": "smtp.live.com",
        "port": 587,
        "tls": {
            "ciphers": "SSLv3"
        }
    },

    "iCloud": {
        "aliases": ["Me", "Mac"],
        "domains": [
            "me.com",
            "mac.com"
        ],
        "host": "smtp.mail.me.com",
        "port": 587
    },

    "mail.ee": {
        "host": "smtp.mail.ee"
    },

    "Mail.ru": {
        "host": "smtp.mail.ru",
        "port": 465,
        "secure": true
    },

    "Maildev": {
        "port": 1025,
        "ignoreTLS": true
    },

    "Mailgun": {
        "host": "smtp.mailgun.org",
        "port": 465,
        "secure": true
    },

    "Mailjet": {
        "host": "in.mailjet.com",
        "port": 587
    },

    "Mailosaur": {
        "host": "mailosaur.io",
        "port": 25
    },

    "Mandrill": {
        "host": "smtp.mandrillapp.com",
        "port": 587
    },

    "Naver": {
        "host": "smtp.naver.com",
        "port": 587
    },

    "OpenMailBox": {
        "aliases": [
            "OMB",
            "openmailbox.org"
        ],
        "host": "smtp.openmailbox.org",
        "port": 465,
        "secure": true
    },

    "Outlook365": {
      "host": "smtp.office365.com",
      "port": 587,
      "secure": false
    },

    "Postmark": {
        "aliases": ["PostmarkApp"],
        "host": "smtp.postmarkapp.com",
        "port": 2525
    },

    "QQ": {
        "domains": [
            "qq.com"
        ],
        "host": "smtp.qq.com",
        "port": 465,
        "secure": true
    },

    "QQex": {
        "aliases": ["QQ Enterprise"],
        "domains": [
            "exmail.qq.com"
        ],
        "host": "smtp.exmail.qq.com",
        "port": 465,
        "secure": true
    },

    "SendCloud": {
        "host": "smtpcloud.sohu.com",
        "port": 25
    },

    "SendGrid": {
        "host": "smtp.sendgrid.net",
        "port": 587
    },

    "SendinBlue": {
        "host": "smtp-relay.sendinblue.com",
        "port": 587
    },

    "SES": {
        "host": "email-smtp.us-east-1.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-US-EAST-1": {
        "host": "email-smtp.us-east-1.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-US-WEST-2": {
        "host": "email-smtp.us-west-2.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-EU-WEST-1": {
        "host": "email-smtp.eu-west-1.amazonaws.com",
        "port": 465,
        "secure": true
    },


    "Sparkpost": {
        "aliases": [
            "SparkPost",
            "SparkPost Mail"
        ],
        "domains": [
            "sparkpost.com"
        ],
        "host": "smtp.sparkpostmail.com",
        "port": 587,
        "secure": false
    },
    
    "Tipimail": {
        "aliases": [
            "tipimail"
        ],
        "host": "smtp.tipimail.com",
        "port": 587
    },

    "Yahoo": {
        "domains": [
            "yahoo.com"
        ],
        "host": "smtp.mail.yahoo.com",
        "port": 465,
        "secure": true
    },

    "Yandex": {
        "domains": [
            "yandex.ru"
        ],
        "host": "smtp.yandex.ru",
        "port": 465,
        "secure": true
    },

    "Zoho": {
        "host": "smtp.zoho.com",
        "port": 465,
        "secure": true,
        "authMethod": "LOGIN"
    },
    "126": {
        "host": "smtp.126.com",
        "port": 465,
        "secure": true
    },
    "163": {
        "host": "smtp.163.com",
        "port": 465,
        "secure": true
    },
    "qiye.aliyun": {
        "host":"smtp.mxhichina.com",
        "port":"465",
        "secure": true
    },
    "One": {
        "host": "send.one.com",
        "port": 465,
        "secure": true
    },
    "DREAMHOST-SUB-0": {
        "host": "smtp.dreamhost.com",
        "port": 465,
        "secure": true
    },
    "DREAMHOST-SUB-3": {
        "host": "sub3.mail.dreamhost.com",
        "port": 465,
        "secure": true
    },
    "DREAMHOST-SUB-4": {
        "host": "sub4.mail.dreamhost.com",
        "port": 465,
        "secure": true
    },
    "DREAMHOST-SUB-5": {
        "host": "sub5.mail.dreamhost.com",
        "port": 465,
        "secure": true
    },
    "DREAMHOST-MASTER": {
        "host": "homie.mail.dreamhost.com",
        "port": 465,
        "secure": true
    }
}

```

### 短信配置
#### 阿里云短信配置

[阿里短信服务Sdk使用](https://help.aliyun.com/product/44282.html?spm=5176.12438469.0.0.56f41cbewO7AAE)

#### 系统短信配置

<div align=center><img src="http://qiniu.canyuegongzi.xyz/message.png"/></div>
1. 签名
与阿里云短信定义的签名保持一致

[阿里短信服务签名](https://help.aliyun.com/document_detail/108072.html?spm=a2c4g.11174283.6.565.5f892c4275U49u)

2. 模板
与阿里云短信定义的签名保持一致

[阿里短信服务模板](https://help.aliyun.com/document_detail/108086.html?spm=a2c4g.11186623.6.571.20743d9ceJBWeR)

3. secretAccessKey  accessKeyId
阿里短信服务中应用key

### webSocket配置（暂未实现）
### APP推送（暂未实现）
## 任务日志
