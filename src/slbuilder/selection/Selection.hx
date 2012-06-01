package slbuilder.selection;

import slbuilder.core.Utils;
import slbuilder.data.Component;
import slbuilder.data.Types;

import slbuilder.core.SLBuilder;
import js.Lib;
import js.Dom;

/**
 * This class holds a list of selected components and a list of selectable components
 * It also visually show which components are selected and which one are selectable
 * And this class places a InPlaceEditor component on top of all the selected components
 * Only the SLBuilder singleton is supposed to instanciate this class
 */
class Selection
{
	/**
	 * list of editors and regions put over the components
	 */
	private var regions:Array<Region>;
	/**
	 * container for the regions put over the components
	 */
	private var container:HtmlDom;
	/**
	 * list of components
	 */
	private var selectedComponents:Array<Component>;
	/**
	 * constructor
	 * 
	 */
	public function new(){
		trace("Selection init");
		// create a container for all regions
		container = Lib.document.createElement("div");
		container.id="slBuilderRegionContainer";
		Lib.document.body.appendChild(container);
		// init arrays
		regions = new Array();
		selectedComponents = new Array();
		refresh();
	}
	/**
	 * change the selection
	 * update the in-place editors
	 */
	public function setSelection(components:Array<Component>){
		selectedComponents = components;
		refresh();
	}
	/**
	 * retrieve the selection
	 */
	public function getSelection():Array<Component>{
		return selectedComponents;
	}
	/**
	 * refresh the in-place editors
	 * also update the selection display
	 */
	public function refresh() {
		// get selectable components list
		var selectableComponents = SLBuilder.getInstance().getComponents(null);

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
		for(component in selectableComponents){
			displaySelectable(component);
		}
	}
	/**
	 * crate an in-place editor and put it over the component
	 */
	private function displaySelected(component:Component){
		regions.push(new RegionEdit(component, container));
	}
	/**
	 * crate a selectable region and put it over the component
	 */
	private function displaySelectable(component:Component){
		regions.push(new RegionDisplay(component, container));
	}
}