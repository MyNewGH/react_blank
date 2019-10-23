import React, {Component} from 'react'
import {Card,Button,Table,Modal,message} from 'antd'
import {PAGE_SIZE} from '../../utils/consts'
import {reqAddRole,reqUpdateRole,reqAllRole} from '../../api'
import AddForm from './addForm';
import AuthForm from './authForm';
import moneyUtils from '../../utils/moneyUtils'
import storageUtils from '../../utils/storageUtils'
import {formateDate} from '../../utils/timeUtil'
export default class Role extends Component {
    constructor(porps){
        super(porps);
        this.state={
            roles:[],
            role:{},
            isShowAdd:false,
            isShowAuth:false
        }
        this.auth = React.createRef()
    }
    initRoleColumn =()=>{
        this.columns=[
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },
        ]
    }
    onRow = (role)=>{
        return{
            onClick:event=>{
                this.setState({
                    role,
                })
            }
        }
    }
    //获取用户列表
    getAllRole = async ()=>{
        const result = await reqAllRole();
        if (result.status===0){
            this.setState({
                roles:[...result.data]
            })
        }
    }
    //添加角色
    addRoles = ()=>{
        this.form.validateFields(async (err,values)=>{
            if (!err){
                this.setState({
                    isShowAdd:false
                })
                // 1、收集数据
                    const {roleName} = values;
                    this.form.resetFields();
                // 2、请求添加接口
                    const result =await reqAddRole(roleName);
                // 3、根据结果显示/添加列表
                if (result.status===0){
                    const role = result.data;
                    message.success('添加角色成功')
                    this.setState((state,props)=>({
                        roles:[...state.roles,role]
                    }))
                } else {
                    message.error('添加角色失败');
                }
            }
        })
    }
    setAuthRoles = async ()=>{
        const role = this.state.role;
        const menus = this.auth.current.getMenus();
        role.menus = menus;
        role.auth_name = moneyUtils.user.username;
        role.auth_time = Date.now();
        const result = await reqUpdateRole(role);
        if (result.status===0){
            console.log(moneyUtils.user._id,role._id)
            if (role._id === moneyUtils.user._id){
                moneyUtils.user= {};
                storageUtils.removeUser();
                message.success('角色设置权限成功，请重新登录');
                this.props.history.replace('/login');
            }else {
                this.setState({
                    isShowAuth:false,
                    role:[...this.state.roles]
                })
                message.success('角色更新权限成功');
            }


        }
    }


    componentWillMount() {
        this.initRoleColumn();
        this.getAllRole();
        // console.log(moneyUtils);
    }

    render() {
        const {roles,role,isShowAdd,isShowAuth} = this.state;
        const title=(
            <span>
                <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button> &nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={()=>this.setState({isShowAuth:true})}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize:5,
                        showQuickJumper:true
                    }}
                    rowSelection={{
                        type:'radio',
                        selectedRowKeys:[role._id],
                        onSelect:(role)=>this.setState({role})
                    }}
                    onRow={this.onRow}
                />
                <Modal
                    title="添加分类"
                    okText='添加'
                    cancelText='取消'
                    visible={isShowAdd}
                    onOk={this.addRoles}
                    onCancel={()=>{
                        this.setState({isShowAdd:false})
                        this.form.resetFields()
                    }}
                >
                    <AddForm
                        setForm = {(form)=>
                            this.form = form
                        }
                    />
                </Modal>
                <Modal
                    title="用户权限设置"
                    okText='添加'
                    cancelText='取消'
                    visible={isShowAuth}
                    onOk={this.setAuthRoles}
                    onCancel={()=>{
                        this.setState({isShowAuth:false})
                    }}
                >
                    <AuthForm role={role} ref={this.auth}
                    />
                </Modal>
            </Card>
        )
    }
}
