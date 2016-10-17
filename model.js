//构建对象关系映射  ORM
//ORM是一个包装了一些数据的对象层


//Model对象用于创建新的模型和实例。自己的静态属性
var Model = {
    records: {},    //用来保存资源的对象.当保存一个实例时，将它添加到这个对象中,当删除实例时,将它从对象中删除

    inherited: function () { },
    created: function () { },


    //类添加静态属性(即对象属性)
    extend: function (obj) {
        var extended = obj.extended;
        for (var i in obj) {
            this[i] = obj[i];
        }
        //添加好对象属性后的回调
        if (extended) extended(this);
    },

    //添加实例属性
    include: function (obj) {
        var included = obj.included;
        for (var i in obj) {
            this.prototype[i] = obj[i];
        }
        //添加实例属性后的回调
        if (included) included(this);
    },

    prototype: {
        init: function () { }
    },

    //返回一个新对象,这个对象继承于Model对象，使用它来创建新模型
    create: function () {
        var object = Object.create(this);   //object包含了很多静态属性
        object.parent = this;

        //object.prototype原型继承至Model.prototype.因此通过object新建的对象可以继承至Model.prototype原型上的属性
        object.prototype = object.fn = Object.create(this.prototype);

        //新对象创建后的回调
        object.created();   //records 和 attributes 属性被清空，不会从Model上继承.

        this.inherited(object);
        return object;
    },
    //返回一个新对象,继承至Model.prototype.
    init: function () {
        var instance = Object.create(this.prototype);   //继承了init方法
        instance.parent = this;
        instance.init.apply(instance, arguments);       //调用init方法
        return instance;                                //返回这个对象,这个对象包含了从Model上继承的很多静态属性
    }
}

Math.guid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
};


//添加实例属性, 添加到prototype原型上的
Model.include({
    newRecord: true,
    create: function () {
        if(!this.id) this.id = Math.guid;
        this.newRecord = false;
        this.parent.records[this.id] = this; //在Model上保存对这个对象
    },
    destory: function () {
        delete this.parent.records[this.id];
    },
    update: function () {
        this.parent.records[this.id] = this;
    },
    save: function () {
        this.newRecord ? this.create() : this.update();
    }
});

//添加对象静态属性
Model.extend({
    find: function (id) {
        return this.records[id] || console.log("Unknown record");
    }
});


//populate方法
//向ORM中添加数据非常简单，只需要从服务器抓取数据并更新模型的记录即可。
//populate方法会对给定的值做遍历,创建实例并更新records对象
Model.extend({
    populate: function(values) {
        //重置model和records
        this.records = {};
        
        for(var i = 0; i < values.length; i++) {
            var record = this.init(values[i]);
            record.newRecord = false;
            this.records[record.id] = record;
        }
    }
});

//每当一个新的模型被创建后, records属性和attributes属性被清空
Model.extend({
    created: function() {
        this.records = {};  //初始化records
        this.attributes = [];   //初始化attributes
    }
});

//给Model对象增加一个attributes数组,每个模型上可以用它来定位它们的属性:
Model.include({
    attributes: function() {
        var result = {};
        for(var i in this.parent.attributes) {
            var attr = this.parent.attributes[i];
            result[i] = attr;
        }
        return result;
    }
});



var Asset = Model.create();     //Asset上面保存了Model的静态方法
var User = Model.create();

$.getJSON('/assets', function(results) {
    Asset.populate(results);
})


var asset = Asset.init();
asset.name = 'name, name';
asset.id = 1;
asset.save();


Model.find(1);

//一般地，应用启动时装载的往往是数据的子集,更多的数据则是在交互发生时装载的.

//OAuth(开放认证)是允许从桌面和网络应用以简单标准的方法进行安全 API 认证的开放协议。


