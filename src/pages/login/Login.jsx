import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import logo from '../../assets/logo.png'
import { Form, Icon, Input, Button,message } from 'antd';
import {reqLogin} from '../../api'
import meneyUtils from '../../utils/moneyUtils'
import storageUtils from '../../utils/storageUtils'
import './Login.less'
 class Login extends Component {

     handleSubmit = e => {
         e.preventDefault();
         this.props.form.validateFields( async (err, values) => {
             if (!err) {
                 const {username,password} = values;
                 const result = await reqLogin(username,password)
                 console.log(result.data)
                 if (result.status===0){
                     let self = this;
                     meneyUtils.user = result.data
                     storageUtils.saveUser(result.data)
                     message.success('登录成功',2,()=>{
                         self.props.history.replace('/')
                     })
                 } else {
                     message.error(result.msg)
                 }
             }else {
                 console.log('校验失败了')
             }
         });
     };
     validatorPwd = (rule,value,callback)=>{
         console.log(value)
         if (!value){
             callback('请输入密码！')
         }else if(value.length<4){
             callback('密码的长度不能小于4位')
         }else if (value.length>12){
             callback('密码的长度不能大于12位')
         } else if (!/^[a-zA-Z0-9_]+$/.test(value)){
             callback('密码必须是字母、数字、下划线组成')
         }else {
             callback();
         }
     };

    render() {
        //判断用户是否已经登陆
        if (meneyUtils.user && meneyUtils.user._id){
            return  <Redirect to='/'/>
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <header className="login_header">
                    <img src={logo} alt="logo"/>
                    <h1>React 后台管理系统</h1>
                </header>
                <div className="login_form">
                    <section>
                        <h2>用户登陆</h2>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {
                                    getFieldDecorator('username',{
                                        // 配置对象:属性名是 一些特定的名称
                                        rules: [
                                            { required: true,whitespace:true, message: '请输入用户名' },
                                            { min: 4, message: '长度最小为4位' },
                                            { max: 12, message: '长度最大为12位' },
                                            { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是字母、数字、下划线组成' },
                                            ],
                                    })(<Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Username"
                                    />)
                                }
                            </Form.Item>
                            <Form.Item>
                                {
                                    getFieldDecorator('password',{
                                        rules:[{
                                            validator:this.validatorPwd
                                        }]

                                    })(
                                        <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="Password"
                                    />,)
                                }

                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                   登陆
                                </Button>
                            </Form.Item>
                        </Form>
                    </section>
                </div>
            </div>
        )
    }
}
const WarpLogin = Form.create()(Login);
export default WarpLogin
// async 和await
// 1、作用
// 简化promise对象的使用，不用再使用then()来指定成功/失败的回调函数，以同步编码（没有回调函数的编码）的方式实现异步流程
// 2、哪里写async
// 在返回promise的表达式的左侧写await,不要promise,想要promise异步成功返回的值
// 3、哪里写await
// await所在函数（最近的地方）定义的async
