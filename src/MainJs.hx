package; 

import demo.Application;

class MainJs {
	public static function main() {
		haxe.Firebug.redirectTraces(); 
		new Application();
	}
}
