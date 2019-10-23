import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {Form,Input,Select} from 'antd'
const Option= Select.Option
//添加/修改用户的form组件
 class userForm extends PureComponent {
    static propTypes ={
        setForm:PropTypes.func.isRequired,
        roles:PropTypes.array.isRequired,
        user:PropTypes.object
    }
    componentWillMount() {
        this.props.setForm(this.props.form)
    }

     render() {
        const{getFieldDecorator} = this.props.form
         const {roles,user} = this.props;
        const formItemLayout ={
            labelCol:{span:5},
            wrapperCol:{span:16}
        }
        return (
           <Form {...formItemLayout}>
               <Form.Item label="用户名称" >
                   {    getFieldDecorator('username',
                       {
                           initialValue:user.username,
                           rules:[
                               {required:true,message:'请输入用户名称'}
                           ]
                       })( <Input type="text" placeholder="请输入用户名称"/>)

                   }
               </Form.Item>
               {
                   user._id?null: <Form.Item label="用户密码" >
                       {    getFieldDecorator('password',
                           {
                               initialValue:user.password,
                               rules:[
                                   {required:true,message:'请输入用户密码'}
                               ]
                           })( <Input type="password" placeholder="请输入用户密码"/>)

                       }
                   </Form.Item>
               }

               <Form.Item label="手机号" >
                   {    getFieldDecorator('phone',
                       {
                           initialValue:user.phone,
                           rules:[
                               {required:true,message:'请输入手机号'}
                           ]
                       })( <Input type="text" placeholder="请输入手机号"/>)

                   }
               </Form.Item>
               <Form.Item label="用户邮箱" >
                   {    getFieldDecorator('email',
                       {
                           initialValue:user.email,
                           rules:[
                               {required:true,message:'请输入用户邮箱'}
                           ]
                       })( <Input type="email" placeholder="请输入用户邮箱"/>)

                   }
               </Form.Item>
               <Form.Item label="角色类型" >
                   {    getFieldDecorator('role_id',
                       {
                           initialValue:user.role_id,
                       })( <Select>
                       {
                           roles.map(role=>(
                               <Option key={role._id} value={role._id}>{role.name}</Option>
                           ))
                       }
                            </Select>)

                   }
               </Form.Item>

           </Form>
        )
    }
}
export default userForm = Form.create()(userForm);
