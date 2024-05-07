<template>
    <div>
      <el-form
        :ref="($event) => setRef($event)"
        :model="ddata"
        label-width="auto"
        class="q-form u-flex u-flex-wrap"
        :class="['q-form-' + name, 'q-form-' + name.slice(-4), `flex-${flex}-start`, `u-flex-items-${align}`, refName]"
      >
        <div
          v-for="(i, n) in form.filter((i) => i)"
          :key="n"
          :class="[i.class, i.prop]"
          :style="i.hidden && { display: 'none', margin: 0 }"
        >
          <h4 v-if="i.els && i.label" :class="!i.hidden && 'm-required'">{{ i.label }}</h4>
          <slot :name="i.slot" :pItem="i" v-if="!i.hidden">
            <div class="u-flex has-els u-flex-wrap" v-if="i.els" :class="[i.prop,i.class]">
              <el-form-item
                v-for="(el, elIndex) in i.els"
                :key="elIndex"
                :class="[el.class, el.prop, el.prop + '_' + el.el]"
                :label="el.label&&!['h2','h3'].includes(el.el)?el.label:''"
                :prop="el.prop"
                :rules="getRules(el)"
                :style="el.hidden && { display: 'none', margin: 0 }"
              >
                <slot :name="el.slot" :sItem="el" v-if="!el.hidden">
                  <elsContainer
                    :el="el"
                    :isView="isView"
                    :data="ddata"
                    @change="$emit('change',$event)"
                    @point-handle="$emit('point-handle',$event)"
                  />
                </slot>
              </el-form-item>
            </div>
            <div v-else class="no-els" :class="i.prop + '_' + i.el">
              <el-form-item
                :label="i.label&&!['h2','h3'].includes(i.el)?i.label:''"
                :class="[i.class, i.prop]"
                :prop="i.prop"
                :rules="getRules(i)"
                :style="i.hidden && { display: 'none', margin: 0 }"
              >
                <elsContainer
                  :el="i"
                  :isView="isView"
                  :data="ddata"
                  @change="$emit('change',$event)"
                  @point-handle="$emit('point-handle',$event)"
                />
              </el-form-item>
            </div>
          </slot>
          <slot name="item-handle" :pItem="i"></slot>
        </div>
        <div class="handle" :class="[flex]">
          <el-button plain type="danger" v-if="showClear" @click.stop="removeBtn">清 除</el-button>
          <el-button v-if="showCancel" plain @click="$emit('cancel')">
            {{
            cancelText
            }}
          </el-button>
          <el-button
            v-if="showSure"
            plain
            type="primary"
            @click="
            onCheck(
              refName == 'flowDigFormRef'
                ? flowDigFormRef:FormRef,
              () => $emit('confirm', {data: ddata})
            )
          "
          >{{ sureText }}</el-button>
        </div>
      </el-form>
    </div>
  </template>
  <script>
  export default {
    name: "diy-form"
  };
  </script>
  <script setup>
//   https://blog.csdn.net/weixin_48888726/article/details/137114983
  import { defineProps, ref, defineEmits } from "vue";
  import elsContainer from "./DiyFormItems.vue";
  const emits = defineEmits([
    "cancel",
    "confirm",
    "change",
    "check",
  ]);
  const props = defineProps({
    sureText: {
      type: String,
      default: "确 定"
    },
    cancelText: {
      type: String,
      default: "取 消"
    },
    showSure: {
      type: Boolean,
      default: true
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    showClear: {
      type: Boolean,
      default: false
    },
    refName: {
      type: String,
      default: "FormRef"
    },
    ddata: {
      type: Object,
      default: () => {}
    },
    form: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: ""
    },
    flex: {
      type: String,
      default: "col"
    },
    align: {
      type: String,
      default: "center"
    },
    isView: {
      type: Boolean,
      default: false
    },
  });
  const FormRef = ref();
  const flowDigFormRef = ref();
  const setRef = e => {
    let { refName } = props;
    switch (refName) {
      case "FormRef":
        FormRef.value = e;
        break;
      case "flowDigFormRef":
        flowDigFormRef.value = e;
        break;
    }
  };
  
  const getRules = e => {
    let { el, hidden, els, required, label, place } = e;
    let message = `请${el && el.includes("input") ? "输入" : "选择"}${label ||
      place ||
      "内容"}`;
    let nowrequired;
    if (required == undefined) {
      nowrequired =
        hidden == undefined
          ? ["true", "1"].includes(
              `${
                required == undefined ? !(el == "p" || hidden || els) : required
              }`
            )
          : !hidden;
    } else {
      nowrequired = required;
    }
    return [
      {
        required:nowrequired,
        message,
        trigger: ["blur", "change"]
      }
    ];
  };
  const onCheck = (formRef, fn) => {
      if (!formRef) return;
      formRef.validate((valid) => {
          if (valid) {
              console.log("submit!");
              fn && fn();
          } else {
              console.error("error submit!");
              return false;
          }
      });
  };
  const removeBtn = () => {
    FormRef.value.resetFields()
    emits('remove')
  }
  </script>
  <style scoped lang="scss">
  .condition {
    min-width: 100%;
  }
  .tip {
    p {
      color: #f00;
      font-size: 10px;
      transform: scale(0.9);
      position: absolute;
      margin-left: 68px !important;
      margin-top: 5px;
    }
  }
  .flex-col-start {
    > div {
      width: 100%;
    }
  }
  .el-form {
    padding-bottom: 10px;
    > div {
      ::v-deep .el-form-item {
        // width: 100%;
        .el-form-item__content { 
          > div {
            > p {
              margin-left: 20px;
            }
          }
        }
      }
    }
    .handle {
      width: 100% ;//!important;
	  &.row {
		width: auto;
      	flex: 0 0 auto;
	  }
    }
    > div {
      // flex: 0 0 50%;
      flex: 0 0 100%;
      // margin-top: 10px;
      align-items: center;
	  &.width-auto {
			flex: 0 0 auto;
			width: auto;
			padding-right: 10px; 
		}
      // background: #f00;
      > h4 {
        margin-bottom: 10px;
        font-size: 15px;
        > i {
          color: #f00;
          margin-right: 4px;
        }
      }
      > div {
        .el-form-item {
          margin-bottom: 15px;
          > div {
            > div {
            }
          }
          ::v-deep .el-form-item__error {
            // top: 105%;
            left: 10px;
          }
        }
      }
    }
    > .handle {
      flex: 0 0 100% ;//!important;
      text-align: left;
    }
  }
  
  </style>
  
  