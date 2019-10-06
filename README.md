# Minecraft Bedrock WebSocket Server Demo
## 如何使用？
```bash
git clone https://github.com/haojie06/BedrockWsServer.git
cd BedrockWsServer
npm install
node build/app.js
#默认使用6800端口
```
### 在服务器上使用ws
bds和stoneserver都是可以使用/connect命令的，我们需要在server.proterties里面加上一行`op-permission-level = 4` 让op拥有控制台的权限，然后在游戏中op即可使用 `/connect ip:6800` 连接ws服务器，但是有非常大的限制，目前只有客户端能执行这条命令，并且只有op能够使用，并且需要op持续在线，所以尽管看上去通过ws能获得非常多的信息，但是在服务器里能做的事情依旧有限。

此demo中实现了三个功能
- 发送subscribe包，对游戏事件进行监听

    demo中监听了ws连接者的发送信息事件，放置方块事件
- 发送unsubscribe包，取消之前设置的监听

    在收到一个事件之后即会解除对用户放置方块事件的监听，因此你可以尝试连续放置方块，后台中应该只会输出一条BlockPlaced事件
- 发送commandrequest包，执行一条命令
    
    在后台中输入 send:message 即可游戏中执行/say message命令

*这是我的第一个nodejs程序😀，虽然ws功能有限，但是还是挺有意思的*
> 参考
> - [mcwiki ws中文教程](https://minecraft-zh.gamepedia.com/%E6%95%99%E7%A8%8B/WebSocket)
> - [github上的 BedrockWS](https://github.com/eDroiid/BedrockWS) 
