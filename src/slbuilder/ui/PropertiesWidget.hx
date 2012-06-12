package slbuilder.ui;

import js.Lib;
import js.Dom;
import slbuilder.core.SLBuilder;
import slbuilder.core.Config;
import slbuilder.core.Utils;
import slbuilder.data.Property;
import slbuilder.data.Component;
import slbuilder.data.Types;
import slbuilder.ui.ListWidget;

/**
 * Properties widget
 * display the properties of a components in a list
 * - list
 * - edit
 * - undo / reset to default ?
 */
class PropertiesWidget extends ListWidget<Property> {
	/**
	 * ID of the component of which we display the properties
	 * TODO: multi selection
	 */
	public var parentId(getParentId, null):Null<Id>;
	/**
	 * ID of the layer of which we display the components
	 * TODO: multi selection
	 */
	private function getParentId():Null<Id>{
		var selected = SLBuilder.getInstance().selection.getComponents();
		if (selected.length > 0)
			return selected[0].id;
		else
			return null;
	}
	/**
	 * button
	 */
	private var submitBtn:HtmlDom;
	/**
	 * init the widget
	 * get elements by class names 
	 * initializes the process of refreshing the list
	 */
	override public dynamic function init() : Void { 
		trace("PROPERTIES WIDGET INIT ");
		super.init();

		submitBtn = Utils.getElementsByClassName(rootElement, "submit")[0];
		if (submitBtn == null) throw("element not found in index.html");
		submitBtn.onclick = onSubmit;

		// submit by pressing enter
		list.onkeydown = function (e:js.Event) {
			//Utils.inspectTrace(e);
			if (e.keyCode == 13)
				onSubmit(e);
		}		
		SLBuilder.getInstance().selection.refreshPropertiesWidgetCallbak = onSelectionChange;
	}
	/**
	 * callback for a change in the selection
	 */
	private function onSelectionChange(){
		trace("onSelectionChange ");
		refresh();
	}
	/**
	 * called when the user presses submit button or hit enter on the keyboard
	 */
	private function onSubmit(e:js.Event) {
		trace("onSubmit");
		var inputs = Utils.getElementsByClassName(rootElement, "input");
		for (idx in 0...dataProvider.length){
			trace(idx);
			dataProvider[idx].value = Reflect.field(inputs[idx], "value");
			SLBuilder.getInstance().setProperty(parentId, dataProvider[idx].name, dataProvider[idx].value);
		}
		reloadData();
		SLBuilder.getInstance().selection.reloadData();
		if (onChange != null){
			onChange(dataProvider[0]);
		}
		//Utils.inspectTrace(dataProvider);
	}
	/**
	 * refreh list data, but do not refresh display
	 * handles the selection
	 * to be overriden to handle the model
	 */
	override public function reloadData() {
		if (_isInit == false)
			return;

		if (parentId!=null){
			dataProvider = SLBuilder.getInstance().getProperties(parentId);
		}
		else{
			dataProvider = new Array();
		}

		// refresh the list
		super.reloadData();
	}
	/**
	 * prevent this behavior
	 */
	override private function updateSelectionDisplay(selection:Array<Property>) {
		//super.updateSelectionDisplay(selection);
	}
}