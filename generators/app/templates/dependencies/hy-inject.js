var HY = (function () {
	var HY = {};
	HY.version = "0.2.0";

	HY.settings = {

	};

	HY.__object_injector__ = function (target, namespace) {
		for (var i in namespace) {
			if (typeof (namespace[i]) == "function" && !i.startsWith("_"))
				target[i] = (function (scopeFunction) {
					return function () {
						var parameters = [this];
						for (var i = 0; i < arguments.length; i++) {
							parameters.push(arguments[i]);
						}
						return scopeFunction.apply(this, parameters);
					}
				})(namespace[i])
		}
	};
	HY.__injector__ = function (target, namespace) {
		for (var i in namespace) {
			if (typeof (namespace[i]) == "function" && !i.startsWith("_"))
				target[i] = (function (scopeFunction) {
					return scopeFunction;
				})(namespace[i]);
		}
	}

	HY.inject = function () {
		for (var i in HY) {
			if (typeof (HY[i]) == "object" && "__injector__" in HY[i])
				HY[i].__injector__();
		}
	}
	return HY;
})();
(function (HY) {

	var HYA = HY.Array = HY.Array || {};

	HYA.__injector__ = function () {
		HY.__object_injector__(Array.prototype, HYA);
	}
	return HY;
})(HY);
(function (HY) {

	var HYC = HY.Class = HY.Class || {};


	HYC.__injector__ = function () {
		HY.__object_injector__(HY.globalScope, HYC);
	}
	return HY;
})(HY);
(function (HY) {

    var HYC = HY.Color = HY.Color || {};

    return HY;
})(HY);
(function (HY) {

	var HYM = HY.Math = HY.Math || {};

	HYM.__injector__ = function () {
		HY.__injector__(Math, HYM);
	}
	return HY;
})(HY);
(function (HY) {

    var HYN = HY.Number = HY.Number || {};

})(HY);
(function (HY) {


	var HYO = HY.Object = HY.Object || {};

	HYO.__injector__ = function () {
		HY.__object_injector__(Object.prototype, HYO);
	}
	return HY;
})(HY);
(function (HY) {


	var HYS = HY.String = HY.String || {};

	HYS.__injector__ = function () {
		HY.__object_injector__(String.prototype, HYS);
	}
	return HY;
})(HY);
(function (HY) {


	var HYU = HY.Utility = HY.Utility || {};


	HYU.__injector__ = function () {
		HY.__injector__(HY.globalScope, HYU);
	}
	return HY;
})(HY);
var HY = (function (HY) {
    //loop from the end until the start
    HY.Array.eachFromEnd = function (arr, callback) {
        for (var i = arr.length - 1; i >= 0; i--)
            callback(arr[i]);
    };
    return HY;
})(HY);
var HY = (function(HY) {
    //loop from the start until the end
    HY.Array.eachFromStart = function(arr, callback) {
        for (var i = 0; i < arr.length; i++)
            callback(arr[i]);
    };
    return HY;
})(HY);

