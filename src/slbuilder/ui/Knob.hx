package slbuilder.ui;

import js.Lib;
import js.Dom;

import slplayer.ui.DisplayObject;
import slbuilder.data.Types;
import slbuilder.core.Utils;

import slbuilder.data.Component;

enum InPlaceEditorState {
	none;
	move;
	resize;
	rotate;
}

/**
 * Knob used by the user to edit the elements in place
 */
class Knob extends DisplayObject{
	/**
	 * equals the size of the image
	 * set in the css
	 */
	private var radius:Int;
	public var x(getX, setX):Int;
	public var y(getY, setY):Int;
	private var _x:Int;
	private var _y:Int;
	private function setX(val:Int):Int{
		_x = val;
		rootElement.style.left = (x - radius) + "px";
		return val;
	}
	private function getX():Int{
		return _x;
	}
	private function setY(val:Int):Int{
		_y = val;
		rootElement.style.top = (y - radius)+ "px";
		return val;
	}
	private function getY():Int{
		return _y;
	}

	/**
	 *
	 */
	public var state(getState, setState):InPlaceEditorState;
	private var _state:InPlaceEditorState;
	/**
	 *
	 */
	private var initialMouseX:Int;
	private var initialMouseY:Int;
	private var isMouseDown:Bool;
	/**
	 * callback for the InPlaceEditor
	 */
	public var onMove:Int->Int->Void;
	/**
	 * callback for the InPlaceEditor
	 */
	public var onResize:Int->Int->Void;
	/**
	 * callback for the InPlaceEditor
	 */
	public var onRotate:Float->Void;
	/**
	 * move zone defines where is the "grip" used to move the knob
	 */
	private var moveZone:ParametricZone;
	/**
	 * resize zone defines where is the "grip" used to resize
	 */
	private var resizeZone:ParametricZone;
	/**
	 * move zone defines where is the "grip" used to rotate
	 */
	private var rotateZone:ParametricZone;

	/**
	 * constructor
	 */
	public function new(d:HtmlDom) {
		super(d);
	}
	/**
	 * init the element
	 */
	override public dynamic function init() : Void { 
		trace("Knob init");

		isMouseDown = false;
		state = none;

		// init events
		//rootElement.onmousemove = onMouseMove;
		Lib.document.onmousemove = onMouseMove;
		rootElement.onmousedown = onMouseDown;
		//rootElement.onmouseup = onMouseUpOrOut;
		Lib.document.onmouseup = onMouseUpOrOut;
		//rootElement.onmouseout = onMouseUpOrOut;

		// init zone
		moveZone = {
			x: Std.parseInt(rootElement.getAttribute("data-movezone-x")),
			y: Std.parseInt(rootElement.getAttribute("data-movezone-y")),
			radius: Std.parseInt(rootElement.getAttribute("data-movezone-radius")),
		};
		resizeZone = {
			x: Std.parseInt(rootElement.getAttribute("data-resizezone-x")),
			y: Std.parseInt(rootElement.getAttribute("data-resizezone-y")),
			radius: Std.parseInt(rootElement.getAttribute("data-resizezone-radius")),
		};
		rotateZone = {
			x: Std.parseInt(rootElement.getAttribute("data-rotatezone-x")),
			y: Std.parseInt(rootElement.getAttribute("data-rotatezone-y")),
			radius: Std.parseInt(rootElement.getAttribute("data-rotatezone-radius")),
		};
		// init radius
		radius = Math.round(rootElement.clientWidth / 2);

		// init knob style
		x = 200;
		y = 200;
	}
	/**
	 * show/hide the knob
	 */
	public function addComponent(component:Component){
		if (isMouseDown == true)
			return;

		x = component.x + Math.round(component.width/2);
		y = component.y + Math.round(component.height/2);
		show();
	}
	/**
	 */
	public function reset(){
		hide();
	}
	/**
	 * show/hide the knob
	 */
	public function show(){
		rootElement.style.visibility = "visible";
		rootElement.style.position = "absolute";
	}
	/**
	 * show/hide the knob
	 */
	public function hide(){
		if (isMouseDown == true)
			return;

		rootElement.style.visibility = "hidden";
	}
	/**
	 * callback called when the mouse is pressed
	 */
	private function onMouseDown(e:js.Event){
		isMouseDown = true;
		initialMouseX = e.clientX;
		initialMouseY = e.clientY;
		trace(initialMouseX+", "+initialMouseY);
		// prevent the drag of the image by the browser
		untyped __js__("return false;");
	}
	/**
	 * callback called when the mouse is released or out
	 */
	private function onMouseUpOrOut(e:js.Event){
		isMouseDown = false;
	}

