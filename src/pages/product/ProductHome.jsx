import React, {Component} from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message
} from 'antd';
import LinkButton from '../../components/link-Button/linkButton'
import {reqProducts,reqSearchProducts,reqProductStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/consts'
const Option = Select.Option;

export default class ProductHome extends Component {
    state={
        products:[],//商品列表
        total:0,//商品总条数
        loading:false,//显示加载loading
        searchName:'',//搜索关键词
        searchType:'productName'//搜索类型
    };
    // 初始化table的数据
    initColums = ()=> {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品信息',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price
            },
            {
                title: '状态',
                // dataIndex: 'status',
                width:100,
                render: (product) => {
                    const {status,_id} = product
                    const newStatus = status===1?2:1;
                    return(
                        <span>
                            <Button type='primary'
                             onClick={()=>this.updateProductStatus(_id,newStatus)}>
                                {status===1?'下架':'上架'}
                            </Button>
                            <span>{status===1?'在售':'已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width:100,
                render: (products) => {
                    return(
                        <span>
                           <LinkButton onClick={()=>this.props.history.push('/product/detail',{products})}>详情</LinkButton>
                           <LinkButton onClick={()=>this.props.history.push('/product/addorupdate',products)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    }
    //获取商品分类列表
    //根据指定页码显示内容
    getProducts = async (pageNum)=>{
        this.pageNum = pageNum;//保存当前页，在更新状态的时候仍然显示当前页面
        this.setState({
            loading:true
        })

        let result;
        const {searchType,searchName} = this.state //如果搜索的input框有值说明要进行搜索操作
        if (searchName) {
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType});
        }else {//一般的分页请求
            result = await reqProducts(pageNum,PAGE_SIZE);
        }
        if (result.status===0){
            // 取出分页数据更新状态
            const {total,list} = result.data
            this.setState({
                total,
                products:list,
                loading:false
            })
        }
    };
    updateProductStatus =async (productId,status)=>{
         const result = await reqProductStatus(productId,status);
         if (result.status===0){
             message.success('商品更新成功');
             this.getProducts(this.pageNum);
         }
    }
    componentWillMount() {
        this.initColums()
    }
    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        const {products,total,loading,searchName,searchType} =this.state
        const title = (
            <span>
                <Select value={searchType} style={{width:150}} onChange={value => this.setState({searchType:value})}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='请输入关键词' style={{width:150,margin:'0 10px'}} value={searchName} onChange={event => this.setState({
                    searchName:event.target.value
                })}/>
                <Button type='primary' onClick={()=>this.getProducts(1)}>搜索</Button>
            </span>
        );
        const extra = (
            <Button type='primary' onClick={()=>this.props.history.push('/product/addorupdate')}>
                <Icon type='plus'/>
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    rowKey='_id'
                    bordered
                    loading={loading}
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        current:this.pageNum,
                        total,
                        defaultPageSize:PAGE_SIZE,
                        showQuickJumper:true,
                        onChange:this.getProducts
                    }}/>;
            </Card>
        )
    }


}
