package slbuilder.ui;

import js.Lib;
import js.Dom;
import slbuilder.core.Config;
import slbuilder.core.Utils;
import slbuilder.data.Types;

import slplayer.ui.DisplayObject;

/**
 * list widget
 * display the layers or components in a list
 * this class has to be overriden
 */
class ListWidget<ElementClass> extends DisplayObject{
	public static inline var LIST_SELECTED_ITEM_CSS_CLASS:String = "listSelectedItem";

	private var _isInit:Bool;
	/**
	 * list
	 */
	public var list:HtmlDom;
	/**
	 * list elements template
	 * @example 	&lt;li&gt;::displayName::&lt;/li&gt;
	 */
	public var listTemplate:String;
	/**
	 * data store
	 */
	public var dataProvider:Array<ElementClass>;
	/**
	 * selected item if any
	 */
	public var selectedItem(getSelectedItem, setSelectedItem):Null<ElementClass>;
	private var _selectedItem:Null<ElementClass>;
	/**
	 * on change callback
	 */
	public var onChange:ElementClass->Void;
	/**
	 * on roll over callback
	 */
	public var onRollOver:ElementClass->Void;
	/**
	 * button
	 */
	private var addBtn:HtmlDom;
	/**
	 * button
	 */
	private var removeBtn:HtmlDom;
	/**
	 * header element
	 */
	private var header:HtmlDom;
	/**
	 * footer element
	 */
	private var footer:HtmlDom;
	/**
	 * constructor
	 */
	public function new(d:HtmlDom) {
		_isInit = false;
		super(d);
	}
	/**
	 * init the widget
	 * get elements by class names 
	 * initializes the process of refreshing the list
	 */
	override public dynamic function init() : Void { 
		super.init();

		// button
		addBtn = Utils.getElementsByClassName(rootElement, "add")[0];
		if (addBtn != null)
			addBtn.onclick = add;

		// button
		removeBtn = Utils.getElementsByClassName(rootElement, "remove")[0];
		if (removeBtn != null)
			removeBtn.onclick = remove;

		// footer
		footer = Utils.getElementsByClassName(rootElement, "toolboxfooter")[0];
		if (footer == null) throw("element not found in index.html");

		// header
		header = Utils.getElementsByClassName(rootElement, "toolboxheader")[0];
		if (header == null) throw("element not found in index.html");

		var _this_ = this;
		untyped __js__("window.addEventListener('resize', _this_.refresh);");

		// list and list template
		list = Utils.getElementsByClassName(rootElement, "list")[0];
		if (list == null) throw("element not found in index.html");
		listTemplate = list.innerHTML;
		_isInit = true;
		refresh();
	}
	/**
	 * refresh the list, i.e. reload the dataProvider( ... )
	 * set the height of the list to match available space
	 * to be overriden to handle the model
	 */
	public function refresh() {
		if (_isInit == false)
			return;

		// refresh list content
		var listInnerHtml:String = "";
		var t = new haxe.Template(listTemplate);
		for (elem in dataProvider){
			listInnerHtml += t.execute(elem);
		}
		list.innerHTML = listInnerHtml;
		attachListEvents();
		selectedItem = null;

		// set the height of the list to match available space
		var availableHeight:Int = rootElement.parentNode.clientHeight;
		availableHeight -= header.clientHeight;
		availableHeight -= footer.clientHeight;

		list.style.height = availableHeight + "px";
	}
	/**
	 * attach mouse events to the list and the items
	 */
	private function attachListEvents(){
		var children = Utils.getElementsByClassName(list, "listItem");
		for (idx in 0...children.length){
			Reflect.setField(children[idx], "data-listwidgetitemidx", Std.string(idx));
			children[idx].onclick = onClick;
			children[idx].onmouseover = _onRollOver;
			children[idx].style.cursor = 'pointer';
		}
	}
	/**
	 * handle click in the list
	 * TODO: multiple selection
	 */
	private function onClick(e:js.Event) {
		var idx:Int = Std.parseInt(Reflect.field(e.target, "data-listwidgetitemidx"));
		selectedItem = dataProvider[idx];
	}
	/**
	 * handle roll over
	 */
	private function _onRollOver(e:js.Event) {
		if (onRollOver != null){
			var idx:Int = Std.parseInt(Reflect.field(e.target, "data-listwidgetitemidx"));
			onRollOver(dataProvider[idx]);
		}
	}
	/**
	 * add an element to the model and refresh the list
	 * to be overriden to handle the model
	 */
	private function add(e:js.Event) {
		refresh();
	}
	/**
	 * remove an element from the model and refresh the list
	 * to be overriden to handle the model
	 */
	private function remove(e:js.Event) {
		refresh();
	}
	/**
	 * handle a selection change
	 * call onChange if defined
	 * TODO: multiple selection
	 */
	private function onSelectionChanged(selection:Array<ElementClass>) {
		trace("-selection changed-");

		// handle the selected style 
		var children = Utils.getElementsByClassName(list, "listItem");
		for (idx in 0...children.length){
			var idxElem:Int = Std.parseInt(Reflect.field(children[idx], "data-listwidgetitemidx"));
			if (idxElem >= 0){
				var found = false;
				for (elem in selection){
					if (elem == dataProvider[idxElem]){
						found = true;
						break;
					}
				}
				if (children[idx] == null){
					// workaround
					trace("--workaround--" + idx +"- "+children[idx]);
					continue;
				}

				var className = "";
//				if (children[idx].className != null)
					className = children[idx].className;
				
				if (found){
					trace("element selected "+idx+": "+children[idx]);
					if (className.indexOf(LIST_SELECTED_ITEM_CSS_CLASS)<0)
						className += " "+LIST_SELECTED_ITEM_CSS_CLASS;
				}
				else{
					var pos = className.indexOf(LIST_SELECTED_ITEM_CSS_CLASS);
					trace("element "+idx+" not selected : "+className+" - "+pos);
					if (pos>=0){
						// remove the spaces
						var tmp = className;
						className = StringTools.trim(className.substr(0, pos));
						className += " "+StringTools.trim(tmp.substr(pos+LIST_SELECTED_ITEM_CSS_CLASS.length));
					}
				}
				children[idx].className = className;
			}
		}
		if (onChange != null){
			onChange(_selectedItem);
		}
	}
	////////////////////////////////////////////////////////////
	// setter / getter
	////////////////////////////////////////////////////////////
	/**
	 * getter/setter
	 */
	function getSelectedItem():Null<ElementClass> {
		return _selectedItem;
	}
	/**
	 * getter/setter
	 */
	function setSelectedItem(selected:Null<ElementClass>):Null<ElementClass> {
		if (selected != _selectedItem){
			_selectedItem = selected;
			onSelectionChanged([selected]);
		}
		return selected;
	}

}