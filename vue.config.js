module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  outputDir: 'dist',
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.runtime.esm-bundler.js'
      }
    }
  },
  devServer: {
    host: '0.0.0.0',  // Permite conexiones externas
    port: 3001,       // Usa el puerto correcto
    allowedHosts: "all",  // Permite cualquier host (incluye Ngrok)
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws' // Configuración automática para WebSocket
    },
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'http://93.127.129.46:3000' 
          : 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      args[0].__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = JSON.stringify(false);
      return args;
    });
  }
};
