package demo;

import slbuilder.SLBuilder;
import slbuilder.core.Utils;
import slbuilder.data.Types;
import slbuilder.data.Property;
import slbuilder.data.Component;
import slbuilder.data.Layer;
import js.Lib;
import js.Dom;


/**
 * This class provides the SLBuilder with the callbacks it needs
 * and exposes the SLBuilder methods to dispatch the application events
 */
class SLBuilderBridge{
	/**
	 * init the callbacks and events of SLBuilder
	 */
	public function new(slBuilder:SLBuilder){
		slBuilder.createLayer = createLayer;
		slBuilder.removeLayer = removeLayer;
		slBuilder.getLayers = getLayers;
		slBuilder.createComponent = createComponent;
		slBuilder.removeComponent = removeComponent;
		slBuilder.getComponents = getComponents;
		slBuilder.getProperties = getProperties;
		slBuilder.setProperty = setProperty;
		slBuilder.slectionChanged = slectionChanged;
		slBuilder.domChanged = domChanged;
		slBuilder.slectionLockChanged = slectionLockChanged;
	}
	/////////////////////////////////////////////////////////////////////
	// Callbacks
	// These must be provided to the SLBuilder application, so that it can interact with your object model
	/////////////////////////////////////////////////////////////////////
	/**
	 * When the SLBuilder application calls this callback, you are supposed to create a container (e.g. a div in html) which will be associated with a layer.
	 * Returns the id of the new layer on success
	 */
	private function createLayer(className:ClassName, parentId:Id = null):Null<Layer> {
		var id:Id = Utils.toId(layer, className);

		var res:HtmlDom = Lib.document.createElement("div");
		res.className = className + " slbuilder layer";
		res.id = id.seed;
		res.style.verticalAlign = "top";

		var parent:HtmlDom;
		if (parentId == null)
			parent = Lib.document.getElementById("main");
		else 
			parent = Lib.document.getElementById(parentId.seed);

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
	private function removeLayer(id:Id):Bool{
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
	private function getLayers(parentId:Id = null):Array<Layer> {
		var parent:HtmlDom;
		if (parentId == null)
			parent = Lib.document.getElementById("main");
		else 
			parent = Lib.document.getElementById(parentId.seed);

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
	private function createComponent(className:ClassName, parentId:Id):Null<Component>{
		var id:Id = Utils.toId(component, className);

		var res:HtmlDom = Lib.document.createElement("div");
		res.className = className + " slbuilder component";
		res.id = id.seed;

		var parent:HtmlDom = Lib.document.getElementById(parentId.seed);
		parent.appendChild(res);

		return {
			parentId : parentId, 
			id : id, 
			displayName : id.seed
		};
	}
	/**
	 * Remove the corresponding component and return true on success
	 */
	private function removeComponent(id:Id):Bool{
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
	private function getComponents(parentId:Id):Array<Component>{
		var parent:HtmlDom = Lib.document.getElementById(parentId.seed);

		var components:HtmlCollection<HtmlDom> = untyped(parent.getElementsByClassName("component"));

		var res:Array<Component> = [];
		for (elementIdx in 0...components.length){
			var element:HtmlDom = Reflect.field(components, Std.string(elementIdx));
			var component:Component = {
				parentId : {
					type:component,
					seed:element.parentNode.id
				}, 
				id : {
					type:component,
					seed:element.id
				}, 
				displayName : element.id
			};
			res.push(component);
		}

		return res;
	}


	/**
	 * Use class name like the slplayer does to retrieve the class name and path, then instanciate the class. Then look for the getProperties method or use reflexion.
	 */
	private function getProperties(parentId:Id):Array<Property>{
		var parent:HtmlDom = Lib.document.getElementById(parentId.seed);
		trace("getProperties "+parentId+" => "+parent);
		var properties:Array<Property> = Reflect.field(Descriptor, parent.nodeName.toLowerCase());
		trace("getProperties "+parent.nodeName+" => "+properties);

		for (property in properties){
			// split at "." in order to handle properties like "style.top"
			var propArray:Array<String> = property.name.split(".");
			var propObject:Dynamic = Reflect.field(parent, propArray.shift());
			for (propertyName in propArray){
				propObject = Reflect.field(propObject, propertyName);
			}
			property.value = propObject;
		}
		return properties;
	}


	/**
	 * Retrieve the component and set the property
	 */
	private function setProperty(parentId:Id, propName:String, propValue:Dynamic):Void{
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
	/*
	 * Your application is in charge of calling this method when your object model has changed.
	 */
	private function domChanged(layerId:Id):Void{
	}

	/**
	 * Call this method when your want the selection to change.
	 */
	private function slectionChanged(componentsIds:Array<Id>):Void{
	}

	/**
	 * Call this method when your want to lock or unlock components.
	 */
	private function slectionLockChanged(componentsIds:Array<Id>):Void{
	}
}