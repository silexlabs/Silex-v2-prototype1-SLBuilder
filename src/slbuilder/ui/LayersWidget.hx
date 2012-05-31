package slbuilder.ui;

import js.Lib;
import js.Dom;
import slbuilder.core.SLBuilder;
import slbuilder.core.Template;
import slbuilder.core.Config;
import slbuilder.core.Utils;
import slbuilder.data.Page;
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
 * 
 * display the Pages in a list
 * - list
 * - create/delete
 */
class LayersWidget extends ListWidget<Layer> {
	/**
	 * ID of the page of which we display the layers
	 */
	public var parentId:Id;
	/**
	 * pages selector
	 */
	public var pagesDropDown:HtmlDom;
	/**
	 * pages selector template
	 */
	public var pagesDropDownTemplate:String;
	/**
	 * page change callback
	 */
	public var onPageChange:Page->Void;
	/**
	 * init the widget
	 * get elements by class names 
	 * initializes the process of refreshing the list
	 */
	override public dynamic function init(?args:Hash<String>) : Void { 
		super.init(args);
		pagesDropDown = Utils.getElementsByClassName(rootElement, "dropdown")[0];
		pagesDropDownTemplate = pagesDropDown.innerHTML;
		untyped ("pagesDropDown.onchange = onPageClick");
	}
	/**
	 * handle page selection change
	 */
	private function onPageClick(e:js.Event) {
		var idx:Int = -1;
		untyped("idx = pagesDropDown.selectedIndex");
		var dataProviderPages = SLBuilder.getInstance().getPages();
		parentId = dataProviderPages[idx].id;
		refresh();
	}
	/**
	 * refresh the list, i.e. arrayStore.loadData( ... )
	 * to be overriden to handle the model
	 */
	override public function refresh() {
		// REFRESH PAGE LIST
		var dataProviderPages = SLBuilder.getInstance().getPages();
		var listInnerHtml:String = "";
		var t = new haxe.Template(pagesDropDownTemplate);
		for (elem in dataProviderPages){
			listInnerHtml += t.execute(elem);
		}
		pagesDropDown.innerHTML = listInnerHtml;

		// refreh list data
		if (parentId!=null){
			dataProvider = SLBuilder.getInstance().getLayers(parentId);
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
		SLBuilder.getInstance().removeLayer(selectedItem.id);
		super.remove(e);
	}
}