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

default port��3000

### ֬�����ܼƼ��㷽ʽ
```
Omega-3��Ԫ������֬����(total_omega3) = ������������(18:3n3) + ��ʮ̼��ϩ��(EPA, 20:5n3) + ��ʮ��̼��ϩ��n3(22:5n3) + ��ʮ��̼��ϩ��(DHA, 22:6n3)

Omega-6��Ԫ������֬����(total_omega6) = ������(18:2n6) + ٤��������(18:3n6) + ��ʮ̼��ϩ��(20:2n6) + ˫��-��-��������(20:3n6) + ������ϩ��(AA, 20:4n6) + ��ʮ��̼��ϩ��(22:4n6) + ��ʮ��̼��ϩ��(22:5n6) 

˳ʽ��Ԫ������֬����(total_monounsaturated) = �������(16:1n7) + ����(18:1n9) + ������(20:1n9) + ����(24:1n9) 

����֬����(total_saturated) = �ⶹޢ��(14:0) + �����(16:0) + Ӳ֬��(18:0) + ������(20:0) + ��ʮ��̼����(22:0) + ��ʮ������(24:0) 

��ʽ֬����(total_trans) = ��ʽ�������(16:1n7t) + ��ʽ����(18:1t) + ��ʽ������(18:2n6t) + ��ʽ֬��ָ�� 
```