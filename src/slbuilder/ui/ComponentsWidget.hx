package slbuilder.ui;

import js.Lib;
import js.Dom;
import slbuilder.core.SLBuilder;
import slbuilder.core.Template;
import slbuilder.core.Config;
import slbuilder.core.Utils;
import slbuilder.data.Component;
import slbuilder.data.Types;
import slbuilder.ui.ListWidget;

/**
 * Components widget
 * display the components in a list
 * - list
 * - list
 * - create / delete
 * - add/remove existing component to layer
 * - zindex in current layer / all layers
 * - copy/cut/paste/duplicate
 * - move to layer?
 * - navigate/use vs edit in place
 */
class ComponentsWidget extends ListWidget<Component> {
	/**
	 * ID of the layer of which we display the components
	 */
	public var parentId:Id;
	/**
	 * init the widget
	 */
	override public function new(parent:HtmlDom, panel:ext.form.Panel){
		super(parent, panel, "Components");
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
		if (parentId != null){
			var components = SLBuilder.getInstance().getComponents(parentId);
			var arraArray:ext.Array<Dynamic> = ext.Array.from(components);
			arrayStore.loadData(arraArray);
		}
		else
			arrayStore.removeAll();
		super.refresh();
	}
	/**
	 * add an element to the model and refresh the list
	 * to be overriden to handle the model
	 */
	override private function add(e:js.Event) {
		var component = SLBuilder.getInstance().createComponent("basicComponent", parentId);
		SLBuilder.getInstance().setProperty(component.id, "displayName", "New Component");
		super.add(e);
	}
	/**
	 * remove an element from the model and refresh the list
	 * to be overriden to handle the model
	 */
	override private function remove(e:js.Event) {
		//Utils.inspectTrace(grid.selModel.selected.items[0].data);
		SLBuilder.getInstance().removeComponent(grid.selModel.selected.items[0].data.id);
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