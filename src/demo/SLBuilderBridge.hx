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
	/**
	 * create an abstract component structure from the dom
	 * this method is not part of SLBuilder API
	 */
	private function getComponentFromDom(element:HtmlDom):Component{
		// center of rotation
		untyped __js__ ("element.style.transformOrigin = '50%';");
		untyped __js__ ("element.style.msTransformOrigin = '50%';");
		untyped __js__ ("element.style.webkitTransformOrigin = '50%';");
		untyped __js__ ("element.style.mozTransformOrigin = '50%';");
		untyped __js__ ("element.style.oTransformOrigin = '50%';");

		// rotation
		var rot:String = "";
		untyped __js__ ("if (element.style.msTransform) rot=element.style.msTransform;");
		untyped __js__ ("if (element.style.mozTransform) rot=element.style.mozTransform;");
		untyped __js__ ("if (element.style.oTransform) rot=element.style.oTransform;");
		untyped __js__ ("if (element.style.webkitTransform) rot=element.style.webkitTransform;");
		untyped __js__ ("if (element.style.transform) rot=element.style.transform;");

		var rotRad:Float = 0;
		// remove everything before "rotate("
		if (rot.indexOf("rotate(")>=0){
			rot = rot.substr(rot.indexOf("rotate(") + "rotate(".length);
			if (rot.indexOf("deg")>=0){
				rot = rot.substr(0, rot.indexOf("deg"));
				var rotDeg:Int = Std.parseInt(rot);
				if (!Math.isNaN(rotDeg)){
					rotRad = rotDeg*Math.PI/180;
				}
			}
		}

		// position
/*	    while(element != null && !Math.isNaN(element.offsetLeft)) {
			component.x += element.offsetLeft - element.scrollLeft;
			component.y += element.offsetTop - element.scrollTop;
			element = element.offsetParent;
	    }
*/
		// return the result
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
			x: element.offsetLeft,
			y: element.offsetTop,
			width: element.clientWidth,
			height: element.clientHeight,
			rotation: rotRad
		};
	    return component;
	}
	/**
	 * apply the properties of an abstract component to the dom
	 * this method is not part of SLBuilder API
	 */
	private function setComponentToDom(element:HtmlDom, component:Component){

		// center of rotation
		untyped __js__ ("element.style.transformOrigin = '50%';");
		untyped __js__ ("element.style.msTransformOrigin = '50%';");
		untyped __js__ ("element.style.webkitTransformOrigin = '50%';");
		untyped __js__ ("element.style.mozTransformOrigin = '50%';");
		untyped __js__ ("element.style.oTransformOrigin = '50%';");

		// rotation
		var degRot:String = Math.round(180*component.rotation/Math.PI) + "deg";
		untyped __js__ ("element.style.transform = 'rotate('+degRot+')';");
		untyped __js__ ("element.style.msTransform = 'rotate('+degRot+')';");
		untyped __js__ ("element.style.mozTransform = 'rotate('+degRot+')';");
		untyped __js__ ("element.style.oTransform = 'rotate('+degRot+')';");
		untyped __js__ ("element.style.webkitTransform = 'rotate('+degRot+')';");

		// position
/*		var tmpElement:HtmlDom = element;
		var posX:Int = 0;
		var posY:Int = 0;
	    while(tmpElement != null && !Math.isNaN(tmpElement.offsetLeft)) {
			posX += tmpElement.offsetLeft - tmpElement.scrollLeft;
			posY += tmpElement.offsetTop - tmpElement.scrollTop;
			tmpElement = tmpElement.offsetParent;
	    }
	    // apply the new coordiantes, taking the relative position of the html element into account
	    //element.offsetLeft = component.x - posX;
	    //element.offsetTop = component.y - posY;
	    trace(component.x +" - "+ posX);
*/
	    element.style.left = (component.x) + "px";
	    element.style.top = (component.y) + "px";

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
	 * @return the object corresponding to the Id
	 */
	public function getPage(id:Id):Page{
		var element:HtmlDom = Lib.document.getElementById(id.seed);
		return {
			id : id, 
			displayName : element.id,
			deeplink : element.getAttribute("name")
		};
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
	 * @return the object corresponding to the Id
	 */
	public function getLayer(id:Id):Layer{
		var element:HtmlDom = Lib.document.getElementById(id.seed);
		if (element == null) throw("element not found in index.html");
		return {
			parentId : {
				type:layer,
				seed:element.parentNode.id
			}, 
			id : id, 
			displayName : id.seed
		};
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
	 * @return the object corresponding to the Id
	 */
	public function getComponent(id:Id):Component{
		var res:HtmlDom = Lib.document.getElementById(id.seed);
		return getComponentFromDom(res);
	}
	/**
	 * update a component based on its ID
	 */
	public function updateComponent(component:Component){
		var dom:HtmlDom = Lib.document.getElementById(component.id.seed);
		setComponentToDom(dom, component);
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
	/**
	 * @return the object corresponding to the Id
	 */
	public function getProperty(parentId:Id, name:String):Property{
		var res:Property = {
			name: name,
			displayName: null,
			parentId: parentId,
			value: null,
			defaultValue: null,
			canBeNull: true,
			description: "",
		};
		var parent:HtmlDom = Lib.document.getElementById(parentId.seed);

		// retrieve the value
		var propArray:Array<String> = name.split(".");
		var propNameNoDot:String = propArray.pop();
		var propObject:Dynamic = parent;
		for (propertyName in propArray){
			propObject = Reflect.field(propObject, propertyName);
		}
		res.value = Reflect.field(propObject, propNameNoDot);

		// retrieve the descriptor values
		var properties:Array<Property> = Reflect.field(Descriptor, parent.nodeName.toLowerCase());
		for (property in properties){
			if (property.name == name){
				res.displayName = property.displayName;
				res.defaultValue = property.defaultValue;
				res.canBeNull = property.canBeNull;
				res.description = property.description;
				break;
			}
		}

		return res;
	}

	///////////////////////////////////////////////////////////////////////////////////
	// events
	// These methods are the SLBuilder API which 
	// your application must use to notify the SLBuilder application of a change in your object model, 
	// or of an event which you want to be related to the selection.
	///////////////////////////////////////////////////////////////////////////////////
	/**
	 * This method is called when the selection has changeed.
	 */
	public function selectionChanged(componentsIds:Array<Id>):Void{
		throw("not implemented");
	}

	/**
	 * This method is called when a component has been locked or unlocked components.
	 */
	public function selectionLockChanged(componentsIds:Array<Id>):Void{
		throw("not implemented");
	}
}