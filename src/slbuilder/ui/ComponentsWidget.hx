package slbuilder.ui;

import js.Lib;
import js.Dom;
import slbuilder.core.SLBuilder;
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
	 * TODO: multi selection
	 */
	public var parentId(getParentId, null):Null<Id>;
	/**
	 * ID of the layer of which we display the components
	 * TODO: multi selection
	 */
	private function getParentId():Null<Id>{
		var selected = SLBuilder.getInstance().selection.getLayers();
		if (selected.length > 0)
			return selected[0].id;
		else
			return null;
	}
	/**
	 * constructor
	 */
	public function new(d:HtmlDom) {
		super(d);
	}
	/**
	 * init the widget
	 * get elements by class names 
	 * initializes the process of refreshing the list
	 */
	override public dynamic function init() : Void { 
		trace("COMPONENTS WIDGET INIT ");
		super.init();

		SLBuilder.getInstance().selection.refreshComponentsWidgetCallbak = onSelectionChange;
	}
	/**
	 * handle click in the list
	 * TODO: multiple selection
	 */
	override private function onClick(e:js.Event) {
		super.onClick(e);
		SLBuilder.getInstance().selection.setComponents([selectedItem]);
	}
	/**
	 * callback for a change in the selection
	 */
	private function onSelectionChange(){
		trace("onSelectionChange ComponentsWidget ");
		// handles selection
		var selectedComponents = SLBuilder.getInstance().selection.getComponents();
		if (selectedComponents.length > 0)
			selectedItem = selectedComponents[0];
		else
			selectedItem = null;

		refresh();
	}
	/**
	 * refreh list data, but do not refresh display
	 * to be overriden to handle the model
	 */
	override public function reloadData() {
		trace("reloadData "+parentId);

		if (_isInit == false)
			return;

		if (parentId!=null){
			dataProvider = SLBuilder.getInstance().getComponents(parentId);
		}
		else{
			dataProvider = new Array();
		}
		// refresh the list
		super.reloadData();
	}
	/**
	 * handle a selection change
	 * call onChange if defined
	 * TODO: multiple selection
	 */
	override private function updateSelectionDisplay(selection:Array<Component>) {
		super.updateSelectionDisplay(selection);
	}
	/**
	 * add an element to the model and refresh the list
	 * to be overriden to handle the model
	 */
	override private function add(e:js.Event) {
		if (parentId == null)
			throw ("Can not create a component, no layer is selected");
		var component = SLBuilder.getInstance().createComponent("basicComponent", parentId);
		SLBuilder.getInstance().setProperty(component.id, "displayName", "New Component");
		super.add(e);
	}
	/**
	 * remove an element from the model and refresh the list
	 * to be overriden to handle the model
	 */
	override private function remove(e:js.Event) {
		SLBuilder.getInstance().removeComponent(selectedItem.id);
		super.remove(e);
	}
}