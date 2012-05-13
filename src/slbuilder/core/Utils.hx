package slbuilder.core;

import slbuilder.data.Types;

class Utils {
	/**
	 * incremental id counter
	 */
	static var nextId:Int;
	/**
	 * creates an id with type and seed
	 * seed is type, className, nextId, random, concatenated with "_" as a separator
	 */
	public static function toId(type:ElementType, className:String):Id 
	{
		return {
			type:type, 
			seed:Std.string(type)+"_"+className
			+"_"+Std.string(nextId++)+"_"+Math.round(Math.random()*999999)
		};
	}
}
