import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd';
import {reqWeather} from '../../api'
import {formateDate} from '../../utils/timeUtil'
import moneyUtils from '../../utils/moneyUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
import LinkButton from '../../components/link-Button/linkButton'
import './header.less'
const { confirm } = Modal;
class Header extends Component {
    state = {
        nowTime:formateDate(Date.now()),
        dayPictureUrl:'',
        weather:''
    }
    /*
     发送ajax更新最新天气状态
     */
    getWeather = async () =>{
        const {dayPictureUrl,weather} = await reqWeather('广州');
        this.setState({
            dayPictureUrl,
            weather
        })
    }
    /*
    启动定时器实现时间更新
    */
    getTimeUpdate = () =>{
        this.timer = setInterval(()=>{
            this.setState({
                nowTime:formateDate(Date.now()),
            })
        },1000)
    }
    /*
    实时更新标签页对应的title
    * */
    getTitle = () =>{
        const path = this.props.location.pathname;
        // console.log(path)
        let title;
        menuList.map(item=>{
            if (item.key===path){
                title = item.title;
            }else if (item.children) {
                const cItem = item.children.find(cItem =>path.indexOf(cItem.key)===0)
                if (cItem){
                    title = cItem.title;
                }
            }
        })
        return title
    }
    //用户退出
    logout = () =>{
        confirm({
            title: 'Are You 确定退出吗？',
            okText: '确定',
            cancelText: '取消',
            onOk:()=> {
                storageUtils.removeUser()
                moneyUtils.user={};
                this.props.history.replace('/login')
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    componentDidMount() {
        this.getWeather();
        this.getTimeUpdate()
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render() {
        const {nowTime,dayPictureUrl,weather} = this.state
        const title = this.getTitle();
        console.log(title)
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎, {moneyUtils.user.username}登陆</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {title}
                    </div>
                    <div className="header-bottom-right">
                        <span>{nowTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header);
