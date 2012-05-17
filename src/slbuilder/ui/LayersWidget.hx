package slbuilder.ui;

import js.Lib;
import js.Dom;
import slbuilder.core.Template;
import slbuilder.core.Config;
import slbuilder.core.Utils;
import slbuilder.data.Layer;
import slbuilder.data.Types;

/**
 * layers widget
 * display the layers in a list
 * - list
 * - create/delete
 * - add/remove existing layer to page
 * - zorder in current page / all pages
 * - move to page?
 * - navigate vs edit in place
 * - Pages: selection = dropdown + add / suppr
 */
class LayersWidget {
	/**
	 * template name
	 */
	static inline var TEMPLATE_NAME:String = "LayersWidget";
	/**
	 * on change callback
	 */
	public var onChange:Layer->Void;
	/**
	 * the list
	 */
	private var list:HtmlDom;
	/**
	 * button
	 */
	private var addBtn:HtmlDom;
	/**
	 * root container
	 */
	private var root:HtmlDom;
	/**
	 * parent container, provided as a constructor param
	 */
	private var parent:HtmlDom;
	/**
	 * init the ViewMenu
	 */
	public function new(parent:HtmlDom){
		this.parent = parent;
		// load the templates
		new Template(TEMPLATE_NAME).onLoad = attachTemplate;
	}
	/**
	 * callback for loaded teplates
	 */
	private function attachTemplate(template:Template){
		root = Lib.document.createElement("div");
		root.innerHTML = template.execute({Config:Config});
		parent.appendChild(root);
		// init the UIs contained in the template
		list = Utils.getElementsByClassName("list")[0];
		addBtn = Utils.getElementsByClassName("add")[0];
		addBtn.onclick = addLayer;

		refresh();
	}

	private function refresh() {
		list.innerHTML = "";
		var layers = SLBuilder.getInstance().getLayers(null);
		var t = this;
		//var liString = "";
		for (layer in layers){
			//liString += "<li id='"+layer.id+"'>"+layer.displayName+"</li>";
			var elem = Lib.document.createElement("li");
			elem.id = layer.id.seed;
			elem.innerHTML = layer.displayName;
			elem.onclick = function(e:js.Event){
				t.removeLayer(layer.id);
			};
			list.appendChild(elem);
		}
		//list.innerHTML = liString;
	}
	private function addLayer(e:js.Event) {
		var layer = SLBuilder.getInstance().createLayer("basicLayer", null);
		SLBuilder.getInstance().setProperty(layer.id, "displayName", "New Layer");
		refresh();
	}
	private function removeLayer(id:Id) {
		SLBuilder.getInstance().removeLayer(id);
		refresh();
	}
	private function onClickList(e:js.Event) {
		//trace("click "+e.target.className);
//		if (onChange != null)
//			onChange(e.target.className);
	}
}