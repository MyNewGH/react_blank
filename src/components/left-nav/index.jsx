import React, {Component} from 'react'
import './left-nav.less'
import {Link,withRouter} from "react-router-dom";
import {Menu, Icon,Modal} from 'antd';
import logo from "../../assets/logo.png";
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/moneyUtils'
const {SubMenu} = Menu;
 class LeftNav extends Component {
     //判断当前用户对item是否有权限
     getAuth = (item)=>{
         const {key,isPublic} = item;
         const menus = memoryUtils.user.role.menus;
         const userNmae = memoryUtils.user.username;
         // 1.如果当前用户是admin
         // 2.如果item是公开的
         // 3.如果当前用户有此item权限：key有没有在menus中
         if(userNmae==='admin'|| isPublic || menus.indexOf(key)!==-1){
            return true;
         }else if (item.children){
             return  !!item.children.find(c=>menus.indexOf(c.key)!==-1)
         }
        return false;
     }
     // 在第一次render()之前执行一次，
     // 为第一个render()之前准备数据，必须是同步的
     componentWillMount() {
         this.menuNode = this.getMenuList(menuList)
     }

     render() {
        let path = this.props.location.pathname
         if (path.indexOf('/product')===0){
             path = '/product'
         }
         const openKey = this.openKey
        return (
            <div className="left-nav">
                <header>
                    <Link to='/home'>
                        <img src={logo} alt="logo"/>
                        <h1>React后台系统</h1>
                    </Link>
                </header>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {
                        this.menuNode
                    }
                </Menu>
            </div>
        )
    }
    //map+递归实现列表
    // getMenuList_map = (list)=>{
    //     return list.map(item =>{
    //         if (!item.children){
    //             return(
    //                 <Menu.Item key={item.key}>
    //                     <Link to={item.key}>
    //                         <Icon type={item.icon}/>
    //                         <span>{item.title}</span>
    //                     </Link>
    //                 </Menu.Item>
    //             )
    //         }else {
    //             return (
    //                 <SubMenu
    //                     key={item.key}
    //                     title={
    //                         <span>
    //                             <Icon type={item.icon}/>
    //                             <span>{item.title}</span>
    //                         </span>
    //                     }
    //                 >
    //                     {
    //                         this.getMenuList_map(item.children)
    //                     }
    //                 </SubMenu>
    //             )
    //         }
    //     })
    // }
     //reduce+递归实现左侧列表渲染
    getMenuList = (list)=>{
        const path = this.props.location.pathname
        // 如果当前用户有对应的item权限,才需要显示对应的菜单项

            return list.reduce((pre,item)=>{
                if (this.getAuth(item)){
                    if (!item.children){
                        pre.push(
                            (
                                <Menu.Item key={item.key}>
                                    <Link to={item.key}>
                                        <Icon type={item.icon}/>
                                        <span>{item.title}</span>
                                    </Link>
                                </Menu.Item>
                            )
                        )
                    }else {
                        //查找一个与当前请求路径匹配的子item
                        const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0)
                        // 如果存在则打开当前字列表
                        if (cItem){
                            this.openKey = item.key;
                        }
                        pre.push((
                            <SubMenu
                                key={item.key}
                                title={
                                    <span>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </span>
                                }
                            >
                                {
                                    this.getMenuList(item.children)
                                }
                            </SubMenu>
                        ))
                    }
                }
                return pre
            },[])


    }
}
export default withRouter(LeftNav)
