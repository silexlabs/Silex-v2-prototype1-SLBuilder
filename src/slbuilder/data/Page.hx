package slbuilder.data;

import slbuilder.data.Types;

/**
 * A page is a group of layers. One page only is visible at a time. A page corresponds to a deep link or HTML anchor. 
 * Among all pages, there is a default page displayed at the start of the application, when no deep link is specified.
 */
typedef Page = {
	public var id:Id;
	public var deeplink:String;
	public var displayName:String;
};