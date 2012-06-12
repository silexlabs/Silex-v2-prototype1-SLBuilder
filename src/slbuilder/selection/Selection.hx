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
	 * used to determine if a redraw method call is already planed in the next frame
	 */
	private var isDirty:Bool;
	/**
	 * constructor
	 */
	public function new(){
		trace("Selection init");
		// init arrays
		pages = new Array();
		layers = new Array();
		components = new Array();

		// init
		isDirty = false;

		// refresh regions
		redrawRegions();
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
	public var refreshPagesWidgetCallbak:Void->Void;
	/**
	 * callback for the widget
	 */
	public var refreshLayersWidgetCallbak:Void->Void;
	/**
	 * callback for the widget
	 */
	public var refreshComponentsWidgetCallbak:Void->Void;
	/**
	 * callback for the widget
	 */
	public var refreshPropertiesWidgetCallbak:Void->Void;
	/**
	 * callback for the widget
	 */
	public var refreshRegionsCallbak:Void->Void;

	/**
	 * refresh the in-place editors
	 */
	public function redrawRegions() {
		if (refreshRegionsCallbak != null)
			refreshRegionsCallbak();
	}
	/**
	 * invalidate the selection display
	 * this will ensure that the display will be updated in next frame, 
	 * and will do not redraw multiple times even if this method is called multiple times
	 */
	public function invalidate() {
		if (isDirty == false){
			isDirty = true;
			// do later
			haxe.Timer.delay(redraw, 25);
		}
	}
	/**
	 * update the selection display and refresh the in-place editors
	 */
	public function redraw() {
		// notify the widget 
		if (refreshPagesWidgetCallbak != null)
			refreshPagesWidgetCallbak();
		// notify the widget 
		if (refreshLayersWidgetCallbak != null)
			refreshLayersWidgetCallbak();
		// notify the widget 
		if (refreshComponentsWidgetCallbak != null)
			refreshComponentsWidgetCallbak();
		// notify the widget 
		if (refreshPropertiesWidgetCallbak != null)
			refreshPropertiesWidgetCallbak();
		// redraw regions
		redrawRegions();

		// now we are clean
		isDirty = false;
	}
	/**
	 * reload all components/layers/pages data from the dom
	 */
	public function reloadData(){
		for(idx in 0...components.length){
			components[idx] = SLBuilder.getInstance().getComponent(components[idx].id);
		}
		for(idx in 0...layers.length){
			layers[idx] = SLBuilder.getInstance().getLayer(layers[idx].id);
		}
		for(idx in 0...pages.length){
			pages[idx] = SLBuilder.getInstance().getPage(pages[idx].id);
		}
	}
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
			refreshPagesWidgetCallbak();

		// empty the selection
		if (invalidateLayers == true)
			setLayers([], true, false);

		// notify the SLBuilder singleton
		if (onChange != null)
			onChange();

		// redraw regions
		redrawRegions();
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
			refreshLayersWidgetCallbak();

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
			refreshComponentsWidgetCallbak();

		// notify the widget 
		if (refreshPropertiesWidgetCallbak != null)
			refreshPropertiesWidgetCallbak();

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
}