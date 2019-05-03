<template>
    <div>
        <Button class="aa" :type="item.order_num==1?'success':'error'" v-for="(item,index) in buttonList" :key="index">{{item.name}}</Button>
        <Button class="bb" type="primary" @click="modal1 = true">添加</Button>
        <Modal
        v-model="modal1"
        title="Common Modal dialog box title"
        @on-ok="ok"
        @on-cancel="cancel">
        <Input v-model="value1" placeholder="Enter something..." style="width: 300px" />
        <Input v-model="value2" placeholder="Enter something..." style="width: 300px" />
        <p>Content of dialog</p>
    </Modal>
    </div>
</template>

<script>
import {
 getMenuList
} from '@/api/routers'
    export default {
        data(){
            return{
                buttonList:[],
                modal1: false,
                value1:'',
                value2:''
            }
        },
        methods:{
            ok () {
                this.$Message.info(this.value1);
                this.value1='';
            },
            cancel () {
                this.$Message.info('Clicked cancel');
            }
        },
        created() {
            let menus = [];
            getMenuList().then(res=>{
                menus = res.data.data;
                menus.forEach((menu,index) => {
                    menus[index].meta={'title': menu.name}; 
                });
            this.buttonList = menus;
            }).catch(err=>{
                console.log(err)
            });
        }
    }
</script>

<style lang="less" scoped>
.aa{
    margin: 10px;
}
.bb{
    position: absolute;
    margin: 10px;
}
</style>