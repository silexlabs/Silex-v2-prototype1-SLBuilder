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
		knob.onMove = applyToComponents;
		knob.onRotate = applyToComponents;

		// refresh regions
		//redraw();
	}
	/**
	 * callback for the knob
	 */
	private function applyToComponents(){
		var selectedComponents = SLBuilder.getInstance().selection.getComponents();
		knob.applyToComponents(selectedComponents);
		for (component in selectedComponents)
			SLBuilder.getInstance().updateComponent(component);

		SLBuilder.getInstance().selection.reloadData();
		redraw();
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

		// remove all regions
		for(region in regions){
			region.remove();
		}

		// reset
		regions = new Array();
		var selectedIdSeeds:Array<String> = [];

		// create regions for selection
		for(component in selectedComponents){
			selectedIdSeeds.push(component.id.seed);
			displaySelected(component);
		}

		// create regions for selection
		for(component in components){
			if (!Lambda.has(selectedIdSeeds, component.id.seed)){
				displaySelectable(component);
			}
		}
		// refresh position of the knob
		knob.attachToComponents(selectedComponents);
	}
	/**
	 * crate an in-place editor and put it over the component
	 */
	private function displaySelected(component:Component){
		regions.push(new RegionEdit(component, rootElement));
	}
	/**
	 * crate a selectable region and put it over the component
	 */
	private function displaySelectable(component:Component){
		regions.push(new RegionDisplay(component, rootElement));
	}

}
