package slbuilder.selection;

import slbuilder.data.Component;
import slbuilder.data.Types;
import slbuilder.core.SLBuilder;
import js.Lib;
import js.Dom;

class RegionDisplay extends Region
{
	public function new(component:Component, container:HtmlDom){
		super(component, container);
		dom.className = "region regiondisplay";
		dom.style.cursor = "pointer";
		dom.onclick = onClick;
	}
	override public function init(){
		super.init();
	}
	private function onClick(e:js.Event){
		SLBuilder.getInstance().selection.setSelection([component]);
	}
}