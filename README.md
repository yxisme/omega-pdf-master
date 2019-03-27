# README #

This README would normally document whatever steps are necessary to get your application up and running.

### Install node, bower
Install node and npm

Install bower - `npm i -g bower`

Install pm2 - `npm i -g pm2`

### How to install dep
sh install.sh

### How to install chinese fonts
sudo apt-get install language-pack-zh*

sudo apt-get install chinese*

sudo apt-get install ttf-wqy-microhei

### How to start the service using PM2 ###

cd to server directory
pm2 start index.js

default port：3000

### 脂肪酸总计计算方式
```
Omega-3多元不饱和脂肪酸(total_omega3) = 阿尔法亚麻酸(18:3n3) + 二十碳五烯酸(EPA, 20:5n3) + 二十二碳五烯酸n3(22:5n3) + 二十二碳六烯酸(DHA, 22:6n3)

Omega-6多元不饱和脂肪酸(total_omega6) = 亚油酸(18:2n6) + 伽马亚油酸(18:3n6) + 二十碳二烯酸(20:2n6) + 双高-γ-亚麻油酸(20:3n6) + 花生四烯酸(AA, 20:4n6) + 二十二碳四烯酸(22:4n6) + 二十二碳五烯酸(22:5n6) 

顺式单元不饱和脂肪酸(total_monounsaturated) = 棕榈油酸(16:1n7) + 油酸(18:1n9) + 花生酸(20:1n9) + 神经酸(24:1n9) 

饱和脂肪酸(total_saturated) = 肉豆蔻酸(14:0) + 棕榈酸(16:0) + 硬脂酸(18:0) + 花生酸(20:0) + 二十二碳烷酸(22:0) + 二十四烷酸(24:0) 

反式脂肪酸(total_trans) = 反式棕榈油酸(16:1n7t) + 反式油酸(18:1t) + 反式亚油酸(18:2n6t) + 反式脂肪指标 
```