function observer(obj){
    if (typeof obj !== 'object') {
        return;
    }
    Object.keys(obj).forEach(function(val){
        defineReactive(obj,val,obj[val])
    })
}

function defineReactive(obj,key,val){
        observer(val);
        var dep=new Dep();
        Object.defineProperty(obj,key,{
            get:function(){
                //注册watcher.
                if (Dep.target) {
                    dep.depend(); //一个属性,如name拥有一个唯一的dep,每个dep有自己的唯一一个id,Object.defineProperty里面的一直引用着自己的dep;这里用到了闭包的性质。
                }
                return val;
            },
            set:function(newVal){
                var oldVal=val;
                if(oldVal!=newVal){
                    console.log('新的'+key+':'+newVal)
                    val=newVal;
                    //通知订阅者
                    dep.notify();
                }
            }
        })

}
Dep.target=null

depid=0;//全局变量,控制dep的id.
//subs是注册的watcher列表
function Dep(){
    this.subs=[]
    this.id=depid++
}
Dep.prototype={
    addSub: function(watcher) {
        this.subs.push(watcher);
    },
    depend:function(){
        Dep.target.addDep(this);//此时this就是dep
    },
    notify:function(){
        //通知自己下辖的watchers去更新自己。
        this.subs.forEach(function(item,key){
            item.update();
        })
    }
}
