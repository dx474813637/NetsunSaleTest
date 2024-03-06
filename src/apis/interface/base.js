import axios from '@/request/index';

// 10001 66f7iMFW6859I2reEiTsm7wIZQWhevpdvu2XggRIuUnH/zEbybV1fMs
// 选品中心  用户后台appid。
// https://doudian.y.netsun.com/Userapi/

// syblogin   生意宝账号登录 参数login passwd msgcode role=13卖家,14买家
// 有账号密码登录  账号验证码登录  账号验证码注册
export const syblogin = (data) => axios.get('Userapi/syblogin', data) 
// msgcode  验证码获取 参数login（手机号不能是账号）
export const msgcode = (data) => axios.get('Userapi/msgcode', data) 

// product 商品列表 参数p  num默认20 cate
export const product = (data) => axios.get('Userapi/product', data) 
// product_detail 商品详情 参数id
export const product_detail = (data) => axios.get('Userapi/product_detail', data) 
// login_sku sku列表
export const login_sku = (data) => axios.get('Userapi/login_sku', data) 
// sku_detail sku详情 参数id
export const sku_detail = (data) => axios.get('Userapi/sku_detail', data) 
// save_sku 保存sku 参数id name sku 有id更新没有id新增 
export const save_sku = (data) => axios.get('Userapi/save_sku', data) 
// del_sku 删除sku 参数id
export const del_sku = (data) => axios.get('Userapi/del_sku', data) 
// pid_sku 单个商品某个规格的库存 参数pid sku json格式的字符串  { '颜色': '红色', '尺码': 'S' } 这个接口好像后台用不到，前台详情里面的。
export const pid_sku = (data) => axios.get('Userapi/pid_sku', data) 
// web_pid_sku1 参数id 多id “,” 隔开
export const web_pid_sku = (data) => axios.get('Userapi/web_pid_sku', data)
export const web_pid_sku1 = (data) => axios.get('Userapi/web_pid_sku1', data) 
// upimg 上传图片
export const upimg = (data, config) => axios.post('Userapi/upimg', data, config) 
// cate_list 分类
export const cate_list = (data) => axios.get('Userapi/cate_list', data) 

// change_product_status 商品上下架 参数id  商品id
export const change_product_status = (data) => axios.get('Userapi/change_product_status', data) 

// save_product 保存商品 
    // 参数：`id 有id更新没有id新增`,`name`, `cate分类id`, `price`, `pic`商品轮播图, `description商品描述，目前只支持图片。多张图片用|分开。
    // 这个是抖店的详情`, `recommend_remark商家推荐语`, `freight_id运费模板id，传0表示包邮`, `weight重量`, `num` 起批数 批发价`pprice`
    // `weight_unit重量单位，0-kg, 1-g`, `delivery_delay_day承诺发货时间，单位是天`, `info富文本详情`, 
    // `zt`, `on上架1下架0`，spec_prices=json格式的sku specs=颜色|红色,黑色^尺码|S,M，
    // 这两个参数就在新增时接受，编辑时不接口。如果只编辑库存，直接在详情接口里面根据库存列表编辑，不需要编辑商品信息。
export const save_product = (data, config) => axios.post('Userapi/save_product', data, config) 
// spec_prices的格式
// [
//     {
//         "sku":{
//             "颜色":"红色",
//             "尺码":"S"
//             },
//         "img":"图片地址",
//         "stock":11,
//         "price":100,
//     },
//     {
//         "sku":{
//             "颜色":"红色",
//             "尺码":"M"
//             },
//         "img":"图片地址",
//         "stock":12,
//         "price":120,
//     }
// ]

// 弃用 save_stock 保存某一个规格的库存和价格 参数id 库存id stock price img
export const save_stock = (data) => axios.get('Userapi/save_stock', data) 
// save_product_ewm 参数id ewm 保存商品二维码
export const save_product_ewm = (data) => axios.get('Userapi/save_product_ewm', data) 

// `home` 参数p term（ 搜索关键字） tags（分类名称）term、tags两个不能同时有效，传tags了term就无效。
export const home = (data) => axios.get('Userapi/home', data) 
// `web_product` 参数p term（ 搜索关键字） tags（分类名称）term、tags两个不能同时有效，传tags了term就无效。
export const web_product = (data) => axios.get('Userapi/web_product', data) 
// `web_product_detail` 参数id
export const web_product_detail = (data) => axios.get('Userapi/web_product_detail', data) 
// `sign_out` 生意宝账号退出
export const sign_out = (data) => axios.get('Userapi/sign_out', data)  

