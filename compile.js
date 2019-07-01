//1.node转化为fragment.其实就是创建整块的虚拟文档碎片,最后把整块的虚拟文档碎片(包括子节点)都加入到node中。特性:如果使用appendChid方法将原dom树中的节点添加到DocumentFragment中时，会删除原来的节点。
//2.node上要是有数据,注册watcher到node上,会有个update
function Compile(el,vm){
    this.$el=el
    this.$vm=vm
    this.$fragment=this.node2Fragment(this.$el)
    this.init();
    this.$el.appendChild(this.$fragment);
}
Compile.prototype ={
    node2Fragment:function(el){
        var frag=document.createDocumentFragment();
        while(child=el.firstChild){
            frag.appendChild(child)

        }
        return frag
    },
    init:function(){
        this.compileElement(this.$fragment);
    },
    compileElement:function(el){
        var childNodes=el.childNodes;
        var text = el.textContent;
        var reg = /\{\{(.*)\}\}/;
        me=this;
        [].slice.call(childNodes).forEach(function(node){
            if(node.nodeType==1){
                me.compile(node)
            } else if(node.nodeType==3){//匹配下{{}},有的话编译
               var istextpass=reg.exec(text)
                if(istextpass){
                    me.compileText(node, RegExp.$1.trim());
                }

            }
        })
    },
    compile:function(node){
        //只考虑普通指令,即v-bind,v-model,v-html不考虑v-on事件指令
        var attrs=node.attributes;
        var me=this;
        [].slice.call(attrs).forEach(function(attr){
            var attr_name=attr.name;
            var exp=attr.value;
            var dir=attr_name.substring(2)
            if(!me.isDirective(attr_name))
                return
            if(me.isEventDirective(dir)){
                return
            }else{
                compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
            }
            node.removeAttribute(attr_name);
        })
    },
    compileText:function(node,exp){
        compileUtil.text(node, this.$vm, exp);
    },
    isDirective: function(attr) {// 普通vue指令
        return attr.indexOf('v-') == 0;
    },
    isEventDirective: function(attr) {//判断是否事件指令
        return attr.indexOf('on') == 0;
    },

}
var compileUtil={
    text:function(node,vm,exp){
        var me=this
        console.log(node,node.textContent)
        me.bind(node, vm, exp, 'text');
    },
    model:function(node,vm,exp){
        var me=this;
        val = this._getVMVal(vm, exp);
        node.addEventListener('input',function(e){
            var inputvalue=e.target.value;
            if(val!=inputvalue){
                me._setVMVal(vm, exp,inputvalue)
                val=inputvalue
            }
        })
        me.bind(node, vm, exp, 'model');
    },
    bind:function(node,vm,exp,dir){
        updaterFn=update[dir+'Updater']
        updaterFn && updaterFn(node, this._getVMVal(vm, exp));//初始化数据
       new Watcher(vm,exp,function(oldval,newval){
           updaterFn && updaterFn(node, newval);
       })
    },
    _getVMVal: function(vm, exp) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function(k) {
            val = val[k];
        });
        return val;
    },
    _setVMVal: function(vm, exp,newVal) {
        var val = vm.data;
        exp = exp.split('.');
        exp.forEach(function(k,i) {
            if(i<exp.length-1){
                val = val[k];
            }else{
                val[k]=newVal;
            }

        });
    },

}
var update={
    textUpdater:function(node,value){//单纯更新dom数据
        node.textContent = typeof value == 'undefined' ? '' : value;

    },
    modelUpdater:function(node,value){
        node.value = typeof value == 'undefined' ? '' : value;
    }
}