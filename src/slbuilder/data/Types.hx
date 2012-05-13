package slbuilder.data;

/**
 * unique id of components or layers
 * seed is type, className, nextId, random, concatenated with "_" as a separator 
 */
typedef Id = {type:ElementType, seed:String};

enum ElementType 
{
	layer;
	component;
}

/**
 * class name of components and layers 
 */
typedef ClassName = String;

