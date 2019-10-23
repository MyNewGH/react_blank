import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {Form,Input,Tree} from 'antd'
import menuList from '../../config/menuConfig'
const { TreeNode } = Tree;
//添加用户的form组件
export default class AddForm extends PureComponent {
    static propTypes ={
        role:PropTypes.object
    }
    constructor(props){
        super(props);
        const {menus} = this.props.role
        this.state={
            checkedKeys:menus
        }
    }
    getTreeNode = (menus)=>{
        return menus.reduce((pre,cur)=>{
            pre.push(
                <TreeNode title={cur.title} key={cur.key} >
                    {cur.children?this.getTreeNode(cur.children):null}
                </TreeNode>)
            return pre;
        },[])
    }
    //选中某各节点的回调
    onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    };
    //为父组件提供最新的menus
    getMenus = ()=>this.state.checkedKeys;
    componentWillMount() {
        this.TreeNodes = this.getTreeNode(menuList)
    }
    /*
    当组件接收到新的属性时自动调用
    * */
    componentWillReceiveProps(nextProps, nextContext) {
        const checkedKeys = nextProps.role.menus;
        this.setState({
            checkedKeys
        })
    }

    render() {
        const formItemLayout ={
            labelCol:{span:6},
            wrapperCol:{span:16}
        }
        const {role} = this.props
        const {checkedKeys} = this.state
        return (
           <div>
               <Form.Item label="角色名称" {...formItemLayout}>
                   <Input type="text" disabled value={role.name}/>
               </Form.Item>
               <Tree
                   checkable
                   defaultExpandAll={true}
                   checkedKeys={checkedKeys}
                   onCheck={this.onCheck}
               >
                    <TreeNode key="all" title="权限平台">
                        {this.TreeNodes}
                    </TreeNode>
               </Tree>
           </div>
        )
    }
}
