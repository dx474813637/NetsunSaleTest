import axios from '@/request/index';
 

// product 商品列表 参数p  num默认20 cate terms
export const product = (data) => axios.get('Market/product', data)  
// product_detail 商品详情 参数id
export const product_detail = (data) => axios.get('Market/product_detail', data) 

// address
export const address = (data) => axios.get('Market/address', data) 
// longs 发现列表，不用翻页。就4种类型的
export const longs = (data) => axios.get('Market/longs', data) 
// create_order 创建订单 字段跟小程序一致 
export const create_order = (data, config) => axios.post('Market/create_order', data, config)
// order_list 订单列表 参数p
export const order_list = (data) => axios.get('Market/order_list', data) 
// order_detail 订单详情 参数order_id
export const order_detail = (data) => axios.get('Market/order_detail', data) 
// change_order_status 未付款取消订单  参数order_id
export const change_order_status = (data) => axios.get('Market/change_order_status', data) 
// order_refund 付款成功后退款 参数order_id
export const order_refund = (data) => axios.get('Market/order_refund', data) 
// weixin_pay 发起支付 参数id 订单id 返回的pay.code_url是一个支付地址。
// https://www.sunmaxx.cn/Index/qrcode?url=pay.code_url 拼接 是一个二维码图片
export const weixin_pay = (data) => axios.get('Market/weixin_pay', data) 
// test
// 123456
// login 登录接口 成功后返回userid userid从头部传
export const login = (data, config) => axios.post('Market/login', data, config) 