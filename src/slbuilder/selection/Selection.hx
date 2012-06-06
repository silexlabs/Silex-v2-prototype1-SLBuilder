package slbuilder.selection;

import slbuilder.core.Utils;
import slbuilder.data.Page;
import slbuilder.data.Layer;
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
	 * list of selected items
	 */
	private var pages:Array<Page>;
	/**
	 * list of selected items
	 */
	private var layers:Array<Layer>;
	/**
	 * list of selected items
	 */
	private var components:Array<Component>;
	/**
	 * constructor
	 * create a container for the regions and initialize vars
	 */
	public function new(){
		trace("Selection init");
		// create a container for all regions
		container = Lib.document.createElement("div");
		container.id="slBuilderRegionContainer";
		Lib.document.body.appendChild(container);
		
		// init arrays
		regions = new Array();
		pages = new Array();
		layers = new Array();
		components = new Array();
		
		// refresh regions
		redraw();
	}
	///////////////////////////////////////////////////////////////////
	// Callbacks
	///////////////////////////////////////////////////////////////////
	/**
	 * callback for the SLBuilder singleton to catch a change in the selection
	 */
	public var onChange:Void->Void;
	/**
	 * callback for the widget
	 */
	public var refreshPagesWidgetCallbak:Array<Page>->Void;
	/**
	 * callback for the widget
	 */
	public var refreshLayersWidgetCallbak:Array<Layer>->Void;
	/**
	 * callback for the widget
	 */
	public var refreshComponentsWidgetCallbak:Array<Component>->Void;
	/**
	 * callback for the widget
	 */
	public var refreshPropertiesWidgetCallbak:Array<Component>->Void;

	///////////////////////////////////////////////////////////////////
	// Manipulate selection 
	///////////////////////////////////////////////////////////////////
	/**
	 * change the selection
	 * - update the in-place editors
	 * - call the calback to notify the widget and the SLBuilder singleton
	 */
	public function setPages(items:Array<Page>, invalidateLayers:Bool = true){
		trace("setPages "+items);
		// store the instance
		pages = items;

		// notify the widget 
		if (refreshPagesWidgetCallbak != null)
			refreshPagesWidgetCallbak(items);

		// empty the selection
		if (invalidateLayers == true)
			setLayers([], true, false);

		// notify the SLBuilder singleton
		if (onChange != null)
			onChange();

		// redraw regions
		redraw();
	}
	/**
	 * retrieve the selection
	 */
	public function getPages():Array<Page>{
		return pages;
	}
	/**
	 * change the selection
	 * - compute the new pages selection
	 * - update the in-place editors
	 * - call the calback to notify the widget 
	 */
	public function setLayers(items:Array<Layer>, invalidateComponents:Bool = true, invalidatePages:Bool = true){
		trace("setLayers "+items);
		// store the instance
		layers = items;

		// select the pages which contain all the selected layers
		var pagesArray:Array<Page> = [];
		var pagesIds:Array<Id> = [];

		// retrieve the ids of the layers and components
		for(layer in layers){
			if (!Lambda.has(pagesIds, layer.parentId)){
				// store the page id 
				pagesIds.push(layer.parentId);
				
				// store the page
				var page = SLBuilder.getInstance().getPage(layer.parentId);
				pagesArray.push(page);
			}
		}

		// update the selection
		if (invalidatePages == true)
			setPages(pagesArray, false);

		// notify the widget 
		if (refreshLayersWidgetCallbak != null)
			refreshLayersWidgetCallbak(items);

		// empty the selection
		if (invalidateComponents == true)
			setComponents([], false);

		// notify the SLBuilder singleton
		if (onChange != null)
			onChange();
	}
	/**
	 * retrieve the selection
	 */
	public function getLayers():Array<Layer>{
		return layers;
	}
	/**
	 * change the selection
	 * - compute the new layers selection
	 * - update the in-place editors
	 * - call the calback to notify the widget 
	 */
	public function setComponents(items:Array<Component>, invalidateLayers:Bool = true){
		trace("setComponents "+items);
		// store the instance
		components = items;

		// select the layers which contain all the selected components
		var layersArray:Array<Layer> = [];
		var layerIds:Array<Id> = [];

		// retrieve the ids of the layers and components
		for(comp in components){
			if (!Lambda.has(layerIds, comp.parentId)){
				// store the id of the layer
				layerIds.push(comp.parentId);
				
				// store the corresponding layer
				var layer = SLBuilder.getInstance().getLayer(comp.parentId);
				layersArray.push(layer);
			}
		}

		// update the selection of the widget
		if (invalidateLayers == true)
			setLayers(layersArray, false);

		// notify the widget 
		if (refreshComponentsWidgetCallbak != null)
			refreshComponentsWidgetCallbak(items);

		// notify the widget 
		if (refreshPropertiesWidgetCallbak != null)
			refreshPropertiesWidgetCallbak(items);

		// notify the SLBuilder singleton
		if (onChange != null)
			onChange();
	}
	/**
	 * retrieve the selection
	 */
	public function getComponents():Array<Component>{
		return components;
	}
	///////////////////////////////////////////////////////////////////
	// Regions 
	///////////////////////////////////////////////////////////////////
	/**
	 * refresh the in-place editors
	 * also update the selection display
	 */
	public function redraw() {
		// get selectable components list
		var selectableComponents = SLBuilder.getInstance().getComponents(null);

		// remove all regions
		for(region in regions){
			region.remove();
		}
		regions = new Array();
		// create regions for selection
		for(component in components){
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