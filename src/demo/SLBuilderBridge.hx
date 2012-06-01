package demo;

import slbuilder.core.SLBuilder;
import slbuilder.core.Utils;
import slbuilder.data.Types;
import slbuilder.data.Property;
import slbuilder.data.Component;
import slbuilder.data.Layer;
import slbuilder.data.Page;
import slbuilder.core.ISLBuilderBridge;
import js.Lib;
import js.Dom;


/**
 * This class provides the SLBuilder with the callbacks it needs
 * and exposes the SLBuilder methods to dispatch the application events
 */
class SLBuilderBridge implements ISLBuilderBridge{
	/**
	 *
	 */
	public function new(){
	}
	private function getComponentFromDom(element:HtmlDom):Component{
		var component:Component = {
			parentId : {
				type:component,
				seed:element.parentNode.id
			}, 
			id : {
				type:component,
				seed:element.id
			}, 
			displayName : element.id,
			x: 0,
			y: 0,
			width: element.clientWidth,
			height: element.clientHeight,
			rotation: 0.0 //untyped __js__ ("element.style.rotation")
		};
	    while(element != null && !Math.isNaN(element.offsetLeft)) {
			component.x += element.offsetLeft - element.scrollLeft;
			component.y += element.offsetTop - element.scrollTop;
			element = element.offsetParent;
	    }
	    return component;
	}
	/////////////////////////////////////////////////////////////////////
	// Callbacks
	// These must be provided to the SLBuilder application, so that it can interact with your object model
	/////////////////////////////////////////////////////////////////////
	/**
	 * Returns the main container for components (or layers or pages)
	 */
	public function getMainContainer():HtmlDom{
		return Lib.document.getElementById("root_element_for_demo");
	}
	/**
	 * When the SLBuilder application calls this callback, you are supposed to create a container (e.g. a div in html) 
	 * which will be associated with a page
	 * Returns the id of the new page on success
	 */
	public function createPage(deeplink:Deeplink):Page {
		var id:Id = Utils.toId(page, deeplink);

		var res:HtmlDom = Lib.document.createElement("a");
		res.className = "slbuilder page";
		res.id = id.seed;
		res.setAttribute("name", deeplink);
		res.style.verticalAlign = "top";

		var parent = Lib.document.getElementById("root_element_for_demo");
		if (parent == null) throw("element not found in index.html");
		parent.appendChild(res);

		return {
			id : id, 
			displayName : id.seed,
			deeplink : deeplink
		};
	}

	/**
	 * Remove the corresponding page and return true on success
	 */
	public function removePage(id:Id):Bool{
		trace("removePage("+id.seed);
		if (id.type != page)
			throw ("Error: trying to remove a page, but the ID is the ID of a "+Std.string(id.type));

		var element:HtmlDom = Lib.document.getElementById(id.seed);
		if (element != null){
			element.parentNode.removeChild(element);
			return true;
		}
		return false;
	}

	/**
	 * When the SLBuilder calls this callback, you are supposed to return a list of pages
	 */
	public function getPages():Array<Page> {
		var parent:HtmlDom = Lib.document.getElementById("root_element_for_demo");
		if (parent == null) throw("element not found in index.html");

		var pages:HtmlCollection<HtmlDom> = untyped(parent.getElementsByClassName("page"));

		var res:Array<Page> = [];
		for (elementIdx in 0...pages.length){
			var element:HtmlDom = Reflect.field(pages, Std.string(elementIdx));
			var page:Page = {
				id : {
					type:page,
					seed:element.id
				}, 
				displayName : element.id,
				deeplink : element.getAttribute("name")
			};
			res.push(page);
		}

		return res;
	}

	/**
	 * When the SLBuilder application calls this callback, you are supposed to create a container (e.g. a div in html) which will be associated with a layer.
	 * Returns the id of the new layer on success
	 */
	public function createLayer(className:ClassName, parentId:Id):Null<Layer> {
		var id:Id = Utils.toId(layer, className);

		var res:HtmlDom = Lib.document.createElement("div");
		res.className = className + " slbuilder layer";
		res.id = id.seed;
		res.style.verticalAlign = "top";

		var parent:HtmlDom = Lib.document.getElementById(parentId.seed);

		parent.appendChild(res);

		return {
			parentId : parentId, 
			id : id, 
			displayName : id.seed
		};
	}

	/**
	 * Remove the corresponding layer and return true on success
	 */
	public function removeLayer(id:Id):Bool{
		if (id.type != layer)		if (id.type != page)
			throw ("Error: trying to remove a layer, but the ID is the ID of a "+Std.string(id.type));

		var element:HtmlDom = Lib.document.getElementById(id.seed);
		if (element != null){
			element.parentNode.removeChild(element);
			return true;
		}
		return false;
	}

