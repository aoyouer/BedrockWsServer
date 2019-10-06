import { Packet,UnSubscribe,Subscribe,CommandPacket } from './packet/packet';
import { Server } from 'ws';
import {EventEmitter} from 'events';
import { Socket } from 'net';
import {createInterface} from 'readline';
//import {v4} from 'uuid';
let uuid4 = require('uuid/v4');
//创建一个负责输入输出的对象
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});


export class WSServer extends EventEmitter{
    //strictPropertyInitialization:false
    _socket:Server;

    public listen(port:number):void{
        let server:WSServer = this;

        this._socket = new Server({port:port});
        //当有客户端连接时回调
        console.log("WS开始监听" + port);
        this._socket.on("connection",socket => {
            console.log("客户端连接");
            
            //发送subscribe包建立监听
            registerSubscribe(socket,"PlayerMessage");
            registerSubscribe(socket,"BlockPlaced");

            //当socket收到信息时回调
            socket.on("message", message => {
                console.log("接收到客户端的信息");
                
                let data = JSON.parse(message as string);
                let msgPurpose = data.header.messagePurpose;
                if(msgPurpose == "error"){
                    console.log("出现错误:", data);
                }
                else if(msgPurpose == "event"){
                    console.log(data.body.eventName);
                    //console.log(data.body.properties);
                    //测试unsubscribe,解除对破坏事件的监听 ?难道需要相同的requestid？不需要
                    unRegisterSubscribe(socket,"PlayerMessage");
                    //let usPacket:UnSubscribe = new UnSubscribe("BlockBroken");
                    //socket.send(JSON.stringify(usPacket));
                }
                else if(msgPurpose == "commandResponse"){
                    console.log("命令返回：" + data.body.statusCode);
                }
                
            });
            //接收到控制台的发送信息事件
            server.on("sendMsg",msg=>{
                let cpacket:Packet = new CommandPacket('say Hello');
                console.log("[sendMsg]:" + msg);
                socket.send(JSON.stringify(cpacket));
            });

            socket.on("error",err=>{
                console.log("建立的socket出现错误" + err.message);
            });

            socket.on("close", () => {console.log("客户端断开连接")});

        });

        this._socket.on("error",error=>{
            console.log(`出现错误${error}`);
        });


        //持续获得用户输入
        rl.on('line', (input) => {
            console.log(`[consoleInput]：${input}`);
            let [cmd,content] = input.split(":");
            if(cmd == "send"){
                server.emit("sendMsg",content);
            }
        });

    }
}

function registerSubscribe(socket:any,eventName:string):void{
    let packet:Subscribe = new Subscribe(eventName);
    socket.send(JSON.stringify(packet));
}

function unRegisterSubscribe(socket:any,eventName:string):void{
    let packet:UnSubscribe = new UnSubscribe(eventName);
    socket.send(JSON.stringify(packet));
}