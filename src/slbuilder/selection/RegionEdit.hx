package slbuilder.selection;

import slbuilder.data.Component;
import slbuilder.data.Types;
import js.Lib;
import js.Dom;

class RegionEdit extends Region
{
	public function new(component:Component, container:HtmlDom){
		super(component, container);
		dom.className = "region regionedit";
	}
	override public function init(){
		super.init();
	}
}