var HY = (function(HY) {
    //reverse array content
    HY.Array.reverse = function(arr) {
        var result = [];
        for (var i = arr.length - 1; i >= 0; i--) {
            result.push(arr[i]);
        }
        return result;
    };
    return HY;
})(HY);
var HY = (function(HY) {
    //remove duplicated values
    HY.Array.unique = function(arr) {
        var result = [];
        for (var i = 0; i < arr.length; i++) {
            if (result.indexOf(arr[i]) == -1)
                result.push(arr[i]);
        }
        return result;
    };
    return HY;
})(HY);
var HY = (function (HY) {
    function Pipeline() {
        var args = arguments;
        return (function (args) {
            var pipeline = {
                state: "waiting",
                context: {},
                processQueue: [],
                lastProcessIndex: 0,
                then: function () {
                    var nextProcess = arguments;
                    for (var i in nextProcess)
                        addProcess(nextProcess[i]);
                    executeProcessQueue();
                    return this;
                },
                restart: function () {
                    restartPipeline();
                }
            }

            for (var i in args)
                addProcess(args[i]);

            restartPipeline();
            return pipeline;

            function addProcess(process) {
                if (process) {
                    pipeline.processQueue.push(process);
                }
            }

            function restartPipeline() {
                pipeline.lastProcessIndex = 0;
                pipeline.state = "ready";
                executeProcessQueue();
            }

            function nextCaller() {
                pipeline.state = "ready";
                pipeline.lastProcessIndex++;
                executeProcessQueue();
            }
            //callback structure is function(args,context,next)

            function executeProcessQueue() {
                if (pipeline.state == "ready" && pipeline.lastProcessIndex < pipeline.processQueue.length) {
                    var callback = pipeline.processQueue[pipeline.lastProcessIndex];
                    pipeline.state == "executing";
                    callback(pipeline.context, nextCaller, failed);
                }
            }

            function failed() {
                pipeline.state = "failed";
            }
        })(args);
    }
    HY.Class.Pipeline = Pipeline;
    return HY;
    /*
        var pipeline = Pipeline(f1,f2,f3);
        var pipeline.then(f4);
        var pipeline.then(f5,f6)

        var f1 = f2 = f3 = f4 = f5 = f6 = function(context, next){
            context.value = context.value + 1 || 0;
            console.log(context.value);
            next();
        }
    */
})(HY);
var HY = (function (HY) {

	function Synchronization() {
		var args = arguments;
		return (function (args) {

			var syncronization = {
				processes: [],
				onDone: [],
				context: {},
				remainingProcess: 0,

				addProcess: addProcess,
				restart: restart,
				done: done,
			}
			var processes = syncronization.processes;
			var onDone = syncronization.onDone;
			var context = syncronization.context;

			for (var i in args)
				addProcess(args[i]);
			restart();

			function addProcess(process) {
				if (typeof (process) == "function") {
					processes.push(process);

				}
			}


			function executeAll() {
				for (var i in processes) {
					execute(processes[i]);
				}
			}

			function execute(process) {
				process(context, finished)
			}

			function finished() {
				syncronization.remainingProcess--;
				checkStates();
			}

			function checkStates() {
				if (syncronization.remainingProcess == 0)
					allProcessFinished();
			}

			function allProcessFinished() {
				for (var i in onDone) {
					onDone[i](context);
				}
			}

			function restart() {
				syncronization.remainingProcess = processes.length;
				executeAll();
			}

			function done() {
				var callbacks = arguments;
				for (var i in callbacks) {
					if (typeof (callbacks[i]) == "function") {
						if (syncronization.remainingProcess == 0)
							callbacks[i](context);
						onDone.push(callbacks[i]);
					}
				}
				return syncronization;
			}

			return syncronization;
		})(args);

	};
	HY.Class.Synchronization = Synchronization;
	return HY;

	/*
	var synchronization = Synchronization(s1,s2,s3,s4);
	synchronization.done(done1,done2,done3);

	var s1 = s2 = s3 = s4 = function(context,next){
		context.value = context.value + 1 || 0;
		next();
	}

	var done1 = done2 = done3 = function(context){
		console.log(context.value);
	}
	*/
})(HY);
(function (HY) {

    HY.Color.nameToHex = function (value) {
        var colors = {
            "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
            "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
            "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
            "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
            "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
            "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
            "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
            "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
            "honeydew": "#f0fff0", "hotpink": "#ff69b4",
            "indianred ": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
            "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
            "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
            "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
            "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
            "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
            "navajowhite": "#ffdead", "navy": "#000080",
            "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
            "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080",
            "rebeccapurple": "#663399", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
            "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
            "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
            "violet": "#ee82ee",
            "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
            "yellow": "#ffff00", "yellowgreen": "#9acd32"
        };

        if (typeof colors[value.toLowerCase()] != 'undefined')
            return colors[value.toLowerCase()];

        return false;
    };
    return HY;
})(HY);
(function (HY) {

    HY.Color.shiftHexadecimal = function (color, value) {
        var length = color.length;
        if (length != 4 && length != 7)
            return null;
        var width = parseInt(length / 3);
        var result = "#";
        var maxValue = 1;
        for (var i = 0; i < width; i++)
            maxValue *= 16;
        for (var i = 0; i < 3; i++) {
            var channelCode = color.substring(i * width + 1, (i + 1) * width + 1);
            var channelValue = parseInt(channelCode, 16);
            var shiftedValue = channelValue * (1 + value);
            if (shiftedValue >= maxValue)
                shiftedValue = maxValue - 1;
            if (shiftedValue < 0)
                shiftedValue = 0;
            shiftedValue = parseInt(shiftedValue);
            result += shiftedValue.toString(16);
        }
        return result;
    };
    return HY;
})(HY);
(function (HY) {

    HY.Color.shiftRGB = function (color, value) {

    };
    return HY;
})(HY);
(function (HY) {

    HY.Color.shiftRGBA = function (color, value) {

    };
    return HY;
})(HY);
var HY = (function(HY) {

    HY.Math.scale = function(value, min, max) {
        return (value + min) / (min + max);
    };
    return HY;
})(HY);
var HY = (function(HY) {

    HY.Math.valueRange = function(value, min, max, ranges) {
        var scaledValue = HY.Math.scale(value, min, max);
        for (var i = 0; i < ranges.length; i++)
            if (ranges[i].from <= scaledValue && ranges[i].to >= scaledValue)
                return ranges[i].value;
        return null;
    };
    return HY;
})(HY);
var HY = (function (HY) {

	HY.Math.valueRangeScale = function (value, ranges) {
		for (var i = 0; i < ranges.length; i++)
			if (ranges[i].from <= value && ranges[i].to >= value)
				return ranges[i].value;
		return null;
	};
	return HY;
})(HY);
(function (HY) {

    HY.Object.convertKeys = function (object, keyProcessor) {
        var newO, origKey, newKey, value
        if (o instanceof Array) {
            newO = []
            for (origKey in o) {
                value = o[origKey]
                if (typeof value === "object") {
                    value = toCamel(value)
                }
                newO.push(value)
            }
        } else {
            newO = {}
            for (origKey in o) {
                if (o.hasOwnProperty(origKey)) {
                    newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
                    value = o[origKey]
                    if (value !== null && value.constructor === Object || value.constructor == Array) {
                        value = toCamel(value)
                    }
                    newO[newKey] = value
                }
            }
        }
        return newO;
    };
    return HY;
})(HY);
var HY = (function(HY) {

    HY.Object.get = function(object, stringQuery) {
        var segments = stringQuery.split(".");
        var result = object;
        for (var i = 0; i < segments.length && result; i++) {
            result = result[segments[i]];
        }
        return result;
    };
    return HY;
})(HY);
var HY = (function (HY) {

	HY.String.format = function () {
		var result = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			var reg = new RegExp("\\{" + (i - 1) + "\\}", "g");
			result = result.replace(reg, arguments[i]);
		};
		return result;
	};
	return HY;
})(HY);
var HY = (function (HY) {

	HY.String.render = function (string, properties, options) {
		function convertReccursive(data) {
			var result = {};

			function reccursiveCrawler(data, name) {
				if (typeof (data) != "object" || Object.keys(data).length == 0)
					result[name] = data;
				else
					for (var i in data)
						reccursiveCrawler(data[i], name == "" ? i : name + "." + i);
			}
			reccursiveCrawler(data, "");
			return result;
		}
		var result = string;
		var replace = [];
		var options = options || {};
		var prefix = options.prefix || "";
		var postfix = options.postfix || "";
		var buffer = convertReccursive(properties);
		if (options.only) {
			replace = options.only;
		} else {
			for (i in buffer)
				replace.push(i);
		}
		var except = options.except || [];
		for (var i = 0; i < except.length; i++) {
			var index = replace.indexOf(except[i]);
			if (index != -1)
				replace.splice(index, 1);

		}
		for (i in replace) {
			var name = replace[i];
			var reg = new RegExp("\\{\\{" + prefix + name + postfix + "\\}\\}", "g");
			var replacement = "";
			switch (typeof buffer[name]) {
				case "string":
					replacement = buffer[name];
					break;
				case "function":
					replacement = buffer[name]();
					break;
				default:
					break;
			}
			if (!isNaN(buffer[name]))
				replacement = buffer[name];
			result = result.replace(reg, replacement);
		}
		if (options.remove_rest) {
			var reg = new RegExp("{.*}", "g");
			result = result.replace(reg, "");
		}
		return result;
	};
	return HY;
})(HY);

