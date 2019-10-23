import React, {Component} from 'react'
import {Card,Icon,List} from 'antd'
import LinkButton from '../../components/link-Button/linkButton'
import {HTTPS} from '../../utils/consts'
import {reqProductInfo} from '../../api'
const Item = List.Item
export default class ProductDetail extends Component {
    state={
        oneName:'',//一级分类名称
        towName:'',//二级分类名称
    }
    async componentDidMount() {
        const {categoryId,pCategoryId} =this.props.history.location.state.products
        let oneName;
        if (pCategoryId==='0') {
            const result = await reqProductInfo(categoryId)
            oneName = result.data.name;
            this.setState({
                oneName
            })
        }else {
            const results = await Promise.all([reqProductInfo(pCategoryId),reqProductInfo(categoryId)]);
            oneName =results[0].data.name;
            const towName =results[1].data.name;
            this.setState({
                oneName,
                towName
            })
        }
    }

    render() {
        //读取带过来的商品参数
        const {name,desc,price,detail,imgs} = this.props.history.location.state.products
        const {oneName,towName} = this.state
        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left'
                          onClick={()=>this.props.history.goBack()}
                          style={{
                        color:'#58bc58',
                        marginRight:15,
                        fontSize:20
                    }}/>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product_detail'>
                <List>
                    <Item>
                        <span className='left'>商品名称：</span>
                        <span >{name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述：</span>
                        <span >{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格：</span>
                        <span >￥{price}</span>
                    </Item>
                    <Item>
                        <span className='left'>所属分类：</span>
                        <span >{oneName}{towName?'->'+towName:''}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品图片：</span>
                        <span >{
                            imgs.map((item,index)=>(
                                <img
                                    className="detailImg"
                                    src={HTTPS+item}
                                    key={index}
                                />
                            ))
                        }</span>
                    </Item>
                    <Item>
                        <span className='left'>商品名称：</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