	/**
	 * compute the state in function of the mouse position
	 */
	private function computeState(mouseX:Int, mouseY:Int){
		// do not change state while mouse is down (mouse may be out but we continue draging)
		if (isMouseDown)
			return;
		// compute coord relatively to center
		var polarX = mouseX - (x-radius);
		var polarY = mouseY - (y-radius);
		// check in which zone we are
		if (Utils.distance(polarX, polarY, moveZone.x, moveZone.y) < moveZone.radius){
			//trace("MOVE ZONE");
			state = move;
		}
		else if (Utils.distance(polarX, polarY, resizeZone.x, resizeZone.y) < resizeZone.radius){
			//trace("RESIZE ZONE");
			state = resize;
		}
		else if (Utils.distance(polarX, polarY, rotateZone.x, rotateZone.y) < rotateZone.radius){
			//trace("ROTATE ZONE");
			state = rotate;
		}
		else{
			state = none;
		}
	}
	/**
	 * setter/getter
	 */
	private function setState(val:InPlaceEditorState):InPlaceEditorState{
		if (_state == val)
			return _state;

		_state = val;
		switch (_state) {
			case none:
				rootElement.style.cursor = "auto";
			case move:
				rootElement.style.cursor = "move";
			case resize:
				rootElement.style.cursor = "ne-resize";
			case rotate:
				rootElement.style.cursor = "hand";
		}
		return _state;
	}
	/**
	 * setter/getter
	 */
	private function getState():InPlaceEditorState{
		return _state;
	}
	/**
	 * callback called when the mouse is over the knob image
	 * in charge of the mouse cursor
	 */
	private function onMouseMove(e:js.Event){
		computeState(e.clientX, e.clientY);
		if (isMouseDown){
			switch (state) {
				case none:
				case move:
					x += e.clientX-initialMouseX;
					y += e.clientY-initialMouseY;
					trackMove();
				case resize:
					trackResize();
				case rotate:
					var mouseX = e.clientX;
					var mouseY = e.clientY;

/*					var initialPolarX = initialMouseX - x;
					var initialPolarY = initialMouseY - y;
					var initialRotation = Math.atan2(initialPolarY, initialPolarX);

*/					var polarX = mouseX - x;
					var polarY = mouseY - y;
					var rotation = Math.atan2(polarY, polarX);

					var degRot:String = Math.round(180*rotation/Math.PI) + "deg";
					//trace(initialRotation+" - "+rotation+" - "+degRot);
					var __this__ = this;
					untyped __js__ ("__this__.rootElement.style.transform = 'rotate('+degRot+')';");
					untyped __js__ ("__this__.rootElement.style.msTransform = 'rotate('+degRot+')';");
					untyped __js__ ("__this__.rootElement.style.mozTransform = 'rotate('+degRot+')';");
					untyped __js__ ("__this__.rootElement.style.oTransform = 'rotate('+degRot+')';");
					untyped __js__ ("__this__.rootElement.style.webkitTransform = 'rotate('+degRot+')';");

					trackRotate(rotation);
			}
			//trace("onMouseMove " + mouseX +", "+mouseY+", "+moveZone.x+", "+moveZone.y+", "+Utils.distance(mouseX, mouseY, moveZone.x, moveZone.y));
			initialMouseX = e.clientX;
			initialMouseY = e.clientY;
			untyped __js__("return false;");
		}
	}
	/**
	 * if the mouse is pressed, compute the delta of the mouse position and notifies the InPlaceEditor
	 */
	private function trackMove(){
		if (onMove != null){
			trace("tracked Move "+x);
			onMove(x-radius, y-radius);
		}
	}
	/**
	 * if the mouse is pressed, compute the delta of the mouse position and notifies the InPlaceEditor
	 */
	private function trackResize(){
		if (onResize != null){
			trace("tracked Resize ");
			onResize(x-radius, y-radius);
		}
	}
	/**
	 * if the mouse is pressed, compute the delta of the mouse position and notifies the InPlaceEditor
	 */
	private function trackRotate(angle:Float){
		if (onRotate != null){
			trace("tracked ROTATE "+angle);
			onRotate(angle);
		}
	}
}
