package slbuilder;

import js.Lib;
import js.Dom;
import slbuilder.core.Config;
import slbuilder.ui.Menu;
import slbuilder.ui.LayersWidget;
import slbuilder.data.Types;
import slbuilder.data.Property;
import slbuilder.data.Component;
import slbuilder.data.Layer;
import slbuilder.core.Template;

/**
 * SLBuilder class
 *
 * The loads on top of your application and interacts with it through a set of callbacks, 
 * which you are expected to provide, 
 * and a set of event methods which you want to call when something happened in your application.
 *
 * initialize the builder, create all tool boxes
 * exposes the callbacks and event methods, as defined here https://github.com/silexlabs/SLBuilder/wiki/Specifications
 * this is a singleton pattern, and the SLBuilder is initialized the first time you call SLBuilder.getInstance()
 */
class SLBuilder {
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
		root = Lib.document.getElementById("SLBuilder");
	}
	/**
	 * init UIs
	 */
	private function initUis(){
		//new Menu(root, "ViewMenu").onClick = onViewMenuClick;
		new LayersWidget(root);
	}
	private function onViewMenuClick(className:String) 
	{
		switch (className) {
			case "ShowComponentsBtn":
				trace("test");
			case "testBtn1":
				var layer = createLayer("basicLayer", null);
				trace(layer);
			
				Lib.document.getElementById(layer.id.seed).style.display = "inline-block";

				Lib.document.getElementById(layer.id.seed).style.width = "100px";
				Lib.document.getElementById(layer.id.seed).style.height = "100px";

				var color = Math.round(Math.random()*255);
				Lib.document.getElementById(layer.id.seed).style.backgroundColor = "rgb("+color+","+color+","+color+")";
			case "testBtn2":
				var layers = getLayers(null);
				trace(layers);
				for (layer in layers){
					var color = Math.round(Math.random()*255*255);
					Lib.document.getElementById(layer.id.seed).style.backgroundColor = color;
				}
			case "testBtn3":
				var component = createComponent("galery", getLayers(null)[0].id);
				trace(component);
			
				Lib.document.getElementById(component.id.seed).style.display = "inline-block";

				Lib.document.getElementById(component.id.seed).style.width = "10px";
				Lib.document.getElementById(component.id.seed).style.height = "10px";

				var color = Math.round(Math.random()*255);
				Lib.document.getElementById(component.id.seed).style.backgroundColor = "rgb("+color+","+color+","+color+")";
			case "testBtn4":
				var components = getComponents(getLayers(null)[0].id);
				trace(components);
				for (component in components){
					var color = Math.round(Math.random()*255*255);
					Lib.document.getElementById(component.id.seed).style.backgroundColor = color;
				}
			case "testBtn5":
				var properties = getProperties(getComponents(getLayers(null)[0].id)[0].id);
				//trace(properties);
/*				var str = "<ul>";
				for (property in properties){
					str+="<li>"+property+"</li>";
				}
				str += "</ul>";
				Lib.document.getElementById("propertyList").innerHTML = str;
*/				
				var t = this;
				new Template("PropertiesList").onLoad = function(template:Template){
					var container = Lib.document.createElement("div");
					container.innerHTML = template.execute({
						Config:Config, 
						properties:properties,
						component: t.getComponents(t.getLayers(null)[0].id)[0]
					});
					t.root.appendChild(container);
				};

			case "testBtn6":
				var components = getComponents(getLayers(null)[0].id);
				//var properties = getProperties(components[0].id);
				testPropCount+=10;
				setProperty(components[0].id, "style.position", "absolute");
				setProperty(components[0].id, "style.top", testPropCount+"px");
				trace(components[0].id);
			default:
		}
	}
	private var testPropCount:Int;
	/////////////////////////////////////////////////////////////////////
	// Callbacks
	// These must be provided to the SLBuilder application, so that it can interact with your object model
	/////////////////////////////////////////////////////////////////////
	/**
	 * When the SLBuilder application calls this callback, you are supposed to create a container (e.g. a div in html) which will be associated with a layer.
	 * Returns the id of the new layer on success
	 */
	public var createLayer:ClassName->Id->Null<Layer>;

	/**
	 * Remove the corresponding layer and return true on success
	 */
	public var removeLayer:Id->Bool;

	/**
	 * When the SLBuilder calls this callback, you are supposed to return a list of layers
	 */
	public var getLayers:Id->Array<Layer>;


	/**
	 * When the SLBuilder calls this callback, you are supposed to create a component in your object model, with the ID layerId and of the type className
	 */
	public var createComponent:ClassName->Id->Null<Component>;


	/**
	 * When the SLBuilder calls this callback, you are supposed to return a list of components, which are contained in the layer with the provided ID.
	 */
	public var getComponents:Id->Array<Component>;


	/**
	 * Use class name like the slplayer does to retrieve the class name and path, then instanciate the class. Then look for the getProperties method or use reflexion.
	 */
	public var getProperties:Id->Array<Property>;


	/**
	 * Retrieve the component and set the property
	 */
	public var setProperty:Id->String->Dynamic->Void;

	///////////////////////////////////////////////////////////////////////////////////
	// events
	// These methods are the SLBuilder API which 
	// your application must use to notify the SLBuilder application of a change in your object model, 
	// or of an event which you want to be related to the selection.
	///////////////////////////////////////////////////////////////////////////////////
	/*
	 * Your application is in charge of calling this method when your object model has changed.
	 */
	public var domChanged:Id->Void;

	/**
	 * Call this method when your want the selection to change.
	 */
	public var slectionChanged:Array<Id>->Void;

	/**
	 * Call this method when your want to lock or unlock components.
	 */
	public var slectionLockChanged:Array<Id>->Void;
}
