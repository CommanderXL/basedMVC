var Class = function(parent) {
    var kclass = function() {
        this.init.apply(this, arguments);
    }
    
    //改变kclass的原型
    if(parent) {
        var subclass = function() {};
        subclass.prototype = parent.prototype;
        kclass.prototype = new subclass();
    }


    kclass.prototype.init = function() {
        
    }
    
    //定义prototype的别名
    kclass.fn = kclass.prototype;
    
    //定义类的别名
    kclass.fn.parent = kclass;
    
    kclass._super = kclass.__proto__;
    
    //给类添加属性.  静态属性 
    kclass.extend = function(obj) {
        var extended = obj.extended;
        for(var i in obj) {
            kclass[i] = obj[i];
        }
        //这里的实现支持extended的回调，将属性传入对象后就会触发这个回调
        if(extended) extended(kclass);
    }
    
    //给实例添加属性.  原型上添加属性
    kclass.include = function(obj) {            
        var included = obj.included;
        for(var i in obj) {
            kclass.fn[i] = obj[i];
        }
        //这里的实现支持included的回调,将属性传入对象后就会触发这个回调
        if(included) included(kclass);
    }
    
    return kclass;
}

var Person = new Class();

Person.prototype.init = function() {
    //基于Person的实例做初始化
}

var person = new Person();



var PubSub = {
    //事件订阅
    subscribe: function(ev, callback) {
        var calls = this._callbacks || (this._callbacks = {});
        (this._callbacks[ev] || (this._callbacks[ev] = [])).push(callback);
        return this;
    },
    publish: function() {
        var args = [].slice.call(arguments);
        
        var ev = args.shift();
        
        var list, calls, i, l;
        if(!(calls = this._callbacks)) return this;
        if(!(list = this._callbacks[ev])) return this;
        
        
        for(i = 0, l = list.length; i < l; i++) {
            list[i].apply(this, args);
        }
        return this;
    }
}