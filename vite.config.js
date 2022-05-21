import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

const path = require('path');

function _resolve(dir) {
    return path.resolve(__dirname, dir);
}

// https://vitejs.dev/config/
export default defineConfig({
    //配置目录别名
    resolve: {
        alias: [
            {find: '@', replacement: _resolve('./src')},
            {find: '@components', replacement: _resolve('./src/components')},
            {find: '@assets', replacement: _resolve('./src/assets')}
        ]
    },
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    base: './',
    server: {
        open: false, // 是否自动在浏览器打开
        port: 3000, // 端口号
        host: '0.0.0.0',
        https: false,// 使用的是http协议则设置为false，https协议则设置为true
        //配置请求代理
        proxy: {
            '/api': {
                //所有的接口请求都会被代理到这个路径上
                target: 'http://localhost:8500',
                /**
                 * 重写路径，当我们在浏览器中看到请求的地址为：http://localho
                 * 实际上访问的地址是：http://121.121.67.254:8185
                 */
                rewrite: (path) => path.replace(/^\/api/, ''),
                ws: true, // 是否启用webSockets
                secure: false, // 使用的是http协议则设置为false 安全证书校验
                //是否开启跨域
                changeOrigin: true,
            }
        },
    },
    build: {
        target: 'modules',
        outDir: 'dist', // 指定输出路径
        assetsDir: 'static', // 指定生成静态资源的存放路径
        minify: 'terser', // 混淆器,terser构建后文件体积更小
        // 移除console
        terserOptions: {
            compress: {
                drop_console: true, // 生产环境移除console
                drop_debugger: true // 生产环境移除debugger
            }
        },
        //配置多页面
        rollupOptions: {
            treeshake: false,
            //压缩最小输入
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString()
                    }
                }
            }
        }
    }
})
