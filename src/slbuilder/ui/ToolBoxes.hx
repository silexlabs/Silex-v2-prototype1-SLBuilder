package slbuilder.ui;

import js.Lib;
import js.Dom;
import slbuilder.core.Config;
import slbuilder.core.Utils;
import slbuilder.ui.LayersWidget;
import slbuilder.ui.ComponentsWidget;
import slbuilder.ui.PropertiesWidget;
import slbuilder.data.Types;
import slbuilder.data.Property;
import slbuilder.data.Component;
import slbuilder.data.Layer;
import slbuilder.data.Page;
import slbuilder.core.ISLBuilderBridge;
import slbuilder.core.SLBuilder;

import slplayer.ui.DisplayObject;
import slplayer.core.SLPlayer;

/**
 * synchronize the tool boxes and selection
 */
class ToolBoxes extends DisplayObject 
{
	////////////////////////////////////////////////////////////////////
	// Widgets composing the SLBuilder
	////////////////////////////////////////////////////////////////////
	/**
	 * widget
	 */
	private var layersWidget:LayersWidget;
	/**
	 * widget
	 */
	private var componentsWidget:ComponentsWidget;
	/**
	 * widget
	 */
	private var propertiesWidget:PropertiesWidget;
	/////////////////////////////////////////////////////////////////
	// tool boxes
	/////////////////////////////////////////////////////////////////
	/**
	 * init the application
	 */
	override public dynamic function init() : Void { 
		//haxe.Firebug.redirectTraces(); 
		trace("ToolBoxes init");
		initUis();
	}
	/**
	 * called by SLBuilder::
	 */
	public function setSelection(pages:Array<Page>, layer:Array<Layer>, components:Array<Component>){
		//layersWidget.pageSelectedIndex = ;
	}
	/**
	 * retrieve references to the widgets
	 */
	private function initUis(){
		var domElem;
		domElem = Utils.getElementsByClassName(rootElement, "LayersWidget")[0];
		if (domElem == null) throw("element not found in index.html");
		layersWidget = cast(SLPlayer.getAssociatedComponents(domElem).first());
		layersWidget.onChange = onLayerChange;
		layersWidget.onPageChange = onPageChange;

		domElem = Utils.getElementsByClassName(rootElement, "ComponentsWidget")[0];
		if (domElem == null) throw("element not found in index.html");
		componentsWidget = cast(SLPlayer.getAssociatedComponents(domElem).first());
		componentsWidget.onChange = onComponentChange;

		domElem = Utils.getElementsByClassName(rootElement, "PropertiesWidget")[0];
		if (domElem == null) throw("element not found in index.html");
		propertiesWidget = cast(SLPlayer.getAssociatedComponents(domElem).first());
		propertiesWidget.onChange = onPropertyChange;
	}
	private function onPageChange(page:Page) {
	}
	private function onLayerChange(layer:Layer) {
		var displayName = "none";
		if (layer != null){
			displayName = layer.displayName;
			componentsWidget.parentId = layer.id;
		}
		else{
			componentsWidget.parentId = null;
		}
		componentsWidget.refresh();
		trace ("Layer selected: "+displayName);
	}
	private function onComponentChange(component:Component) {
		var displayName = "none";
		if (component != null){
			displayName = component.displayName;
			propertiesWidget.parentId = component.id;
		}
		else{
			propertiesWidget.parentId = null;
		}

		// update in-place editors
		SLBuilder.getInstance().selection.setSelection([component]);

		// update properties widget
		propertiesWidget.refresh();
		trace ("Component selected: "+displayName);
	}
	private function onPropertyChange(property:Property) {
		trace ("Property change: "+property.displayName +" = "+property.value);
		componentsWidget.reloadData();
		SLBuilder.getInstance().selection.setSelection([componentsWidget.selectedItem]);
	}
}
