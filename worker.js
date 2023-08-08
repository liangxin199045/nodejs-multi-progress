//监控未捕获的worker进程错误
process.on('uncaughtException', function(e) {
    console.log(e && e.stack);
});
// 接收主线程发送过来的任务
process.on("message", ({task, context}) => {
    // 结束后通知主线程
    try{
        const n = Math.random()*10 + context.age;
        setTimeout(()=>{
            console.log(process.pid + ' deal done !!!' + 'taskName: ' + task.name)
            process.send({type: 'result', msg: n*1000, taskName: task.name});
            process.kill(process.pid);
        }, n*1000)    
    }catch(e){
        process.send({type: 'result', msg:e.message, taskName: task.name});
        process.kill(process.pid);
    }
});