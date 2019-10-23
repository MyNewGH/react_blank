import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Input,Select,Form} from 'antd'
const Item = Form.Item
 class UpdateForm extends Component {
    static propType ={
        categoryName:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }
    componentWillMount() {
        this.props.setForm(this.props.form)
    }

     render() {
        const {getFieldDecorator} =this.props.form
        const {categoryName} =this.props
        return (
           <Form>
               <Item>
                   {
                       getFieldDecorator('categoryName',{
                           initialValue:categoryName,
                           rules:[
                               {required:true,message:'请输入分类名称'}
                           ]
                       })(
                           <Input placeholder="请输入分类名称"></Input>
                       )
                   }
               </Item>
           </Form>
        )
    }
}
export default Form.create()(UpdateForm)
