package slbuilder.core;

/**
 * handles loading and creation of templates
 */
class Template {
	/**
	 * default template folder path
	 */
	public static inline var DEFAULT_TEMPLATE_FOLDER_PATH:String = "templates/";
	/**
	 * default template extenion
	 */
	public static inline var DEFAULT_TEMPLATE_EXTENSION:String = ".html";
	/**
	 * template folder path
	 */
	private var templateFolderPath:String;
	/**
	 * template extenion
	 */
	private var templateExtenstion:String;
	/**
	 * callback
	 */
	public var onLoad(getOnLoad, setOnLoad):Null<Template->Void>;
	/**
	 * store the onLoad callback
	 */
	private var _onLoad:Null<Template->Void>;
	/**
	 * callback
	 */
	public var onError:Null<Template->String->Void>;
	/**
	 * template name
	 */
	private var name:String;
	/**
	 * template file content
	 */
	private var loadedContent:String;
	/**
	 * constructor
	 * load the template and then call the callback
	 */
	public function new(name:String, 
		templateFolderPath:String = DEFAULT_TEMPLATE_FOLDER_PATH, templateExtenstion:String = DEFAULT_TEMPLATE_EXTENSION, 
		onLoad:Null<Template->Void> = null, onError:Null<Template->String->Void> = null) 
	{
		this.templateExtenstion = templateExtenstion;
		this.templateFolderPath = templateFolderPath;
		this.name = name;
		this.onLoad = onLoad;
		this.onError = onError;
	}
	/**
	 * setter for the onLoad property
	 * lauch the loading process of the template
	 */
	private function setOnLoad(onLoad:Null<Template->Void>):Null<Template->Void> 
	{
		_onLoad = onLoad;

		if (onLoad != null){
			load();
		}

		return onLoad;
	}
	/**
	 * getter for the onLoad property
	 */
	private function getOnLoad():Null<Template->Void> 
	{
		return _onLoad;
	}
	/**
	 * lauch the loading process of the template
	 */
	private function load():Void 
	{
		var r = new haxe.Http(templateFolderPath+name+templateExtenstion);
		r.onError = onErrorCallback;
		r.onData = onLoadCallback;
		r.request(false);
	}
	/**
	 * loading error callback
	 * calls the onError callback if provided in the constructor
	 */
	private function onErrorCallback(message:String):Void 
	{
		//trace("error loading template "+name+": "+message);
		if (onError != null){
			onError(this, message);
		}
	}
	/**
	 * load callback
	 * calls the onLoad callback 
	 */
	private function onLoadCallback(templateContent:String):Void 
	{
		//trace("template "+name+" loaded: "+ templateContent);
		loadedContent = templateContent;
		onLoad(this);
	}
	public function execute(context:Dynamic):String 
	{
		var template = new haxe.Template(loadedContent);
		var output = template.execute(context, {setval:
			function(resolve : String -> Dynamic, prop:String, val:String)
			{
				//trace("setval "+prop+"="+val);
				Reflect.setField(context, prop, val);
				return "";
			}
		});
		return output;
	}
}
