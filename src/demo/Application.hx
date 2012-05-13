package demo;

import js.Lib;
import js.Dom;
import slbuilder.SLBuilder;
import demo.SLBuilderBridge;

/**
 * entry point for the application
 */
class Application {

	public var slBuilderBridge:SLBuilderBridge;
	/**
	 * init the application
	 */
	public function new(){
		slBuilderBridge = new SLBuilderBridge(SLBuilder.getInstance());
	}
}
