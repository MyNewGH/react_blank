import React, {Component} from 'react'
import { Upload, Icon, Modal,message } from 'antd';
import PropTypes from 'prop-types'
import {reqDeleteImg} from '../../api'
import {HTTPS,IMAGE} from '../../utils/consts'
export default class PicturesWall  extends Component {
    // state = {
    //     previewVisible: false,//标识大图是否显示预览
    //     previewImage: '',//大图的url
    //     fileList: [
    //         // {
    //         //     uid: '-1',// 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
    //         //     name: 'image.png', // 文件名
    //         //     status: 'done', // 状态有：uploading=上传中 done=已完成 error removed=删除
    //         //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',//图片的地址
    //         // },
    //     ],
    // };
    static propTypes ={
        imgs:PropTypes.array
    }
    constructor(props){
        super(props);
        const {imgs} = this.props;
        const fileList = imgs && imgs.length>0?imgs.map((img,index)=>({
            uid: -index,// 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
            name: img, // 文件名
            status: 'done', // 状态有：uploading=上传中 done=已完成 error removed=删除
            url: HTTPS+img,//图片的地址
        })):[];
        // console.log(fileList)
        this.state={
            previewVisible: false,//标识大图是否显示预览
            previewImage: '',//大图的url
            fileList
        }
    }
     getBase64 =(file) =>{
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    //隐藏预览图片的模态框
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }
        //显示指定file对应的大图
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    /*
    fileList:所有已上传文件图片文件对象数组
    file:当前操作的图片对象（上传/删除）
    */
    handleChange = async ({ file,fileList }) => {
        if (file.status==='done'){
            const result = file.response;
            if (result.status===0){
                message.success('图片上传成功');
                const {name,url} = result.data;
                file = fileList[fileList.length-1];
                file.name = name;
                file.url = url;
            }else {
                message.error('图片上传失败');
            }
        }else if (file.status === 'removed') {
            const result = await reqDeleteImg(file.name)
            if (result.status===0){
                message.success('图片删除成功');
            } else {
                message.error('图片删除失败');
            }
        }
        this.setState({ fileList })
    };
    getImgs = ()=>{
        return this.state.fileList.map(file=>file.name);
    }
    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload"//上传图片的接口
                    listType="picture-card" //卡片类型
                    name={IMAGE} //接口的参数名
                    fileList={fileList} //已上传的图片的数组集合
                    accept="image/*" //只能上传图片格式的文件
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
