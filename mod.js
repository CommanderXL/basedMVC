(function($, exports) {
    var mod = function(includes) {
        if(includes) this.include(includes);
    };
    
    mod.fn = mod.prototype;
    
    mod.fn.proxy = function(func) {
        return $.proxy(func, this);
    };
    
    mod.fn.load = function(func) {
        $(this.proxy(func));    //$(function() {})  jquery初始化操作
    };
    
    //添加属性
    mod.fn.include = function(ob) {
        $.extend(this, ob);
    }
    //向外暴露Controller属性
    exports.Controller = mod;
})(jQuery, window);


(function($, Controller) {
    var mod = new Controller();
    
    mod.toggleClass = function(e) {
        this.view.toggleClass('over', e.data);
    }
    
    mod.load(function() {
        this.view = $("#view");
        this.view.mouseover(this.proxy(this.toggleClass), true);
        this.view.mouseout(this.proxy(this.toggleClass), false);
    });
})(jQuery, Controller);