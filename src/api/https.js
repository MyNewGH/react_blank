// 基于promise对axios进行二次封装
/*
接口请求函数
返回值是Promised
优化
1、处理请求异常
（1）外层嵌套一个promise对象
（2）在请求出错时，不reject，而是直接显示错误
2、在请求成功后直接取到response的值

*/
import axios from 'axios'
import {message} from 'antd'

export default function  https(url,data={},type='GET') {
    return new Promise((resolve,reject )=>{
        let promise;
        if (type==='GET'){
            promise= axios.get(url,{
                params:{...data}
            })
        } else {
            promise = axios.post(url,data)
        }
        //如果成功了调用成功的成功的回调resolve（value）
        promise.then(response=>{
            resolve(response.data)
        }).catch(error=>{//失败直接接收后端反馈回来的异常信息
            reject(error)
            message.error('请求错误'+error.message);
        })
    })

}
