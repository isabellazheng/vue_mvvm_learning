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
        Object.defineProperty(obj,key,{
            get:function(){
                return val;
            },
            set:function(newVal){
                var oldVal=val;
                if(oldVal!=newVal){
                    console.log('新的'+key+':'+newVal)
                    val=newVal;
                    //通知订阅者
                }
            }
        })

}
