$estr = function() { return js.Boot.__string_rec(this,''); }
if(typeof slbuilder=='undefined') slbuilder = {}
if(!slbuilder.core) slbuilder.core = {}
slbuilder.core.Utils = function() { }
slbuilder.core.Utils.__name__ = ["slbuilder","core","Utils"];
slbuilder.core.Utils.nextId = null;
slbuilder.core.Utils.toId = function(type,className) {
	return { type : type, seed : Std.string(type) + "_" + className + "_" + Std.string(slbuilder.core.Utils.nextId++) + "_" + Math.round(Math.random() * 999999)};
}
slbuilder.core.Utils.getElementsByClassName = function(className) {
	return document.getElementsByClassName(className);
}
slbuilder.core.Utils.prototype.__class__ = slbuilder.core.Utils;
StringTools = function() { }
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
	while(r < l && StringTools.isSpace(s,r)) {
		r++;
	}
	if(r > 0) return s.substr(r,l - r);
	else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) {
		r++;
	}
	if(r > 0) {
		return s.substr(0,l - r);
	}
	else {
		return s;
	}
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) {
		if(l - sl < cl) {
			s += c.substr(0,l - sl);
			sl = l;
		}
		else {
			s += c;
			sl += cl;
		}
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) {
		if(l - sl < cl) {
			ns += c.substr(0,l - sl);
			sl = l;
		}
		else {
			ns += c;
			sl += cl;
		}
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
StringTools.prototype.__class__ = StringTools;
Reflect = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	if(o.hasOwnProperty != null) return o.hasOwnProperty(field);
	var arr = Reflect.fields(o);
	{ var $it0 = arr.iterator();
	while( $it0.hasNext() ) { var t = $it0.next();
	if(t == field) return true;
	}}
	return false;
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	}
	catch( $e0 ) {
		{
			var e = $e0;
			null;
		}
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	if(o == null) return new Array();
	var a = new Array();
	if(o.hasOwnProperty) {
		
				for(var i in o)
					if( o.hasOwnProperty(i) )
						a.push(i);
			;
	}
	else {
		var t;
		try {
			t = o.__proto__;
		}
		catch( $e0 ) {
			{
				var e = $e0;
				{
					t = null;
				}
			}
		}
		if(t != null) o.__proto__ = null;
		
				for(var i in o)
					if( i != "__proto__" )
						a.push(i);
			;
		if(t != null) o.__proto__ = t;
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
	{
		var _g = 0, _g1 = Reflect.fields(o);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			o2[f] = Reflect.field(o,f);
		}
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = new Array();
		{
			var _g1 = 0, _g = arguments.length;
			while(_g1 < _g) {
				var i = _g1++;
				a.push(arguments[i]);
			}
		}
		return f(a);
	}
}
Reflect.prototype.__class__ = Reflect;
if(typeof haxe=='undefined') haxe = {}
haxe.Log = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Log.prototype.__class__ = haxe.Log;
if(typeof demo=='undefined') demo = {}
demo.Application = function(p) { if( p === $_ ) return; {
	this.slBuilderBridge = new demo.SLBuilderBridge(slbuilder.SLBuilder.getInstance());
}}
demo.Application.__name__ = ["demo","Application"];
demo.Application.prototype.slBuilderBridge = null;
demo.Application.prototype.__class__ = demo.Application;
StringBuf = function(p) { if( p === $_ ) return; {
	this.b = new Array();
}}
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype.add = function(x) {
	this.b[this.b.length] = x;
}
StringBuf.prototype.addSub = function(s,pos,len) {
	this.b[this.b.length] = s.substr(pos,len);
}
StringBuf.prototype.addChar = function(c) {
	this.b[this.b.length] = String.fromCharCode(c);
}
StringBuf.prototype.toString = function() {
	return this.b.join("");
}
StringBuf.prototype.b = null;
StringBuf.prototype.__class__ = StringBuf;
MainJs = function() { }
MainJs.__name__ = ["MainJs"];
MainJs.main = function() {
	haxe.Firebug.redirectTraces();
	new demo.Application();
}
MainJs.prototype.__class__ = MainJs;
if(!haxe._Template) haxe._Template = {}
haxe._Template.TemplateExpr = { __ename__ : ["haxe","_Template","TemplateExpr"], __constructs__ : ["OpVar","OpExpr","OpIf","OpStr","OpBlock","OpForeach","OpMacro"] }
haxe._Template.TemplateExpr.OpVar = function(v) { var $x = ["OpVar",0,v]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpExpr = function(expr) { var $x = ["OpExpr",1,expr]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpIf = function(expr,eif,eelse) { var $x = ["OpIf",2,expr,eif,eelse]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpStr = function(str) { var $x = ["OpStr",3,str]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpBlock = function(l) { var $x = ["OpBlock",4,l]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpForeach = function(expr,loop) { var $x = ["OpForeach",5,expr,loop]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpMacro = function(name,params) { var $x = ["OpMacro",6,name,params]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
EReg = function(r,opt) { if( r === $_ ) return; {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
}}
EReg.__name__ = ["EReg"];
EReg.prototype.r = null;
EReg.prototype.match = function(s) {
	this.r.m = this.r.exec(s);
	this.r.s = s;
	this.r.l = RegExp.leftContext;
	this.r.r = RegExp.rightContext;
	return this.r.m != null;
}
EReg.prototype.matched = function(n) {
	return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
		var $r;
		throw "EReg::matched";
		return $r;
	}(this));
}
EReg.prototype.matchedLeft = function() {
	if(this.r.m == null) throw "No string matched";
	if(this.r.l == null) return this.r.s.substr(0,this.r.m.index);
	return this.r.l;
}
EReg.prototype.matchedRight = function() {
	if(this.r.m == null) throw "No string matched";
	if(this.r.r == null) {
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	return this.r.r;
}
EReg.prototype.matchedPos = function() {
	if(this.r.m == null) throw "No string matched";
	return { pos : this.r.m.index, len : this.r.m[0].length};
}
EReg.prototype.split = function(s) {
	var d = "#__delim__#";
	return s.replace(this.r,d).split(d);
}
EReg.prototype.replace = function(s,by) {
	return s.replace(this.r,by);
}
EReg.prototype.customReplace = function(s,f) {
	var buf = new StringBuf();
	while(true) {
		if(!this.match(s)) break;
		buf.b[buf.b.length] = this.matchedLeft();
		buf.b[buf.b.length] = f(this);
		s = this.matchedRight();
	}
	buf.b[buf.b.length] = s;
	return buf.b.join("");
}
EReg.prototype.__class__ = EReg;
haxe.Template = function(str) { if( str === $_ ) return; {
	var tokens = this.parseTokens(str);
	this.expr = this.parseBlock(tokens);
	if(!tokens.isEmpty()) throw "Unexpected '" + tokens.first().s + "'";
}}
haxe.Template.__name__ = ["haxe","Template"];
haxe.Template.prototype.expr = null;
haxe.Template.prototype.context = null;
haxe.Template.prototype.macros = null;
haxe.Template.prototype.stack = null;
haxe.Template.prototype.buf = null;
haxe.Template.prototype.execute = function(context,macros) {
	this.macros = macros == null?{ }:macros;
	this.context = context;
	this.stack = new List();
	this.buf = new StringBuf();
	this.run(this.expr);
	return this.buf.b.join("");
}
haxe.Template.prototype.resolve = function(v) {
	if(Reflect.hasField(this.context,v)) return Reflect.field(this.context,v);
	{ var $it0 = this.stack.iterator();
	while( $it0.hasNext() ) { var ctx = $it0.next();
	if(Reflect.hasField(ctx,v)) return Reflect.field(ctx,v);
	}}
	if(v == "__current__") return this.context;
	return Reflect.field(haxe.Template.globals,v);
}
haxe.Template.prototype.parseTokens = function(data) {
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
			if(c == 40) npar++;
			else if(c == 41) npar--;
			else if(c == null) throw "Unclosed macro parenthesis";
			parp++;
		}
		var params = data.substr(p.pos + p.len,parp - (p.pos + p.len) - 1).split(",");
		tokens.add({ p : haxe.Template.splitter.matched(2), s : false, l : params});
		data = data.substr(parp,data.length - parp);
	}
	if(data.length > 0) tokens.add({ p : data, s : true, l : null});
	return tokens;
}
haxe.Template.prototype.parseBlock = function(tokens) {
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
haxe.Template.prototype.parse = function(tokens) {
	var t = tokens.pop();
	var p = t.p;
	if(t.s) return haxe._Template.TemplateExpr.OpStr(p);
	if(t.l != null) {
		var pe = new List();
		{
			var _g = 0, _g1 = t.l;
			while(_g < _g1.length) {
				var p1 = _g1[_g];
				++_g;
				pe.add(this.parseBlock(this.parseTokens(p1)));
			}
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
		}
		else if(t1.p == "else") {
			tokens.pop();
			eelse = this.parseBlock(tokens);
			t1 = tokens.pop();
			if(t1 == null || t1.p != "end") throw "Unclosed 'else'";
		}
		else {
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
haxe.Template.prototype.parseExpr = function(data) {
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
	}
	catch( $e0 ) {
		if( js.Boot.__instanceof($e0,String) ) {
			var s = $e0;
			{
				throw "Unexpected '" + s + "' in " + expr;
			}
		} else throw($e0);
	}
	return function() {
		try {
			return e();
		}
		catch( $e1 ) {
			{
				var exc = $e1;
				{
					throw "Error : " + Std.string(exc) + " in " + expr;
				}
			}
		}
	}
}
haxe.Template.prototype.makeConst = function(v) {
	haxe.Template.expr_trim.match(v);
	v = haxe.Template.expr_trim.matched(1);
	if(v.charCodeAt(0) == 34) {
		var str = v.substr(1,v.length - 2);
		return function() {
			return str;
		}
	}
	if(haxe.Template.expr_int.match(v)) {
		var i = Std.parseInt(v);
		return function() {
			return i;
		}
	}
	if(haxe.Template.expr_float.match(v)) {
		var f = Std.parseFloat(v);
		return function() {
			return f;
		}
	}
	var me = this;
	return function() {
		return me.resolve(v);
	}
}
haxe.Template.prototype.makePath = function(e,l) {
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
haxe.Template.prototype.makeExpr = function(l) {
	return this.makePath(this.makeExpr2(l),l);
}
haxe.Template.prototype.makeExpr2 = function(l) {
	var p = l.pop();
	if(p == null) throw "<eof>";
	if(p.s) return this.makeConst(p.p);
	switch(p.p) {
	case "(":{
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
			case "+":{
				$r = function() {
					return e1() + e2();
				}
			}break;
			case "-":{
				$r = function() {
					return e1() - e2();
				}
			}break;
			case "*":{
				$r = function() {
					return e1() * e2();
				}
			}break;
			case "/":{
				$r = function() {
					return e1() / e2();
				}
			}break;
			case ">":{
				$r = function() {
					return e1() > e2();
				}
			}break;
			case "<":{
				$r = function() {
					return e1() < e2();
				}
			}break;
			case ">=":{
				$r = function() {
					return e1() >= e2();
				}
			}break;
			case "<=":{
				$r = function() {
					return e1() <= e2();
				}
			}break;
			case "==":{
				$r = function() {
					return e1() == e2();
				}
			}break;
			case "!=":{
				$r = function() {
					return e1() != e2();
				}
			}break;
			case "&&":{
				$r = function() {
					return e1() && e2();
				}
			}break;
			case "||":{
				$r = function() {
					return e1() || e2();
				}
			}break;
			default:{
				$r = (function($this) {
					var $r;
					throw "Unknown operation " + p1.p;
					return $r;
				}($this));
			}break;
			}
			return $r;
		}(this));
	}break;
	case "!":{
		var e = this.makeExpr(l);
		return function() {
			var v = e();
			return v == null || v == false;
		}
	}break;
	case "-":{
		var e = this.makeExpr(l);
		return function() {
			return -e();
		}
	}break;
	}
	throw p.p;
}
haxe.Template.prototype.run = function(e) {
	var $e = e;
	switch( $e[1] ) {
	case 0:
	var v = $e[2];
	{
		this.buf.add(Std.string(this.resolve(v)));
	}break;
	case 1:
	var e1 = $e[2];
	{
		this.buf.add(Std.string(e1()));
	}break;
	case 2:
	var eelse = $e[4], eif = $e[3], e1 = $e[2];
	{
		var v = e1();
		if(v == null || v == false) {
			if(eelse != null) this.run(eelse);
		}
		else this.run(eif);
	}break;
	case 3:
	var str = $e[2];
	{
		this.buf.add(str);
	}break;
	case 4:
	var l = $e[2];
	{
		{ var $it0 = l.iterator();
		while( $it0.hasNext() ) { var e1 = $it0.next();
		this.run(e1);
		}}
	}break;
	case 5:
	var loop = $e[3], e1 = $e[2];
	{
		var v = e1();
		try {
			if(v.hasNext == null) {
				var x = v.iterator();
				if(x.hasNext == null) throw null;
				v = x;
			}
		}
		catch( $e1 ) {
			{
				var e2 = $e1;
				{
					throw "Cannot iter on " + v;
				}
			}
		}
		this.stack.push(this.context);
		var v1 = v;
		{ var $it2 = v1;
		while( $it2.hasNext() ) { var ctx = $it2.next();
		{
			this.context = ctx;
			this.run(loop);
		}
		}}
		this.context = this.stack.pop();
	}break;
	case 6:
	var params = $e[3], m = $e[2];
	{
		var v = Reflect.field(this.macros,m);
		var pl = new Array();
		var old = this.buf;
		pl.push($closure(this,"resolve"));
		{ var $it3 = params.iterator();
		while( $it3.hasNext() ) { var p = $it3.next();
		{
			var $e = p;
			switch( $e[1] ) {
			case 0:
			var v1 = $e[2];
			{
				pl.push(this.resolve(v1));
			}break;
			default:{
				this.buf = new StringBuf();
				this.run(p);
				pl.push(this.buf.b.join(""));
			}break;
			}
		}
		}}
		this.buf = old;
		try {
			this.buf.add(Std.string(v.apply(this.macros,pl)));
		}
		catch( $e4 ) {
			{
				var e1 = $e4;
				{
					var plstr = (function($this) {
						var $r;
						try {
							$r = pl.join(",");
						}
						catch( $e5 ) {
							{
								var e2 = $e5;
								$r = "???";
							}
						}
						return $r;
					}(this));
					var msg = "Macro call " + m + "(" + plstr + ") failed (" + Std.string(e1) + ")";
					throw msg;
				}
			}
		}
	}break;
	}
}
haxe.Template.prototype.__class__ = haxe.Template;
haxe.Firebug = function() { }
haxe.Firebug.__name__ = ["haxe","Firebug"];
haxe.Firebug.detect = function() {
	try {
		return console != null && console.error != null;
	}
	catch( $e0 ) {
		{
			var e = $e0;
			{
				return false;
			}
		}
	}
}
haxe.Firebug.redirectTraces = function() {
	haxe.Log.trace = $closure(haxe.Firebug,"trace");
	js.Lib.setErrorHandler($closure(haxe.Firebug,"onError"));
}
haxe.Firebug.onError = function(err,stack) {
	var buf = err + "\n";
	{
		var _g = 0;
		while(_g < stack.length) {
			var s = stack[_g];
			++_g;
			buf += "Called from " + s + "\n";
		}
	}
	haxe.Firebug.trace(buf,null);
	return true;
}
haxe.Firebug.trace = function(v,inf) {
	var type = inf != null && inf.customParams != null?inf.customParams[0]:null;
	if(type != "warn" && type != "info" && type != "debug" && type != "error") type = inf == null?"error":"log";
	console[type]((inf == null?"":inf.fileName + ":" + inf.lineNumber + " : ") + Std.string(v));
}
haxe.Firebug.prototype.__class__ = haxe.Firebug;
IntIter = function(min,max) { if( min === $_ ) return; {
	this.min = min;
	this.max = max;
}}
IntIter.__name__ = ["IntIter"];
IntIter.prototype.min = null;
IntIter.prototype.max = null;
IntIter.prototype.hasNext = function() {
	return this.min < this.max;
}
IntIter.prototype.next = function() {
	return this.min++;
}
IntIter.prototype.__class__ = IntIter;
Std = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	if(x < 0) return Math.ceil(x);
	return Math.floor(x);
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
Std.prototype.__class__ = Std;
List = function(p) { if( p === $_ ) return; {
	this.length = 0;
}}
List.__name__ = ["List"];
List.prototype.h = null;
List.prototype.q = null;
List.prototype.length = null;
List.prototype.add = function(item) {
	var x = [item];
	if(this.h == null) this.h = x;
	else this.q[1] = x;
	this.q = x;
	this.length++;
}
List.prototype.push = function(item) {
	var x = [item,this.h];
	this.h = x;
	if(this.q == null) this.q = x;
	this.length++;
}
List.prototype.first = function() {
	return this.h == null?null:this.h[0];
}
List.prototype.last = function() {
	return this.q == null?null:this.q[0];
}
List.prototype.pop = function() {
	if(this.h == null) return null;
	var x = this.h[0];
	this.h = this.h[1];
	if(this.h == null) this.q = null;
	this.length--;
	return x;
}
List.prototype.isEmpty = function() {
	return this.h == null;
}
List.prototype.clear = function() {
	this.h = null;
	this.q = null;
	this.length = 0;
}
List.prototype.remove = function(v) {
	var prev = null;
	var l = this.h;
	while(l != null) {
		if(l[0] == v) {
			if(prev == null) this.h = l[1];
			else prev[1] = l[1];
			if(this.q == l) this.q = prev;
			this.length--;
			return true;
		}
		prev = l;
		l = l[1];
	}
	return false;
}
List.prototype.iterator = function() {
	return { h : this.h, hasNext : function() {
		return this.h != null;
	}, next : function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		return x;
	}};
}
List.prototype.toString = function() {
	var s = new StringBuf();
	var first = true;
	var l = this.h;
	s.b[s.b.length] = "{";
	while(l != null) {
		if(first) first = false;
		else s.b[s.b.length] = ", ";
		s.b[s.b.length] = Std.string(l[0]);
		l = l[1];
	}
	s.b[s.b.length] = "}";
	return s.b.join("");
}
List.prototype.join = function(sep) {
	var s = new StringBuf();
	var first = true;
	var l = this.h;
	while(l != null) {
		if(first) first = false;
		else s.b[s.b.length] = sep;
		s.b[s.b.length] = l[0];
		l = l[1];
	}
	return s.b.join("");
}
List.prototype.filter = function(f) {
	var l2 = new List();
	var l = this.h;
	while(l != null) {
		var v = l[0];
		l = l[1];
		if(f(v)) l2.add(v);
	}
	return l2;
}
List.prototype.map = function(f) {
	var b = new List();
	var l = this.h;
	while(l != null) {
		var v = l[0];
		l = l[1];
		b.add(f(v));
	}
	return b;
}
List.prototype.__class__ = List;
haxe.Http = function(url) { if( url === $_ ) return; {
	this.url = url;
	this.headers = new Hash();
	this.params = new Hash();
	this.async = true;
}}
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.requestUrl = function(url) {
	var h = new haxe.Http(url);
	h.async = false;
	var r = null;
	h.onData = function(d) {
		r = d;
	}
	h.onError = function(e) {
		throw e;
	}
	h.request(false);
	return r;
}
haxe.Http.prototype.url = null;
haxe.Http.prototype.async = null;
haxe.Http.prototype.postData = null;
haxe.Http.prototype.headers = null;
haxe.Http.prototype.params = null;
haxe.Http.prototype.setHeader = function(header,value) {
	this.headers.set(header,value);
}
haxe.Http.prototype.setParameter = function(param,value) {
	this.params.set(param,value);
}
haxe.Http.prototype.setPostData = function(data) {
	this.postData = data;
}
haxe.Http.prototype.request = function(post) {
	var me = this;
	var r = new js.XMLHttpRequest();
	var onreadystatechange = function() {
		if(r.readyState != 4) return;
		var s = (function($this) {
			var $r;
			try {
				$r = r.status;
			}
			catch( $e0 ) {
				{
					var e = $e0;
					$r = null;
				}
			}
			return $r;
		}(this));
		if(s == undefined) s = null;
		if(s != null) me.onStatus(s);
		if(s != null && s >= 200 && s < 400) me.onData(r.responseText);
		else switch(s) {
		case null: case undefined:{
			me.onError("Failed to connect or resolve host");
		}break;
		case 12029:{
			me.onError("Failed to connect to host");
		}break;
		case 12007:{
			me.onError("Unknown host");
		}break;
		default:{
			me.onError("Http Error #" + r.status);
		}break;
		}
	}
	if(this.async) r.onreadystatechange = onreadystatechange;
	var uri = this.postData;
	if(uri != null) post = true;
	else { var $it1 = this.params.keys();
	while( $it1.hasNext() ) { var p = $it1.next();
	{
		if(uri == null) uri = "";
		else uri += "&";
		uri += StringTools.urlDecode(p) + "=" + StringTools.urlEncode(this.params.get(p));
	}
	}}
	try {
		if(post) r.open("POST",this.url,this.async);
		else if(uri != null) {
			var question = this.url.split("?").length <= 1;
			r.open("GET",this.url + (question?"?":"&") + uri,this.async);
			uri = null;
		}
		else r.open("GET",this.url,this.async);
	}
	catch( $e2 ) {
		{
			var e = $e2;
			{
				this.onError(e.toString());
				return;
			}
		}
	}
	if(this.headers.get("Content-Type") == null && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	{ var $it3 = this.headers.keys();
	while( $it3.hasNext() ) { var h = $it3.next();
	r.setRequestHeader(h,this.headers.get(h));
	}}
	r.send(uri);
	if(!this.async) onreadystatechange();
}
haxe.Http.prototype.onData = function(data) {
	null;
}
haxe.Http.prototype.onError = function(msg) {
	null;
}
haxe.Http.prototype.onStatus = function(status) {
	null;
}
haxe.Http.prototype.__class__ = haxe.Http;
slbuilder.core.Config = function() { }
slbuilder.core.Config.__name__ = ["slbuilder","core","Config"];
slbuilder.core.Config.prototype.__class__ = slbuilder.core.Config;
demo.Descriptor = function() { }
demo.Descriptor.__name__ = ["demo","Descriptor"];
demo.Descriptor.prototype.__class__ = demo.Descriptor;
if(typeof js=='undefined') js = {}
js.Lib = function() { }
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
js.Lib.prototype.__class__ = js.Lib;
slbuilder.SLBuilder = function(p) { if( p === $_ ) return; {
	haxe.Log.trace("SLBuilder init",{ fileName : "SLBuilder.hx", lineNumber : 53, className : "slbuilder.SLBuilder", methodName : "new"});
	this.initDomReferences();
	this.initUis();
}}
slbuilder.SLBuilder.__name__ = ["slbuilder","SLBuilder"];
slbuilder.SLBuilder.instance = null;
slbuilder.SLBuilder.getInstance = function() {
	if(slbuilder.SLBuilder.instance == null) slbuilder.SLBuilder.instance = new slbuilder.SLBuilder();
	return slbuilder.SLBuilder.instance;
}
slbuilder.SLBuilder.prototype.root = null;
slbuilder.SLBuilder.prototype.initDomReferences = function() {
	this.root = js.Lib.document.getElementById("SLBuilder");
}
slbuilder.SLBuilder.prototype.initUis = function() {
	new slbuilder.ui.LayersWidget(this.root);
}
slbuilder.SLBuilder.prototype.onViewMenuClick = function(className) {
	switch(className) {
	case "ShowComponentsBtn":{
		haxe.Log.trace("test",{ fileName : "SLBuilder.hx", lineNumber : 74, className : "slbuilder.SLBuilder", methodName : "onViewMenuClick"});
	}break;
	case "testBtn1":{
		var layer = this.createLayer("basicLayer",null);
		haxe.Log.trace(layer,{ fileName : "SLBuilder.hx", lineNumber : 77, className : "slbuilder.SLBuilder", methodName : "onViewMenuClick"});
		js.Lib.document.getElementById(layer.id.seed).style.display = "inline-block";
		js.Lib.document.getElementById(layer.id.seed).style.width = "100px";
		js.Lib.document.getElementById(layer.id.seed).style.height = "100px";
		var color = Math.round(Math.random() * 255);
		js.Lib.document.getElementById(layer.id.seed).style.backgroundColor = "rgb(" + color + "," + color + "," + color + ")";
	}break;
	case "testBtn2":{
		var layers = this.getLayers(null);
		haxe.Log.trace(layers,{ fileName : "SLBuilder.hx", lineNumber : 88, className : "slbuilder.SLBuilder", methodName : "onViewMenuClick"});
		{
			var _g = 0;
			while(_g < layers.length) {
				var layer = layers[_g];
				++_g;
				var color = Math.round(Math.random() * 255 * 255);
				js.Lib.document.getElementById(layer.id.seed).style.backgroundColor = color;
			}
		}
	}break;
	case "testBtn3":{
		var component = this.createComponent("galery",this.getLayers(null)[0].id);
		haxe.Log.trace(component,{ fileName : "SLBuilder.hx", lineNumber : 95, className : "slbuilder.SLBuilder", methodName : "onViewMenuClick"});
		js.Lib.document.getElementById(component.id.seed).style.display = "inline-block";
		js.Lib.document.getElementById(component.id.seed).style.width = "10px";
		js.Lib.document.getElementById(component.id.seed).style.height = "10px";
		var color = Math.round(Math.random() * 255);
		js.Lib.document.getElementById(component.id.seed).style.backgroundColor = "rgb(" + color + "," + color + "," + color + ")";
	}break;
	case "testBtn4":{
		var components = this.getComponents(this.getLayers(null)[0].id);
		haxe.Log.trace(components,{ fileName : "SLBuilder.hx", lineNumber : 106, className : "slbuilder.SLBuilder", methodName : "onViewMenuClick"});
		{
			var _g = 0;
			while(_g < components.length) {
				var component = components[_g];
				++_g;
				var color = Math.round(Math.random() * 255 * 255);
				js.Lib.document.getElementById(component.id.seed).style.backgroundColor = color;
			}
		}
	}break;
	case "testBtn5":{
		var properties = this.getProperties(this.getComponents(this.getLayers(null)[0].id)[0].id);
		var t = this;
		new slbuilder.core.Template("PropertiesList").setOnLoad(function(template) {
			var container = js.Lib.document.createElement("div");
			container.innerHTML = template.execute({ Config : slbuilder.core.Config, properties : properties, component : t.getComponents(t.getLayers(null)[0].id)[0]});
			t.root.appendChild(container);
		});
	}break;
	case "testBtn6":{
		var components = this.getComponents(this.getLayers(null)[0].id);
		this.testPropCount += 10;
		this.setProperty(components[0].id,"style.position","absolute");
		this.setProperty(components[0].id,"style.top",this.testPropCount + "px");
		haxe.Log.trace(components[0].id,{ fileName : "SLBuilder.hx", lineNumber : 138, className : "slbuilder.SLBuilder", methodName : "onViewMenuClick"});
	}break;
	default:{
		null;
	}break;
	}
}
slbuilder.SLBuilder.prototype.testPropCount = null;
slbuilder.SLBuilder.prototype.createLayer = null;
slbuilder.SLBuilder.prototype.removeLayer = null;
slbuilder.SLBuilder.prototype.getLayers = null;
slbuilder.SLBuilder.prototype.createComponent = null;
slbuilder.SLBuilder.prototype.getComponents = null;
slbuilder.SLBuilder.prototype.getProperties = null;
slbuilder.SLBuilder.prototype.setProperty = null;
slbuilder.SLBuilder.prototype.domChanged = null;
slbuilder.SLBuilder.prototype.slectionChanged = null;
slbuilder.SLBuilder.prototype.slectionLockChanged = null;
slbuilder.SLBuilder.prototype.__class__ = slbuilder.SLBuilder;
js.Boot = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__unhtml(js.Boot.__string_rec(v,"")) + "<br/>";
	var d = document.getElementById("haxe:trace");
	if(d == null) alert("No haxe:trace element defined\n" + msg);
	else d.innerHTML += msg;
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
	else null;
}
js.Boot.__closure = function(o,f) {
	var m = o[f];
	if(m == null) return null;
	var f1 = function() {
		return m.apply(o,arguments);
	}
	f1.scope = o;
	f1.method = m;
	return f1;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ != null || o.__ename__ != null)) t = "object";
	switch(t) {
	case "object":{
		if(o instanceof Array) {
			if(o.__enum__ != null) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				{
					var _g1 = 2, _g = o.length;
					while(_g1 < _g) {
						var i = _g1++;
						if(i != 2) str += "," + js.Boot.__string_rec(o[i],s);
						else str += js.Boot.__string_rec(o[i],s);
					}
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			{
				var _g = 0;
				while(_g < l) {
					var i1 = _g++;
					str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
				}
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		}
		catch( $e0 ) {
			{
				var e = $e0;
				{
					return "???";
				}
			}
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
		if(hasp && !o.hasOwnProperty(k)) continue;
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__") continue;
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	}break;
	case "function":{
		return "<function>";
	}break;
	case "string":{
		return o;
	}break;
	default:{
		return String(o);
	}break;
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
	}
	catch( $e0 ) {
		{
			var e = $e0;
			{
				if(cl == null) return false;
			}
		}
	}
	switch(cl) {
	case Int:{
		return Math.ceil(o%2147483648.0) === o;
	}break;
	case Float:{
		return typeof(o) == "number";
	}break;
	case Bool:{
		return o === true || o === false;
	}break;
	case String:{
		return typeof(o) == "string";
	}break;
	case Dynamic:{
		return true;
	}break;
	default:{
		if(o == null) return false;
		return o.__enum__ == cl || cl == Class && o.__name__ != null || cl == Enum && o.__ename__ != null;
	}break;
	}
}
js.Boot.__init = function() {
	js.Lib.isIE = typeof document!='undefined' && document.all != null && typeof window!='undefined' && window.opera == null;
	js.Lib.isOpera = typeof window!='undefined' && window.opera != null;
	Array.prototype.copy = Array.prototype.slice;
	Array.prototype.insert = function(i,x) {
		this.splice(i,0,x);
	}
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
	}
	Array.prototype.iterator = function() {
		return { cur : 0, arr : this, hasNext : function() {
			return this.cur < this.arr.length;
		}, next : function() {
			return this.arr[this.cur++];
		}};
	}
	if(String.prototype.cca == null) String.prototype.cca = String.prototype.charCodeAt;
	String.prototype.charCodeAt = function(i) {
		var x = this.cca(i);
		if(x != x) return null;
		return x;
	}
	var oldsub = String.prototype.substr;
	String.prototype.substr = function(pos,len) {
		if(pos != null && pos != 0 && len != null && len < 0) return "";
		if(len == null) len = this.length;
		if(pos < 0) {
			pos = this.length + pos;
			if(pos < 0) pos = 0;
		}
		else if(len < 0) {
			len = this.length + len - pos;
		}
		return oldsub.apply(this,[pos,len]);
	}
	$closure = js.Boot.__closure;
}
js.Boot.prototype.__class__ = js.Boot;
demo.SLBuilderBridge = function(slBuilder) { if( slBuilder === $_ ) return; {
	slBuilder.createLayer = $closure(this,"createLayer");
	slBuilder.removeLayer = $closure(this,"removeLayer");
	slBuilder.getLayers = $closure(this,"getLayers");
	slBuilder.createComponent = $closure(this,"createComponent");
	slBuilder.getComponents = $closure(this,"getComponents");
	slBuilder.getProperties = $closure(this,"getProperties");
	slBuilder.setProperty = $closure(this,"setProperty");
	slBuilder.slectionChanged = $closure(this,"slectionChanged");
	slBuilder.domChanged = $closure(this,"domChanged");
	slBuilder.slectionLockChanged = $closure(this,"slectionLockChanged");
}}
demo.SLBuilderBridge.__name__ = ["demo","SLBuilderBridge"];
demo.SLBuilderBridge.prototype.createLayer = function(className,parentId) {
	var id = slbuilder.core.Utils.toId(slbuilder.data.ElementType.layer,className);
	var res = js.Lib.document.createElement("div");
	res.className = className + " slbuilder layer";
	res.id = id.seed;
	res.style.verticalAlign = "top";
	var parent;
	if(parentId == null) parent = js.Lib.document.getElementById("main");
	else parent = js.Lib.document.getElementById(parentId.seed);
	parent.appendChild(res);
	return { parentId : parentId, id : id, displayName : id.seed};
}
demo.SLBuilderBridge.prototype.removeLayer = function(id) {
	var element = js.Lib.document.getElementById(id.seed);
	if(element != null) {
		element.parentNode.removeChild(element);
		return true;
	}
	return false;
}
demo.SLBuilderBridge.prototype.getLayers = function(parentId) {
	var parent;
	if(parentId == null) parent = js.Lib.document.getElementById("main");
	else parent = js.Lib.document.getElementById(parentId.seed);
	var layers = parent.getElementsByClassName("layer");
	var res = [];
	{
		var _g1 = 0, _g = layers.length;
		while(_g1 < _g) {
			var elementIdx = _g1++;
			var element = Reflect.field(layers,Std.string(elementIdx));
			var layer = { parentId : { type : slbuilder.data.ElementType.layer, seed : element.parentNode.id}, id : { type : slbuilder.data.ElementType.layer, seed : element.id}, displayName : element.id};
			res.push(layer);
		}
	}
	return res;
}
demo.SLBuilderBridge.prototype.createComponent = function(className,parentId) {
	var id = slbuilder.core.Utils.toId(slbuilder.data.ElementType.component,className);
	var res = js.Lib.document.createElement("div");
	res.className = className + " slbuilder component";
	res.id = id.seed;
	var parent = js.Lib.document.getElementById(parentId.seed);
	parent.appendChild(res);
	return { parentId : parentId, id : id, displayName : id.seed};
}
demo.SLBuilderBridge.prototype.getComponents = function(parentId) {
	var parent = js.Lib.document.getElementById(parentId.seed);
	var components = parent.getElementsByClassName("component");
	var res = [];
	{
		var _g1 = 0, _g = components.length;
		while(_g1 < _g) {
			var elementIdx = _g1++;
			var element = Reflect.field(components,Std.string(elementIdx));
			var component = { parentId : { type : slbuilder.data.ElementType.component, seed : element.parentNode.id}, id : { type : slbuilder.data.ElementType.component, seed : element.id}, displayName : element.id};
			res.push(component);
		}
	}
	return res;
}
demo.SLBuilderBridge.prototype.getProperties = function(parentId) {
	var parent = js.Lib.document.getElementById(parentId.seed);
	haxe.Log.trace("getProperties " + parentId + " => " + parent,{ fileName : "SLBuilderBridge.hx", lineNumber : 161, className : "demo.SLBuilderBridge", methodName : "getProperties"});
	var properties = Reflect.field(demo.Descriptor,parent.nodeName.toLowerCase());
	haxe.Log.trace("getProperties " + parent.nodeName + " => " + properties,{ fileName : "SLBuilderBridge.hx", lineNumber : 163, className : "demo.SLBuilderBridge", methodName : "getProperties"});
	{
		var _g = 0;
		while(_g < properties.length) {
			var property = properties[_g];
			++_g;
			var propArray = property.name.split(".");
			var propObject = Reflect.field(parent,propArray.shift());
			{
				var _g1 = 0;
				while(_g1 < propArray.length) {
					var propertyName = propArray[_g1];
					++_g1;
					propObject = Reflect.field(propObject,propertyName);
				}
			}
			property.value = propObject;
		}
	}
	return properties;
}
demo.SLBuilderBridge.prototype.setProperty = function(parentId,propName,propValue) {
	var parent = js.Lib.document.getElementById(parentId.seed);
	var propArray = propName.split(".");
	var propNameNoDot = propArray.pop();
	var propObject = parent;
	{
		var _g = 0;
		while(_g < propArray.length) {
			var propertyName = propArray[_g];
			++_g;
			propObject = Reflect.field(propObject,propertyName);
		}
	}
	propObject[propNameNoDot] = propValue;
}
demo.SLBuilderBridge.prototype.domChanged = function(layerId) {
	null;
}
demo.SLBuilderBridge.prototype.slectionChanged = function(componentsIds) {
	null;
}
demo.SLBuilderBridge.prototype.slectionLockChanged = function(componentsIds) {
	null;
}
demo.SLBuilderBridge.prototype.__class__ = demo.SLBuilderBridge;
if(!slbuilder.ui) slbuilder.ui = {}
slbuilder.ui.LayersWidget = function(parent) { if( parent === $_ ) return; {
	this.parent = parent;
	new slbuilder.core.Template("LayersWidget").setOnLoad($closure(this,"attachTemplate"));
}}
slbuilder.ui.LayersWidget.__name__ = ["slbuilder","ui","LayersWidget"];
slbuilder.ui.LayersWidget.prototype.onChange = null;
slbuilder.ui.LayersWidget.prototype.list = null;
slbuilder.ui.LayersWidget.prototype.addBtn = null;
slbuilder.ui.LayersWidget.prototype.root = null;
slbuilder.ui.LayersWidget.prototype.parent = null;
slbuilder.ui.LayersWidget.prototype.attachTemplate = function(template) {
	this.root = js.Lib.document.createElement("div");
	this.root.innerHTML = template.execute({ Config : slbuilder.core.Config});
	this.parent.appendChild(this.root);
	this.list = slbuilder.core.Utils.getElementsByClassName("list")[0];
	this.addBtn = slbuilder.core.Utils.getElementsByClassName("add")[0];
	this.addBtn.onclick = $closure(this,"addLayer");
	this.refresh();
}
slbuilder.ui.LayersWidget.prototype.refresh = function() {
	this.list.innerHTML = "";
	var layers = slbuilder.SLBuilder.getInstance().getLayers(null);
	var t = this;
	{
		var _g = 0;
		while(_g < layers.length) {
			var layer = [layers[_g]];
			++_g;
			var elem = js.Lib.document.createElement("li");
			elem.id = layer[0].id.seed;
			elem.innerHTML = layer[0].displayName;
			elem.onclick = function(layer) {
				return function(e) {
					t.removeLayer(layer[0].id);
				}
			}(layer);
			this.list.appendChild(elem);
		}
	}
}
slbuilder.ui.LayersWidget.prototype.addLayer = function(e) {
	var layer = slbuilder.SLBuilder.getInstance().createLayer("basicLayer",null);
	slbuilder.SLBuilder.getInstance().setProperty(layer.id,"displayName","New Layer");
	this.refresh();
}
slbuilder.ui.LayersWidget.prototype.removeLayer = function(id) {
	slbuilder.SLBuilder.getInstance().removeLayer(id);
	this.refresh();
}
slbuilder.ui.LayersWidget.prototype.onClickList = function(e) {
	null;
}
slbuilder.ui.LayersWidget.prototype.__class__ = slbuilder.ui.LayersWidget;
slbuilder.core.Template = function(name,templateFolderPath,templateExtenstion,onLoad,onError) { if( name === $_ ) return; {
	if(templateExtenstion == null) templateExtenstion = ".html";
	if(templateFolderPath == null) templateFolderPath = "templates/";
	this.templateExtenstion = templateExtenstion;
	this.templateFolderPath = templateFolderPath;
	this.name = name;
	this.setOnLoad(onLoad);
	this.onError = onError;
}}
slbuilder.core.Template.__name__ = ["slbuilder","core","Template"];
slbuilder.core.Template.prototype.templateFolderPath = null;
slbuilder.core.Template.prototype.templateExtenstion = null;
slbuilder.core.Template.prototype.onLoad = null;
slbuilder.core.Template.prototype._onLoad = null;
slbuilder.core.Template.prototype.onError = null;
slbuilder.core.Template.prototype.name = null;
slbuilder.core.Template.prototype.loadedContent = null;
slbuilder.core.Template.prototype.setOnLoad = function(onLoad) {
	this._onLoad = onLoad;
	if(onLoad != null) {
		this.load();
	}
	return onLoad;
}
slbuilder.core.Template.prototype.getOnLoad = function() {
	return this._onLoad;
}
slbuilder.core.Template.prototype.load = function() {
	var r = new haxe.Http(this.templateFolderPath + this.name + this.templateExtenstion);
	r.onError = $closure(this,"onErrorCallback");
	r.onData = $closure(this,"onLoadCallback");
	r.request(false);
}
slbuilder.core.Template.prototype.onErrorCallback = function(message) {
	if(this.onError != null) {
		this.onError(this,message);
	}
}
slbuilder.core.Template.prototype.onLoadCallback = function(templateContent) {
	this.loadedContent = templateContent;
	(this.getOnLoad())(this);
}
slbuilder.core.Template.prototype.execute = function(context) {
	var template = new haxe.Template(this.loadedContent);
	var output = template.execute(context,{ setval : function(resolve,prop,val) {
		context[prop] = val;
		return "";
	}});
	return output;
}
slbuilder.core.Template.prototype.__class__ = slbuilder.core.Template;
if(!slbuilder.data) slbuilder.data = {}
slbuilder.data.ElementType = { __ename__ : ["slbuilder","data","ElementType"], __constructs__ : ["layer","component"] }
slbuilder.data.ElementType.layer = ["layer",0];
slbuilder.data.ElementType.layer.toString = $estr;
slbuilder.data.ElementType.layer.__enum__ = slbuilder.data.ElementType;
slbuilder.data.ElementType.component = ["component",1];
slbuilder.data.ElementType.component.toString = $estr;
slbuilder.data.ElementType.component.__enum__ = slbuilder.data.ElementType;
Hash = function(p) { if( p === $_ ) return; {
	this.h = {}
	if(this.h.__proto__ != null) {
		this.h.__proto__ = null;
		delete(this.h.__proto__);
	}
	else null;
}}
Hash.__name__ = ["Hash"];
Hash.prototype.h = null;
Hash.prototype.set = function(key,value) {
	this.h["$" + key] = value;
}
Hash.prototype.get = function(key) {
	return this.h["$" + key];
}
Hash.prototype.exists = function(key) {
	try {
		key = "$" + key;
		return this.hasOwnProperty.call(this.h,key);
	}
	catch( $e0 ) {
		{
			var e = $e0;
			{
				
				for(var i in this.h)
					if( i == key ) return true;
			;
				return false;
			}
		}
	}
}
Hash.prototype.remove = function(key) {
	if(!this.exists(key)) return false;
	delete(this.h["$" + key]);
	return true;
}
Hash.prototype.keys = function() {
	var a = new Array();
	
			for(var i in this.h)
				a.push(i.substr(1));
		;
	return a.iterator();
}
Hash.prototype.iterator = function() {
	return { ref : this.h, it : this.keys(), hasNext : function() {
		return this.it.hasNext();
	}, next : function() {
		var i = this.it.next();
		return this.ref["$" + i];
	}};
}
Hash.prototype.toString = function() {
	var s = new StringBuf();
	s.b[s.b.length] = "{";
	var it = this.keys();
	{ var $it0 = it;
	while( $it0.hasNext() ) { var i = $it0.next();
	{
		s.b[s.b.length] = i;
		s.b[s.b.length] = " => ";
		s.b[s.b.length] = Std.string(this.get(i));
		if(it.hasNext()) s.b[s.b.length] = ", ";
	}
	}}
	s.b[s.b.length] = "}";
	return s.b.join("");
}
Hash.prototype.__class__ = Hash;
slbuilder.ui.Menu = function(parent,teamplateName) { if( parent === $_ ) return; {
	this.parent = parent;
	this.initTemplates(teamplateName);
}}
slbuilder.ui.Menu.__name__ = ["slbuilder","ui","Menu"];
slbuilder.ui.Menu.prototype.onClick = null;
slbuilder.ui.Menu.prototype.root = null;
slbuilder.ui.Menu.prototype.parent = null;
slbuilder.ui.Menu.prototype.initTemplates = function(teamplateName) {
	new slbuilder.core.Template(teamplateName).setOnLoad($closure(this,"attachTemplate"));
}
slbuilder.ui.Menu.prototype.initButtons = function(container) {
	var buttons = container.getElementsByTagName("li");
	{
		var _g1 = 0, _g = buttons.length;
		while(_g1 < _g) {
			var buttonIdx = _g1++;
			buttons[buttonIdx].onclick = $closure(this,"onClickBtn");
		}
	}
}
slbuilder.ui.Menu.prototype.attachTemplate = function(template) {
	this.root = js.Lib.document.createElement("div");
	this.root.innerHTML = template.execute({ Config : slbuilder.core.Config});
	this.parent.appendChild(this.root);
	this.initButtons(this.root);
}
slbuilder.ui.Menu.prototype.onClickBtn = function(e) {
	if(this.onClick != null) this.onClick(e.target.className);
}
slbuilder.ui.Menu.prototype.__class__ = slbuilder.ui.Menu;
$_ = {}
js.Boot.__res = {}
js.Boot.__init();
{
	String.prototype.__class__ = String;
	String.__name__ = ["String"];
	Array.prototype.__class__ = Array;
	Array.__name__ = ["Array"];
	Int = { __name__ : ["Int"]};
	Dynamic = { __name__ : ["Dynamic"]};
	Float = Number;
	Float.__name__ = ["Float"];
	Bool = { __ename__ : ["Bool"]};
	Class = { __name__ : ["Class"]};
	Enum = { };
	Void = { __ename__ : ["Void"]};
}
{
	Math.__name__ = ["Math"];
	Math.NaN = Number["NaN"];
	Math.NEGATIVE_INFINITY = Number["NEGATIVE_INFINITY"];
	Math.POSITIVE_INFINITY = Number["POSITIVE_INFINITY"];
	Math.isFinite = function(i) {
		return isFinite(i);
	}
	Math.isNaN = function(i) {
		return isNaN(i);
	}
}
{
	js.Lib.document = document;
	js.Lib.window = window;
	onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if( f == null )
			return false;
		return f(msg,[url+":"+line]);
	}
}
{
	js["XMLHttpRequest"] = window.XMLHttpRequest?XMLHttpRequest:window.ActiveXObject?function() {
		try {
			return new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch( $e0 ) {
			{
				var e = $e0;
				{
					try {
						return new ActiveXObject("Microsoft.XMLHTTP");
					}
					catch( $e1 ) {
						{
							var e1 = $e1;
							{
								throw "Unable to create XMLHttpRequest object.";
							}
						}
					}
				}
			}
		}
	}:(function($this) {
		var $r;
		throw "Unable to create XMLHttpRequest object.";
		return $r;
	}(this));
}
haxe.Template.splitter = new EReg("(::[A-Za-z0-9_ ()&|!+=/><*.\"-]+::|\\$\\$([A-Za-z0-9_-]+)\\()","");
haxe.Template.expr_splitter = new EReg("(\\(|\\)|[ \r\n\t]*\"[^\"]*\"[ \r\n\t]*|[!+=/><*.&|-]+)","");
haxe.Template.expr_trim = new EReg("^[ ]*([^ ]+)[ ]*$","");
haxe.Template.expr_int = new EReg("^[0-9]+$","");
haxe.Template.expr_float = new EReg("^([+-]?)(?=\\d|,\\d)\\d*(,\\d*)?([Ee]([+-]?\\d+))?$","");
haxe.Template.globals = { };
slbuilder.core.Config.VIEW_MENU_HEIGHT = "20px";
demo.Descriptor.div = [{ name : "style.position", displayName : "css position", parentId : null, value : null, defaultValue : "relative", canBeNull : false, description : "CSS style postions (absolute, relative, ...)"},{ name : "style.top", displayName : "css top", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style top (y position)"},{ name : "style.bottom", displayName : "css bottom", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style bottom (y position)"},{ name : "style.left", displayName : "css left", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style left (y position)"},{ name : "style.right", displayName : "css right", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style right (y position)"},{ name : "style.width", displayName : "css width", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style width (y position)"},{ name : "style.height", displayName : "css height", parentId : null, value : null, defaultValue : null, canBeNull : true, description : "CSS style height (y position)"}];
js.Lib.onerror = null;
slbuilder.ui.LayersWidget.TEMPLATE_NAME = "LayersWidget";
slbuilder.core.Template.DEFAULT_TEMPLATE_FOLDER_PATH = "templates/";
slbuilder.core.Template.DEFAULT_TEMPLATE_EXTENSION = ".html";
MainJs.main()