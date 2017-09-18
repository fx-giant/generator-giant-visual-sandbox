function namespace(path){
    var splits = path.split(".");
    var current = window;
    for (var i = 0; i < splits.length; i++){
        var name = splits[i];
        if (!(name in current))
            current[name] = {};
        current = current[name];
    }
    return current;
};