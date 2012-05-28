package slbuilder.ui;

import js.Lib;
import js.Dom;
import slbuilder.core.SLBuilder;
import slbuilder.core.Template;
import slbuilder.core.Config;
import slbuilder.core.Utils;
import slbuilder.data.Page;
import slbuilder.data.Types;
import slbuilder.ui.ListWidget;

/**
 * Pages widget
 * display the Pages in a list
 * - list
 * - create/delete
 */
class PagesWidget extends ListWidget<Page> {
	/**
	 * init the widget
	 */
	override public function new(parent:HtmlDom, panel:ext.form.Panel){
		super(parent, panel, "Pages");
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
		var pages = SLBuilder.getInstance().getPages();
		var arraArray:ext.Array<Dynamic> = ext.Array.from(pages);
		arrayStore.loadData(arraArray);
		super.refresh();
	}
	/**
	 * add an element to the model and refresh the list
	 * to be overriden to handle the model
	 */
	override private function add(e:js.Event) {
		var deeplink:String = Lib.window.prompt("What deeplink for this new page?");
		var page = SLBuilder.getInstance().createPage(deeplink);
		SLBuilder.getInstance().setProperty(page.id, "displayName", "New Page");
		super.add(e);
	}
	/**
	 * remove an element from the model and refresh the list
	 * to be overriden to handle the model
	 */
	override private function remove(e:js.Event) {
		//Utils.inspectTrace(grid.selModel.selected.items[0].data);
		SLBuilder.getInstance().removePage(grid.selModel.selected.items[0].data.id);
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