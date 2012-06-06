package slbuilder.core;

import slbuilder.data.Types;
import slbuilder.data.Property;
import slbuilder.data.Component;
import slbuilder.data.Layer;
import slbuilder.data.Page;
import slbuilder.ui.ToolBoxes;
import slbuilder.core.ISLBuilderBridge;
import slbuilder.selection.Selection;

import js.Lib;
import js.Dom;
/**
 * SLBuilder singleton
 *
 * The loads on top of your application and interacts with it through a set of callbacks, 
 * which you are expected to provide, and a set of event methods which you want to call when something happened in your application.
 * To provide these methods, create a class which implements an ISLBuilderBridge 
 * and set SLBuilder::slBuilderBridge to an instance of this class 
 * 
 * This class exposes the callbacks and event methods, as defined here https://github.com/silexlabs/SLBuilder/wiki/Specifications
 * this is a singleton pattern, and the SLBuilder is initialized the first time you call SLBuilder.getInstance()
 * 
 * This class implements ISLBuilderBridge because it redirects all ISLBuilderBridge methods calls 
 * to the slBuilderBridge object which your application is supposed to provide
 */
class SLBuilder implements ISLBuilderBridge
{
	/**
	 * selection object, used to store the selection and to handle in-place edition
	 */
	public var selection:Selection;

	/**
	 * reference to the ToolBoxes object, used to manage the SLBuilder tool boxes
	 */
	public var toolBoxes:ToolBoxes;

	/**
	 * ISLBuilderBridge object used to interact with the dom
	 * The implementation of ISLBuilderBridge which your application is to provide
	 * so that the SLBuilder can interact with you DOM
	 */
	public var slBuilderBridge:ISLBuilderBridge;

	/**
	 * You are supposed to call init before using the SLBuilder singleton
	 */
	static private var isInitOk:Bool;
	/**
	 * You are supposed to call init before using the SLBuilder singleton
	 */
	public function init(){
		trace("SLBuilder init");

		if (isInitOk)
			throw("You are supposed to call SLBuilder.getInstance().init() only once");

		isInitOk = true;
		
		// init selection
		selection = new Selection();
		selection.onChange = selectionChangedCallback;

		// init tool boxes
		var toolBoxesTag = Utils.getElementsByClassName(Lib.document.body, "toolboxes")[0];
		toolBoxes = cast(slplayer.core.SLPlayer.getAssociatedComponents(toolBoxesTag))[0];
	}
	/**
	 * called by the selection class when the selection has changed
	 * call SLBuilder::selectionChanged with the list of ids
	 * update the selection of the widgets also
	 */
	private function selectionChangedCallback(){
		// retrieve the ids of the components
		var ids:Array<Id> = [];
		for(comp in selection.getComponents()){
			// store the component id
			ids.push(comp.id);
		}

		// call SLBuilder::selectionChanged with the list of ids
		selectionChanged(ids);
	}
	////////////////////////////////////////////////////////////////////
	// Singleton pattern
	////////////////////////////////////////////////////////////////////
	/**
	 * Singleton pattern
	 */
	static private var instance:SLBuilder;
	/**
	 * Singleton pattern
	 */
	static public function getInstance():SLBuilder{
		if (instance == null){
			instance = new SLBuilder();
		}
		return instance;
	}
	/**
	 * constructor
	 * should not be called directly
	 */
	private function new(){
		haxe.Firebug.redirectTraces();
		isInitOk = false;
	}
	/*
	 * Your application is in charge of calling this method when your object model has changed.
	 * @example		SLBuilder.getInstance().domChanged(id);
	 */
	public function domChanged(id:Id):Void{
		throw("not implemented");
	}

	/////////////////////////////////////////////////////////////////////
	// DOM interactions
	// These methods call your application's methods, so that it can interact with your object model
	/////////////////////////////////////////////////////////////////////
	/**
	 * Returns the main container for components (or layers or pages)
	 */
	public function getMainContainer():HtmlDom{
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.getMainContainer();
	}

	/**
	 * When the SLBuilder application calls this callback, you are supposed to create a container (e.g. a div in html) 
	 * which will be associated with a page
	 * Returns the id of the new page on success
	 */
	public function createPage(deeplink:Deeplink):Page {
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.createPage(deeplink);
	}

	/**
	 * Remove the corresponding page and return true on success
	 */
	public function removePage(id:Id):Bool{
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.removePage(id);
	}

	/**
	 * When the SLBuilder calls this callback, you are supposed to return a list of pages
	 */
	public function getPages():Array<Page> {
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.getPages();
	}
	/**
	 * @return the object corresponding to the Id
	 */
	public function getPage(id:Id):Page{
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.getPage(id);
	}

	/**
	 * When the SLBuilder application calls this callback, you are supposed to create a container (e.g. a div in html) which will be associated with a layer.
	 * Returns the id of the new layer on success
	 */
	public function createLayer(c:ClassName, id:Id):Null<Layer>{
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.createLayer(c, id);
	}

	/**
	 * Remove the corresponding layer and return true on success
	 */
	public function removeLayer(id:Id):Bool{
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.removeLayer(id);
	}

	/**
	 * When the SLBuilder calls this callback, you are supposed to return a list of layers
	 */
	public function getLayers(id:Id):Array<Layer>{
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.getLayers(id);
	}
	/**
	 * @return the object corresponding to the Id
	 */
	public function getLayer(id:Id):Layer{
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.getLayer(id);
	}

	/**
	 * When the SLBuilder calls this callback, you are supposed to create a component in your object model, with the ID layerId and of the type className
	 */
	public function createComponent(c:ClassName, id:Id):Null<Component>{
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.createComponent(c, id);
	}

	/**
	 * Remove the corresponding layer and return true on success
	 */
	public function removeComponent(id:Id):Bool{
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.removeComponent(id);
	}

	/**
	 * When the SLBuilder calls this callback, you are supposed to return a list of components, which are contained in the layer with the provided ID.
	 */
	public function getComponents(id:Null<Id>):Array<Component>{
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.getComponents(id);
	}
	/**
	 * @return the object corresponding to the Id
	 */
	public function getComponent(id:Id):Component{
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.getComponent(id);
	}

	/**
	 * Use class name like the slplayer does to retrieve the class name and path, then instanciate the class. Then look for the getProperties method or use reflexion.
	 */
	public function getProperties(id:Id):Array<Property>{
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.getProperties(id);
	}

	/**
	 * Retrieve the component and set the property
	 */
	public function setProperty(id:Id, p:String, v:Dynamic):Void{
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.setProperty(id, p, v);
	}
	/**
	 * @return the object corresponding to the Id
	 */
	public function getProperty(parentId:Id, name:String):Property{
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.getProperty(parentId, name);
	}


	///////////////////////////////////////////////////////////////////////////////////
	// events
	// These methods are the SLBuilder API which 
	// your application must use to notify the SLBuilder application of a change in your object model, 
	// or of an event which you want to be related to the selection.
	///////////////////////////////////////////////////////////////////////////////////
	/**
	 * This method is called when the selection has changeed.
	 * @example		SLBuilder.getInstance().slectionChanged([id1,id2]);
	 */
	public function selectionChanged(ids:Array<Id>):Void{
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");
	}

	/**
	 * This method is called when a component has been locked or unlocked components.
	 * @example		SLBuilder.getInstance().slectionLockChanged([id1,id2]);
	 */
	public function selectionLockChanged(ids:Array<Id>):Void{
		if (isInitOk == false)
			throw("You are supposed to call SLBuilder.getInstance().init() before using the SLBuilder singleton");

		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");
	}
}
