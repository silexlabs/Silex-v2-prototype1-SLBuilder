package slbuilder.core;

import js.Lib;
import js.Dom;
import slbuilder.core.Config;
import slbuilder.core.Utils;
import slbuilder.ui.LayersWidget;
import slbuilder.ui.ComponentsWidget;
import slbuilder.data.Types;
import slbuilder.data.Property;
import slbuilder.data.Component;
import slbuilder.data.Layer;
import slbuilder.data.Page;

/**
 * ISLBuilderBridge interface
 * 
 * It defines a set of callbacks and event methods, as defined here 
 * https://github.com/silexlabs/SLBuilder/wiki/Specifications
 * 
 * To use SLBuilder in your application you will want to call these methods 
 * when something happened in your application
 *
 * And the callbacks you provide will let you know when the SLBuilder 
 * wants to interact with the DOM of your application  
 */
interface ISLBuilderBridge {
	/////////////////////////////////////////////////////////////////////
	// Callbacks
	// These must be provided to the SLBuilder application, so that it can interact with your object model
	/////////////////////////////////////////////////////////////////////
	/**
	 * Returns the main container for components (or layers or pages)
	 */
	public function getMainContainer():HtmlDom;

	/**
	 * When the SLBuilder application calls this callback, you are supposed to create a container (e.g. a div in html) 
	 * which will be associated with a page
	 * Returns the id of the new page on success
	 */
	public function createPage(deeplink:Deeplink):Page;

	/**
	 * Remove the corresponding page and return true on success
	 */
	public function removePage(id:Id):Bool;

	/**
	 * When the SLBuilder calls this callback, you are supposed to return a list of pages
	 */
	public function getPages():Array<Page>;

	/**
	 * When the SLBuilder application calls this callback, you are supposed to create a container (e.g. a div in html) which will be associated with a layer.
	 * Returns the id of the new layer on success
	 */
	public function createLayer(className:ClassName, parentId:Id):Null<Layer>;
	/**
	 * Remove the corresponding layer and return true on success
	 */
	public function removeLayer(id:Id):Bool;

	/**
	 * When the SLBuilder calls this callback, you are supposed to return a list of layers
	 */
	public function getLayers(parentId:Id):Array<Layer>;

	/**
	 * When the SLBuilder calls this callback, you are supposed to create a component in your object model, with the ID layerId and of the type className
	 */
	public function createComponent(className:ClassName, parentId:Id):Null<Component>;
	/**
	 * Remove the corresponding component and return true on success
	 */
	public function removeComponent(id:Id):Bool;
	/**
	 * When the SLBuilder calls this callback, you are supposed to return a list of components, which are contained in the layer with the provided ID.
	 */
	public function getComponents(parentId:Null<Id>):Array<Component>;


	/**
	 * Use class name like the slplayer does to retrieve the class name and path, then instanciate the class. Then look for the getProperties method or use reflexion.
	 */
	public function getProperties(parentId:Id):Array<Property>;


	/**
	 * Retrieve the component and set the property
	 */
	public function setProperty(parentId:Id, propName:String, propValue:Dynamic):Void;

	///////////////////////////////////////////////////////////////////////////////////
	// events
	// These methods are the SLBuilder API which 
	// your application must use to notify the SLBuilder application of a change in your object model, 
	// or of an event which you want to be related to the selection.
	///////////////////////////////////////////////////////////////////////////////////
	/**
	 * This method is called when a component has been locked or unlocked components.
	 */
	public function slectionChanged(componentsIds:Array<Id>):Void;

	/**
	 * This method is called when the selection has changeed.
	 */
	public function selectionLockChanged(componentsIds:Array<Id>):Void;
}
