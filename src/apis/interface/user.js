import axios from '@/request/index';


// `memu` 菜单
export const memu = (data) => axios.get('Userapi/memu1', data) 
// `memu2` 获取账户权限
export const getAccRole = (data) => axios.get('Userapi/memu2', data) 
// `my_card` 买卖方名片
export const my_card = (data) => axios.get('Userapi/my_card', data)  
// `change_psw` 修改密码 参数password  passworda
export const change_psw = (data, config) => axios.post('Userapi/change_psw', data, config) 

// `edit_card` 编辑买卖方名片
export const edit_card = (data, config) => axios.post('Userapi/edit_card', data, config) 

// my_company 卖家企业信息
export const my_company = (data, config) => axios.post('Userapi/my_company', data, config) 
// save_company 编辑卖家企业信息 `company`公司名称, `img`logo, `info`介绍, `phone`联系电话, `address`地址, contacts联系人 ewm二维码图片
export const save_company = (data, config) => axios.post('Userapi/save_company', data, config) 


// `addresss_list` 地址列表 参数p
export const addresss_list = (data) => axios.get('Userapi/addresss_list', data) 
// `address_detail` 地址详情 参数address_id
export const address_detail = (data) => axios.get('Userapi/address_detail', data) 
// `regional_list` 地区列表  在编辑地址时regional字段需要用到。
export const regional_list = (data) => axios.get('Userapi/regional_list', data) 
// `addressDetail` 地区列表  在编辑地址时regional字段需要用到。
export const addressDetail = (data) => axios.get('Userapi/addressDetail', data) 

// `address_change` 地址修改 
// 		参数
// 		name      收件人姓名       必填
// 		mobile    收件人手机号码   必填
// 		regional  收件地区(数字) 这里用到地区列表接口   必填
// 		address   收件详细地址     必填
// 		remark    备注             选填
// 		address_id  地址列表中的地址ID值  选填  修改时原有数据时需要带上，否则是新添加数据
// 		auto  0 1
export const address_change = (data) => axios.get('Userapi/address_change', data) 


// `create_order` 生成订单 参数pid_array  address_id
// json格式，每一条记录包含： cid表示旺铺ID，pid商品ID，num表示购买的商品数量
export const create_order = (data) => axios.get('Userapi/create_order', data) 
// `order_list` 订单列表  参数type 1待付款 2待收货 3已完成 role=1 买家的订单列表 不传或传其他值 卖家的订单列表 p页数  ziti=1时出现自提按钮
// express=1时显示电子面单按钮，如果选择极兔速递的，输入框物品总重量KG 参数weight必填
export const order_list = (data) => axios.get('Userapi/order_list', data) 
// change_order_status4 自提接口，参数order_id订单ID
export const change_order_status4 = (data) => axios.get('Userapi/change_order_status4', data)
// `order_detail` 订单详情 参数order_id
export const order_detail = (data) => axios.get('Userapi/order_detail', data)  
 
// `orderConfirm` 订单详情 参数order_id
export const orderConfirm = (data) => axios.get('Userapi/orderConfirm', data)  
 
// rz_pay 融资支付  order_id
export const rz_pay = (data) => axios.get('Userapi/rz_pay', data) 
 
// 订单状态  0 待付款 1付款成功 2待收货 3订单完成 
// 4评分完成 5支付中 6支付失败
// 状态0或6的时候能发起支付 
// 1的时候在卖家端出现发货 
// 2的时候在买家端出现确认收货 
// 3的时候买家端出现评分
//0 待付款pay 1付款成功 2待收货 3订单完成 4评分完成 5支付中 6支付失败 7待审核 8审核拒绝edit
 
// change_order_status  改变订单状态（收货/发货） 参数order_id  --delivery_id  就是物流公司列表里的delivery_id
export const change_order_status = (data) => axios.get('Userapi/change_order_status', data) 


// order_score 订单评分 参数order_id score 1-5
export const order_score = (data) => axios.get('Userapi/order_score', data) 
// login_role 角色权限
export const login_role = (data) => axios.get('Userapi/login_role', data) 

// delivery_list 物流公司列表
export const delivery_list = (data) => axios.get('Userapi/delivery_list', data) 

// service_list 售后列表 参数p
export const service_list = (data) => axios.get('Userapi/service_list', data) 
// change_service_status 有两个按钮 一个提交换货的新快递单号 参数id售后id，express 快递单号  
// 另一个按钮 结束售后 参数id  什么时候显示按钮，我列表里返回。
export const change_service_status = (data) => axios.get('Userapi/change_service_status', data)
// warehouse_list  
export const warehouse_list = (data) => axios.get('Userapi/warehouse_list', data)  


// sinopay 供应商结算接口 参数action 接口名
// action有下列值：

// BA_QUERY 余额查询 无参数

// GET_BANK_CODE 获取银行编码 无参数
// GET_BANK_NAME 获取开户行列表 terms搜索关键字

// OUT_QUERY 转账查询 order_id 订单id（出金订单）
// CITIC_BA_RECONCILE_DL 历史明细查询 datea开始日期 dateb结束日期

// OUT_PAY_APPLY 出金申请 
    // rec_bank_account_name 银行账户名称 
    // rec_bank_code 银行编码 
    // rec_bank_no 银行行号	
    // rec_bank_account 银行卡号
    // rec_bank_name 银行支行名称
    // amount 提现金额(元)
    // memo 备注
export const sinopay = (data, config) => axios.post('Userapi/sinopay', data, config) 

// pay_info 出金资料 不用参数，返回auth=1有资料，不需要去获取银行等信息，只要填写一个提现金额和备注（备注不必填） =0没资料 那就要获取出金申请所需的所有资料。
export const pay_info = (data) => axios.get('Userapi/pay_info', data)

// statement_list 结算申请列表 参数p
export const statement_list = (data) => axios.get('Userapi/statement_list', data)