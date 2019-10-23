import React, {Component} from 'react'
import {
    Card,
    Table,
    Modal,
    Button,
    Input,
    message
} from 'antd'
import {formateDate} from '../../utils/timeUtil'
import LinkButton from '../../components/link-Button/linkButton';
import {reqUserList,reqDeleteUser,reqAddOrUpdateUser} from '../../api'
import UserForm from './userForm'
export default class User extends Component {
    state={
        users:[],
        roles:[],
        isShow:false
    }
    initColumns = ()=>{
        this.columns =[
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title:'所属角色',
                dataIndex:'role_id',
                render:value=> this.roleNmae[value]
            },
            {
                title:'操作',
                render: (user)=>(
                    <span>
                        <LinkButton  onClick={()=>this.showChangeUser(user)}>修改</LinkButton>
                        <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }

    initRoleName = (roles)=>{
       this.roleNmae = roles.reduce((pre,role)=>{
           pre[role._id] = role.name;
           return pre;
       },{})
    }
    getUsers = async ()=>{
        const result = await reqUserList();
        if (result.status===0){
            const {users,roles} = result.data;
            this.initRoleName(roles)
            this.setState({
                users,
                roles
            })
            // console.log(result)
        }
    }
    addOrUpdateUser = async ()=>{
        //1、收集数据
        const user = this.form.getFieldsValue();
        if (this.user){
            user._id = this.user._id;
        }
        // 2、提交数据并请求
        const result = await reqAddOrUpdateUser(user)
        // 3、根据数据返回结果进行提示
        if (result.status===0){
            message.success(`${this.user?'修改':'添加'}用户成功`);
            this.form.resetFields();
            this.setState({
                isShow:false
            })
            this.getUsers();
        }
    }
    showUserList = ()=>{
        this.user= null
        this.setState({
            isShow:true
        })
    }
    deleteUser = (user)=>{
        Modal.confirm({
            title:`确认删除${user.username}吗？`,
            onOk : async ()=>{
                const result = await reqDeleteUser(user._id);
                if (result.status===0){
                    message.success('用户删除成功');
                    this.getUsers();
                }
            }
        })
    }
    showChangeUser =(user)=>{
        this.user= user;
        this.setState({
            isShow:true
        })
    }
    componentWillMount() {
        this.initColumns();
    }
    componentDidMount() {
        this.getUsers()
    }

    render() {
        const title = <Button type='primary' onClick={this.showUserList}>创建用户</Button>
        const {users,isShow,roles} = this.state
        const user = this.user || {}
        // console.log(userForm)
        return (
           <Card title={title}>
               <Table
                    bordered
                    rowKey='_id'
                    columns={this.columns}
                    dataSource={users}
                    pagination={{
                        defaultPageSize:5
                    }}
               />
               <Modal
                    title={user._id?'修改用户':'新增用户'}
                    visible={isShow}
                    okText='添加'
                    cancelText='取消'
                    onOk={this.addOrUpdateUser}
                    onCancel={()=>{
                        this.setState({
                        isShow:false
                    })
                    this.form.resetFields()}}
               >
                   <UserForm setForm={(form)=>this.form=form} roles={roles} user={user}/>
               </Modal>
           </Card>
        )
    }
}
