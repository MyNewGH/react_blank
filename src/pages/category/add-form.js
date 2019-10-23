import React, {Component} from 'react'
import {Input,Select,Form} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
const Option = Select.Option
 class AddForm extends Component {
     static propTypes ={
         categorys :PropTypes.array.isRequired,//一级分类列表
         parentId: PropTypes.string.isRequired,//一级分类id
         setForm:PropTypes.func.isRequired//用来接收Form 对象
     }
     componentWillMount() {
         this.props.setForm(this.props.form);
     }

     render() {
        const {getFieldDecorator} =this.props.form
        const {categorys,parentId} =this.props
        return (
           <Form>
               <Item>
                   {
                       getFieldDecorator('parentId',{
                           initialValue:parentId,
                       })(
                           <Select>
                               <Option value="0">一级分类</Option>
                               {
                                   categorys.map(c=><Option value={c._id}>{c.name}</Option>)
                               }
                           </Select>
                       )
                   }
               </Item>
               <Item>
                   {
                       getFieldDecorator('categoryName',{
                           initialValue:'',
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
export default Form.create()(AddForm)
