<!--  -->
<template>
	<header-user ></header-user>
	<div class="home-w">
		<div class="u-p-t-80 u-p-b-30">
			<el-row>
				<el-col :span="15"></el-col>
				<el-col :span="9">
					<div class="login-box bg-white u-radius-8 u-p-30 u-p-t-40">
						<el-form
							ref="formRef"
							style="max-width: 600px"
							:model="loginForm"
							label-width="auto"
							class="demo-ruleForm"
						>
							<el-form-item
								label="账号"
								prop="login"
								:rules="[
									{ required: true, message: 'login is required' }, 
								]"
								>
								<el-input
									v-model="loginForm.login"
									type="text"
									autocomplete="off"
								/>
							</el-form-item>
							<el-form-item
								label="密码"
								prop="password"
								:rules="[
									{ required: true, message: 'password is required' }, 
								]"
								>
								<el-input
									v-model="loginForm.password"
									type="password"
									autocomplete="off"
								/>
							</el-form-item>
							<el-form-item class="u-p-t-30">
								<el-button style="width: 100%;" type="primary" @click="submitForm(formRef)">登录</el-button> 
							</el-form-item>
						</el-form>
					</div>
				</el-col>
			</el-row>
			
		</div>
	</div>
</template>

<script setup lang='ts'>
import { reactive, ref, inject, onMounted, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { userStore } from '@/stores/user'
import router from '@/router';
const user = userStore()
const { userid } = toRefs(user); 
const $api: any = inject('$api') 
const $axios: any = inject('$axios')
const formRef = ref<FormInstance>()
const loginForm = reactive({
	login: 'test',
	password: '123456'
})


onMounted(async () => {  
})

const submitForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.validate(async (valid) => {
		if (valid) {
			const res = await $api.login({...loginForm})
			if(res.code == 1) {
				ElMessage.success('登录成功')
				localStorage.setItem('userid', res.userid)
				router.go(-1)
			}
		} else {
			console.log('error submit!')
		return false
		}
	})
}


 
</script>
<style lang='scss' scoped>
@import '@/styles/iconfont.css';
@import '@/styles/mediaScreen.scss';
.box {
	@extend %box-sizing;
}

.list {
	@include flex(x, start, start);
	flex-wrap: wrap;

	.list-item {
		flex: 0 0 15%;
		width: 15%;
		margin-right: 2%;

		&:nth-of-type(6n) {
			margin-right: 0;
		}
	}
}
</style>