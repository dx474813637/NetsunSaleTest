<template> 
    <el-form
        style="width: 100%;" 
        ref="formRef" 
        :model="dynamicValidateForm" 
        label-width="120px" 
        :rules="rules" 
        class="demo-dynamic u-p-20 box-border"
        label-position="top"
        scroll-to-error
        inline-message
        > 
        <template v-if="mode == 'bind'">
            <el-row>
                <el-col :span="12" :xs="24">
                    <el-form-item label="开户名" prop="rec_bank_account_name">
                        <el-input 
                            v-model="dynamicValidateForm.rec_bank_account_name"  
                            autocomplete="off" 
                            clearable 
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :xs="24">
                    <el-form-item label="开户银行" prop="rec_bank_code">
                        <el-select
                            style="width: 100%"
                            v-model="dynamicValidateForm.rec_bank_code"
                            filterable
                            placeholder="可输入关键字筛选"  
                            clearable 
                        >
                            <el-option
                                v-for="item in bank_code_list"
                                :key="item.id"
                                :label="`${item.name} - ${item.code}`"
                                :value="item.code"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :xs="24">
                    <el-form-item label="银行支行名称" prop="rec_bank_name">
                        <div class="u-flex" style="width: 100%">
                            <el-input 
                                v-model="dynamicValidateForm.rec_bank_name"   
                                autocomplete="off" 
                                readonly 
                                class="u-flex-1" 
                            />
                            <el-button type="warning" plain class="u-m-l-20" @click.prevent="dialogVisible = true">点击查询</el-button>
                        </div>
                        
                        <!-- <el-select
                                class="u-flex-1 more-select" 
                                popper-class="more_select_dropdown"
                                v-model="dynamicValidateForm.rec_bank_name"
                                filterable
                                remote
                                reserve-keyword 
                                :remote-method="bankNameRemoteMethod" 
                                placeholder="输入银行关键字([地区]+[银行]组合如“杭州 平安”)搜索银行支行名称以及行号"  
                                :loading="bank_name_loading"
                                clearable 
                                @change="bankChange"
                                @clear="bankClear"
                                v-loadmore="loadmore"
                            >
                                <el-option
                                    v-for="item in bank_name_list"
                                    :key="item.id"
                                    :label="`${item.bank_name} - ${item.bank_no}`"
                                    :value="`${item.bank_name},${item.bank_no}`"
                                />
                            </el-select> -->
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row v-show="dynamicValidateForm.rec_bank_no">
                <el-col :span="12" :xs="24">
                    <el-form-item label="银行行号" prop="rec_bank_no">
                        <el-input 
                            v-model="dynamicValidateForm.rec_bank_no"   
                            autocomplete="off" 
                            readonly 
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :xs="24">
                    <el-form-item label="银行账号" prop="rec_bank_account">
                        <el-input 
                            v-model="dynamicValidateForm.rec_bank_account"  
                            autocomplete="off" 
                            clearable 
                        />
                    </el-form-item>
                </el-col>
            </el-row>
        </template>
        
        <template v-if="mode == 'apply'">
            <el-row>
                <el-col :span="12" :xs="24">
                    <el-form-item label="提现金额(元)" prop="amount">
                        <el-input 
                            v-model="dynamicValidateForm.amount"  
                            autocomplete="off" 
                            clearable 
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :xs="24">
                    <el-form-item label="备注" prop="memo">
                        <el-input 
                            v-model="dynamicValidateForm.memo"  
                            autocomplete="off" 
                            clearable 
                        />
                    </el-form-item>
                </el-col>
            </el-row>
        </template>
        
         
        <el-row>
            <el-col :span="12" :xs="24">
                <el-form-item class="u-flex">
                    <el-button type="primary" class="u-flex-1" @click="submitForm(formRef)">提交</el-button> 
                    <!-- <el-button type="primary" plain @click="router.push({name: 'statement_list'})">提现申请列表</el-button> 
                    <el-button type="success" plain v-if="mode == 'bind'" @click="router.push({name: 'out_pay_apply'})">提现申请</el-button> 
                    <el-button type="success" plain v-if="mode == 'apply'" @click="router.push({name: 'out_pay_bind'})">绑定资料</el-button>  -->
                </el-form-item>
            </el-col>
        </el-row>
        
    </el-form>  
    <el-dialog v-model="dialogVisible" title="银行检索" width="70%" > 
        <table-bank-list
            isRadioGroup
            isSearchBar
            maxHeight="50vh" 
            @setCurrentRow="setCurrentRow"
        ></table-bank-list> 
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">退出</el-button> 
                <el-tooltip 
                    effect="dark"
                    content="请先输入关键字搜索后点击选中对应银行"
                    placement="top-end" 
                    >
                    <el-button type="primary" @click="bankTableConfirm">选择该银行</el-button>
                </el-tooltip>
                  
            </span>
        </template>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { reactive, ref, inject, onMounted, watch } from 'vue'
