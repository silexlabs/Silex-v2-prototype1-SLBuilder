var $_, $hxClasses = $hxClasses || {}, $estr = function() { return js.Boot.__string_rec(this,''); }
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	r: null
	,match: function(s) {
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.add(this.matchedLeft());
			buf.add(f(this));
			s = this.matchedRight();
		}
		buf.b[buf.b.length] = s == null?"null":s;
		return buf.b.join("");
	}
	,__class__: EReg
}
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	h: null
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return a.iterator();
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,toString: function() {
		var s = new StringBuf();
		s.b[s.b.length] = "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b[s.b.length] = i == null?"null":i;
			s.b[s.b.length] = " => ";
			s.add(Std.string(this.get(i)));
			if(it.hasNext()) s.b[s.b.length] = ", ";
		}
		s.b[s.b.length] = "}";
		return s.b.join("");
	}
	,__class__: Hash
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	min: null
	,max: null
	,hasNext: function() {
		return this.min < this.max;
	}
	,next: function() {
		return this.min++;
	}
	,__class__: IntIter
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	h: null
	,q: null
	,length: null
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b[s.b.length] = "{";
		while(l != null) {
			if(first) first = false; else s.b[s.b.length] = ", ";
			s.add(Std.string(l[0]));
			l = l[1];
		}
		s.b[s.b.length] = "}";
		return s.b.join("");
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b[s.b.length] = sep == null?"null":sep;
			s.add(l[0]);
			l = l[1];
		}
		return s.b.join("");
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,__class__: List
}
var MainJs = $hxClasses["MainJs"] = function() { }
MainJs.__name__ = ["MainJs"];
MainJs.main = function() {
	haxe.Firebug.redirectTraces();
	new demo.Application();
}
MainJs.prototype = {
	__class__: MainJs
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && f.__name__ == null;
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && v.__name__ != null;
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
Reflect.prototype = {
	__class__: Reflect
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && x.charCodeAt(1) == 120) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
Std.prototype = {
	__class__: Std
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = new Array();
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b[this.b.length] = x == null?"null":x;
	}
	,addSub: function(s,pos,len) {
		this.b[this.b.length] = s.substr(pos,len);
	}
	,addChar: function(c) {
		this.b[this.b.length] = String.fromCharCode(c);
	}
	,toString: function() {
		return this.b.join("");
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && s.substr(0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && s.substr(slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = s.charCodeAt(pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return s.substr(r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return s.substr(0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += c.substr(0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += c.substr(0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.cca(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
StringTools.prototype = {
	__class__: StringTools
}
var demo = demo || {}
demo.Application = $hxClasses["demo.Application"] = function() {
	this.slBuilderBridge = new demo.SLBuilderBridge();
	slbuilder.core.SLBuilder.getInstance().slBuilderBridge = this.slBuilderBridge;
};
demo.Application.__name__ = ["demo","Application"];
demo.Application.prototype = {
	slBuilderBridge: null
	,__class__: demo.Application
}
demo.Descriptor = $hxClasses["demo.Descriptor"] = function() { }
demo.Descriptor.__name__ = ["demo","Descriptor"];
demo.Descriptor.prototype = {
	__class__: demo.Descriptor
}
var slbuilder = slbuilder || {}
if(!slbuilder.core) slbuilder.core = {}
slbuilder.core.ISLBuilderBridge = $hxClasses["slbuilder.core.ISLBuilderBridge"] = function() { }
slbuilder.core.ISLBuilderBridge.__name__ = ["slbuilder","core","ISLBuilderBridge"];
slbuilder.core.ISLBuilderBridge.prototype = {
	createPage: null
	,removePage: null
	,getPages: null
	,createLayer: null
	,removeLayer: null
	,getLayers: null
	,createComponent: null
	,removeComponent: null
	,getComponents: null
	,getProperties: null
	,setProperty: null
	,domChanged: null
	,slectionChanged: null
	,slectionLockChanged: null
	,__class__: slbuilder.core.ISLBuilderBridge
}
demo.SLBuilderBridge = $hxClasses["demo.SLBuilderBridge"] = function() {
};
demo.SLBuilderBridge.__name__ = ["demo","SLBuilderBridge"];
demo.SLBuilderBridge.__interfaces__ = [slbuilder.core.ISLBuilderBridge];
demo.SLBuilderBridge.prototype = {
	createPage: function(deeplink) {
		var id = slbuilder.core.Utils.toId(slbuilder.data.ElementType.page,deeplink);
		var res = js.Lib.document.createElement("a");
		res.className = "slbuilder page";
		res.id = id.seed;
		res.setAttribute("name",deeplink);
		res.style.verticalAlign = "top";
		var parent = js.Lib.document.getElementById("main");
		parent.appendChild(res);
		return { id : id, displayName : id.seed, deeplink : deeplink};
	}
	,removePage: function(id) {
		haxe.Log.trace("removePage(" + id.seed,{ fileName : "SLBuilderBridge.hx", lineNumber : 57, className : "demo.SLBuilderBridge", methodName : "removePage"});
		if(id.type != slbuilder.data.ElementType.page) throw "Error: trying to remove a page, but the ID is the ID of a " + Std.string(id.type);
		var element = js.Lib.document.getElementById(id.seed);
		if(element != null) {
			element.parentNode.removeChild(element);
			return true;
		}
		return false;
	}
	,getPages: function() {
		var parent = js.Lib.document.getElementById("main");
		var pages = parent.getElementsByClassName("page");
		var res = [];
		var _g1 = 0, _g = pages.length;
		while(_g1 < _g) {
			var elementIdx = _g1++;
			var element = Reflect.field(pages,Std.string(elementIdx));
			var page = { id : { type : slbuilder.data.ElementType.page, seed : element.id}, displayName : element.id, deeplink : element.getAttribute("name")};
			res.push(page);
		}
		return res;
	}
	,createLayer: function(className,parentId) {
		var id = slbuilder.core.Utils.toId(slbuilder.data.ElementType.layer,className);
		var res = js.Lib.document.createElement("div");
		res.className = className + " slbuilder layer";
		res.id = id.seed;
		res.style.verticalAlign = "top";
		var parent = js.Lib.document.getElementById(parentId.seed);
		parent.appendChild(res);
		return { parentId : parentId, id : id, displayName : id.seed};
	}
	,removeLayer: function(id) {
		if(id.type != slbuilder.data.ElementType.layer) {
			if(id.type != slbuilder.data.ElementType.page) throw "Error: trying to remove a layer, but the ID is the ID of a " + Std.string(id.type);
		}
		var element = js.Lib.document.getElementById(id.seed);
		if(element != null) {
			element.parentNode.removeChild(element);
			return true;
		}
		return false;
	}
	,getLayers: function(parentId) {
		var parent;
		if(parentId == null) parent = js.Lib.document.getElementById("main"); else parent = js.Lib.document.getElementById(parentId.seed);
		var layers = parent.getElementsByClassName("layer");
		var res = [];
		var _g1 = 0, _g = layers.length;
		while(_g1 < _g) {
			var elementIdx = _g1++;
			var element = Reflect.field(layers,Std.string(elementIdx));
			var layer = { parentId : { type : slbuilder.data.ElementType.layer, seed : element.parentNode.id}, id : { type : slbuilder.data.ElementType.layer, seed : element.id}, displayName : element.id};
			res.push(layer);
		}
		return res;
	}
	,createComponent: function(className,parentId) {
		var id = slbuilder.core.Utils.toId(slbuilder.data.ElementType.component,className);
		var res = js.Lib.document.createElement("div");
		res.className = className + " slbuilder component";
		res.id = id.seed;
		var parent = js.Lib.document.getElementById(parentId.seed);
		parent.appendChild(res);
		return { parentId : parentId, id : id, displayName : id.seed};
	}
	,removeComponent: function(id) {
		if(id.type != slbuilder.data.ElementType.component) {
			if(id.type != slbuilder.data.ElementType.page) throw "Error: trying to remove a component, but the ID is the ID of a " + Std.string(id.type);
		}
		var element = js.Lib.document.getElementById(id.seed);
		if(element != null) {
			element.parentNode.removeChild(element);
			return true;
		}
		return false;
	}
	,getComponents: function(parentId) {
		var parent = js.Lib.document.getElementById(parentId.seed);
		var components = parent.getElementsByClassName("component");
		var res = [];
		var _g1 = 0, _g = components.length;
		while(_g1 < _g) {
			var elementIdx = _g1++;
			var element = Reflect.field(components,Std.string(elementIdx));
			var component = { parentId : { type : slbuilder.data.ElementType.component, seed : element.parentNode.id}, id : { type : slbuilder.data.ElementType.component, seed : element.id}, displayName : element.id};
			res.push(component);
		}
		return res;
	}
	,getProperties: function(parentId) {
		var parent = js.Lib.document.getElementById(parentId.seed);
		haxe.Log.trace("getProperties " + parentId + " => " + parent,{ fileName : "SLBuilderBridge.hx", lineNumber : 230, className : "demo.SLBuilderBridge", methodName : "getProperties"});
		var properties = Reflect.field(demo.Descriptor,parent.nodeName.toLowerCase());
		haxe.Log.trace("getProperties " + parent.nodeName + " => " + properties,{ fileName : "SLBuilderBridge.hx", lineNumber : 232, className : "demo.SLBuilderBridge", methodName : "getProperties"});
		var _g = 0;
		while(_g < properties.length) {
			var property = properties[_g];
			++_g;
			var propArray = property.name.split(".");
			var propObject = Reflect.field(parent,propArray.shift());
			var _g1 = 0;
			while(_g1 < propArray.length) {
				var propertyName = propArray[_g1];
				++_g1;
				propObject = Reflect.field(propObject,propertyName);
			}
			property.value = propObject;
		}
		return properties;
	}
	,setProperty: function(parentId,propName,propValue) {
		var parent = js.Lib.document.getElementById(parentId.seed);
		var propArray = propName.split(".");
		var propNameNoDot = propArray.pop();
		var propObject = parent;
		var _g = 0;
		while(_g < propArray.length) {
			var propertyName = propArray[_g];
			++_g;
			propObject = Reflect.field(propObject,propertyName);
		}
		propObject[propNameNoDot] = propValue;
	}
	,domChanged: function(layerId) {
	}
	,slectionChanged: function(componentsIds) {
	}
	,slectionLockChanged: function(componentsIds) {
	}
	,__class__: demo.SLBuilderBridge
}
var haxe = haxe || {}
haxe.Firebug = $hxClasses["haxe.Firebug"] = function() { }
haxe.Firebug.__name__ = ["haxe","Firebug"];
haxe.Firebug.detect = function() {
	try {
		return console != null && console.error != null;
	} catch( e ) {
		return false;
	}
}
haxe.Firebug.redirectTraces = function() {
	haxe.Log.trace = haxe.Firebug.trace;
	js.Lib.onerror = haxe.Firebug.onError;
}
haxe.Firebug.onError = function(err,stack) {
	var buf = err + "\n";
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		buf += "Called from " + s + "\n";
	}
	haxe.Firebug.trace(buf,null);
	return true;
}
haxe.Firebug.trace = function(v,inf) {
	var type = inf != null && inf.customParams != null?inf.customParams[0]:null;
	if(type != "warn" && type != "info" && type != "debug" && type != "error") type = inf == null?"error":"log";
	console[type]((inf == null?"":inf.fileName + ":" + inf.lineNumber + " : ") + Std.string(v));
}
haxe.Firebug.prototype = {
	__class__: haxe.Firebug
}
haxe.Http = $hxClasses["haxe.Http"] = function(url) {
	this.url = url;
	this.headers = new Hash();
	this.params = new Hash();
	this.async = true;
};
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.requestUrl = function(url) {
	var h = new haxe.Http(url);
	h.async = false;
	var r = null;
	h.onData = function(d) {
		r = d;
	};
	h.onError = function(e) {
		throw e;
	};
	h.request(false);
	return r;
}
haxe.Http.prototype = {
	url: null
	,async: null
	,postData: null
	,headers: null
	,params: null
	,setHeader: function(header,value) {
		this.headers.set(header,value);
	}
	,setParameter: function(param,value) {
		this.params.set(param,value);
	}
	,setPostData: function(data) {
		this.postData = data;
	}
	,request: function(post) {
		var me = this;
		var r = new js.XMLHttpRequest();
		var onreadystatechange = function() {
			if(r.readyState != 4) return;
			var s = (function($this) {
				var $r;
				try {
					$r = r.status;
				} catch( e ) {
					$r = null;
				}
				return $r;
			}(this));
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) me.onData(r.responseText); else switch(s) {
			case null: case undefined:
				me.onError("Failed to connect or resolve host");
				break;
			case 12029:
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.onError("Unknown host");
				break;
			default:
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.keys();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += StringTools.urlEncode(p) + "=" + StringTools.urlEncode(this.params.get(p));
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e ) {
			this.onError(e.toString());
			return;
		}
		if(this.headers.get("Content-Type") == null && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.keys();
		while( $it1.hasNext() ) {
			var h = $it1.next();
			r.setRequestHeader(h,this.headers.get(h));
		}
		r.send(uri);
		if(!this.async) onreadystatechange();
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
	,__class__: haxe.Http
}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Log.prototype = {
	__class__: haxe.Log
}
if(!haxe._Template) haxe._Template = {}
haxe._Template.TemplateExpr = $hxClasses["haxe._Template.TemplateExpr"] = { __ename__ : ["haxe","_Template","TemplateExpr"], __constructs__ : ["OpVar","OpExpr","OpIf","OpStr","OpBlock","OpForeach","OpMacro"] }
haxe._Template.TemplateExpr.OpVar = function(v) { var $x = ["OpVar",0,v]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpExpr = function(expr) { var $x = ["OpExpr",1,expr]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpIf = function(expr,eif,eelse) { var $x = ["OpIf",2,expr,eif,eelse]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpStr = function(str) { var $x = ["OpStr",3,str]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpBlock = function(l) { var $x = ["OpBlock",4,l]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpForeach = function(expr,loop) { var $x = ["OpForeach",5,expr,loop]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpMacro = function(name,params) { var $x = ["OpMacro",6,name,params]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe.Template = $hxClasses["haxe.Template"] = function(str) {
	var tokens = this.parseTokens(str);
	this.expr = this.parseBlock(tokens);
	if(!tokens.isEmpty()) throw "Unexpected '" + tokens.first().s + "'";
};
haxe.Template.__name__ = ["haxe","Template"];
haxe.Template.prototype = {
	expr: null
	,context: null
	,macros: null
	,stack: null
	,buf: null
	,execute: function(context,macros) {
		this.macros = macros == null?{ }:macros;
		this.context = context;
		this.stack = new List();
		this.buf = new StringBuf();
		this.run(this.expr);
		return this.buf.b.join("");
	}
	,resolve: function(v) {
		if(Reflect.hasField(this.context,v)) return Reflect.field(this.context,v);
		var $it0 = this.stack.iterator();
		while( $it0.hasNext() ) {
			var ctx = $it0.next();
			if(Reflect.hasField(ctx,v)) return Reflect.field(ctx,v);
		}
		if(v == "__current__") return this.context;
		return Reflect.field(haxe.Template.globals,v);
	}
	,parseTokens: function(data) {
		var tokens = new List();
		while(haxe.Template.splitter.match(data)) {
			var p = haxe.Template.splitter.matchedPos();
			if(p.pos > 0) tokens.add({ p : data.substr(0,p.pos), s : true, l : null});
			if(data.charCodeAt(p.pos) == 58) {
				tokens.add({ p : data.substr(p.pos + 2,p.len - 4), s : false, l : null});
				data = haxe.Template.splitter.matchedRight();
				continue;
			}
			var parp = p.pos + p.len;
			var npar = 1;
			while(npar > 0) {
				var c = data.charCodeAt(parp);
				if(c == 40) npar++; else if(c == 41) npar--; else if(c == null) throw "Unclosed macro parenthesis";
				parp++;
			}
			var params = data.substr(p.pos + p.len,parp - (p.pos + p.len) - 1).split(",");
			tokens.add({ p : haxe.Template.splitter.matched(2), s : false, l : params});
			data = data.substr(parp,data.length - parp);
		}
		if(data.length > 0) tokens.add({ p : data, s : true, l : null});
		return tokens;
	}
	,parseBlock: function(tokens) {
		var l = new List();
		while(true) {
			var t = tokens.first();
			if(t == null) break;
			if(!t.s && (t.p == "end" || t.p == "else" || t.p.substr(0,7) == "elseif ")) break;
			l.add(this.parse(tokens));
		}
		if(l.length == 1) return l.first();
		return haxe._Template.TemplateExpr.OpBlock(l);
	}
	,parse: function(tokens) {
		var t = tokens.pop();
		var p = t.p;
		if(t.s) return haxe._Template.TemplateExpr.OpStr(p);
		if(t.l != null) {
			var pe = new List();
			var _g = 0, _g1 = t.l;
			while(_g < _g1.length) {
				var p1 = _g1[_g];
				++_g;
				pe.add(this.parseBlock(this.parseTokens(p1)));
			}
			return haxe._Template.TemplateExpr.OpMacro(p,pe);
		}
		if(p.substr(0,3) == "if ") {
			p = p.substr(3,p.length - 3);
			var e = this.parseExpr(p);
			var eif = this.parseBlock(tokens);
			var t1 = tokens.first();
			var eelse;
			if(t1 == null) throw "Unclosed 'if'";
			if(t1.p == "end") {
				tokens.pop();
				eelse = null;
			} else if(t1.p == "else") {
				tokens.pop();
				eelse = this.parseBlock(tokens);
				t1 = tokens.pop();
				if(t1 == null || t1.p != "end") throw "Unclosed 'else'";
			} else {
				t1.p = t1.p.substr(4,t1.p.length - 4);
				eelse = this.parse(tokens);
			}
			return haxe._Template.TemplateExpr.OpIf(e,eif,eelse);
		}
		if(p.substr(0,8) == "foreach ") {
			p = p.substr(8,p.length - 8);
			var e = this.parseExpr(p);
			var efor = this.parseBlock(tokens);
			var t1 = tokens.pop();
			if(t1 == null || t1.p != "end") throw "Unclosed 'foreach'";
			return haxe._Template.TemplateExpr.OpForeach(e,efor);
		}
		if(haxe.Template.expr_splitter.match(p)) return haxe._Template.TemplateExpr.OpExpr(this.parseExpr(p));
		return haxe._Template.TemplateExpr.OpVar(p);
	}
	,parseExpr: function(data) {
		var l = new List();
		var expr = data;
		while(haxe.Template.expr_splitter.match(data)) {
			var p = haxe.Template.expr_splitter.matchedPos();
			var k = p.pos + p.len;
			if(p.pos != 0) l.add({ p : data.substr(0,p.pos), s : true});
			var p1 = haxe.Template.expr_splitter.matched(0);
			l.add({ p : p1, s : p1.indexOf("\"") >= 0});
			data = haxe.Template.expr_splitter.matchedRight();
		}
		if(data.length != 0) l.add({ p : data, s : true});
		var e;
		try {
			e = this.makeExpr(l);
			if(!l.isEmpty()) throw l.first().p;
		} catch( s ) {
			if( js.Boot.__instanceof(s,String) ) {
				throw "Unexpected '" + s + "' in " + expr;
			} else throw(s);
		}
		return function() {
			try {
				return e();
			} catch( exc ) {
				throw "Error : " + Std.string(exc) + " in " + expr;
			}
		};
	}
	,makeConst: function(v) {
		haxe.Template.expr_trim.match(v);
		v = haxe.Template.expr_trim.matched(1);
		if(v.charCodeAt(0) == 34) {
			var str = v.substr(1,v.length - 2);
			return function() {
				return str;
			};
		}
		if(haxe.Template.expr_int.match(v)) {
			var i = Std.parseInt(v);
			return function() {
				return i;
			};
		}
		if(haxe.Template.expr_float.match(v)) {
			var f = Std.parseFloat(v);
			return function() {
				return f;
			};
		}
		var me = this;
		return function() {
			return me.resolve(v);
		};
	}
	,makePath: function(e,l) {
		var p = l.first();
		if(p == null || p.p != ".") return e;
		l.pop();
		var field = l.pop();
		if(field == null || !field.s) throw field.p;
		var f = field.p;
		haxe.Template.expr_trim.match(f);
		f = haxe.Template.expr_trim.matched(1);
		return this.makePath(function() {
			return Reflect.field(e(),f);
		},l);
	}
	,makeExpr: function(l) {
		return this.makePath(this.makeExpr2(l),l);
	}
	,makeExpr2: function(l) {
		var p = l.pop();
		if(p == null) throw "<eof>";
		if(p.s) return this.makeConst(p.p);
		switch(p.p) {
		case "(":
			var e1 = this.makeExpr(l);
			var p1 = l.pop();
			if(p1 == null || p1.s) throw p1.p;
			if(p1.p == ")") return e1;
			var e2 = this.makeExpr(l);
			var p2 = l.pop();
			if(p2 == null || p2.p != ")") throw p2.p;
			return (function($this) {
				var $r;
				switch(p1.p) {
				case "+":
					$r = function() {
						return e1() + e2();
					};
					break;
				case "-":
					$r = function() {
						return e1() - e2();
					};
					break;
				case "*":
					$r = function() {
						return e1() * e2();
					};
					break;
				case "/":
					$r = function() {
						return e1() / e2();
					};
					break;
				case ">":
					$r = function() {
						return e1() > e2();
					};
					break;
				case "<":
					$r = function() {
						return e1() < e2();
					};
					break;
				case ">=":
					$r = function() {
						return e1() >= e2();
					};
					break;
				case "<=":
					$r = function() {
						return e1() <= e2();
					};
					break;
				case "==":
					$r = function() {
						return e1() == e2();
					};
					break;
				case "!=":
					$r = function() {
						return e1() != e2();
					};
					break;
				case "&&":
					$r = function() {
						return e1() && e2();
					};
					break;
				case "||":
					$r = function() {
						return e1() || e2();
					};
					break;
				default:
					$r = (function($this) {
						var $r;
						throw "Unknown operation " + p1.p;
						return $r;
					}($this));
				}
				return $r;
			}(this));
		case "!":
			var e = this.makeExpr(l);
			return function() {
				var v = e();
				return v == null || v == false;
			};
		case "-":
			var e = this.makeExpr(l);
			return function() {
				return -e();
			};
		}
		throw p.p;
	}
	,run: function(e) {
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			this.buf.add(Std.string(this.resolve(v)));
			break;
		case 1:
			var e1 = $e[2];
			this.buf.add(Std.string(e1()));
			break;
		case 2:
			var eelse = $e[4], eif = $e[3], e1 = $e[2];
			var v = e1();
			if(v == null || v == false) {
				if(eelse != null) this.run(eelse);
			} else this.run(eif);
			break;
		case 3:
			var str = $e[2];
			this.buf.add(str);
			break;
		case 4:
			var l = $e[2];
			var $it0 = l.iterator();
			while( $it0.hasNext() ) {
				var e1 = $it0.next();
				this.run(e1);
			}
			break;
		case 5:
			var loop = $e[3], e1 = $e[2];
			var v = e1();
			try {
				var x = v.iterator();
				if(x.hasNext == null) throw null;
				v = x;
			} catch( e2 ) {
				try {
					if(v.hasNext == null) throw null;
				} catch( e3 ) {
					throw "Cannot iter on " + v;
				}
			}
			this.stack.push(this.context);
			var v1 = v;
			while( v1.hasNext() ) {
				var ctx = v1.next();
				this.context = ctx;
				this.run(loop);
			}
			this.context = this.stack.pop();
			break;
		case 6:
			var params = $e[3], m = $e[2];
			var v = Reflect.field(this.macros,m);
			var pl = new Array();
			var old = this.buf;
			pl.push(this.resolve.$bind(this));
			var $it1 = params.iterator();
			while( $it1.hasNext() ) {
				var p = $it1.next();
				var $e = (p);
				switch( $e[1] ) {
				case 0:
					var v1 = $e[2];
					pl.push(this.resolve(v1));
					break;
				default:
					this.buf = new StringBuf();
					this.run(p);
					pl.push(this.buf.b.join(""));
				}
			}
			this.buf = old;
			try {
				this.buf.add(Std.string(v.apply(this.macros,pl)));
			} catch( e1 ) {
				var plstr = (function($this) {
					var $r;
					try {
						$r = pl.join(",");
					} catch( e2 ) {
						$r = "???";
					}
					return $r;
				}(this));
				var msg = "Macro call " + m + "(" + plstr + ") failed (" + Std.string(e1) + ")";
				throw msg;
			}
			break;
		}
	}
	,__class__: haxe.Template
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ != null || o.__ename__ != null)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__ != null) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		return o.__enum__ == cl || cl == Class && o.__name__ != null || cl == Enum && o.__ename__ != null;
	}
}
js.Boot.__init = function() {
	js.Lib.isIE = typeof document!='undefined' && document.all != null && typeof window!='undefined' && window.opera == null;
	js.Lib.isOpera = typeof window!='undefined' && window.opera != null;
	Array.prototype.copy = Array.prototype.slice;
	Array.prototype.insert = function(i,x) {
		this.splice(i,0,x);
	};
	Array.prototype.remove = Array.prototype.indexOf?function(obj) {
		var idx = this.indexOf(obj);
		if(idx == -1) return false;
		this.splice(idx,1);
		return true;
	}:function(obj) {
		var i = 0;
		var l = this.length;
		while(i < l) {
			if(this[i] == obj) {
				this.splice(i,1);
				return true;
			}
			i++;
		}
		return false;
	};
	Array.prototype.iterator = function() {
		return { cur : 0, arr : this, hasNext : function() {
			return this.cur < this.arr.length;
		}, next : function() {
			return this.arr[this.cur++];
		}};
	};
	if(String.prototype.cca == null) String.prototype.cca = String.prototype.charCodeAt;
	String.prototype.charCodeAt = function(i) {
		var x = this.cca(i);
		if(x != x) return undefined;
		return x;
	};
	var oldsub = String.prototype.substr;
	String.prototype.substr = function(pos,len) {
		if(pos != null && pos != 0 && len != null && len < 0) return "";
		if(len == null) len = this.length;
		if(pos < 0) {
			pos = this.length + pos;
			if(pos < 0) pos = 0;
		} else if(len < 0) len = this.length + len - pos;
		return oldsub.apply(this,[pos,len]);
	};
	Function.prototype["$bind"] = function(o) {
		var f = function() {
			return f.method.apply(f.scope,arguments);
		};
		f.scope = o;
		f.method = this;
		return f;
	};
}
js.Boot.prototype = {
	__class__: js.Boot
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.isIE = null;
js.Lib.isOpera = null;
js.Lib.document = null;
js.Lib.window = null;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
js.Lib.prototype = {
	__class__: js.Lib
}
slbuilder.core.Config = $hxClasses["slbuilder.core.Config"] = function() { }
slbuilder.core.Config.__name__ = ["slbuilder","core","Config"];
slbuilder.core.Config.prototype = {
	__class__: slbuilder.core.Config
}
slbuilder.core.SLBuilder = $hxClasses["slbuilder.core.SLBuilder"] = function() {
	haxe.Log.trace("SLBuilder init",{ fileName : "SLBuilder.hx", lineNumber : 83, className : "slbuilder.core.SLBuilder", methodName : "new"});
	this.initDomReferences();
	this.initUis();
};
slbuilder.core.SLBuilder.__name__ = ["slbuilder","core","SLBuilder"];
slbuilder.core.SLBuilder.__interfaces__ = [slbuilder.core.ISLBuilderBridge];
slbuilder.core.SLBuilder.instance = null;
slbuilder.core.SLBuilder.getInstance = function() {
	if(slbuilder.core.SLBuilder.instance == null) slbuilder.core.SLBuilder.instance = new slbuilder.core.SLBuilder();
	return slbuilder.core.SLBuilder.instance;
}
slbuilder.core.SLBuilder.prototype = {
	slBuilderBridge: null
	,pagesWidget: null
	,layersWidget: null
	,componentsWidget: null
	,root: null
	,initDomReferences: function() {
		this.root = slbuilder.core.Utils.getElementsByClassName(js.Lib.document.body,"SLBuilderMain")[0];
	}
	,initUis: function() {
		Ext.require(["Ext.form.*","Ext.data.*","Ext.grid.Panel","Ext.grid.GridPanel","Ext.layout.container.Column"]);
		Ext.onReady(this.initExtJsUi.$bind(this));
	}
	,initExtJsUi: function() {
		var gridForm;
		gridForm = Ext.create("Ext.form.Panel",{ id : "slbuilder-form", frame : true, title : "SLBuilder Editor", height : 350, width : 800, layout : "column", fieldDefaults : { labelAlign : "left", msgTarget : "side"}, renderTo : this.root});
		var gridFormHtmlDom = gridForm.getEl().dom;
		gridFormHtmlDom.style.position = "absolute";
		gridFormHtmlDom.style.bottom = "0";
		gridFormHtmlDom.style.left = "0";
		this.pagesWidget = new slbuilder.ui.PagesWidget(this.root,gridForm);
		this.pagesWidget.onChange = this.onPageChange.$bind(this);
		this.pagesWidget.refresh();
		this.layersWidget = new slbuilder.ui.LayersWidget(this.root,gridForm);
		this.layersWidget.onChange = this.onLayerChange.$bind(this);
		this.componentsWidget = new slbuilder.ui.ComponentsWidget(this.root,gridForm);
		this.componentsWidget.onChange = this.onComponentChange.$bind(this);
	}
	,onPageChange: function(page) {
		var displayName = "none";
		if(page != null) {
			displayName = page.displayName;
			this.layersWidget.parentId = page.id;
		} else this.layersWidget.parentId = null;
		this.layersWidget.refresh();
		haxe.Log.trace("Page selected: " + displayName,{ fileName : "SLBuilder.hx", lineNumber : 162, className : "slbuilder.core.SLBuilder", methodName : "onPageChange"});
	}
	,onLayerChange: function(layer) {
		var displayName = "none";
		if(layer != null) {
			displayName = layer.displayName;
			this.componentsWidget.parentId = layer.id;
		} else this.componentsWidget.parentId = null;
		this.componentsWidget.refresh();
		haxe.Log.trace("Layer selected: " + displayName,{ fileName : "SLBuilder.hx", lineNumber : 174, className : "slbuilder.core.SLBuilder", methodName : "onLayerChange"});
	}
	,onComponentChange: function(component) {
		var displayName = "none";
		if(component != null) displayName = component.displayName;
		haxe.Log.trace("Component selected: " + displayName,{ fileName : "SLBuilder.hx", lineNumber : 182, className : "slbuilder.core.SLBuilder", methodName : "onComponentChange"});
	}
	,createPage: function(deeplink) {
		if(this.slBuilderBridge == null) throw "SLBuilder error: the application did not provide a ISLBuilderBridge object";
		return this.slBuilderBridge.createPage(deeplink);
	}
	,removePage: function(id) {
		if(this.slBuilderBridge == null) throw "SLBuilder error: the application did not provide a ISLBuilderBridge object";
		return this.slBuilderBridge.removePage(id);
	}
	,getPages: function() {
		if(this.slBuilderBridge == null) throw "SLBuilder error: the application did not provide a ISLBuilderBridge object";
		return this.slBuilderBridge.getPages();
	}
	,createLayer: function(c,id) {
		if(this.slBuilderBridge == null) throw "SLBuilder error: the application did not provide a ISLBuilderBridge object";
		return this.slBuilderBridge.createLayer(c,id);
	}
	,removeLayer: function(id) {
		if(this.slBuilderBridge == null) throw "SLBuilder error: the application did not provide a ISLBuilderBridge object";
		return this.slBuilderBridge.removeLayer(id);
	}
	,getLayers: function(id) {
		if(this.slBuilderBridge == null) throw "SLBuilder error: the application did not provide a ISLBuilderBridge object";
		return this.slBuilderBridge.getLayers(id);
	}
	,createComponent: function(c,id) {
		if(this.slBuilderBridge == null) throw "SLBuilder error: the application did not provide a ISLBuilderBridge object";
		return this.slBuilderBridge.createComponent(c,id);
	}
	,removeComponent: function(id) {
		if(this.slBuilderBridge == null) throw "SLBuilder error: the application did not provide a ISLBuilderBridge object";
		return this.slBuilderBridge.removeComponent(id);
	}
	,getComponents: function(id) {
		if(this.slBuilderBridge == null) throw "SLBuilder error: the application did not provide a ISLBuilderBridge object";
		return this.slBuilderBridge.getComponents(id);
	}
	,getProperties: function(id) {
		if(this.slBuilderBridge == null) throw "SLBuilder error: the application did not provide a ISLBuilderBridge object";
		return this.slBuilderBridge.getProperties(id);
	}
	,setProperty: function(id,p,v) {
		if(this.slBuilderBridge == null) throw "SLBuilder error: the application did not provide a ISLBuilderBridge object";
		return this.slBuilderBridge.setProperty(id,p,v);
	}
	,domChanged: function(id) {
		if(this.slBuilderBridge == null) throw "SLBuilder error: the application did not provide a ISLBuilderBridge object";
		return this.slBuilderBridge.domChanged(id);
	}
	,slectionChanged: function(ids) {
		throw "not implemented";
	}
	,slectionLockChanged: function(ids) {
		throw "not implemented";
	}
	,__class__: slbuilder.core.SLBuilder
}
slbuilder.core.Template = $hxClasses["slbuilder.core.Template"] = function(name,templateFolderPath,templateExtenstion,onLoad,onError) {
	if(templateExtenstion == null) templateExtenstion = ".html";
	if(templateFolderPath == null) templateFolderPath = "templates/";
	this.templateExtenstion = templateExtenstion;
	this.templateFolderPath = templateFolderPath;
	this.name = name;
	this.setOnLoad(onLoad);
	this.onError = onError;
};
slbuilder.core.Template.__name__ = ["slbuilder","core","Template"];
slbuilder.core.Template.prototype = {
	templateFolderPath: null
	,templateExtenstion: null
	,onLoad: null
	,_onLoad: null
	,onError: null
	,name: null
	,loadedContent: null
	,setOnLoad: function(onLoad) {
		this._onLoad = onLoad;
		if(onLoad != null) this.load();
		return onLoad;
	}
	,getOnLoad: function() {
		return this._onLoad;
	}
	,load: function() {
		var r = new haxe.Http(this.templateFolderPath + this.name + this.templateExtenstion);
		r.onError = this.onErrorCallback.$bind(this);
		r.onData = this.onLoadCallback.$bind(this);
		r.request(false);
	}
	,onErrorCallback: function(message) {
		if(this.onError != null) this.onError(this,message);
	}
	,onLoadCallback: function(templateContent) {
		this.loadedContent = templateContent;
		(this.getOnLoad())(this);
	}
	,execute: function(context) {
		var template = new haxe.Template(this.loadedContent);
		var output = template.execute(context,{ setval : function(resolve,prop,val) {
			context[prop] = val;
			return "";
		}});
		return output;
	}
	,__class__: slbuilder.core.Template
	,__properties__: {set_onLoad:"setOnLoad",get_onLoad:"getOnLoad"}
}
slbuilder.core.Utils = $hxClasses["slbuilder.core.Utils"] = function() { }
slbuilder.core.Utils.__name__ = ["slbuilder","core","Utils"];
slbuilder.core.Utils.nextId = null;
slbuilder.core.Utils.toId = function(type,className) {
	return { type : type, seed : Std.string(type) + "_" + className + "_" + Std.string(slbuilder.core.Utils.nextId++) + "_" + Math.round(Math.random() * 999999)};
}
slbuilder.core.Utils.getElementsByClassName = function(parent,className) {
	return parent.getElementsByClassName(className);
}
slbuilder.core.Utils.inspectTrace = function(obj) {
	var _g = 0, _g1 = Reflect.fields(obj);
	while(_g < _g1.length) {
		var prop = _g1[_g];
		++_g;
		haxe.Log.trace("- " + prop + " = " + Reflect.field(obj,prop),{ fileName : "Utils.hx", lineNumber : 28, className : "slbuilder.core.Utils", methodName : "inspectTrace"});
	}
}
slbuilder.core.Utils.prototype = {
	__class__: slbuilder.core.Utils
}
if(!slbuilder.data) slbuilder.data = {}
slbuilder.data.ElementType = $hxClasses["slbuilder.data.ElementType"] = { __ename__ : ["slbuilder","data","ElementType"], __constructs__ : ["page","layer","component"] }
slbuilder.data.ElementType.page = ["page",0];
slbuilder.data.ElementType.page.toString = $estr;
slbuilder.data.ElementType.page.__enum__ = slbuilder.data.ElementType;
slbuilder.data.ElementType.layer = ["layer",1];
slbuilder.data.ElementType.layer.toString = $estr;
slbuilder.data.ElementType.layer.__enum__ = slbuilder.data.ElementType;
slbuilder.data.ElementType.component = ["component",2];
slbuilder.data.ElementType.component.toString = $estr;
slbuilder.data.ElementType.component.__enum__ = slbuilder.data.ElementType;
if(!slbuilder.ui) slbuilder.ui = {}
slbuilder.ui.ListWidget = $hxClasses["slbuilder.ui.ListWidget"] = function(parent,panel,title) {
	this.widgetTitle = title;
	this.parent = parent;
	this.panel = panel;
	this.initExtJsUi();
};
slbuilder.ui.ListWidget.__name__ = ["slbuilder","ui","ListWidget"];
slbuilder.ui.ListWidget.prototype = {
	widgetTitle: null
	,arrayStore: null
	,onChange: null
	,addBtn: null
	,removeBtn: null
	,parent: null
	,root: null
	,panel: null
	,grid: null
	,initDomReferences: function() {
		haxe.Log.trace(this.root.id,{ fileName : "ListWidget.hx", lineNumber : 66, className : "slbuilder.ui.ListWidget", methodName : "initDomReferences"});
		this.addBtn = slbuilder.core.Utils.getElementsByClassName(this.root,"addBtn")[0];
		this.addBtn.onclick = this.add.$bind(this);
		this.removeBtn = slbuilder.core.Utils.getElementsByClassName(this.root,"removeBtn")[0];
		this.removeBtn.onclick = this.remove.$bind(this);
		this.refresh();
	}
	,refresh: function() {
	}
	,add: function(e) {
		this.refresh();
	}
	,remove: function(e) {
		this.refresh();
	}
	,onSelectionChanged: function(model,records) {
		var selected = null;
		if(records[0] != null) selected = records[0].data;
		if(this.onChange != null) this.onChange(selected);
	}
	,initExtJsUi: function() {
		this.arrayStore = Ext.create("Ext.data.ArrayStore",{ fields : [{ name : "id"},{ name : "parentId"},{ name : "displayName"}]});
		this.grid = Ext.create("Ext.grid.GridPanel",{ id : slbuilder.core.Utils.toId(slbuilder.data.ElementType.layer,"list").seed, columnWidth : 0.60, xtype : "gridpanel", store : this.arrayStore, height : 150, minWidth : 150, width : 150, style : { minWidth : "150px", width : "150px", 'float' : "left", position : "relative", height : "250px"}, columns : [{ id : "col", text : this.widgetTitle, flex : 1, sortable : true, dataIndex : "displayName"}], listeners : { selectionchange : this.onSelectionChanged.$bind(this)}, buttons : [{ cls : "addBtn", text : "+", xtype : "button"},{ cls : "removeBtn", text : "-", xtype : "button"}]});
		this.panel.add(this.grid);
		this.root = this.grid.getEl().dom;
		this.root.style.position = "relative";
		this.root.style["float"] = "left";
		this.initDomReferences();
	}
	,__class__: slbuilder.ui.ListWidget
}
slbuilder.ui.ComponentsWidget = $hxClasses["slbuilder.ui.ComponentsWidget"] = function(parent,panel) {
	slbuilder.ui.ListWidget.call(this,parent,panel,"Components");
};
slbuilder.ui.ComponentsWidget.__name__ = ["slbuilder","ui","ComponentsWidget"];
slbuilder.ui.ComponentsWidget.__super__ = slbuilder.ui.ListWidget;
slbuilder.ui.ComponentsWidget.prototype = $extend(slbuilder.ui.ListWidget.prototype,{
	parentId: null
	,initDomReferences: function() {
		slbuilder.ui.ListWidget.prototype.initDomReferences.call(this);
	}
	,refresh: function() {
		if(this.parentId != null) {
			var components = slbuilder.core.SLBuilder.getInstance().getComponents(this.parentId);
			var arraArray = Ext.Array.from(components);
			this.arrayStore.loadData(arraArray);
		} else this.arrayStore.removeAll();
		slbuilder.ui.ListWidget.prototype.refresh.call(this);
	}
	,add: function(e) {
		var component = slbuilder.core.SLBuilder.getInstance().createComponent("basicComponent",this.parentId);
		slbuilder.core.SLBuilder.getInstance().setProperty(component.id,"displayName","New Component");
		slbuilder.ui.ListWidget.prototype.add.call(this,e);
	}
	,remove: function(e) {
		slbuilder.core.SLBuilder.getInstance().removeComponent(this.grid.selModel.selected.items[0].data.id);
		slbuilder.ui.ListWidget.prototype.remove.call(this,e);
	}
	,onSelectionChanged: function(model,records) {
		slbuilder.ui.ListWidget.prototype.onSelectionChanged.call(this,model,records);
	}
	,initExtJsUi: function() {
		slbuilder.ui.ListWidget.prototype.initExtJsUi.call(this);
	}
	,__class__: slbuilder.ui.ComponentsWidget
});
slbuilder.ui.LayersWidget = $hxClasses["slbuilder.ui.LayersWidget"] = function(parent,panel) {
	slbuilder.ui.ListWidget.call(this,parent,panel,"Layers");
};
slbuilder.ui.LayersWidget.__name__ = ["slbuilder","ui","LayersWidget"];
slbuilder.ui.LayersWidget.__super__ = slbuilder.ui.ListWidget;
slbuilder.ui.LayersWidget.prototype = $extend(slbuilder.ui.ListWidget.prototype,{
	parentId: null
	,initDomReferences: function() {
		slbuilder.ui.ListWidget.prototype.initDomReferences.call(this);
	}
	,refresh: function() {
		if(this.parentId != null) {
			var layers = slbuilder.core.SLBuilder.getInstance().getLayers(this.parentId);
			var arraArray = Ext.Array.from(layers);
			this.arrayStore.loadData(arraArray);
		} else this.arrayStore.removeAll();
		slbuilder.ui.ListWidget.prototype.refresh.call(this);
	}
	,add: function(e) {
		var layer = slbuilder.core.SLBuilder.getInstance().createLayer("basicLayer",this.parentId);
		slbuilder.core.SLBuilder.getInstance().setProperty(layer.id,"displayName","New Layer");
		slbuilder.ui.ListWidget.prototype.add.call(this,e);
	}
	,remove: function(e) {
		slbuilder.core.SLBuilder.getInstance().removeLayer(this.grid.selModel.selected.items[0].data.id);
		slbuilder.ui.ListWidget.prototype.remove.call(this,e);
	}
	,onSelectionChanged: function(model,records) {
		slbuilder.ui.ListWidget.prototype.onSelectionChanged.call(this,model,records);
	}
	,initExtJsUi: function() {
		slbuilder.ui.ListWidget.prototype.initExtJsUi.call(this);
	}
	,__class__: slbuilder.ui.LayersWidget
});
slbuilder.ui.Menu = $hxClasses["slbuilder.ui.Menu"] = function(parent,teamplateName) {
	this.parent = parent;
	this.initTemplates(teamplateName);
};
slbuilder.ui.Menu.__name__ = ["slbuilder","ui","Menu"];
slbuilder.ui.Menu.prototype = {
	onClick: null
	,root: null
	,parent: null
	,initTemplates: function(teamplateName) {
		new slbuilder.core.Template(teamplateName).setOnLoad(this.attachTemplate.$bind(this));
	}
	,initButtons: function(container) {
		var buttons = container.getElementsByTagName("li");
		var _g1 = 0, _g = buttons.length;
		while(_g1 < _g) {
			var buttonIdx = _g1++;
			buttons[buttonIdx].onclick = this.onClickBtn.$bind(this);
		}
	}
	,attachTemplate: function(template) {
		this.root = js.Lib.document.createElement("div");
		this.root.innerHTML = template.execute({ Config : slbuilder.core.Config});
		this.parent.appendChild(this.root);
		this.initButtons(this.root);
	}
	,onClickBtn: function(e) {
		if(this.onClick != null) this.onClick(e.target.className);
	}
	,__class__: slbuilder.ui.Menu
}
slbuilder.ui.PagesWidget = $hxClasses["slbuilder.ui.PagesWidget"] = function(parent,panel) {
	slbuilder.ui.ListWidget.call(this,parent,panel,"Pages");
};
slbuilder.ui.PagesWidget.__name__ = ["slbuilder","ui","PagesWidget"];
slbuilder.ui.PagesWidget.__super__ = slbuilder.ui.ListWidget;
slbuilder.ui.PagesWidget.prototype = $extend(slbuilder.ui.ListWidget.prototype,{
	initDomReferences: function() {
		slbuilder.ui.ListWidget.prototype.initDomReferences.call(this);
	}
	,refresh: function() {
		var pages = slbuilder.core.SLBuilder.getInstance().getPages();
		var arraArray = Ext.Array.from(pages);
		this.arrayStore.loadData(arraArray);
		slbuilder.ui.ListWidget.prototype.refresh.call(this);
	}
	,add: function(e) {
		var deeplink = js.Lib.window.prompt("What deeplink for this new page?");
		var page = slbuilder.core.SLBuilder.getInstance().createPage(deeplink);
		slbuilder.core.SLBuilder.getInstance().setProperty(page.id,"displayName","New Page");
		slbuilder.ui.ListWidget.prototype.add.call(this,e);
	}
	,remove: function(e) {
		slbuilder.core.SLBuilder.getInstance().removePage(this.grid.selModel.selected.items[0].data.id);
		slbuilder.ui.ListWidget.prototype.remove.call(this,e);
	}
	,onSelectionChanged: function(model,records) {
		slbuilder.ui.ListWidget.prototype.onSelectionChanged.call(this,model,records);
	}
	,initExtJsUi: function() {
		slbuilder.ui.ListWidget.prototype.initExtJsUi.call(this);
	}
	,__class__: slbuilder.ui.PagesWidget
});
js.Boot.__res = {}
js.Boot.__init();
{
	Math.__name__ = ["Math"];
	Math.NaN = Number["NaN"];
	Math.NEGATIVE_INFINITY = Number["NEGATIVE_INFINITY"];
	Math.POSITIVE_INFINITY = Number["POSITIVE_INFINITY"];
	$hxClasses["Math"] = Math;
	Math.isFinite = function(i) {
		return isFinite(i);
	};
	Math.isNaN = function(i) {
		return isNaN(i);
	};
}
{
	String.prototype.__class__ = $hxClasses["String"] = String;
	String.__name__ = ["String"];
	Array.prototype.__class__ = $hxClasses["Array"] = Array;
	Array.__name__ = ["Array"];
	var Int = $hxClasses["Int"] = { __name__ : ["Int"]};
	var Dynamic = $hxClasses["Dynamic"] = { __name__ : ["Dynamic"]};
	var Float = $hxClasses["Float"] = Number;
	Float.__name__ = ["Float"];
	var Bool = $hxClasses["Bool"] = Boolean;
	Bool.__ename__ = ["Bool"];
	var Class = $hxClasses["Class"] = { __name__ : ["Class"]};
	var Enum = { };
	var Void = $hxClasses["Void"] = { __ename__ : ["Void"]};
}
{
	if(typeof document != "undefined") js.Lib.document = document;
	if(typeof window != "undefined") {
		js.Lib.window = window;
		js.Lib.window.onerror = function(msg,url,line) {
			var f = js.Lib.onerror;
			if(f == null) return false;
			return f(msg,[url + ":" + line]);
		};
	}
}
js["XMLHttpRequest"] = window.XMLHttpRequest?XMLHttpRequest:window.ActiveXObject?function() {
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch( e ) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch( e1 ) {
			throw "Unable to create XMLHttpRequest object.";
		}
	}
}:(function($this) {
	var $r;
	throw "Unable to create XMLHttpRequest object.";
	return $r;
}(this));
demo.Descriptor.div = [{ name : "style.position", displayName : "css position", parentId : null, value : null, defaultValue : "relative", canBeNull : false, description : "CSS style postions (absolute, relative, ...)"},{ name : "style.top", displayName : "css top", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style top (y position)"},{ name : "style.bottom", displayName : "css bottom", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style bottom (y position)"},{ name : "style.left", displayName : "css left", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style left (y position)"},{ name : "style.right", displayName : "css right", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style right (y position)"},{ name : "style.width", displayName : "css width", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style width (y position)"},{ name : "style.height", displayName : "css height", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style height (y position)"}];
haxe.Template.splitter = new EReg("(::[A-Za-z0-9_ ()&|!+=/><*.\"-]+::|\\$\\$([A-Za-z0-9_-]+)\\()","");
haxe.Template.expr_splitter = new EReg("(\\(|\\)|[ \r\n\t]*\"[^\"]*\"[ \r\n\t]*|[!+=/><*.&|-]+)","");
haxe.Template.expr_trim = new EReg("^[ ]*([^ ]+)[ ]*$","");
haxe.Template.expr_int = new EReg("^[0-9]+$","");
haxe.Template.expr_float = new EReg("^([+-]?)(?=\\d|,\\d)\\d*(,\\d*)?([Ee]([+-]?\\d+))?$","");
haxe.Template.globals = { };
js.Lib.onerror = null;
slbuilder.core.Config.VIEW_MENU_HEIGHT = "20px";
slbuilder.core.Template.DEFAULT_TEMPLATE_FOLDER_PATH = "templates/";
slbuilder.core.Template.DEFAULT_TEMPLATE_EXTENSION = ".html";
MainJs.main()