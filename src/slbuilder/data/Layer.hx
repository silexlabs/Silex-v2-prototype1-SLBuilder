package slbuilder.data;

import slbuilder.data.Types;

/**
 * A layer is a group of components and layers which are alwas visible at the same time. 
 */
typedef Layer = {
	public var id:Id;
	public var parentId:Id;
	public var displayName:String;
};