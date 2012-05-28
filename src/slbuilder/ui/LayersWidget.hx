package slbuilder.ui;

import js.Lib;
import js.Dom;
import slbuilder.core.SLBuilder;
import slbuilder.core.Template;
import slbuilder.core.Config;
import slbuilder.core.Utils;
import slbuilder.data.Layer;
import slbuilder.data.Types;
import slbuilder.ui.ListWidget;

/**
 * layers widget
 * display the layers in a list
 * - list
 * - create/delete
 * - add/remove existing layer to page
 * - zorder in current page / all pages
 * - move to page?
 * - navigate vs edit in place
 */
class LayersWidget extends ListWidget<Layer> {
	/**
	 * ID of the page of which we display the layers
	 */
	public var parentId:Id;
/*
	public var parentId(setParentId,default):Id;
	private function setParentId(newParentId:Id):Id{
		refresh();
		return newParentId;
	}
*/	/**
	 * init the widget
	 */
	override public function new(parent:HtmlDom, panel:ext.form.Panel){
		super(parent, panel, "Layers");
	}
	/**
	 * get elements by class names 
	 * initializes the process of refreshing the list
	 */
	override private function initDomReferences() {
		super.initDomReferences();
	}
	/**
	 * refresh the list, i.e. arrayStore.loadData( ... )
	 * to be overriden to handle the model
	 */
	override public function refresh() {
		if (parentId!=null){
			var layers = SLBuilder.getInstance().getLayers(parentId);
			var arraArray:ext.Array<Dynamic> = ext.Array.from(layers);
			arrayStore.loadData(arraArray);
		}
		else{
			// empty selection
			arrayStore.removeAll();
		}
		super.refresh();
	}
	/**
	 * add an element to the model and refresh the list
	 * to be overriden to handle the model
	 */
	override private function add(e:js.Event) {
		var layer = SLBuilder.getInstance().createLayer("basicLayer", parentId);
		SLBuilder.getInstance().setProperty(layer.id, "displayName", "New Layer");
		super.add(e);
	}
	/**
	 * remove an element from the model and refresh the list
	 * to be overriden to handle the model
	 */
	override private function remove(e:js.Event) {
		//Utils.inspectTrace(grid.selModel.selected.items[0].data);
		SLBuilder.getInstance().removeLayer(grid.selModel.selected.items[0].data.id);
		super.remove(e);
	}
	/**
	 * handle a selection change
	 * call onChange if defined
	 */
	override private function onSelectionChanged(model:Dynamic, records:Array<Dynamic>) {
		super.onSelectionChanged(model, records);
	}

	/**
	 * init the extjs list 
	 */
	override private function initExtJsUi(){
		super.initExtJsUi();
	}
}