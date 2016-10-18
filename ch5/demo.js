(function(window) {
    var User = function(name) {
        this.name = name;
    };
    
    User.records = [];
    
    //绑定事件及回调函数
    User.bind = function(ev, callback) {
        var calls = this._callback || (this._callback = []);
        (this._callback[ev] || (this._callback[ev] = [])).push(callback);
    };
    
    User.trigger = function(ev) {
        var list, calls, i, l;
        //TODO 学习下这种变量定义及if的书写方式
        if(!(calls = this._callback)) return this;
        if(!(list = this._callback[ev])) return this;
        //顺序调用
        jQuery.each(list, function() {
            this();
        });
    };
    
    User.create = function(name) {
        User.records.push(new User(name));
        this.trigger('change');
    };
    
    jQuery(function($) {
        User.bind('change', function() {
            var template = $('#userTmpl').tmpl(User.records);
            
            $('#users').empty();
            $('#users').append(template);
        });
    });
})(window);