	/**
	 * When the SLBuilder calls this callback, you are supposed to return a list of layers
	 */
	public function getLayers(parentId:Id):Array<Layer> {
		var parent:HtmlDom = Lib.document.getElementById(parentId.seed);
		if (parent == null) throw("element not found in index.html");

		var layers:HtmlCollection<HtmlDom> = untyped(parent.getElementsByClassName("layer"));

		var res:Array<Layer> = [];
		for (elementIdx in 0...layers.length){
			var element:HtmlDom = Reflect.field(layers, Std.string(elementIdx));
			var layer:Layer = {
				parentId : {
					type:layer,
					seed:element.parentNode.id
				}, 
				id : {
					type:layer,
					seed:element.id
				}, 
				displayName : element.id
			};
			res.push(layer);
		}

		return res;
	}

	/**
	 * When the SLBuilder calls this callback, you are supposed to create a component in your object model, with the ID layerId and of the type className
	 */
	public function createComponent(className:ClassName, parentId:Id):Null<Component>{
		var id:Id = Utils.toId(component, className);

		var res:HtmlDom = Lib.document.createElement("div");
		res.className = className + " slbuilder component";
		res.id = id.seed;

		var parent:HtmlDom = Lib.document.getElementById(parentId.seed);
		parent.appendChild(res);

		return getComponentFromDom(res);
	}
	/**
	 * Remove the corresponding component and return true on success
	 */
	public function removeComponent(id:Id):Bool{
		if (id.type != component)		if (id.type != page)
			throw ("Error: trying to remove a component, but the ID is the ID of a "+Std.string(id.type));

		var element:HtmlDom = Lib.document.getElementById(id.seed);
		if (element != null){
			element.parentNode.removeChild(element);
			return true;
		}
		return false;
	}
	/**
	 * When the SLBuilder calls this callback, you are supposed to return a list of components, which are contained in the layer with the provided ID.
	 */
	public function getComponents(parentId:Null<Id>):Array<Component>{
		var parent:HtmlDom;
		if (parentId==null)
			parent = Lib.document.body;
		else
			parent = Lib.document.getElementById(parentId.seed);

		var components:HtmlCollection<HtmlDom> = untyped(parent.getElementsByClassName("component"));

		var res:Array<Component> = [];
		for (elementIdx in 0...components.length){
			var element:HtmlDom = Reflect.field(components, Std.string(elementIdx));
			var component:Component = getComponentFromDom(element);
			res.push(component);
		}

		return res;
	}

	/**
	 * Use class name like the slplayer does to retrieve the class name and path, then instanciate the class. Then look for the getProperties method or use reflexion.
	 */
	public function getProperties(parentId:Id):Array<Property>{
		var parent:HtmlDom = Lib.document.getElementById(parentId.seed);
		trace("getProperties "+parentId+" => "+parent);
		var properties:Array<Property> = Reflect.field(Descriptor, parent.nodeName.toLowerCase());
		trace("getProperties "+parent.nodeName+" => "+properties);

		for (property in properties){
			// split at "." in order to handle properties like "style.top"
			var propArray:Array<String> = property.name.split(".");
			var propObject:Dynamic = Reflect.field(parent, propArray.shift());
			for (propertyName in propArray){
				//Utils.inspectTrace(propObject);
				propObject = Reflect.field(propObject, propertyName);
			}
			property.value = propObject;
		}
		return properties;
	}


	/**
	 * Retrieve the component and set the property
	 */
	public function setProperty(parentId:Id, propName:String, propValue:Dynamic):Void{
		var parent:HtmlDom = Lib.document.getElementById(parentId.seed);
		// split at "." in order to handle properties like "style.top"
		var propArray:Array<String> = propName.split(".");
		var propNameNoDot:String = propArray.pop();
		var propObject:Dynamic = parent;
		for (propertyName in propArray){
			propObject = Reflect.field(propObject, propertyName);
		}
		Reflect.setField(propObject, propNameNoDot, propValue);
	}

	///////////////////////////////////////////////////////////////////////////////////
	// events
	// These methods are the SLBuilder API which 
	// your application must use to notify the SLBuilder application of a change in your object model, 
	// or of an event which you want to be related to the selection.
	///////////////////////////////////////////////////////////////////////////////////
	/**
	 * This method is called when a component has been locked or unlocked components.
	 */
	public function slectionChanged(componentsIds:Array<Id>):Void{
		throw("not implemented");
	}

	/**
	 * This method is called when the selection has changeed.
	 */
	public function selectionLockChanged(componentsIds:Array<Id>):Void{
		throw("not implemented");
	}
}