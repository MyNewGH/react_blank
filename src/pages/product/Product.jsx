import React, {Component} from 'react'
import {Route,Switch,Redirect} from 'react-router-dom'
import ProductHome from './ProductHome'
import ProductDetail from './ProductDetail'
import ProductAddOrUpdate from './ProductAddOrUpdate'
import './product.less'
export default class Product extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/product' component={ProductHome}/>
                    <Route  path='/product/detail' component={ProductDetail}/>
                    <Route  path='/product/addorupdate' component={ProductAddOrUpdate}/>
                    <Redirect to='/product'/>
                </Switch>
            </div>
        )
    }
}
