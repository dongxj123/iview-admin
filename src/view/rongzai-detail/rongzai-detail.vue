<template>
    <div>
        <Button class="button-distance" @click="confirm(item)" :type="item.order_num==1?'success':'error'" v-for="(item,index) in buttonList" :key="index">{{item.name}}</Button>
        <Button class="add-btn" type="primary" @click="modal1 = true">添加按钮</Button>
        <Modal
        v-model="modal1"
        title="添加容灾按钮"
        >
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
            <FormItem label="按钮名称：" prop="btnName">
                <Input v-model="formValidate.btnName" placeholder="请输入按钮名称：..."></Input>
            </FormItem>
            <FormItem label="选择脚本：" prop="scriptName">
                <Select v-model="formValidate.scriptName" placeholder="请选择脚本">
                    <Option v-for="(val,i) in scriptList" :value="val" :key="i">{{ val }}</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button :disabled="disabled" type="primary" @click="handleSubmit()">添加</Button>
                <Button @click="handleReset()" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
        <div slot="footer" style="display:none;"></div>
    </Modal>
    <Modal
        v-model="modal2"
        title="脚本执行完成"
        >
        <p>脚本名称：{{executeResult.script_name}}</p>
        <p>脚本执行开始时间：{{executeResult.start_date}}</p>
        <p>脚本执行结束时间：{{executeResult.exec_date}}</p>
        <p>标准错误:{{executeResult.stderr}}</p>
        <p>脚本执行返回码：{{executeResult.exec_code}}</p>
        <p>脚本执行参数：{{executeResult.options}}</p>
        <p>标准输出：{{executeResult.stdout}}</p>
        <div slot="footer">
            <Button type="primary" @click="modal2 = false">确定</Button>
        </div>
    </Modal>
    </div>
</template>

<script>
import {
    getMenuList,
    getrongzaiDetail,
    getScripts,
    addButton,
    executeButton
} from '@/api/routers'
import { setToken, getToken } from '@/libs/util'
    export default {
        data(){
            return{
                formValidate: {
                    btnName: '',
                    scriptName: ''
                },
                disabled:false,
                buttonList:[],
                modal1: false,
                modal2: false,
                scriptList: [],
                ruleValidate: {
                    btnName: [
                        { required: true, message: '按钮名称不能为空', trigger: 'blur' }
                    ],
                    scriptName: [
                        { required: true, message: '请选择脚本', trigger: 'change' }
                    ]
                },
                executeResult:{}
            }
        },
        methods:{
            handleSubmit () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.disabled=true;
                        addButton(this.formValidate.btnName,this.formValidate.scriptName).then(res=>{
                            if(res.data.code===0){
                                this.$Message.success(res.data.message)
                            }
                            this.disabled=false;
                            this.reload();
                            this.modal1=false;
                        }).catch(err=>{
                            console.log(err);
                            this.$Message.error(err.message)
                        });
                    } else {
                        //this.$Message.error('Fail!');
                    }
                })
            },
            handleReset () {
                this.$refs['formValidate'].resetFields();
                this.disabled=false;
            },
            reload(){
                let buttons = [];
                getrongzaiDetail().then(res=>{
                    buttons = res.data.data;
                    this.buttonList = buttons;
                }).catch(err=>{
                    this.$Message.error(err.message)
                });
            },
            confirm (btnMsg) {
                this.$Modal.confirm({
                    title: '确认执行脚本？',
                    content: `<p>${btnMsg.script}</p>`,
                    onOk: () => {
                        //let executeResult={};
                        executeButton(btnMsg.id).then(res=>{
                            // if(res.data.code===0){
                            //     this.$Message.success(res.data.message);
                            // }
                            this.executeResult=res.data.data;
                            this.$Message.success(res.data.message);
                            this.modal2=true;
                        }).catch(err=>{
                            this.$Message.error(err.message)
                        });
                    },
                    onCancel: () => {
                        //this.$Message.info('Clicked cancel');
                    }
                });
            }
        },
        created() {
            let buttons = [];
            getrongzaiDetail().then(res=>{
                buttons = res.data.data;
                this.buttonList = buttons;
            }).catch(err=>{
                this.$Message.error(err.message)
            });
        },
        watch:{
            modal1(newVal){
                if(newVal){
                    this.formValidate.btnName='';
                    this.formValidate.scriptName='';
                    let scripts=[];
                    getScripts().then(res=>{
                        scripts=res.data.data;
                        this.scriptList=scripts;
                    }).catch(err=>{
                        console.log(err)
                        this.$Message.error(err.message)
                    });
                }
            }
        }
    }
</script>

<style lang="less" scoped>
.button-distance{
    margin: 10px;
}
.add-btn{
    position: absolute;
    margin: 10px;
}
</style>