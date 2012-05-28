package slbuilder.data;

/**
 * unique id of components or layers
 * seed is type, className, nextId, random, concatenated with "_" as a separator 
 */
typedef Id = 
{
	type:ElementType, 
	seed:String
};

/**
 * unique name of a page
 */
typedef Deeplink = String;

/*
 * the types of elements, as explained here 
 * https://github.com/silexlabs/SLBuilder/wiki/Specifications
 */
enum ElementType 
{
	page;
	layer;
	component;
}

/**
 * class name of components and layers 
 */
typedef ClassName = String;

