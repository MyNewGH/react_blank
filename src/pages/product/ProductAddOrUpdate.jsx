import React, {Component} from 'react'
import {Card,Icon,Form,Input,Button,Cascader,message } from 'antd'
import LinkButton from '../../components/link-Button/linkButton'
import {reqCategory,reqAddOrUpdateProduct} from '../../api'
import PictureWall from './PicturesWall'
import RichTextEditor from './RichTextEditor'
const {Item} = Form
const {TextArea} = Input
 class ProductAddOrUpdate extends Component {
    constructor(props){
        super(props)
        this.state = {
            options:[],
        };
        this.pic = React.createRef();
        this.edit = React.createRef()
    }

     initOptions = async (categorys)=>{
         //生成一个需要对应字段的队像
        const options = categorys.map(c=>({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))
         // 如果点击是一个二级分类的商品在请求一次数据
         const {updateFlag,product} =this;
         const {pCategoryId,categoryId} = product
         if (updateFlag&&pCategoryId!=='0'){
             const subTargetOption = await this.getCategorys(pCategoryId)
             const childOption = subTargetOption.map(child=>({
                 value: child._id,
                 label: child.name,
                 isLeaf: true,
             }))
             const targetOption = options.find(option=>option.value===pCategoryId);
             targetOption.children =childOption;
         }
         this.setState({
             options
         })

     }
     /*
     * 异步获取一级/二级列表，并显示
     * async 函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定*/
     getCategorys = async (parentId)=>{
        const result = await reqCategory(parentId);
        if (result.status===0){
            const category = result.data;
            if (parentId==='0'){//一级列表
                this.initOptions(category);
            } else {
                //二级列表
                return category;
            }
        }
     }
     validatorPrice =(rule,value,callback)=>{
         if (value*1>0){
             callback()
         } else {
             callback('输入是价格必须大于0');
         }
     }
     /*
     加载下一级列表的回调函数
     */
     loadData = async selectedOptions => {
         //得到选中的option对象以及他子列表
         const targetOption = selectedOptions[0];
         targetOption.loading = true;//显示lodaing

         // 异步请求获取数据(根据选中的分类获取二级分类)
         const subTargetOption = await this.getCategorys(targetOption.value);
         targetOption.loading = false;
         if (subTargetOption && subTargetOption.length>0){
             const childOption = subTargetOption.map(child=>({
                 value: child._id,
                 label: child.name,
                 isLeaf: true,
             }))
             targetOption.children = childOption;
         } else {
             targetOption.isLeaf = true;
         }
         //更新options的状态
         this.setState({
             options: [...this.state.options],
         });
     };
     submit = ()=>{
         //进行表单验证，如果通过了，才发送请求
         this.props.form.validateFields(async (error,values)=>{
             if (!error){
                 // 1、收集数据并封装成product对象
                 const {name,desc,price,categoryIds} = values
                 let pCategoryId,categoryId;
                 if (categoryIds.length===1){
                     pCategoryId='0';
                     categoryId=categoryIds[0];
                 }else {
                     pCategoryId=categoryIds[0];
                     categoryId=categoryIds[1];
                 }
                 const imgs = this.pic.current.getImgs();
                 const detail = this.edit.current.getDetail();
                 const product ={name,desc,price,imgs,detail,pCategoryId,categoryId};
                 if (this.updateFlag){
                     product._id = this.product._id;
                 }
                 // 2、调用接口函数去进行添加或者更新
                 const result = await reqAddOrUpdateProduct(product);
                 // 3、根据状态进行信息提示
                 if (result.status===0){
                     message.success(`${this.updateFlag?'更新':'添加'}商品成功`,()=>this.props.history.goBack());
                 }else {
                     message.error(`${this.updateFlag?'更新':'添加'}商品失败`)
                 }

             }
         })
     }
     componentWillMount() {
         const product = this.props.location.state;//如果是更新就有值，如果是添加就没有值
         this.updateFlag = !!product;//保存是否是更新的标识
         this.product = product||{};
     }

     componentDidMount() {
         this.getCategorys('0');
     }

     render() {
         const {updateFlag,product} = this;
         const {categoryId,pCategoryId,imgs,detail} = product
         const categoryIds = []
         if (updateFlag){
             //商品是一个一级分类商品
             if (pCategoryId==='0'){
                 categoryIds.push(categoryId)
             }else {
                 categoryIds.push(pCategoryId,categoryId);
             }
             //商品是一个二级分类商品
         }
        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left'
                          onClick={()=>this.props.history.goBack()}
                          style={{
                            color:'#58bc58',
                            marginRight:10,
                            fontSize:20
                                }}/>
                </LinkButton>
                  <span>{updateFlag===true?'更新商品':'添加商品'}</span>
            </span>
        );
        const formItemLayout = {
            labelCol:{span:2},
            wrapperCol:{span: 8}
        }
        const {getFieldDecorator} =this.props.form
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="商品名称：">
                        {
                            getFieldDecorator('name',{
                                initialValue:product.name,
                                rules:[
                                    {required:true,message:'必须输入商品名称'}
                                ]
                            })(  <Input placeholder="请输入商品名称"/>)
                        }
                    </Item>
                    <Item label="商品描述：">
                        {
                            getFieldDecorator('desc',{
                                initialValue:product.desc,
                                rules:[
                                    {required:true,message:'必须输入商品描述'}
                                ]
                            })(<TextArea
                                placeholder="请输入商品描述"
                                autoSize={{ minRows: 2, maxRows: 6 }}
                            />)
                        }

                    </Item>
                    <Item label="商品价格：">
                        {
                            getFieldDecorator('price',{
                                initialValue:product.price,
                                rules:[
                                    {required:true,message:'必须输入商品价格'},
                                    {validator:this.validatorPrice}
                                ]
                            })(<Input type='number' placeholder="请输入商品价格" addonAfter="元"/>)
                        }
                    </Item>
                    <Item label='商品分类：'>
                        {
                            getFieldDecorator('categoryIds',{
                                initialValue:categoryIds,
                                rules:[
                                    {required:true,message:'必须选择指定商品分类'}
                                ]
                            })( <Cascader
                                placeholder="请选择指定商品分类"
                                options={this.state.options}
                                loadData={this.loadData}
                            />)
                        }

                    </Item>
                    <Item label='商品图片'>
                        <PictureWall ref={this.pic} imgs={imgs}/>
                    </Item>
                    <Item label='商品详情'  labelCol={{span:2}}
                    wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.edit}detail={detail}/>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddOrUpdate)
