package slbuilder.core;

import js.Lib;
import js.Dom;
import slbuilder.core.Config;
import slbuilder.core.Utils;
import slbuilder.ui.Menu;
import slbuilder.ui.PagesWidget;
import slbuilder.ui.LayersWidget;
import slbuilder.ui.ComponentsWidget;
import slbuilder.data.Types;
import slbuilder.data.Property;
import slbuilder.data.Component;
import slbuilder.data.Layer;
import slbuilder.data.Page;
import slbuilder.core.Template;
import slbuilder.core.ISLBuilderBridge;

/**
 * SLBuilder class
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
class SLBuilder implements ISLBuilderBridge{
	/**
	 * ISLBuilderBridge object used to interact with the dom
	 * The implementation of ISLBuilderBridge which your application is to provide
	 * so that the SLBuilder can interact with you DOM
	 */
	public var slBuilderBridge:ISLBuilderBridge;

	////////////////////////////////////////////////////////////////////
	// Widgets composing the SLBuilder
	////////////////////////////////////////////////////////////////////
	/**
	 * widget
	 */
	private var pagesWidget:PagesWidget;
	/**
	 * widget
	 */
	private var layersWidget:LayersWidget;
	/**
	 * widget
	 */
	private var componentsWidget:ComponentsWidget;
	////////////////////////////////////////////////////////////////////
	// Singleton patter
	////////////////////////////////////////////////////////////////////
	/**
	 * Singleton pattern
	 */
	static private var instance:SLBuilder;
	/**
	 * Singleton pattern
	 */
	static public function getInstance():SLBuilder{
		if (instance == null)
			instance = new SLBuilder();
		return instance;
	}
	/////////////////////////////////////////////////////////////////
	// tool boxes
	/////////////////////////////////////////////////////////////////
	/**
	 * SLBuilder root container
	 */
	private var root:HtmlDom;
	/**
	 * init the application
	 */
	private function new(){
		//haxe.Firebug.redirectTraces(); 
		trace("SLBuilder init");
		initDomReferences();
		initUis();
	}
	/**
	 * retrieve references to the Dom 
	 */
	private function initDomReferences(){
		root = Utils.getElementsByClassName(Lib.document.body, "SLBuilderMain")[0];
	}
	/**
	 * init UIs
	 */
	private function initUis(){
		Ext.require([
		    'Ext.form.*',
		    'Ext.data.*',
		    'Ext.grid.Panel',
		    'Ext.grid.GridPanel',
		    'Ext.layout.container.Column'
		]);
		Ext.onReady(initExtJsUi);
	}
	private function initExtJsUi(){
     	// Here is where we create the Form
	    var gridForm:ext.form.Panel;
	    gridForm = Ext.create('Ext.form.Panel', {
	        id: 'slbuilder-form',
	        frame: true,
	        title: 'SLBuilder Editor',
            height: 350,
            width: 800,

	        /*
	        style : {
	        	left: '0',
			    top: '0',
			    position: 'absolute',
			    width: '100%'
			},
			*/
	        layout: 'column',    // Specifies that the items will now be arranged in columns

	        fieldDefaults: {
	            labelAlign: 'left',
	            msgTarget: 'side'
	        },
	        renderTo: root
	    });
		var gridFormHtmlDom:HtmlDom = cast(gridForm.getEl()).dom;
		gridFormHtmlDom.style.position="absolute";
		gridFormHtmlDom.style.bottom="0";
		gridFormHtmlDom.style.left="0";
		//gridFormHtmlDom.style.width="800px";
		//gridFormHtmlDom.style.height="250px";

		//new Menu(root, "ViewMenu").onClick = onViewMenuClick;
		
		pagesWidget = new PagesWidget(root, gridForm);
		pagesWidget.onChange = onPageChange;
		pagesWidget.refresh();
		
		layersWidget = new LayersWidget(root, gridForm);
		layersWidget.onChange = onLayerChange;

		componentsWidget = new ComponentsWidget(root, gridForm);
		componentsWidget.onChange = onComponentChange;

	}
	private function onPageChange(page:Page) {
		var displayName = "none";
		if (page != null){
			displayName = page.displayName;
			layersWidget.parentId = page.id;
		}
		else{
			layersWidget.parentId = null;
		}
		layersWidget.refresh();
		trace ("Page selected: "+displayName);
	}
	private function onLayerChange(layer:Layer) {
		var displayName = "none";
		if (layer != null){
			displayName = layer.displayName;
			componentsWidget.parentId = layer.id;
		}
		else{
			componentsWidget.parentId = null;
		}
		componentsWidget.refresh();
		trace ("Layer selected: "+displayName);
	}
	private function onComponentChange(component:Component) {
		var displayName = "none";
		if (component != null){
			displayName = component.displayName;
		}

		trace ("Component selected: "+displayName);
	}
	/////////////////////////////////////////////////////////////////////
	// DOM interactions
	// These methods call your application's methods, so that it can interact with your object model
	/////////////////////////////////////////////////////////////////////
	/**
	 * When the SLBuilder application calls this callback, you are supposed to create a container (e.g. a div in html) 
	 * which will be associated with a page
	 * Returns the id of the new page on success
	 */
	public function createPage(deeplink:Deeplink):Page {
		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.createPage(deeplink);
	}

	/**
	 * Remove the corresponding page and return true on success
	 */
	public function removePage(id:Id):Bool{
		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.removePage(id);
	}

	/**
	 * When the SLBuilder calls this callback, you are supposed to return a list of pages
	 */
	public function getPages():Array<Page> {
		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.getPages();
	}
	/**
	 * When the SLBuilder application calls this callback, you are supposed to create a container (e.g. a div in html) which will be associated with a layer.
	 * Returns the id of the new layer on success
	 */
	public function createLayer(c:ClassName, id:Id):Null<Layer>{
		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.createLayer(c, id);
	}

	/**
	 * Remove the corresponding layer and return true on success
	 */
	public function removeLayer(id:Id):Bool{
		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.removeLayer(id);
	}

	/**
	 * When the SLBuilder calls this callback, you are supposed to return a list of layers
	 */
	public function getLayers(id:Id):Array<Layer>{
		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.getLayers(id);
	}

	/**
	 * When the SLBuilder calls this callback, you are supposed to create a component in your object model, with the ID layerId and of the type className
	 */
	public function createComponent(c:ClassName, id:Id):Null<Component>{
		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.createComponent(c, id);
	}

	/**
	 * Remove the corresponding layer and return true on success
	 */
	public function removeComponent(id:Id):Bool{
		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.removeComponent(id);
	}

	/**
	 * When the SLBuilder calls this callback, you are supposed to return a list of components, which are contained in the layer with the provided ID.
	 */
	public function getComponents(id:Id):Array<Component>{
		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.getComponents(id);
	}


	/**
	 * Use class name like the slplayer does to retrieve the class name and path, then instanciate the class. Then look for the getProperties method or use reflexion.
	 */
	public function getProperties(id:Id):Array<Property>{
		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.getProperties(id);
	}


	/**
	 * Retrieve the component and set the property
	 */
	public function setProperty(id:Id, p:String, v:Dynamic):Void{
		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.setProperty(id, p, v);
	}

	///////////////////////////////////////////////////////////////////////////////////
	// events
	// These methods are the SLBuilder API which 
	// your application must use to notify the SLBuilder application of a change in your object model, 
	// or of an event which you want to be related to the selection.
	///////////////////////////////////////////////////////////////////////////////////
	/*
	 * Your application is in charge of calling this method when your object model has changed.
	 * @example		SLBuilder.getInstance().domChanged(id);
	 */
	public function domChanged(id:Id):Void{
		if (slBuilderBridge == null)
			throw("SLBuilder error: the application did not provide a ISLBuilderBridge object");

		return slBuilderBridge.domChanged(id);
	}

	/**
	 * Call this method when your want the selection to change.
	 * @example		SLBuilder.getInstance().slectionChanged([id1,id2]);
	 */
	public function slectionChanged(ids:Array<Id>):Void{
		throw("not implemented");
	}

	/**
	 * Call this method when your want to lock or unlock components.
	 * @example		SLBuilder.getInstance().slectionLockChanged([id1,id2]);
	 */
	public function slectionLockChanged(ids:Array<Id>):Void{
		throw("not implemented");
	}
}
