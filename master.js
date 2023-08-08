const { fork } = require('child_process');
const childFile = './worker.js';
const workerNum = 8;
let completedCount = 0;
let totalCount = 0;
let startTime = 0;
let context = {
    initval : {},
    age: 4,
}
let tasks = [
    {name:'taks1', result:'', status: 'todo'},
    {name:'taks2', result:'', status: 'todo'},
    {name:'taks3', result:'', status: 'todo'},
    {name:'taks4', result:'', status: 'todo'},
    {name:'taks5', result:'', status: 'todo'},
    {name:'taks6', result:'', status: 'todo'},
    {name:'taks7', result:'', status: 'todo'},
    {name:'taks8', result:'', status: 'todo'},
    {name:'taks9', result:'', status: 'todo'},
    {name:'taks10', result:'', status: 'todo'},
    {name:'taks11', result:'', status: 'todo'},
    {name:'taks12', result:'', status: 'todo'},
    {name:'taks13', result:'', status: 'todo'},
    {name:'taks14', result:'', status: 'todo'},
    {name:'taks15', result:'', status: 'todo'},
    {name:'taks16', result:'', status: 'todo'},
    {name:'taks17', result:'', status: 'todo'},
    {name:'taks18', result:'', status: 'todo'},
    {name:'taks19', result:'', status: 'todo'},
    {name:'taks20', result:'', status: 'todo'},
    {name:'taks21', result:'', status: 'todo'},
]

//监控未捕获的worker进程错误
process.on('uncaughtException', function(e) {
    console.log(e && e.stack);
});

// 创建子进程
function forkWorker(task, tempContext) {
    // console.log('fork====')
    task.status = 'doing';
    const worker = fork(childFile);
    console.log('worker : ' + worker.pid + ' create')
    // 接收子进程数据
    worker.on("message", function({type, msg, taskName}) {
        if(type ==='result'){
            const doneTask = tasks.find((item)=>{
                return item.name === taskName;
            })
            if(doneTask){
                doneTask.result = msg;
                doneTask.status = 'done';
                // 完成一个，记录并打印进度
                completedCount++;
                console.log(completedCount)
            }

            if (completedCount >= totalCount) {
                console.log(`process: ${completedCount}/${totalCount}`);
                console.log(tasks);
                console.info(`任务完成，用时: ${Date.now() - startTime}ms`);
            }
        }
    });
    // 子进程结束事件
    worker.on('exit', function(code){
        console.log('worker id ' + this.pid + ' exit');
        const todoTask = tasks.find((item)=>{
            return item.status === 'todo';
        })
        if(todoTask){
            forkWorker(todoTask, tempContext)
        }
    })
    worker.send({task:task, context: tempContext})
}

// 创建多进程执行任务
function analysis() {
    // 记录开始时间
    startTime = Date.now();
    // 任务总数
    totalCount = tasks.length;
    // 初始化worker数目
    const formNum = totalCount > workerNum ? workerNum : totalCount;
    // 创建首批worker
    for (let i = 0; i < formNum; i++) {
        forkWorker(tasks[i], context)
    }
}

analysis()