// web_news 公告/资讯列表 p cate num默认20 这个cate是中文的
export const web_news = (data) => axios.get('Userapi/web_news', data)  
// web_news_detail 公告/资讯详情 id
export const web_news_detail = (data) => axios.get('Userapi/web_news_detail', data)  
// web_tuijian 优选店铺 login 空默认返回列表第一个数据的信息。
export const web_tuijian = (data) => axios.get('Userapi/web_tuijian', data)  
// web_tuijian2 推荐店铺 num获取几个数据
export const web_tuijian2 = (data) => axios.get('Userapi/web_tuijian2', data)  
// web_login_shop 店铺数据 p cate num login必填
export const web_login_shop = (data) => axios.get('Userapi/web_login_shop', data)  
// web_home 首页推荐里的一些数据
export const web_home = (data) => axios.get('Userapi/web_home', data)  

// web_search 搜索 p cate=0或不传  商品搜索 随便传个值就店铺搜索 num默认20 terms
export const web_search = (data) => axios.get('Userapi/web_search', data)  

// superboss 参数 toPlatform cate=0 登录 1上货设置页 2上货页 cate=2时  多传一个参数id 商品id
export const superboss = (data) => axios.get('Userapi/superboss', data)  
// toplatform 分销平台  现在图片都一样的
export const toplatform = (data) => axios.get('Userapi/toplatform', data)  

// web_danye 单页详情 参数id
export const web_danye = (data) => axios.get('Userapi/web_danye', data)  

// web_help 帮助中心
export const web_help = (data) => axios.get('Userapi/web_help', data) 
// web_help_detail 帮助页详情 参数id
export const web_help_detail = (data) => axios.get('Userapi/web_help_detail', data) 


// PC商家管理后台
// company_detail 旺铺详情接口
export const company_detail = (data) => axios.get('Userapi/company_detail', data) 
// edit_company 新增/编辑旺铺 参数company 公司名称 logo公司logo address公司地址 tel联系电话 name联系人 参数info 富文本公司介绍 rz_company 实名公司名称 rz_no统一社会信用代码 rz_pic营业执照 rc=1不允许编辑
export const edit_company = (data, config) => axios.post('Userapi/edit_company', data, config) 
// pc端 address_detail 退货地址详情
export const address_detail = (data) => axios.get('Userapi/address_detail', data) 
// edit_address 编辑退货地址
// 参数kefu 企业微信客服地址
// a1 省 a2市 a3区 a4详细地址（去掉省市区） a5手机 a6收件人
export const edit_address = (data, config) => axios.post('Userapi/edit_address', data, config) 
// pc端 certificate_detail 资质证书
export const certificate_detail = (data) => axios.get('Userapi/certificate_detail', data)
// edit_certificate 编辑资质证书 参数pic 多个图片英文逗号隔开
export const edit_certificate = (data, config) => axios.post('Userapi/edit_certificate', data, config) 

// personnel_list 员工列表 参数p
export const personnel_list = (data) => axios.get('Userapi/personnel_list', data)
// get_code 员工发送验证码 参数uid
export const get_code = (data) => axios.get('Userapi/get_code', data)
// uid_bind_handle 绑定员工 参数uid code验证码
export const uid_bind_handle = (data) => axios.get('Userapi/uid_bind_handle', data)
// tuan_list 员工发展团长列表 参数p uid
export const tuan_list = (data) => axios.get('Userapi/tuan_list', data)
// shop_list 员工发展商家列表 参数p uid
export const shop_list = (data) => axios.get('Userapi/shop_list', data)

// shop_order_list 发展商家有效订单列表 参数p uid员工id login商家账号。
// 商家账号参数优先级高于UID，有商家账号参数了，传UID就无效。 
// UID login都不传，就是发展的所有商家的有效订单列表。
export const shop_order_list = (data) => axios.get('Userapi/shop_order_list', data)
// shop_product_num 商家商品数 参数login必填
export const shop_product_num = (data) => axios.get('Userapi/shop_product_num', data)