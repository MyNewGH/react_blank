import {message} from 'antd'
import ajax from './https'
import jsonp from 'jsonp'
const BASE_URL = ''
export const reqLogin = (username,password) => ajax(BASE_URL+'/login',{username,password},'POST')

//获取一二级分类列表
export const reqCategory = (parentId)=> ajax(BASE_URL+'/manage/category/list',{parentId})
// 添加分类
export const reqAddCategory = (categoryName,parentId)=> ajax(BASE_URL + '/manage/category/add',{categoryName,parentId},'POST');
// 更新分类
export const reqUpdateCategory = ({categoryId,categoryName})=>ajax(BASE_URL+'/manage/category/update',{categoryId,categoryName},'POST')
//获取商品分类列表
export const reqProducts = (pageNum,pageSize) => ajax(BASE_URL+'/manage/product/list',{pageNum,pageSize});

//搜索商品分类列表（根据商品名称、商品描述进行搜索）
//searchType 搜索类型 productName/productDesc
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType}) => ajax(BASE_URL+'/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName
})
//获取一个分类的信息
export const reqProductInfo = (categoryId) => ajax(BASE_URL+'/manage/category/info',{categoryId})
//更新商品状态（已下架、在售）
export const reqProductStatus = (productId,status) =>ajax(BASE_URL+'/manage/product/updateStatus',{productId,status},'POST');
//商品图片的预览
export const  reqDeleteImg = (name) => ajax(BASE_URL+'/manage/img/delete',{name},'POST');
//商品的更新/新增
export const reqAddOrUpdateProduct =(product) => ajax(BASE_URL+'/manage/product/'+(product._id?'update':'add'),product,'POST')

//添加角色
export const reqAddRole =(roleName)=>ajax(BASE_URL+'/manage/role/add',{roleName},'POST');
//获取角色列表
export const reqAllRole = ()=>ajax(BASE_URL+'/manage/role/list')
//更新角色列表
export const reqUpdateRole = (role)=>ajax(BASE_URL+'/manage/role/update',role,'POST');
//获取用户列表
export const reqUserList = ()=>ajax(BASE_URL+'/manage/user/list');
//删除用户
export const reqDeleteUser = (userId) =>ajax(BASE_URL+'/manage/user/delete',{userId},'POST');
//添加or更新用户
export const reqAddOrUpdateUser =(user)=>ajax(BASE_URL+'/manage/user/'+(user._id?'update':'add'),user,'POST');
export const reqWeather = (city) => {
    return new Promise((resolve,reject)=>{
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
        jsonp(url,{},(err,data)=>{
            // console.log(data.results[0].weather_data)
            if (!err && data.status==='success'){
                const {dayPictureUrl,weather} = data.results[0].weather_data[0];
                resolve({dayPictureUrl,weather});
            }else {
                message.error('获取天气信息失败！');
            }
        })
    })
}
// reqWeather('广州')
