<template>
    <div class="els-container">
      <h3 v-show="el.el == 'point-select'">
        <el-icon v-if="data.type" @click.stop="$emit('point-handle', { show: true, type: 'add' })">
          <CirclePlusFilled />
        </el-icon>
        <el-icon v-if="data.id" @click.stop="$emit('point-handle', { show: true, type: 'set' })">
          <EditPen />
        </el-icon>
      </h3>
      <h2 v-if="el.el == 'h2'">{{el.label}}</h2>
      <h3 v-else-if="el.el == 'h3'">{{el.label}}</h3>
  
      <el-input
        v-else-if="el.el == 'input'"
        :placeholder="`输入${el.label || el.place}`"
        v-model="data[el.prop]"
        :maxlength="el.max || 1000"
        :type="el.type || 'text'"
        :disabled="el.disabled || isView || el.hidden"
        @input="$emit('change', { res: $event, el })"
      ></el-input>
      <el-input-number
        v-else-if="el.el == 'input-number'"
        :placeholder="`${el.place ? '输入' + el.place : ''}`"
        :min="el.min || 0"
        :max="el.max || 9999999999999999"
        v-model="data[el.prop]"
        @input="onInputNumber({ el, res: $event })"
        :disabled="el.disabled || isView || el.hidden"
      />
      <el-input
        v-else-if="el.el == 'text-area'"
        type="textarea"
        autosize
        :placeholder="`输入${el.label || el.place}`"
        v-model="data[el.prop]"
        :maxlength="el.max || 1000"
        show-word-limit
        @input="$emit('change', { res: $event, el })"
        :disabled="el.disabled || isView || el.hidden"
      />
      <el-date-picker
        v-else-if="el.el == 'date'"
        v-model="data[el.prop]"
        type="date"
        placeholder="选择一个日期"
        :disabled="el.disabled || isView || el.hidden"
        :clearable="false"
        value-format="YYYY-MM-DD"
        format="YYYY-MM-DD"
        :default-value="new Date()"
        @change="$emit('change', { res: $event, el })"
      />
      <el-date-picker
        v-else-if="el.el == 'time'"
        v-model="data[el.prop]"
        type="datetime"
        placeholder="选择一个日期时间"
        :disabled="el.disabled || isView || el.hidden"
        value-format="YYYY-MM-DD HH:mm:ss"
        format="YYYY-MM-DD HH:mm:ss"
        @change="$emit('change', { res: $event, el })"
      />
      <el-date-picker
        v-else-if="el.el == 'date-range'"
        v-model="data[el.prop]"
        type="daterange"
        placeholder="选择一个日期时段"
        :disabled="el.disabled || isView || el.hidden"
        :clearable="false"
        value-format="YYYY-MM-DD"
        format="YYYY-MM-DD"
        @change="$emit('change', { res: $event, el })"
      />
      <el-date-picker
        v-else-if="el.el == 'time-range'"
        v-model="data[el.prop]"
        type="datetimerange"
        placeholder="选择一个日期时间范围"
        :disabled="el.disabled || isView || el.hidden"
        :clearable="false"
        value-format="YYYY-MM-DD HH:mm:ss"
        format="YYYY-MM-DD HH:mm:ss"
        @change="$emit('change', { res: $event, el })"
      />
      <el-switch
        v-else-if="el.el == 'switch'"
        v-model="data[el.prop]"
        active-color="#13C75B"
        @change="$emit('change', { res: $event, el })"
        :active-value="el.type ? 1 : true"
        :inactive-value="el.type ? 0 : false"
        :disabled="el.disabled || isView || el.hidden"
      />
      <el-radio-group
        v-else-if="el.el == 'radio'"
        v-model="data[el.prop]"
        :disabled="el.disabled || isView || el.hidden"
      >
        <el-radio
          v-for="oitem in el.options"
          :key="oitem.value"
          :label="oitem.value"
          :disabled="oitem.disabled || el.hidden"
          @click="$emit('change', { res: oitem.value, el })"
        >{{ oitem.label }}</el-radio>
      </el-radio-group>
      <p v-else-if="el.el == 'p'" :class="el.class" @click="$emit('change', { el })">
        {{ el.prop?data[el.prop]:'' }}
      </p>
      <el-tree-select
        v-else-if="el.el == 'three-select'"
        filterable
        v-model="data[el.prop]"
        class="m-2"
        :placeholder="`选择${el.label || el.place}`"
        :multiple="el.multiple"
        :data="el.options"
        :render-after-expand="false"
        :props="el.props"
        @change="$emit('change', { res: $event, el })"
        :disabled="el.disabled || isView || el.hidden"
      />
      <el-select
        v-else
        :disabled="el.disabled || isView || el.hidden"
        :clearable="el.isClear"
        filterable
        v-model="data[el.prop]"
        class="m-2"
        :placeholder="`选择${el.label || el.place}`"
        :multiple="el.multiple"
        @clear="$emit('change',{
                      item: el,
                      res:'',
                      el,
                  })"
      >
        <template #prefix v-if="showIcon(data, el)">
          <img :src="data.icon || data.url" class="icon_22" alt />
        </template>
        <el-option
          v-for="(oitem) in el.options"
          :key="el.props.value == 'self' ? oitem : oitem[el.props.value]"
          @click="
                    onSelectChange({
                      item: el,
                      res: el.props.value == 'self' ? oitem : oitem[el.props.value],
                      el,
                      oitem,
                    })
                  "
          :label="el.props.label == 'self' ? oitem : oitem[el.props.label]"
          :value="el.props.value == 'self' ? oitem : oitem[el.props.value]"
        >
          <img
            v-if="oitem.url"
            :src="oitem.url"
            alt
            srcset
            class="icon_22"
            style="margin-right: 20px"
          />
          <img
            v-if="oitem.icon"
            :src="oitem.icon"
            alt
            srcset
            class="icon_22"
            style="margin-right: 20px"
          />
          <span>{{ el.props.label == "self" ? oitem : oitem[el.props.label] }}</span>
        </el-option>
      </el-select>
      <p v-if="el.fn">{{ el.fn && el.fn(data[el.prop],data) }}</p>
    </div>
  </template>
  <script>
  export default {
    name: "diy-form-items"
  };
  </script>
  <script setup>
  import { defineProps, ref, defineEmits, onMounted, computed } from "vue";
  // import { onCheck } from "@/utils/rules";
  const emits = defineEmits([
    "change"
  ]);
  const props = defineProps({
    el: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    },
    isView: {
      type: Boolean,
      default: false
    }
  });
  
  const disabled = computed(() => {
    let { isView, el } = props;
    return isView || el.disabled || el.hidden;
  });
  const showIcon = (data, item) => {
    return (
      (data.icon || data.url) &&
      item.options &&
      typeof item.options[0] == "object" &&
      (item.options[0].url || item.options[0].icon)
    );
  };
  const onSelectChange = e => {
   emits("change", e);
  };
  const onInputNumber = e => {
    let { res, el } = e;
    emits("change", e);
  };
  </script>
  <style scoped lang="scss">
  </style>
  