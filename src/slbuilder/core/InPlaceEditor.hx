package slbuilder.core;

import js.Lib;
import js.Dom;

import slplayer.ui.DisplayObject;
import slplayer.core.SLPlayer;

import slbuilder.data.Types;
import slbuilder.core.Utils;
import slbuilder.core.SLBuilder;
import slbuilder.data.Component;
import slbuilder.selection.Region;
import slbuilder.selection.RegionEdit;
import slbuilder.selection.RegionDisplay;
import slbuilder.ui.Knob;

/**
 * Knob used by the user to edit the elements in place
 */
class InPlaceEditor extends DisplayObject{
	/**
	 * list of editors and regions put over the components
	 */
	private var regions:Array<Region>;
	/**
	 * reference to the knob instance
	 */
	private var knob:Knob;
	/**
	 * constructor
	 */
	public function new(d:HtmlDom) {
		super(d);

		// init arrays
		regions = new Array();
	}
	/**
	 * init the element
	 */
	override public dynamic function init() : Void { 
		trace("InPlaceEditor init");
		// attach to the selection
		SLBuilder.getInstance().selection.refreshRegionsCallbak = redraw;
		
		// knob
		var elements = Utils.getElementsByClassName(rootElement, "Knob");
		if (elements == null || elements.length <= 0)
			throw("could not find the element in index.html");
		var components = SLPlayer.getAssociatedComponents(elements[0]);
		if (components == null || components.length <= 0)
			throw("could not find the knob instance");
		knob = cast(components.first());
		knob.hide();

		/// attach to the knob
		knob.onMove = moveComponent;
		knob.onRotate = rotateComponent;

		// refresh regions
		//redraw();
	}
	private function rotateComponent(angle:Float){
		var selectedComponents = SLBuilder.getInstance().selection.getComponents();
		var component = selectedComponents[0];
		component.rotation = angle;
		SLBuilder.getInstance().updateComponent(component);
		SLBuilder.getInstance().selection.reloadData();
	}
	private function moveComponent(x:Int, y:Int){
		var selectedComponents = SLBuilder.getInstance().selection.getComponents();
		var component = selectedComponents[0];
		component.x = x;
		component.y = y;
		SLBuilder.getInstance().updateComponent(component);
		SLBuilder.getInstance().selection.reloadData();
	}
	///////////////////////////////////////////////////////////////////
	// Regions 
	///////////////////////////////////////////////////////////////////
	/**
	 * refresh the in-place editors
	 * also update the selection display
	 */
	public function redraw() {
		trace("redraw ");
		// get selectable components list
		var components = SLBuilder.getInstance().getComponents(null);
		var selectedComponents = SLBuilder.getInstance().selection.getComponents();

		knob.reset();

		// remove all regions
		for(region in regions){
			region.remove();
		}
		regions = new Array();
		// create regions for selection
		for(component in selectedComponents){
			displaySelected(component);
		}
		// create regions for selection
		for(component in components){
			displaySelectable(component);
		}
	}
	/**
	 * crate an in-place editor and put it over the component
	 */
	private function displaySelected(component:Component){
		regions.push(new RegionEdit(component, rootElement));
		knob.addComponent(component);
	}
	/**
	 * crate a selectable region and put it over the component
	 */
	private function displaySelectable(component:Component){
		regions.push(new RegionDisplay(component, rootElement));
	}

}
