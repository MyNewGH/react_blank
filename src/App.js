import React,{Component} from 'react'
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import Admin from './pages/admin/Admin'
import Login from './pages/login/Login'
import storageUtils from './utils/storageUtils'
import moneyUtils from './utils/moneyUtils'

const user = storageUtils.getUser()
moneyUtils.user = user

export default class App extends Component{
    render() {
      return <BrowserRouter>
                    <Switch>
                        <Route path='/login' component={Login}/>
                        <Route path='/' component={Admin}/>
                    </Switch>
             </BrowserRouter>
    }
}
