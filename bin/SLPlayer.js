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
var Lambda = $hxClasses["Lambda"] = function() { }
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = it.iterator();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.list = function(it) {
	var l = new List();
	var $it0 = it.iterator();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = it.iterator();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.mapi = function(it,f) {
	var l = new List();
	var i = 0;
	var $it0 = it.iterator();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(i++,x));
	}
	return l;
}
Lambda.has = function(it,elt,cmp) {
	if(cmp == null) {
		var $it0 = it.iterator();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			if(x == elt) return true;
		}
	} else {
		var $it1 = it.iterator();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(cmp(x,elt)) return true;
		}
	}
	return false;
}
Lambda.exists = function(it,f) {
	var $it0 = it.iterator();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
}
Lambda.foreach = function(it,f) {
	var $it0 = it.iterator();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
}
Lambda.iter = function(it,f) {
	var $it0 = it.iterator();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = it.iterator();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = it.iterator();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = it.iterator();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = it.iterator();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
Lambda.empty = function(it) {
	return !it.iterator().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = it.iterator();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = a.iterator();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = b.iterator();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
Lambda.prototype = {
	__class__: Lambda
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
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if(o.__enum__ != null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || cl.__name__ == null) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || e.__ename__ == null) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	a.remove("__class__");
	a.remove("__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	a.remove("__name__");
	a.remove("__interfaces__");
	a.remove("__properties__");
	a.remove("__super__");
	a.remove("prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.copy();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ != null) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
Type.prototype = {
	__class__: Type
}
var demo = demo || {}
demo.Application = $hxClasses["demo.Application"] = function() {
	this.slBuilderBridge = new demo.SLBuilderBridge();
	slbuilder.core.SLBuilder.getInstance().slBuilderBridge = this.slBuilderBridge;
	haxe.Log.trace("Demo Application stated ",{ fileName : "Application.hx", lineNumber : 20, className : "demo.Application", methodName : "new"});
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
		var parent = js.Lib.document.getElementById("root_element_for_demo");
		if(parent == null) throw "element not found in index.html";
		parent.appendChild(res);
		return { id : id, displayName : id.seed, deeplink : deeplink};
	}
	,removePage: function(id) {
		haxe.Log.trace("removePage(" + id.seed,{ fileName : "SLBuilderBridge.hx", lineNumber : 58, className : "demo.SLBuilderBridge", methodName : "removePage"});
		if(id.type != slbuilder.data.ElementType.page) throw "Error: trying to remove a page, but the ID is the ID of a " + Std.string(id.type);
		var element = js.Lib.document.getElementById(id.seed);
		if(element != null) {
			element.parentNode.removeChild(element);
			return true;
		}
		return false;
	}
	,getPages: function() {
		var parent = js.Lib.document.getElementById("root_element_for_demo");
		if(parent == null) throw "element not found in index.html";
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
		var parent = js.Lib.document.getElementById(parentId.seed);
		if(parent == null) throw "element not found in index.html";
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
haxe.Md5 = $hxClasses["haxe.Md5"] = function() {
};
haxe.Md5.__name__ = ["haxe","Md5"];
haxe.Md5.encode = function(s) {
	return new haxe.Md5().doEncode(s);
}
haxe.Md5.prototype = {
	bitOR: function(a,b) {
		var lsb = a & 1 | b & 1;
		var msb31 = a >>> 1 | b >>> 1;
		return msb31 << 1 | lsb;
	}
	,bitXOR: function(a,b) {
		var lsb = a & 1 ^ b & 1;
		var msb31 = a >>> 1 ^ b >>> 1;
		return msb31 << 1 | lsb;
	}
	,bitAND: function(a,b) {
		var lsb = a & 1 & (b & 1);
		var msb31 = a >>> 1 & b >>> 1;
		return msb31 << 1 | lsb;
	}
	,addme: function(x,y) {
		var lsw = (x & 65535) + (y & 65535);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return msw << 16 | lsw & 65535;
	}
	,rhex: function(num) {
		var str = "";
		var hex_chr = "0123456789abcdef";
		var _g = 0;
		while(_g < 4) {
			var j = _g++;
			str += hex_chr.charAt(num >> j * 8 + 4 & 15) + hex_chr.charAt(num >> j * 8 & 15);
		}
		return str;
	}
	,str2blks: function(str) {
		var nblk = (str.length + 8 >> 6) + 1;
		var blks = new Array();
		var _g1 = 0, _g = nblk * 16;
		while(_g1 < _g) {
			var i = _g1++;
			blks[i] = 0;
		}
		var i = 0;
		while(i < str.length) {
			blks[i >> 2] |= str.charCodeAt(i) << (str.length * 8 + i) % 4 * 8;
			i++;
		}
		blks[i >> 2] |= 128 << (str.length * 8 + i) % 4 * 8;
		var l = str.length * 8;
		var k = nblk * 16 - 2;
		blks[k] = l & 255;
		blks[k] |= (l >>> 8 & 255) << 8;
		blks[k] |= (l >>> 16 & 255) << 16;
		blks[k] |= (l >>> 24 & 255) << 24;
		return blks;
	}
	,rol: function(num,cnt) {
		return num << cnt | num >>> 32 - cnt;
	}
	,cmn: function(q,a,b,x,s,t) {
		return this.addme(this.rol(this.addme(this.addme(a,q),this.addme(x,t)),s),b);
	}
	,ff: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitOR(this.bitAND(b,c),this.bitAND(~b,d)),a,b,x,s,t);
	}
	,gg: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitOR(this.bitAND(b,d),this.bitAND(c,~d)),a,b,x,s,t);
	}
	,hh: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitXOR(this.bitXOR(b,c),d),a,b,x,s,t);
	}
	,ii: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitXOR(c,this.bitOR(b,~d)),a,b,x,s,t);
	}
	,doEncode: function(str) {
		var x = this.str2blks(str);
		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;
		var step;
		var i = 0;
		while(i < x.length) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			step = 0;
			a = this.ff(a,b,c,d,x[i],7,-680876936);
			d = this.ff(d,a,b,c,x[i + 1],12,-389564586);
			c = this.ff(c,d,a,b,x[i + 2],17,606105819);
			b = this.ff(b,c,d,a,x[i + 3],22,-1044525330);
			a = this.ff(a,b,c,d,x[i + 4],7,-176418897);
			d = this.ff(d,a,b,c,x[i + 5],12,1200080426);
			c = this.ff(c,d,a,b,x[i + 6],17,-1473231341);
			b = this.ff(b,c,d,a,x[i + 7],22,-45705983);
			a = this.ff(a,b,c,d,x[i + 8],7,1770035416);
			d = this.ff(d,a,b,c,x[i + 9],12,-1958414417);
			c = this.ff(c,d,a,b,x[i + 10],17,-42063);
			b = this.ff(b,c,d,a,x[i + 11],22,-1990404162);
			a = this.ff(a,b,c,d,x[i + 12],7,1804603682);
			d = this.ff(d,a,b,c,x[i + 13],12,-40341101);
			c = this.ff(c,d,a,b,x[i + 14],17,-1502002290);
			b = this.ff(b,c,d,a,x[i + 15],22,1236535329);
			a = this.gg(a,b,c,d,x[i + 1],5,-165796510);
			d = this.gg(d,a,b,c,x[i + 6],9,-1069501632);
			c = this.gg(c,d,a,b,x[i + 11],14,643717713);
			b = this.gg(b,c,d,a,x[i],20,-373897302);
			a = this.gg(a,b,c,d,x[i + 5],5,-701558691);
			d = this.gg(d,a,b,c,x[i + 10],9,38016083);
			c = this.gg(c,d,a,b,x[i + 15],14,-660478335);
			b = this.gg(b,c,d,a,x[i + 4],20,-405537848);
			a = this.gg(a,b,c,d,x[i + 9],5,568446438);
			d = this.gg(d,a,b,c,x[i + 14],9,-1019803690);
			c = this.gg(c,d,a,b,x[i + 3],14,-187363961);
			b = this.gg(b,c,d,a,x[i + 8],20,1163531501);
			a = this.gg(a,b,c,d,x[i + 13],5,-1444681467);
			d = this.gg(d,a,b,c,x[i + 2],9,-51403784);
			c = this.gg(c,d,a,b,x[i + 7],14,1735328473);
			b = this.gg(b,c,d,a,x[i + 12],20,-1926607734);
			a = this.hh(a,b,c,d,x[i + 5],4,-378558);
			d = this.hh(d,a,b,c,x[i + 8],11,-2022574463);
			c = this.hh(c,d,a,b,x[i + 11],16,1839030562);
			b = this.hh(b,c,d,a,x[i + 14],23,-35309556);
			a = this.hh(a,b,c,d,x[i + 1],4,-1530992060);
			d = this.hh(d,a,b,c,x[i + 4],11,1272893353);
			c = this.hh(c,d,a,b,x[i + 7],16,-155497632);
			b = this.hh(b,c,d,a,x[i + 10],23,-1094730640);
			a = this.hh(a,b,c,d,x[i + 13],4,681279174);
			d = this.hh(d,a,b,c,x[i],11,-358537222);
			c = this.hh(c,d,a,b,x[i + 3],16,-722521979);
			b = this.hh(b,c,d,a,x[i + 6],23,76029189);
			a = this.hh(a,b,c,d,x[i + 9],4,-640364487);
			d = this.hh(d,a,b,c,x[i + 12],11,-421815835);
			c = this.hh(c,d,a,b,x[i + 15],16,530742520);
			b = this.hh(b,c,d,a,x[i + 2],23,-995338651);
			a = this.ii(a,b,c,d,x[i],6,-198630844);
			d = this.ii(d,a,b,c,x[i + 7],10,1126891415);
			c = this.ii(c,d,a,b,x[i + 14],15,-1416354905);
			b = this.ii(b,c,d,a,x[i + 5],21,-57434055);
			a = this.ii(a,b,c,d,x[i + 12],6,1700485571);
			d = this.ii(d,a,b,c,x[i + 3],10,-1894986606);
			c = this.ii(c,d,a,b,x[i + 10],15,-1051523);
			b = this.ii(b,c,d,a,x[i + 1],21,-2054922799);
			a = this.ii(a,b,c,d,x[i + 8],6,1873313359);
			d = this.ii(d,a,b,c,x[i + 15],10,-30611744);
			c = this.ii(c,d,a,b,x[i + 6],15,-1560198380);
			b = this.ii(b,c,d,a,x[i + 13],21,1309151649);
			a = this.ii(a,b,c,d,x[i + 4],6,-145523070);
			d = this.ii(d,a,b,c,x[i + 11],10,-1120210379);
			c = this.ii(c,d,a,b,x[i + 2],15,718787259);
			b = this.ii(b,c,d,a,x[i + 9],21,-343485551);
			a = this.addme(a,olda);
			b = this.addme(b,oldb);
			c = this.addme(c,oldc);
			d = this.addme(d,oldd);
			i += 16;
		}
		return this.rhex(a) + this.rhex(b) + this.rhex(c) + this.rhex(d);
	}
	,__class__: haxe.Md5
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
	haxe.Firebug.redirectTraces();
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
var slplayer = slplayer || {}
if(!slplayer.ui) slplayer.ui = {}
slplayer.ui.DisplayObject = $hxClasses["slplayer.ui.DisplayObject"] = function(rootElement) {
	this.rootElement = rootElement;
	if(!this.checkFilterOnElt(rootElement)) throw "ERROR: cannot instantiate " + Type.getClassName(Type.getClass(this)) + " on a " + rootElement.nodeName + " element.";
	slplayer.core.SLPlayer.addAssociatedComponent(rootElement,this);
};
slplayer.ui.DisplayObject.__name__ = ["slplayer","ui","DisplayObject"];
slplayer.ui.DisplayObject.prototype = {
	rootElement: null
	,checkFilterOnElt: function(elt) {
		if(elt.nodeType != js.Lib.document.body.nodeType) return false;
		var tagFilter = Reflect.field(Type.getClass(this),"rootElementNameFilter");
		if(tagFilter == null || tagFilter.isEmpty()) return true;
		if(Lambda.exists(tagFilter,function(s) {
			return elt.nodeName.toLowerCase() == s.toLowerCase();
		})) return true;
		return false;
	}
	,init: function() {
	}
	,__class__: slplayer.ui.DisplayObject
}
if(!slbuilder.ui) slbuilder.ui = {}
slbuilder.ui.ListWidget = $hxClasses["slbuilder.ui.ListWidget"] = function(d) {
	this._isInit = false;
	slplayer.ui.DisplayObject.call(this,d);
};
slbuilder.ui.ListWidget.__name__ = ["slbuilder","ui","ListWidget"];
slbuilder.ui.ListWidget.__super__ = slplayer.ui.DisplayObject;
slbuilder.ui.ListWidget.prototype = $extend(slplayer.ui.DisplayObject.prototype,{
	_isInit: null
	,list: null
	,listTemplate: null
	,dataProvider: null
	,selectedItem: null
	,_selectedItem: null
	,onChange: null
	,addBtn: null
	,removeBtn: null
	,header: null
	,footer: null
	,init: function() {
		slplayer.ui.DisplayObject.prototype.init.call(this);
		this.addBtn = slbuilder.core.Utils.getElementsByClassName(this.rootElement,"add")[0];
		if(this.addBtn != null) this.addBtn.onclick = this.add.$bind(this);
		this.removeBtn = slbuilder.core.Utils.getElementsByClassName(this.rootElement,"remove")[0];
		if(this.removeBtn != null) this.removeBtn.onclick = this.remove.$bind(this);
		this.footer = slbuilder.core.Utils.getElementsByClassName(this.rootElement,"toolboxfooter")[0];
		if(this.footer == null) throw "element not found in index.html";
		this.header = slbuilder.core.Utils.getElementsByClassName(this.rootElement,"toolboxheader")[0];
		if(this.header == null) throw "element not found in index.html";
		var _this_ = this;
		window.addEventListener('resize', _this_.refresh);;
		this.list = slbuilder.core.Utils.getElementsByClassName(this.rootElement,"list")[0];
		if(this.list == null) throw "element not found in index.html";
		this.listTemplate = this.list.innerHTML;
		this._isInit = true;
		this.refresh();
	}
	,refresh: function() {
		if(this._isInit == false) return;
		var listInnerHtml = "";
		var t = new haxe.Template(this.listTemplate);
		var _g = 0, _g1 = this.dataProvider;
		while(_g < _g1.length) {
			var elem = _g1[_g];
			++_g;
			listInnerHtml += t.execute(elem);
		}
		this.list.innerHTML = listInnerHtml;
		this.attachListEvents();
		this.setSelectedItem(null);
		var availableHeight = this.rootElement.parentNode.clientHeight;
		availableHeight -= this.header.clientHeight;
		availableHeight -= this.footer.clientHeight;
		this.list.style.height = availableHeight + "px";
	}
	,attachListEvents: function() {
		var children = slbuilder.core.Utils.getElementsByClassName(this.list,"listItem");
		var _g1 = 0, _g = children.length;
		while(_g1 < _g) {
			var idx = _g1++;
			children[idx]["data-listwidgetitemidx"] = Std.string(idx);
			children[idx].onclick = this.onClick.$bind(this);
			children[idx].style.cursor = "pointer";
		}
	}
	,onClick: function(e) {
		var idx = Std.parseInt(Reflect.field(e.target,"data-listwidgetitemidx"));
		this.setSelectedItem(this.dataProvider[idx]);
	}
	,add: function(e) {
		this.refresh();
	}
	,remove: function(e) {
		this.refresh();
	}
	,onSelectionChanged: function(selection) {
		haxe.Log.trace("-selection changed-",{ fileName : "ListWidget.hx", lineNumber : 167, className : "slbuilder.ui.ListWidget", methodName : "onSelectionChanged"});
		var children = slbuilder.core.Utils.getElementsByClassName(this.list,"listItem");
		var _g1 = 0, _g = children.length;
		while(_g1 < _g) {
			var idx = _g1++;
			var idxElem = Std.parseInt(Reflect.field(children[idx],"data-listwidgetitemidx"));
			if(idxElem >= 0) {
				var found = false;
				var _g2 = 0;
				while(_g2 < selection.length) {
					var elem = selection[_g2];
					++_g2;
					if(elem == this.dataProvider[idxElem]) {
						found = true;
						break;
					}
				}
				if(children[idx] == null) {
					haxe.Log.trace("--workaround--" + idx + "- " + children[idx],{ fileName : "ListWidget.hx", lineNumber : 183, className : "slbuilder.ui.ListWidget", methodName : "onSelectionChanged"});
					continue;
				}
				var className = "";
				className = children[idx].className;
				if(found) {
					haxe.Log.trace("element selected " + idx + ": " + children[idx],{ fileName : "ListWidget.hx", lineNumber : 192, className : "slbuilder.ui.ListWidget", methodName : "onSelectionChanged"});
					if(className.indexOf("listSelectedItem") < 0) className += " " + "listSelectedItem";
				} else {
					var pos = className.indexOf("listSelectedItem");
					haxe.Log.trace("element " + idx + " not selected : " + className + " - " + pos,{ fileName : "ListWidget.hx", lineNumber : 198, className : "slbuilder.ui.ListWidget", methodName : "onSelectionChanged"});
					if(pos >= 0) {
						var tmp = className;
						className = StringTools.trim(className.substr(0,pos));
						className += " " + StringTools.trim(tmp.substr(pos + "listSelectedItem".length));
					}
				}
				children[idx].className = className;
			}
		}
		if(this.onChange != null) this.onChange(this._selectedItem);
	}
	,getSelectedItem: function() {
		return this._selectedItem;
	}
	,setSelectedItem: function(selected) {
		if(selected != this._selectedItem) {
			this._selectedItem = selected;
			this.onSelectionChanged([selected]);
		}
		return selected;
	}
	,__class__: slbuilder.ui.ListWidget
	,__properties__: {set_selectedItem:"setSelectedItem",get_selectedItem:"getSelectedItem"}
});
slbuilder.ui.ComponentsWidget = $hxClasses["slbuilder.ui.ComponentsWidget"] = function(d) {
	slbuilder.ui.ListWidget.call(this,d);
};
slbuilder.ui.ComponentsWidget.__name__ = ["slbuilder","ui","ComponentsWidget"];
slbuilder.ui.ComponentsWidget.__super__ = slbuilder.ui.ListWidget;
slbuilder.ui.ComponentsWidget.prototype = $extend(slbuilder.ui.ListWidget.prototype,{
	parentId: null
	,init: function() {
		haxe.Log.trace("COMPONENTS WIDGET INIT ",{ fileName : "ComponentsWidget.hx", lineNumber : 35, className : "slbuilder.ui.ComponentsWidget", methodName : "init"});
		slbuilder.ui.ListWidget.prototype.init.call(this);
	}
	,refresh: function() {
		if(this._isInit == false) return;
		if(this.parentId != null) this.dataProvider = slbuilder.core.SLBuilder.getInstance().getComponents(this.parentId); else this.dataProvider = new Array();
		slbuilder.ui.ListWidget.prototype.refresh.call(this);
	}
	,add: function(e) {
		var component = slbuilder.core.SLBuilder.getInstance().createComponent("basicComponent",this.parentId);
		slbuilder.core.SLBuilder.getInstance().setProperty(component.id,"displayName","New Component");
		slbuilder.ui.ListWidget.prototype.add.call(this,e);
	}
	,remove: function(e) {
		slbuilder.core.SLBuilder.getInstance().removeComponent(this.getSelectedItem().id);
		slbuilder.ui.ListWidget.prototype.remove.call(this,e);
	}
	,__class__: slbuilder.ui.ComponentsWidget
});
slbuilder.ui.LayersWidget = $hxClasses["slbuilder.ui.LayersWidget"] = function(d) {
	slbuilder.ui.ListWidget.call(this,d);
};
slbuilder.ui.LayersWidget.__name__ = ["slbuilder","ui","LayersWidget"];
slbuilder.ui.LayersWidget.__super__ = slbuilder.ui.ListWidget;
slbuilder.ui.LayersWidget.prototype = $extend(slbuilder.ui.ListWidget.prototype,{
	parentId: null
	,pagesDropDown: null
	,pagesDropDownTemplate: null
	,addPageBtn: null
	,removePageBtn: null
	,onPageChange: null
	,init: function() {
		this.pagesDropDown = slbuilder.core.Utils.getElementsByClassName(this.rootElement,"dropdown")[0];
		if(this.pagesDropDown == null) throw "element not found in index.html";
		this.pagesDropDownTemplate = this.pagesDropDown.innerHTML;
		var _this_ = this;
		_this_.pagesDropDown.onchange = function(e){_this_.onPageClick(e)}
		this.addPageBtn = slbuilder.core.Utils.getElementsByClassName(this.rootElement,"addPage")[0];
		if(this.addPageBtn == null) throw "element not found in index.html";
		this.addPageBtn.onclick = this.addPage.$bind(this);
		this.removePageBtn = slbuilder.core.Utils.getElementsByClassName(this.rootElement,"removePage")[0];
		if(this.removePageBtn == null) throw "element not found in index.html";
		this.removePageBtn.onclick = this.removePage.$bind(this);
		slbuilder.ui.ListWidget.prototype.init.call(this);
		this.refresh();
		this.onPageClick();
	}
	,onPageClick: function(e) {
		var idx = -1;
		var _this_ = this;
		idx = _this_.pagesDropDown.selectedIndex;
		var dataProviderPages = slbuilder.core.SLBuilder.getInstance().getPages();
		this.parentId = dataProviderPages[idx].id;
		haxe.Log.trace("PAGE SELECTED : " + this.parentId,{ fileName : "LayersWidget.hx", lineNumber : 86, className : "slbuilder.ui.LayersWidget", methodName : "onPageClick"});
		this.refresh();
	}
	,refresh: function() {
		if(this._isInit == false) return;
		var _this_ = this;
		var oldIdx = _this_.pagesDropDown.selectedIndex;
		if(oldIdx <= 0) oldIdx = 0;
		var dataProviderPages = slbuilder.core.SLBuilder.getInstance().getPages();
		var listInnerHtml = "";
		var t = new haxe.Template(this.pagesDropDownTemplate);
		var _g = 0;
		while(_g < dataProviderPages.length) {
			var elem = dataProviderPages[_g];
			++_g;
			listInnerHtml += t.execute(elem);
		}
		this.pagesDropDown.innerHTML = listInnerHtml;
		_this_.pagesDropDown.selectedIndex = oldIdx;
		if(this.parentId != null) this.dataProvider = slbuilder.core.SLBuilder.getInstance().getLayers(this.parentId); else this.dataProvider = new Array();
		slbuilder.ui.ListWidget.prototype.refresh.call(this);
	}
	,add: function(e) {
		var layer = slbuilder.core.SLBuilder.getInstance().createLayer("basicLayer",this.parentId);
		slbuilder.core.SLBuilder.getInstance().setProperty(layer.id,"displayName","New Layer");
		slbuilder.ui.ListWidget.prototype.add.call(this,e);
	}
	,remove: function(e) {
		slbuilder.core.SLBuilder.getInstance().removeLayer(this.getSelectedItem().id);
		slbuilder.ui.ListWidget.prototype.remove.call(this,e);
	}
	,addPage: function(e) {
		var deeplink = js.Lib.window.prompt("Deeplink for the new page");
		if(deeplink != null && deeplink != "") {
			var page = slbuilder.core.SLBuilder.getInstance().createPage(deeplink);
			slbuilder.core.SLBuilder.getInstance().setProperty(page.id,"displayName",deeplink);
			this.refresh();
		}
	}
	,removePage: function(e) {
		slbuilder.core.SLBuilder.getInstance().removePage(this.parentId);
		this.refresh();
		this.onPageClick();
	}
	,__class__: slbuilder.ui.LayersWidget
});
slbuilder.ui.PropertiesWidget = $hxClasses["slbuilder.ui.PropertiesWidget"] = function(d) {
	slbuilder.ui.ListWidget.call(this,d);
};
slbuilder.ui.PropertiesWidget.__name__ = ["slbuilder","ui","PropertiesWidget"];
slbuilder.ui.PropertiesWidget.__super__ = slbuilder.ui.ListWidget;
slbuilder.ui.PropertiesWidget.prototype = $extend(slbuilder.ui.ListWidget.prototype,{
	parentId: null
	,submitBtn: null
	,init: function() {
		var me = this;
		slbuilder.ui.ListWidget.prototype.init.call(this);
		this.submitBtn = slbuilder.core.Utils.getElementsByClassName(this.rootElement,"submit")[0];
		if(this.submitBtn == null) throw "element not found in index.html";
		this.submitBtn.onclick = this.onSubmit.$bind(this);
		this.list.onkeydown = function(e) {
			if(e.keyCode == 13) me.onSubmit(e);
		};
	}
	,onSubmit: function(e) {
		haxe.Log.trace("onSubmit",{ fileName : "PropertiesWidget.hx", lineNumber : 48, className : "slbuilder.ui.PropertiesWidget", methodName : "onSubmit"});
		var inputs = slbuilder.core.Utils.getElementsByClassName(this.rootElement,"input");
		var _g1 = 0, _g = this.dataProvider.length;
		while(_g1 < _g) {
			var idx = _g1++;
			haxe.Log.trace(idx,{ fileName : "PropertiesWidget.hx", lineNumber : 51, className : "slbuilder.ui.PropertiesWidget", methodName : "onSubmit"});
			this.dataProvider[idx].value = Reflect.field(inputs[idx],"value");
			slbuilder.core.SLBuilder.getInstance().setProperty(this.parentId,this.dataProvider[idx].name,this.dataProvider[idx].value);
		}
	}
	,refresh: function() {
		if(this._isInit == false) return;
		if(this.parentId != null) this.dataProvider = slbuilder.core.SLBuilder.getInstance().getProperties(this.parentId); else this.dataProvider = new Array();
		slbuilder.ui.ListWidget.prototype.refresh.call(this);
	}
	,onSelectionChanged: function(selection) {
	}
	,__class__: slbuilder.ui.PropertiesWidget
});
slbuilder.ui.ToolBoxes = $hxClasses["slbuilder.ui.ToolBoxes"] = function(rootElement) {
	slplayer.ui.DisplayObject.call(this,rootElement);
};
slbuilder.ui.ToolBoxes.__name__ = ["slbuilder","ui","ToolBoxes"];
slbuilder.ui.ToolBoxes.__super__ = slplayer.ui.DisplayObject;
slbuilder.ui.ToolBoxes.prototype = $extend(slplayer.ui.DisplayObject.prototype,{
	layersWidget: null
	,componentsWidget: null
	,propertiesWidget: null
	,init: function() {
		haxe.Log.trace("ToolBoxes init",{ fileName : "ToolBoxes.hx", lineNumber : 48, className : "slbuilder.ui.ToolBoxes", methodName : "init"});
		this.initUis();
	}
	,initUis: function() {
		var domElem;
		domElem = slbuilder.core.Utils.getElementsByClassName(this.rootElement,"LayersWidget")[0];
		if(domElem == null) throw "element not found in index.html";
		this.layersWidget = slplayer.core.SLPlayer.getAssociatedComponents(domElem).first();
		this.layersWidget.onChange = this.onLayerChange.$bind(this);
		this.layersWidget.onPageChange = this.onPageChange.$bind(this);
		domElem = slbuilder.core.Utils.getElementsByClassName(this.rootElement,"ComponentsWidget")[0];
		if(domElem == null) throw "element not found in index.html";
		this.componentsWidget = slplayer.core.SLPlayer.getAssociatedComponents(domElem).first();
		this.componentsWidget.onChange = this.onComponentChange.$bind(this);
		domElem = slbuilder.core.Utils.getElementsByClassName(this.rootElement,"PropertiesWidget")[0];
		if(domElem == null) throw "element not found in index.html";
		this.propertiesWidget = slplayer.core.SLPlayer.getAssociatedComponents(domElem).first();
		this.propertiesWidget.onChange = this.onPropertyChange.$bind(this);
	}
	,onPageChange: function(page) {
	}
	,onLayerChange: function(layer) {
		var displayName = "none";
		if(layer != null) {
			displayName = layer.displayName;
			this.componentsWidget.parentId = layer.id;
		} else this.componentsWidget.parentId = null;
		this.componentsWidget.refresh();
		haxe.Log.trace("Layer selected: " + displayName,{ fileName : "ToolBoxes.hx", lineNumber : 84, className : "slbuilder.ui.ToolBoxes", methodName : "onLayerChange"});
	}
	,onComponentChange: function(component) {
		var displayName = "none";
		if(component != null) {
			displayName = component.displayName;
			this.propertiesWidget.parentId = component.id;
		} else this.propertiesWidget.parentId = null;
		this.propertiesWidget.refresh();
		haxe.Log.trace("Component selected: " + displayName,{ fileName : "ToolBoxes.hx", lineNumber : 97, className : "slbuilder.ui.ToolBoxes", methodName : "onComponentChange"});
	}
	,onPropertyChange: function(property) {
		haxe.Log.trace("Property change: " + property.displayName + " = " + property.value,{ fileName : "ToolBoxes.hx", lineNumber : 100, className : "slbuilder.ui.ToolBoxes", methodName : "onPropertyChange"});
	}
	,__class__: slbuilder.ui.ToolBoxes
});
if(!slplayer.core) slplayer.core = {}
slplayer.core.SLPlayer = $hxClasses["slplayer.core.SLPlayer"] = function() {
	this.registeredComponents = new Hash();
};
slplayer.core.SLPlayer.__name__ = ["slplayer","core","SLPlayer"];
slplayer.core.SLPlayer.main = function() {
	var mySLPlayerApp = new slplayer.core.SLPlayer();
	js.Lib.window.onload = function(e) {
		mySLPlayerApp.registerComponentsforInit();
		mySLPlayerApp.initComponents();
	};
}
slplayer.core.SLPlayer.addAssociatedComponent = function(node,cmp) {
	var nodeId = node.getAttribute("data-" + slplayer.core.SLPlayer.SLPID_ATTR_NAME);
	var associatedCmps;
	if(nodeId != null) associatedCmps = slplayer.core.SLPlayer.nodeToCmpInstances.get(nodeId); else {
		nodeId = haxe.Md5.encode(Std.string(Math.random()) + Date.now().toString());
		node.setAttribute("data-" + slplayer.core.SLPlayer.SLPID_ATTR_NAME,nodeId);
		associatedCmps = new List();
	}
	associatedCmps.add(cmp);
	slplayer.core.SLPlayer.nodeToCmpInstances.set(nodeId,associatedCmps);
}
slplayer.core.SLPlayer.getAssociatedComponents = function(node) {
	var nodeId = node.getAttribute("data-" + slplayer.core.SLPlayer.SLPID_ATTR_NAME);
	if(nodeId != null) return slplayer.core.SLPlayer.nodeToCmpInstances.get(nodeId);
	return null;
}
slplayer.core.SLPlayer.prototype = {
	registeredComponents: null
	,registerComponentsforInit: function() {
		demo.Application;
		this.registerComponent("demo.Application");
		slbuilder.ui.ToolBoxes;
		this.registerComponent("slbuilder.ui.ToolBoxes");
		slbuilder.ui.LayersWidget;
		this.registerComponent("slbuilder.ui.LayersWidget");
		slbuilder.ui.ComponentsWidget;
		this.registerComponent("slbuilder.ui.ComponentsWidget");
		slbuilder.ui.PropertiesWidget;
		this.registerComponent("slbuilder.ui.PropertiesWidget");
	}
	,registerComponent: function(componentClassName,args) {
		this.registeredComponents.set(componentClassName,args);
	}
	,initComponents: function() {
		var registeredComponentsClassNames = this.registeredComponents.keys();
		while(registeredComponentsClassNames.hasNext()) {
			var registeredComponentsClassName = registeredComponentsClassNames.next();
			this.createComponentsOfType(registeredComponentsClassName,this.registeredComponents.get(registeredComponentsClassName));
		}
		this.callInitOnComponents();
	}
	,createComponentsOfType: function(componentClassName,args) {
		var componentClass = Type.resolveClass(componentClassName);
		if(componentClass == null) {
			haxe.Log.trace("WARNING cannot resolve " + componentClassName,{ fileName : "SLPlayer.hx", lineNumber : 102, className : "slplayer.core.SLPlayer", methodName : "createComponentsOfType"});
			return;
		}
		if(this.isDisplayObject(componentClass)) {
			var classTag = this.getUnconflictedClassTag(componentClassName);
			var taggedNodes = new Array();
			var taggedNodesCollection = js.Lib.document.getElementsByClassName(classTag);
			var _g1 = 0, _g = taggedNodesCollection.length;
			while(_g1 < _g) {
				var nodeCnt = _g1++;
				taggedNodes.push(taggedNodesCollection[nodeCnt]);
			}
			if(componentClassName != classTag) {
				taggedNodesCollection = js.Lib.document.getElementsByClassName(componentClassName);
				var _g1 = 0, _g = taggedNodesCollection.length;
				while(_g1 < _g) {
					var nodeCnt = _g1++;
					taggedNodes.push(taggedNodesCollection[nodeCnt]);
				}
			}
			var _g = 0;
			while(_g < taggedNodes.length) {
				var node = taggedNodes[_g];
				++_g;
				var newDisplayObject;
				try {
					newDisplayObject = Type.createInstance(componentClass,[node]);
				} catch( unknown ) {
					haxe.Log.trace(Std.string(unknown),{ fileName : "SLPlayer.hx", lineNumber : 137, className : "slplayer.core.SLPlayer", methodName : "createComponentsOfType"});
				}
			}
		} else try {
			if(args != null) Type.createInstance(componentClass,[args]); else Type.createInstance(componentClass,[]);
		} catch( unknown ) {
			haxe.Log.trace(Std.string(unknown),{ fileName : "SLPlayer.hx", lineNumber : 149, className : "slplayer.core.SLPlayer", methodName : "createComponentsOfType"});
		}
	}
	,callInitOnComponents: function() {
		var $it0 = slplayer.core.SLPlayer.nodeToCmpInstances.iterator();
		while( $it0.hasNext() ) {
			var l = $it0.next();
			var $it1 = l.iterator();
			while( $it1.hasNext() ) {
				var c = $it1.next();
				c.init();
			}
		}
	}
	,getUnconflictedClassTag: function(displayObjectClassName) {
		var classTag = displayObjectClassName;
		if(classTag.indexOf(".") != -1) classTag = classTag.substr(classTag.lastIndexOf(".") + 1);
		var registeredComponentsClassNames = this.registeredComponents.keys();
		while(registeredComponentsClassNames.hasNext()) {
			var registeredComponentClassName = registeredComponentsClassNames.next();
			if(classTag == registeredComponentClassName.substr(classTag.lastIndexOf(".") + 1)) return displayObjectClassName;
		}
		return classTag;
	}
	,isDisplayObject: function(cmpClass) {
		if(cmpClass == Type.resolveClass("slplayer.ui.DisplayObject")) return true;
		if(Type.getSuperClass(cmpClass) != null) return this.isDisplayObject(Type.getSuperClass(cmpClass));
		return false;
	}
	,__class__: slplayer.core.SLPlayer
}
js.Boot.__res = {}
js.Boot.__init();
{
	var d = Date;
	d.now = function() {
		return new Date();
	};
	d.fromTime = function(t) {
		var d1 = new Date();
		d1["setTime"](t);
		return d1;
	};
	d.fromString = function(s) {
		switch(s.length) {
		case 8:
			var k = s.split(":");
			var d1 = new Date();
			d1["setTime"](0);
			d1["setUTCHours"](k[0]);
			d1["setUTCMinutes"](k[1]);
			d1["setUTCSeconds"](k[2]);
			return d1;
		case 10:
			var k = s.split("-");
			return new Date(k[0],k[1] - 1,k[2],0,0,0);
		case 19:
			var k = s.split(" ");
			var y = k[0].split("-");
			var t = k[1].split(":");
			return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
		default:
			throw "Invalid date format : " + s;
		}
	};
	d.prototype["toString"] = function() {
		var date = this;
		var m = date.getMonth() + 1;
		var d1 = date.getDate();
		var h = date.getHours();
		var mi = date.getMinutes();
		var s = date.getSeconds();
		return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d1 < 10?"0" + d1:"" + d1) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
	};
	d.prototype.__class__ = $hxClasses["Date"] = d;
	d.__name__ = ["Date"];
}
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
demo.Descriptor.div = [{ name : "style.display", displayName : "css display", parentId : null, value : null, defaultValue : "block", canBeNull : false, description : "CSS style postions (absolute, relative, ...)"},{ name : "style.position", displayName : "css position", parentId : null, value : null, defaultValue : "relative", canBeNull : false, description : "CSS style postions (absolute, relative, ...)"},{ name : "style.top", displayName : "css top", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style top (y position)"},{ name : "style.bottom", displayName : "css bottom", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style bottom (y position)"},{ name : "style.left", displayName : "css left", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style left (y position)"},{ name : "style.right", displayName : "css right", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style right (y position)"},{ name : "style.width", displayName : "css width", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style width (y position)"},{ name : "style.height", displayName : "css height", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style height (y position)"}];
haxe.Template.splitter = new EReg("(::[A-Za-z0-9_ ()&|!+=/><*.\"-]+::|\\$\\$([A-Za-z0-9_-]+)\\()","");
haxe.Template.expr_splitter = new EReg("(\\(|\\)|[ \r\n\t]*\"[^\"]*\"[ \r\n\t]*|[!+=/><*.&|-]+)","");
haxe.Template.expr_trim = new EReg("^[ ]*([^ ]+)[ ]*$","");
haxe.Template.expr_int = new EReg("^[0-9]+$","");
haxe.Template.expr_float = new EReg("^([+-]?)(?=\\d|,\\d)\\d*(,\\d*)?([Ee]([+-]?\\d+))?$","");
haxe.Template.globals = { };
js.Lib.onerror = null;
slbuilder.core.Config.VIEW_MENU_HEIGHT = "20px";
slplayer.ui.DisplayObject.rootElementNameFilter = Lambda.list([]);
slbuilder.ui.ListWidget.LIST_SELECTED_ITEM_CSS_CLASS = "listSelectedItem";
slplayer.core.SLPlayer.nodeToCmpInstances = new Hash();
slplayer.core.SLPlayer.SLPID_ATTR_NAME = "slpid";
slplayer.core.SLPlayer._htmlBody = "\n\t\t";
slplayer.core.SLPlayer.main()