# Loadstar-core

这是一个监控核心, 通过 Socket.io 实现实时获取你的设备的性能数据, 例如 CPU 使用率, 内存使用率.

同时支持获取 pm2 进程列表

能获取到的数据可以参考

-   [monitoring.json](/demo/monitoring.json)
-   [pm2.json](/demo/pm2.json)

如果你需要部署需要你的设备有 node.js 环境

或者下载使用编译好的可执行文件

通过 Socket.io 客户端连接

```javascript
socket.on("server", (data) => {});
socket.on("pm2", (data) => {});
```
