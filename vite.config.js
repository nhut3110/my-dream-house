import {defineConfig} from 'vite';
export default defineConfig({server:{host:'0.0.0.0',port:4190,strictPort:true},build:{target:'es2022',rollupOptions:{output:{manualChunks:{three:['three']}}}}});
