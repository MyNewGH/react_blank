const {override, fixBabelImports,addLessLoader} = require('customize-cra');
//针对antd进行按需打包，根据我import了什么组件就打包什么组件以及相关样式（bable-plugin-import）
module.exports = override( fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {'@primary-color': '#1DA57A'},//对源码中less的变量重新制定
    }),
);
