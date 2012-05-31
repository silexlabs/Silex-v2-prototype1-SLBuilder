package demo;

import slbuilder.data.Property;

class Descriptor {	
	public static inline var div:Array<Property> = [
		{
			name:"style.display",
			displayName:"css display",
			parentId:null,
			value:null,
			defaultValue:"block",
			canBeNull:false,
			description:"CSS style postions (absolute, relative, ...)",
		},
		{
			name:"style.position",
			displayName:"css position",
			parentId:null,
			value:null,
			defaultValue:"relative",
			canBeNull:false,
			description:"CSS style postions (absolute, relative, ...)",
		},
		{
			name:"style.top",
			displayName:"css top",
			parentId:null,
			value:null,
			defaultValue:null,
			canBeNull:true,
			description:"CSS style top (y position)",
		},
		{
			name:"style.bottom",
			displayName:"css bottom",
			parentId:null,
			value:null,
			defaultValue:null,
			canBeNull:true,
			description:"CSS style bottom (y position)",
		},
		{
			name:"style.left",
			displayName:"css left",
			parentId:null,
			value:null,
			defaultValue:null,
			canBeNull:true,
			description:"CSS style left (y position)",
		},
		{
			name:"style.right",
			displayName:"css right",
			parentId:null,
			value:null,
			defaultValue:null,
			canBeNull:true,
			description:"CSS style right (y position)",
		},
		{
			name:"style.width",
			displayName:"css width",
			parentId:null,
			value:null,
			defaultValue:null,
			canBeNull:true,
			description:"CSS style width (y position)",
		},
		{
			name:"style.height",
			displayName:"css height",
			parentId:null,
			value:null,
			defaultValue:null,
			canBeNull:true,
			description:"CSS style height (y position)",
		},
	];
}
