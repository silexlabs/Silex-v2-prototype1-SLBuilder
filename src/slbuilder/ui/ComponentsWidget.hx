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
	 * get elements by class names 
	 * initializes the process of refreshing the list
	 */
	override public dynamic function init(?args:Hash<String>) : Void { 
		super.init(args);
	}
	/**
	 * refresh the list, i.e. arrayStore.loadData( ... )
	 * to be overriden to handle the model
	 */
	override public function refresh() {
		// refreh list data
		if (parentId!=null){
			dataProvider = SLBuilder.getInstance().getComponents(parentId);
		}
		else{
			dataProvider = new Array();
		}

		// refresh the list
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
		SLBuilder.getInstance().removeComponent(selectedItem.id);
		super.remove(e);
	}
}