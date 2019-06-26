#### Vue实现双向绑定简化版。参考文章:https://segmentfault.com/a/1190000006599500#articleHeader3

包括四块,Mvvm.js是双向绑定入口。创建对象都用原型模式。

## observer.js

功能:观察者;对数据(变量)进行监控,数据发生变化时会去通知注册该数据的订阅者。由于订阅者包括complie的相应内容,所以会去通知compile更新数据。
实现:利用Object.defineProperty(obj,prop,{get:function(){};set:function(){}});

## watcher.js

功能:把函数注册到变量。

## compile.js

功能:把组件编译为html页面;包括把变量转化为具体的值写入到html中,同时对转化后的html node 绑定事件;原始组件中有变量的,会去绑定一个watcher.

## mvvm.js

功能:入口。
实现:var vm = new MVVM({data: {name: 'kindeng'}}); vm.name="John"