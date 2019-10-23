import React, {Component} from 'react'
import {Redirect,Route,Switch} from 'react-router-dom'
import moneyUtils from '../../utils/moneyUtils'
import { Layout } from 'antd';
import Header from '../../components/Header'
import LeftNav from '../../components/left-nav'
import Home from '../home/Home'
import Category from '../category/Category'
import Product from '../product/Product'
import Role from '../role/Role'
import User from '../user/User'
import Bar from '../charts/Bar'
import Line from '../charts/Line'
import Pie from '../charts/Pie'
const {  Footer, Sider, Content } = Layout;
export default class Admin extends Component {
    render() {
        const user = moneyUtils.user
        // console.log(user)
        if (!user || !user._id){

            return <Redirect to='/login'/>
        }
        return (

                <Layout style={{height:'100%'}}>
                    <Sider>
                        <LeftNav/>
                    </Sider>
                    <Layout >
                        <Header/>
                        <Content style={{
                            background:'#fff',
                            margin:'20px'
                        }}>
                            <Switch>
                                <Route path='/home' component={Home}/>
                                <Route path='/category' component={Category}/>
                                <Route path='/product' component={Product}/>
                                <Route path='/role' component={Role}/>
                                <Route path='/user' component={User}/>
                                <Route path='/charts/bar' component={Bar}/>
                                <Route path='/charts/line' component={Line}/>
                                <Route path='/charts/pie' component={Pie}/>
                                <Redirect to='/home' />
                            </Switch>
                        </Content>
                        <Footer style={{
                            textAlign:"center",
                            color:'#ccc'
                        }}>建议使用谷歌浏览器浏览，效果会更加</Footer>
                    </Layout>
                </Layout>
        )
    }
}
