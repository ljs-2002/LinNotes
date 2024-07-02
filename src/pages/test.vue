<script setup>
import {computed, ref} from "vue";

let aa = ref({
  'a1':{
    name: 'a1',
    age: 1
  },
  'a2':{
    name: 'a2',
    age: 2
  },
})
let aa_list = computed(() => {
  return Object.values(aa.value)
})
const add = ()=>{
  aa.value['a3'] = {
    name: 'a3',
    age: 3
  }
}
</script>

<template>
  <button @click="add">add</button>
  <ul>
    <li v-for="item in aa_list" :key="item.name">
      <div>{{item.name}} - {{item.age}}</div>
    </li>
  </ul>
</template>

<style lang="css" scoped></style>
