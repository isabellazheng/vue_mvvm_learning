#### Vue实现双向绑定简化版。参考文章:https://segmentfault.com/a/1190000006599500#articleHeader3

包括四块,Mvvm.js是双向绑定入口。创建对象都用原型模式。

## observer.js

功能:观察者;对数据(变量)进行监控,数据发生变化时会去通知注册该数据的订阅者。由于订阅者包括complie的相应内容,所以会去通知compile更新数据;每个变量都初始化下自己的依赖.
实现:利用Object.defineProperty(obj,prop,{get:function(){};set:function(){}});

## watcher.js

功能:把函数注册到变量;变量改变会通知watcher,让它去操作注册过的东西(一般是函数,callback);watcher则是通过dep起作用

## compile.js

功能:把组件编译为html页面;包括把变量转化为具体的值写入到html中,同时对转化后的html node 绑定事件;原始组件中有变量的,会去绑定一个watcher.

## mvvm.js

功能:入口。
实现:var vm = new MVVM({data: {name: 'kindeng'}}); vm.name="John"

## observer.js Vs watcher.js

每个data下的属性,以data:{content:'JJ'}为例,有自己唯一的一个dep,这个dep下有个subs数组,这个数组存的是注册在这个属性下的watchers;属性变化的时候,会去通知dep,dep去通知watchers去更新自己;
每个watcher利用get content,去注册自己到content下dep的subs中。在注册的时候会通过自己的depIds属性和dep.id对比,判断自己是不是已经在dep下注册过;没有注册过,就加dep.id到自己的depids,然后在dep的subs加入watcher.