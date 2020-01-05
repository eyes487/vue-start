//给需要变化的元素增加一个观察者，当数据变化后执行对应的方法
class Watcher{
    constructor(vm,expr,cb){
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        //先获取旧值
        this.value = this.get();
    }
    getVal(vm,expr){//获取实例上对应的数据
        expr = expr.split('.');  //"message.a" => [message,a]
        return expr.reduce((prev,next)=>{ //vm.$data.a
            return prev[next]
        },vm.$data);
    }
    get(){
        Dep.target = this;
        let value = this.getVal(this.vm,this.expr);
        Dep.target = null;
        return value;
    }
    update(){
        let newValue = this.getVal(this.vm,this.expr);
        let oldValue = this.value;

        if(newValue != oldValue){
            this.cb(newValue)
        }
    }
}