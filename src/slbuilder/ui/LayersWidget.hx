package slbuilder.ui;

import js.Lib;
import js.Dom;
import slbuilder.core.SLBuilder;
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
	 * button
	 */
	private var addPageBtn:HtmlDom;
	/**
	 * button
	 */
	private var removePageBtn:HtmlDom;
	/**
	 * page change callback
	 */
	public var onPageChange:Page->Void;
	/**
	 * init the widget
	 * get elements by class names 
	 * initializes the process of refreshing the list
	 */
	override public dynamic function init() : Void { 
		pagesDropDown = Utils.getElementsByClassName(rootElement, "dropdown")[0];
		if (pagesDropDown == null) throw("element not found in index.html");
		pagesDropDownTemplate = pagesDropDown.innerHTML;
		var _this_ = this;
		untyped __js__ ("_this_.pagesDropDown.onchange = function(e){_this_.onPageClick(e)}");

		addPageBtn = Utils.getElementsByClassName(rootElement, "addPage")[0];
		if (addPageBtn == null) throw("element not found in index.html");
		addPageBtn.onclick = addPage;

		removePageBtn = Utils.getElementsByClassName(rootElement, "removePage")[0];
		if (removePageBtn == null) throw("element not found in index.html");
		removePageBtn.onclick = removePage;

		super.init();

		refresh();
		onPageClick();
	}
	/**
	 * handle page selection change
	 */
	private function onPageClick(e:js.Event = null) {
		var idx:Int = -1;
		var _this_ = this;
		idx = untyped __js__("_this_.pagesDropDown.selectedIndex");
		var dataProviderPages = SLBuilder.getInstance().getPages();
		parentId = dataProviderPages[idx].id;
		trace("PAGE SELECTED : "+parentId);
		refresh();
	}
	/**
	 * refresh the list, i.e. arrayStore.loadData( ... )
	 * to be overriden to handle the model
	 */
	override public function refresh() {
		if (_isInit == false)
			return;

		// REFRESH PAGE LIST
		// keep selected index
		var _this_ = this;
		var oldIdx:Int = untyped __js__("_this_.pagesDropDown.selectedIndex");
		// the first time, oldIdx will be -1
		if (oldIdx <=0) oldIdx = 0;

		// get data provider
		var dataProviderPages = SLBuilder.getInstance().getPages();

		// redraw content
		var listInnerHtml:String = "";
		var t = new haxe.Template(pagesDropDownTemplate);
		for (elem in dataProviderPages){
			listInnerHtml += t.execute(elem);
		}
		pagesDropDown.innerHTML = listInnerHtml;

		// keep selected index
		untyped __js__("_this_.pagesDropDown.selectedIndex = oldIdx");

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
	/**
	 * add an element to the model and refresh the list
	 */
	private function addPage(e:js.Event) {
		var deeplink:String = js.Lib.window.prompt("Deeplink for the new page");
		if (deeplink != null && deeplink != ""){
			var page = SLBuilder.getInstance().createPage(deeplink);
			SLBuilder.getInstance().setProperty(page.id, "displayName", deeplink);
			refresh();
		}
	}
	/**
	 * remove an element from the model and refresh the list
	 */
	private function removePage(e:js.Event) {
		SLBuilder.getInstance().removePage(parentId);
		refresh();
		onPageClick();
	}
}