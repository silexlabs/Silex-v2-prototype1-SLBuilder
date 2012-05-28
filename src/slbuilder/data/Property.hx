package slbuilder.data;

import slbuilder.data.Types;

/**
 * A property describes a component or layer parameter. 
 */
typedef Property = {
	public var name:String;
	public var displayName:String;
	public var parentId:Id;
	public var value:Dynamic;
	public var defaultValue:Dynamic;
	public var canBeNull:Bool;
	public var description:String;
};