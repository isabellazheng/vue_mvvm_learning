function Watcher(vm,exp,cb){
    this.cb=cb;
    this.vm=vm
    this.getter=this.parseGetter(exp);
    this.depIds = {};//{depid1,dep1}
    this.get()//这里的get是为了读取下data下属性content的值,从而注册watcher(即watcher.addDep(dep))
}
Watcher.prototype={
    update:function(){
        this.run()
    },
    run:function(){
        //运行callback
        var nowVal=this.get()
        var oldVal=this.val;
        if(nowVal!=oldVal){
            this.val=nowVal;
            this.cb.call(this.vm,oldVal,nowVal);
        }
    },
   get:function(){
       Dep.target=this
       var val=this.getter.call(this.vm,this.vm);//获取下content下的dep
       Dep.target=null
       return val
   },
    parseGetter:function(exp){
        return function(obj) {//传入vm
            obj = obj.data[exp];
            return obj;
        }
    },
   addDep:function(dep){
       //需要去判断这个watcher是不是已经被添加了。通过它的depIds搜索depid判断。没有添加的话,1.在dep.subs里addSubs(thiswatcher);2.在watcher里添加depIds。
       if(!this.depIds.hasOwnProperty(dep.id)){
           dep.addSub(this)
           this.depIds[dep.id]=dep
       }
   }

}

//watcher实例里的depIds,保存着watcher实例注册过的所有的dep的id.目前depIds仅仅为了查看watcher是否注册过。