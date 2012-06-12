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
	 * selected page index
	 */
	public var pageSelectedIndex(getPageSelectedIndex, setPageSelectedIndex):Int;
	/**
	 * ID of the page of which we display the layers
	 * TODO: multi selection
	 */
	public var parentId(getParentId, null):Null<Id>;
	/**
	 * ID of the layer of which we display the components
	 * TODO: multi selection
	 */
	private function getParentId():Null<Id>{
		var selected = SLBuilder.getInstance().selection.getPages();
		if (selected.length > 0)
			return selected[0].id;
		else
			return null;
	}
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
		trace("LAYERS WIDGET INIT ");

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

		SLBuilder.getInstance().selection.refreshLayersWidgetCallbak = onSelectionChange;
		SLBuilder.getInstance().selection.refreshPagesWidgetCallbak = onPageSelectionChange;

		pageSelectedIndex = 0;
	}
	/**
	 * callback for a change in the selection
	 */
	private function onSelectionChange(){
		trace("onSelectionChange LayersWidget ");

		// handle selection
		var selectedLayers = SLBuilder.getInstance().selection.getLayers();
		if (selectedLayers.length > 0)
			selectedItem = selectedLayers[0];
		else
			selectedItem = null;

		refresh();
	}
	/**
	 * callback for a change in the selection
	 */
	private function onPageSelectionChange(){
		trace("onPageSelectionChange LayersWidget ");

		// get data provider
		var dataProviderPages = SLBuilder.getInstance().getPages();
		refresh();
	}
	/**
	 * handle click in the list
	 * TODO: multiple selection
	 */
	override private function onClick(e:js.Event) {
		super.onClick(e);
		SLBuilder.getInstance().selection.setLayers([selectedItem]);
	}
	/**
	 * handle page selection change
	 */
	private function onPageClick(e:js.Event = null) {
		var _this_ = this;
		setPageSelectedIndex(untyped __js__("_this_.pagesDropDown.selectedIndex"));
	}
	/**
	 * selected page index setter/getter
	 */
	private function getPageSelectedIndex(): Int{
		// retrieve the selected index from the selection
		var tmpPages = SLBuilder.getInstance().selection.getPages();
		var pageSelected:Page;
		if (tmpPages.length > 0){
			pageSelected = tmpPages[0];
			var dataProviderPages = SLBuilder.getInstance().getPages();
			for (idx in 0...dataProviderPages.length){
				if (pageSelected.id.seed == dataProviderPages[idx].id.seed){
					return idx;
				}
			}
		}
		return -1;
	}
	/**
	 * selected page index setter/getter
	 */
	private function setPageSelectedIndex(idx:Int): Int{
		trace("setPageSelectedIndex "+idx);
		
		// retrieve the selected index from the selection
		var dataProviderPages = SLBuilder.getInstance().getPages();
		SLBuilder.getInstance().selection.setPages([dataProviderPages[idx]]);
		refresh();
		return idx;
	}
	/**
	 * refreh list data, but do not refresh display
	 * to be overriden to handle the model
	 */
	override public function reloadData() {
		if (_isInit == false)
			return;

		// get data provider
		var dataProviderPages = SLBuilder.getInstance().getPages();

		// get selected pages
		var selectedPages = SLBuilder.getInstance().selection.getPages();

		// redraw content
		var listInnerHtml:String = "";
		var t = new haxe.Template(pagesDropDownTemplate);
		for (elem in dataProviderPages){
			listInnerHtml += t.execute(elem);
		}
		pagesDropDown.innerHTML = listInnerHtml;

		// reload data provider
		if (parentId!=null){
			dataProvider = SLBuilder.getInstance().getLayers(parentId);
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
	override private function updateSelectionDisplay(selection:Array<Layer>) {
		super.updateSelectionDisplay(selection);
		var _this_ = this;
		untyped __js__("_this_.pagesDropDown.selectedIndex = _this_.getPageSelectedIndex()");
	}
	/**
	 * add an element to the model and refresh the list
	 * to be overriden to handle the model
	 */
	override private function add(e:js.Event) {
		if (parentId == null)
			throw ("Can not create a layer, no page is selected");

		var layer = SLBuilder.getInstance().createLayer("basicLayer", parentId);
		SLBuilder.getInstance().setProperty(layer.id, "displayName", "New Layer");
		super.add(e);
	}
	/**
	 * remove an element from the model and refresh the list
	 * to be overriden to handle the model
	 */
	override private function remove(e:js.Event) {
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