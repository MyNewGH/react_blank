import React, {Component} from 'react'
import { Card ,Button,Table,message,Icon,Modal} from 'antd';
import {reqAddCategory, reqCategory, reqUpdateCategory} from '../../api'
import LinkButton from '../../components/link-Button/linkButton'
import AddForm from './add-form'
import UpdateForm from './update-form'
export default class Category extends Component {
    state={
        categorys:[],//一级菜单列表
        subCategorys:[],//二级分类菜单
        parentId:'0',//一级分类标识
        categoryName:'',//一级分类名称
        isLoading:false,//数据在加载中
        visible: 0 //标识添加/更新的输入框是否显示 0：都不显示，1：添加 2：更新
    }
    // parentId :如果没有指定根据状态中的parentId请求，如果指定了就根据指定请求
    getCategorys = async (parentId)=>{
        parentId =parentId || this.state.parentId
        this.setState({
            isLoading:true
        })
        const result = await reqCategory(parentId);
        if (result.data.length>0 && result.status===0){
            const categorys = result.data;
            if (parentId==='0'){
                this.setState({
                    categorys,
                    isLoading:false
                })
            }else {
                this.setState({
                    subCategorys:categorys,
                    isLoading:false
                })
            }

        } else {
            this.setState({
                isLoading:false
            })
            message.error('获取数据失败,可能该子级暂无数据')
        }
    }
    //显示一级下面的二级分类列表
    showSubCategorys = (category)=>{
        this.setState({
            parentId:category._id,
            categoryName:category.name
        },()=>{
            this.getCategorys();
            console.log(this.state.parentId)//更新为父级的id
        })
        // console.log(this.state.parentId)//未更新
    }
    //显示一级分类列表
    showCategorys = ()=>{
        this.setState({
            parentId:'0',
            categoryName:'',
            subCategorys:[]
        })
    }
    //点击隐藏，模态框
    handleCancel =() =>{
        this.form.resetFields()
        this.setState({
            visible:0
        })
    }
    //显示添加
    showAdd = () =>{
        this.setState({
            visible:1
        })
    }
    //添加分类
    addCategory = ()=>{
        this.form.validateFields(async (err,values)=>{
            if (!err){
                this.setState({
                    visible:0
                })
                //收集数据并提交请求
                const {categoryName,parentId} = values;
                //获取数据后清除数据
                this.form.resetFields()
                const result = await reqAddCategory(categoryName,parentId);

                if (result.status===0){
                    //添加的分类就是当前分类列表下的分类
                    if (parentId===this.state.parentId){
                        //重新获取当前分类列表进行显示
                        this.getCategorys()
                    }else if(parentId==='0'){//在二级列表下添加一级分类，重新获取一级分类列表，但是不需要显示列表
                        this.getCategorys('0')
                    }

                }
            }
        })

    }
    //显示更新
    showUpdate=(category)=>{
        this.category = category
        console.log(this)
        this.setState({
            visible:2
        })
    }
    //更新分类
    updateCategory =  ()=>{
        // 进行表单验证，只要验证通过了才处理数据
        this.form.validateFields( async (err ,values)=>{
            if (!err){
                //1、隐藏模态框
                this.setState({
                    visible:0
                })
                const categoryId = this.category._id;
                console.log(this.form)
                const {categoryName} = values
                console.log(categoryId,categoryName)
                // 更新input框数据
                this.form.resetFields()
                // 2、发送请求更新数据
                const result = await reqUpdateCategory({
                    categoryId,
                    categoryName
                })
                console.log(result)
                if (result.status===0){
                    this.getCategorys()
                }
            }
        })

    }
    componentWillMount() {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
                key: '_id',
            },
            {
                title: '操作',
                className: 'column-money',
                width:600,
                render: (category)=>(
                    <span>
                        <LinkButton onClick={()=>{this.showUpdate(category)}}>修改分类</LinkButton>
                        {
                            this.state.parentId==='0'? <LinkButton onClick={()=>{this.showSubCategorys(category)}}>查看子分类</LinkButton>:null
                        }
                    </span>
                ),
            },
        ];
    }
    componentDidMount() {
        this.getCategorys()
    }

    render() {
        const {categorys,isLoading,parentId,categoryName,subCategorys,visible} = this.state
        const category =this.category || {}
        console.log(category)
        const Title = parentId === '0'?'一级分类列表':(
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{
                    marginRight:5
                }}></Icon>
                <span>{categoryName}</span>
            </span>
        )
        return (
            <div>
                <Card size="default" title={Title} extra={
                    <Button type="primary" icon="plus" onClick={this.showAdd}>添加</Button>
                } style={{ width: '100%' }}>
                    <Table
                        loading={isLoading}
                        columns={this.columns}
                        dataSource={parentId==='0'?categorys:subCategorys}
                        bordered
                        rowKey='_id'
                        pagination={{defaultPageSize:5,showQuickJumper:true}}
                    />
                    <Modal
                        title="添加分类"
                        okText='添加'
                        cancelText='取消'
                        visible={visible===1}
                        onOk={this.addCategory}
                        onCancel={this.handleCancel}
                    >
                        <AddForm
                            categorys={categorys}
                            parentId={parentId}
                            setForm = {(form)=>{
                                this.form = form
                            }}
                        />
                    </Modal>
                    <Modal
                        title="更新分类"
                        okText='修改'
                        cancelText='取消'
                        visible={visible===2}
                        onOk={this.updateCategory}
                        onCancel={this.handleCancel}
                    >
                        <UpdateForm categoryName={category.name}
                        setForm={(form)=>{
                            this.form =form
                        }}
                        />

                    </Modal>
                </Card>
            </div>
        )
    }
}
