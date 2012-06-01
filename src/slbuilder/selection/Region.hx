package slbuilder.selection;

import slbuilder.data.Component;
import slbuilder.data.Types;
import js.Lib;
import js.Dom;

class Region 
{
	private var dom:HtmlDom;
	private var component:Component;
	function new(component:Component, container:HtmlDom){
		// create the regions
		dom = Lib.document.createElement("div");
		dom.style.position = "absolute";
		dom.style.left = component.x + "px";
		dom.style.top = component.y + "px";
		dom.style.width = component.width + "px";
		dom.style.height = component.height + "px";
		//untyped __js__ ("dom.style.rotation = component.rotation");
		container.appendChild(dom);
		// init
		init();
	}
	public function init(){
	}
	public function remove(){
		dom.parentNode.removeChild(dom);
		dom = null;
	}
}