package slbuilder.data;

import slbuilder.data.Types;

/**
 * A component is a visual element with specific behavior. A component is a visual element with specific behavior.  
 */
typedef Component = {
	public var id:Id;
	public var parentId:Id;
	public var displayName:String;
	public var x:Int;
	public var y:Int;
	public var width:Int;
	public var height:Int;
	public var rotation:Float;
};
