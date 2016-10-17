var exports = this;

(function($) {
    var mod = {};
    
    mod.create = function(includes) {
        var result = function() {
            this.init.apply(this, arguments);
        }
        
        result.fn = result.prototype;   //重新设置原型
        //控制器初始化 new 操作符事实上是调用的这个函数
        result.fn.init = function() {}
        
        result.proxy = function(func) {return $.proxy(func, this)};
        result.fn.proxy = result.proxy;
        
        result.include = function(ob) {$.extend(this.fn, ob);};
        result.extend = function(ob) {$.extend(this, ob)}
        
        if(includes) result.include(includes);
        
        return result;  //返回一个构造函数
    }
    
    exports.Controller = mod;
})(jQuery);


jQuery(function() {
    //现在prototype上添加属性
    var ToggleView = Controller.create({
        init: function(view) {
            this.view = $(view);
            this.view.mouseover(this.proxy(this.toggleClass), true);
            this.view.mouseout(this.proxy(this.toggleClass), false);
        },
        
        toggleClass: function(e) {
            this.view.toggleClass('over', e.data);
        }
    });
    
    //实例化控制器,调用init函数
    new ToggleView('#view');
});


//一种常见的模式就是一个视图对应一个控制器.
//视图包含一个ID.因此可以很容易地传入控制器,然后在视图之中的元素则使用class而不是ID。因此和其他视图中的元素不会产生冲突

//这个地方我的理解是传入一个DOM wrapper的。html的渲染都放到这个DOM wrapper里面
jQuery(function() {
    exports.SearchView = Controller.create({
        elements: {
            'input[type=search]': 'searchInput',
            'form': 'searchForm'
        },
        
        init: function(element) {
            this.el = $(element);
            this.refreshElements();
            this.searchForm.submit(this.proxy(this.search));
        },
        
        search: function() {
            console.log('Searching:', this.searchInput.val());
        },
        
        //私有
        $: function(selector) {
            //传入DOM Wrapper选择器,同时传入选择器
            return $(selector, this.el);
        },
        
        //设置本地变量
        //refreshElements希望每个控制器都包含当前的元素属性el, el由选择器决定。即new SearchView()传入的属性
        //这样就会设置控制器的this.searchForm 和 this.searchInput属性,随后就能进行绑定事件等DOM操作了
        refreshElements: function() {
            for(var key in elements) {
                this[this.elements[key]] = this.$(key);
            }
        }
    });
    
    new SeachView('#users');
});