var HY = (function (HY) {

	HY.String.replaceAll = function (string, find, replace) {
		var reg = new RegExp(find, "g");
		return string.replace(reg, replace);
	};
	return HY;
})(HY);
var HY = (function (HY) {

	HY.Utility.addCSS = function (selector, rule) {
		var stylesheet = document.styleSheets[0];

		if (stylesheet.insertRule) {
			stylesheet.insertRule(selector + rule, stylesheet.cssRules.length);
		} else if (stylesheet.addRule) {
			stylesheet.addRule(selector, rule, -1);
		}
	};
	return HY;
})(HY);
(function (HY) {

    /*compare multiple objects 
     */
    HY.Utility.compare = function (objects) {
        var result = {};
        var length = objects.length;

        //prepare to init with undefined values
        //"set the value for column $name row $key with value of $value, if not $key not exists, then make new one with default of each name as undefined"
        var setDefaultIfNotExists = function (parameter) {
            if (parameter in result)
                return;
            var value = [];
            for (var i = 0; i < length; i++)
                value[i] = undefined;
            result[parameter] = value;
        }

        for (var i = 0; i < length; i++) {
            values = objects[i];
            for (var key in values) {
                setDefaultIfNotExists(key);
                result[key][i] = values[key]
            }
        }

        result._difference = {};
        for (var i in result) {
            var same = true;
            for (var j = 0; j < result[i].length - 1; j++) {
                same = same && result[i][j] == result[i][j + 1]
            }
            if (!same)
                result._difference[i] = result[i];
        }

        return result;
    };
    return HY;
})(HY);
(function (HY) {

	HY.Utility.copy = function (object) {
		return JSON.parse(JSON.stringify(object));
	};
	return HY;
})(HY);
(function (HY) {

	HY.Utility.guid = function () {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		};
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	};
	return HY;
})(HY);
(function (HY) {
    //loop trough the handler list;
    HY.Utility.handle = function (value, handlers, options) {
        var options = options || {};

        var ascending = options.ascending;

        //defautl is descending
        var increment = 1;
        start = handlers.length - 1;
        end = 0;
        //swap if ascending
        if (ascending) {
            increment = -1;
            start = [end, end = start][0];
        }


        var result = null;
        for (var i = start; start != end && !result; i += increment)
            result = handlers[i](value);
        return result;
    };
    return HY;
})(HY);
(function (HY) {

	HY.Utility.isSame = function (left, right) {
		function reccursiveSame(left, right) {
			leftType = typeof (left) == "object";
			rightType = typeof (right) == "object";
			if (leftType && rightType) {
				var result = true;
				if (Object.keys(left).length != Object.keys(right).length)
					return false;
				for (var i in left) {
					result = result && reccursiveSame(left[i], right[i]);
				}
				return result;
			} else
				return left == right
		}
		return reccursiveSame(left, right);
	};
	return HY;
})(HY);
(function (HY) {

    HY.Utility.LoadCSS = function (url) {
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", url)
    };
    return HY;
})(HY);
(function (HY) {

    HY.Utility.LoadJS = function (url, callback) {
        callback = callback || function () {};
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", url);
        fileref.onload = callback;
        document.head.appendChild(fileref);
    };;
    return HY;
})(HY);
(function (HY) {

	HY.Utility.namespace = function (name) {
		var segments = name.split(".");
		var result = window[segments[0]] = window[segments[0]] || {};
		for (var i = 1; i < segments.length; i++) {
			if (!(segments[i] in result))
				result[segments[i]] = {};
			result = result[segments[i]];
		}
		return result;
	};
	return HY;
})(HY);
(function (HY) {

    /*compare multiple objects 
     */
    HY.Utility.queryStrings = function (query) {
        if (query)
            return createQueryString(query);
        else
            return getQueryString();
    };

    function createQueryStrings(query) {
        var result = "";
        var first = true;
        for (var name in query) {
            if (first)
                first = !first;
            else
                result += "&";
            result += name + "=" + query[name];
        }
        return result;
    }

    function getQueryStrings() {

        var url = document.location;
        var queryString = url.search.substring(1);
        if (queryString == "")
            return {};
        var queries = queryString.split("&");
        var result = {};
        for (var i = 0; i < queries.length; i++) {
            var splitting = queries[i].split("=");
            var name = splitting[0];
            var value = splitting[1];
            result[name] = value;
        }
        return result;
    }
    return HY;
})(HY);
(function (HY) {

    HY.Utility.swap = function (left, right) {
        right = [left, left = right][0];
    };
    return HY;
})(HY);
(function (HY) {
	HY.globalScope = window;
})(HY);
(function (HY) {
	HY.inject();
})(HY);