import router from '@/router/guard'
import { genFileId, ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { deepClone } from '@/utils' 

const $api: any = inject('$api')  
const formRef = ref<FormInstance>()  
const dynamicValidateForm = reactive<{ 
    rec_bank_account_name: string 
    rec_bank_code: string 
    rec_bank_no: string
    rec_bank_account: string
    rec_bank_name: string
    amount: string
    memo: string
    bd: string
}>({ 
    rec_bank_account_name: '', 
    rec_bank_code: '', 
    rec_bank_no: '', 
    rec_bank_account: '', 
    rec_bank_name: '', 
    amount: '', 
    memo: '',
    bd: ''
}) 
const dialogVisible = ref(false)
const auth = ref('') 
const terms = ref('')
const mode = ref('')
const pay_info_list = ref([])
const bank_code_list = ref([])
const rec_bank_no_loading = ref(false)
const bank_name_list = ref([])
const bank_name_loading = ref(false)
const currentRow = ref()
onMounted(async () => {
    await getPayInfoData()
    getBankCodeData() 
})
const rules = reactive<FormRules<typeof ruleForm>>({  
    rec_bank_account_name: [{
        required: true,
        message: '不能为空',
        trigger: ['blur', 'change']
    }],
    rec_bank_code: [{
        required: true,
        message: '不能为空',
        trigger: ['blur', 'change']
    }],
    rec_bank_no: [{
        required: true,
        message: '不能为空',
        trigger: [ 'change']
    }],
    rec_bank_account: [{
        required: true,
        message: '不能为空',
        trigger: ['blur', 'change']
    }],
    rec_bank_name: [{
        required: true,
        message: '不能为空',
        trigger: ['change']
    }],
    amount: [{
        required: true,
        message: '不能为空',
        trigger: ['blur', 'change']
    }],
})  

watch(
    () => router.currentRoute.value.meta.mode,
    (newVal:any ) => { 
        mode.value = newVal || 'bind'
        if(mode.value == 'bind') {
            dynamicValidateForm.bd = '1'
        }
    },
    {immediate: true}
) 
function setCurrentRow({value}) {
    currentRow.value = value
}
function bankTableConfirm() { 
    dynamicValidateForm.rec_bank_name = currentRow.value.bank_name
    dynamicValidateForm.rec_bank_no = currentRow.value.bank_no
    dialogVisible.value = false;
}

function submitForm(formEl: FormInstance | undefined) {
    if (!formEl) return 
    formEl.validate(async (valid) => { 
        if (valid) {  
            let params = deepClone(dynamicValidateForm); 
            await submitApi(params)
        } else {
            console.log('error submit!')
            return false
        }
    })
}
function bankChange (v) {
    console.log(v)
    let arr = v.split(',')
    dynamicValidateForm.rec_bank_name = arr[0]
    dynamicValidateForm.rec_bank_no = arr[1]
}
function bankClear() { 
    dynamicValidateForm.rec_bank_no = '' 
    terms.value = ''
}
async function bankNameRemoteMethod(query: string) {
    if (!query)  {
        bank_name_list.value = []
        terms.value = ''
        return 
    }
    if(bank_name_loading.value) return
    bank_name_loading.value = true
    terms.value = query
    try { 
        await getBankNameData(query) 
    } catch (error) {
        
    }
    bank_name_loading.value = false
}
async function getPayInfoData() {
    const res = await $api.pay_info({loading: true})
    if(res.code == 1) {
        auth.value = res.auth
        pay_info_list.value = res.list || {}
        dynamicValidateForm.rec_bank_account_name = pay_info_list.value.rec_bank_account_name
        dynamicValidateForm.rec_bank_code = pay_info_list.value.rec_bank_code
        dynamicValidateForm.rec_bank_no = pay_info_list.value.rec_bank_no
        dynamicValidateForm.rec_bank_account = pay_info_list.value.rec_bank_account
        dynamicValidateForm.rec_bank_name = pay_info_list.value.rec_bank_name
        if(!pay_info_list.value.hasOwnProperty('id') && mode.vlaue == 'apply') {
            router.push({name: 'out_pay_bind'})
        }
    }
}

async function getBankCodeData() {
    const res = await $api.sinopay({
        action: 'GET_BANK_CODE', 
    }, {loading: false})
    if(res.code == 1) {
        bank_code_list.value = res.list.list
    }
}
async function getBankNameData(terms) { 
    const res = await $api.sinopay({
        action: 'GET_BANK_NAME',  
        terms,
    }, {loading: false})
    if(res.code == 1) {
        bank_name_list.value = [...bank_name_list.value, ...res.list?.list_bank_no.pw_rec_list]
    }
}
async function loadmore () {
    console.log('load')
    try { 
        await getBankNameData(terms.value) 
    } catch (error) {
        
    }
}

async function submitApi(data) { 
    const res = await $api.sinopay({
        action: 'OUT_PAY_APPLY',
        ...data
    })
    if(res.code == 1) {
        if( mode.value == 'bind' ) {
            
            ElMessageBox.confirm(
                '绑定申请成功',
                '提示',
                {
                    confirmButtonText: '去申请提现',
                    cancelButtonText: '取消',
                    type: 'success',
                }
            )
            .then(() => {
                router.push({name: 'out_pay_apply'})
            })
            .catch(() => {
                
            }) 
        }
        else { 
            ElMessage.success(res.msg)
        }
        // router.push({
        //     name: 'product_list'
        // })
    }
}
 

</script>
  
<style lang='scss' scoped> 
::v-deep {
    
    .el-table {
        // --el-table-border-color: #dcdfe6;
        thead tr th{
            border-color: #dcdfe6;
        }
    } 
    .el-form-item__label {
        font-weight: bold;
        font-size: 15px;
    } 
 

} 
</style>