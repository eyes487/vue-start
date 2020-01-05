class Compile{
    constructor(el,vm){
        this.el = this.isElementNode(el)?el:document.querySelector(el);
        this.vm = vm;

        if(this.el){
            //开始编译
            //1.先把真是dom移入内存中Fragment（性能）
            let fragment = this.node2Fragment(this.el);
            //2.编译 =》提取想要的元素节点 v-model和文本节点{{}}
            this.compile(fragment)
            //把编译后的Fragment移回页面
            this.el.appendChild(fragment)
        }
    }

    /**
     * 
     * @param {辅助方法} node 
     */
    //判断是否是元素节点
    isElementNode(node){
        return node.nodeType === 1;
    }
    //是不是指令
    isDirective(name){
        return name.includes('v-')
    }

    /**
     * 核心方法
     * @param {*} el 
     */
    compileElement(node){
        //带v-model
        let attrs = node.attributes;//取出当前节点属性
        Array.from(attrs).forEach(attr=>{
            //判断属性名字是否包含v-
            let attrName = attr.name;
            if(this.isDirective(attrName)){
                //取到对应的值放到节点中
                let expr = attr.value;
                let [,type] = attrName.split('-');
       
                //node this.vm.$data 
                CompileUtil[type](node,this.vm,expr)
            }
        })
    }
    compileText(node){
        //带{{}}
        let expr = node.textContent; //取文本中的内容
        let reg = /\{\{([^}]+)\}\}/g;
        if(reg.test(expr)){
            //node this.vm.$data text
            CompileUtil['text'](node,this.vm,expr)
        }

    }

    compile(fragment){
        let childNodes = fragment.childNodes;
        Array.from(childNodes).forEach(node=>{
            if(this.isElementNode(node)){
                //是元素节点,编辑元素
                this.compileElement(node);
                //元素节点中可能还有节点
                this.compile(node)
            }else{
                //文本节点,编译节点
               this.compileText(node);
            }
        })
    }
    node2Fragment(el){
        let fragment = document.createDocumentFragment();
        let firstChild;
        while(firstChild = el.firstChild){
            fragment.appendChild(firstChild);
        }

        return fragment;
    }
}

CompileUtil ={
    getVal(vm,expr){//获取实例上对应的数据
        expr = expr.split('.');  //"message.a" => [message,a]
        return expr.reduce((prev,next)=>{ //vm.$data.a
            return prev[next]
        },vm.$data);
    },
    setVal(vm,expr,value){
        expr = expr.split('.');
        //收敛
        return expr.reduce((prev,next,currentIndex)=>{
            if(currentIndex === expr.length -1){
                return prev[next] = value;
            }
            return prev[next]
        },vm.$data)
    },
    getTextVal(vm,expr){
        return expr.replace(/\{\{([^}]+)\}\}/g,(...arguements)=>{
            return this.getVal(vm,arguements[1])
        })
    },
    text(node,vm,expr){ //文本处理
        let updateFn = this.updater['textUpdater'];
        expr.replace(/\{\{([^}]+)\}\}/g,(...arguements)=>{
            new Watcher(vm,arguements[1],newValue=>{
                //如果数据变化了，文本节点需要重新获取依赖的属性更新文本中的内容
                updateFn && updateFn(node,this.getTextVal(vm,expr))
            })
        })
        updateFn && updateFn(node,this.getTextVal(vm,expr))
    },
    model(node,vm,expr){ //输入框处理
        let updateFn = this.updater['modelUpdater'];
        //这里加一个监控，数据变化了。应该调用这个watch的cb
        new Watcher(vm,expr,newValue=>{
            updateFn && updateFn(node,this.getVal(vm,expr))
        })
        node.addEventListener('input',(e)=>{
            let newValue = e.target.value;
            this.setVal(vm,expr,newValue)
        })
        updateFn && updateFn(node,this.getVal(vm,expr))
    },
    updater:{
        //文本更新
        textUpdater(node,value){
            node.textContent = value;
        },
        //输入框更新
        modelUpdater(node,value){
            node.value = value;
        }
    }
}