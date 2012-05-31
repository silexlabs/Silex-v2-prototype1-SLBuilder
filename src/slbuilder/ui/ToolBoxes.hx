package slbuilder.ui;

import js.Lib;
import js.Dom;
import slbuilder.core.Config;
import slbuilder.core.Utils;
import slbuilder.ui.LayersWidget;
import slbuilder.ui.ComponentsWidget;
import slbuilder.data.Types;
import slbuilder.data.Property;
import slbuilder.data.Component;
import slbuilder.data.Layer;
import slbuilder.data.Page;
import slbuilder.core.ISLBuilderBridge;

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
	/////////////////////////////////////////////////////////////////
	// tool boxes
	/////////////////////////////////////////////////////////////////
	/**
	 * init the application
	 */
	override public dynamic function init(?args:Hash<String>) : Void { 
		//haxe.Firebug.redirectTraces(); 
		trace("ToolBoxes init");
		initUis();
	}
	/**
	 * retrieve references to the widgets
	 */
	private function initUis(){
		var domElem;
		domElem = Utils.getElementsByClassName(rootElement, "layers")[0];
		layersWidget = cast(SLPlayer.getAssociatedComponents(domElem).first());
		layersWidget.onChange = onLayerChange;
		layersWidget.onPageChange = onPageChange;

		domElem = Utils.getElementsByClassName(rootElement, "components")[0];
		componentsWidget = cast(SLPlayer.getAssociatedComponents(domElem).first());
		componentsWidget.onChange = onComponentChange;

		layersWidget.refresh();
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
		}

		trace ("Component selected: "+displayName);
	}
}
