//构建对象关系映射  ORM
//ORM是一个包装了一些数据的对象层


//Model对象用于创建新的模型和实例
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
        object.created();

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


//添加实例属性, 添加到prototype原型上的
Model.include({
    newRecord: true,
    create: function () {
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

var Asset = Model.create();     //Asset上面保存了Model的静态方法
var User = Model.create();


var asset = Asset.init();
asset.name = 'name, name';
asset.id = 1;
asset.save();

