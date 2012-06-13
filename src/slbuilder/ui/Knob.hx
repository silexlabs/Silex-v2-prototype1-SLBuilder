package slbuilder.ui;

import js.Lib;
import js.Dom;

import slplayer.ui.DisplayObject;

import slbuilder.data.Types;
import slbuilder.data.Component;

import slbuilder.core.Utils;
import slbuilder.core.SLBuilder;

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
	private var radius:Float;

	private var initialWidth:Int;
	private var initialHeight:Int;
	/**
	 * position of the knob
	 */
	private var scale(getScale, setScale):Float;

	/**
	 * position of the knob
	 */
	public var x(getX, setX):Int;
	/**
	 * position of the knob
	 */
	public var y(getY, setY):Int;
	/**
	 * position of the knob
	 */
	public var rotation(getRotation, setRotation):Float;
	/**
	 * getter/setter
	 */
	private var _scale:Float;
	private function setScale(val:Float):Float{
		_scale = val;
		rootElement.style.width = rootElement.style.height = (radius*2*_scale) + "px";
		return val;
	}
	private function getScale():Float{
		return _scale;
	}
	/**
	 * getter/setter
	 */
	private var _x:Int;
	private function setX(val:Int):Int{
		_x = val;
		rootElement.style.left = (_x - radius) + "px";
		return val;
	}
	private function getX():Int{
		return _x;
	}
	/**
	 * getter/setter
	 */
	private var _y:Int;
	private function setY(val:Int):Int{
		_y = val;
		rootElement.style.top = (_y - radius)+ "px";
		return val;
	}
	private function getY():Int{
		return _y;
	}
	/**
	 * getter/setter
	 */
	private var _rotation:Float;
	private function setRotation(val:Float):Float{
		_rotation = val;
		var degRot:String = Math.round(180*val/Math.PI) + "deg";
		var __this__ = this;
		untyped __js__ ("__this__.rootElement.style.transform = 'rotate('+degRot+')';");
		untyped __js__ ("__this__.rootElement.style.msTransform = 'rotate('+degRot+')';");
		untyped __js__ ("__this__.rootElement.style.mozTransform = 'rotate('+degRot+')';");
		untyped __js__ ("__this__.rootElement.style.oTransform = 'rotate('+degRot+')';");
		untyped __js__ ("__this__.rootElement.style.webkitTransform = 'rotate('+degRot+')';");
		return val;
	}
	private function getRotation():Float{
		return _rotation;
	}

	/**
	 * state of the knob (none, move, rotate, resize...)
	 */
	public var state(getState, setState):InPlaceEditorState;
	private var _state:InPlaceEditorState;
	/**
	 * initial position
	 */
	private var initialMouseX:Int;
	/**
	 * initial position
	 */
	private var initialMouseY:Int;
	/**
	 * initial position
	 */
	private var initialX:Int;
	/**
	 * initial position
	 */
	private var initialY:Int;
	/**
	 * is the mouse pressed
	 */
	private var isMouseDown:Bool;
	/**
	 * callback for the InPlaceEditor
	 */
	public var onMove:Void->Void;
	/**
	 * callback for the InPlaceEditor
	 */
	public var onResize:Void->Void;
	/**
	 * callback for the InPlaceEditor
	 */
	public var onRotate:Void->Void;
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
			maxRadius: Std.parseFloat(rootElement.getAttribute("data-movezone-max-radius")),
			minRadius: Std.parseFloat(rootElement.getAttribute("data-movezone-min-radius")),
			maxAngle: Std.parseFloat(rootElement.getAttribute("data-movezone-max-angle")),
			minAngle: Std.parseFloat(rootElement.getAttribute("data-movezone-min-angle")),
		};
		resizeZone = {
			maxRadius: Std.parseFloat(rootElement.getAttribute("data-resizezone-max-radius")),
			minRadius: Std.parseFloat(rootElement.getAttribute("data-resizezone-min-radius")),
			maxAngle: Std.parseFloat(rootElement.getAttribute("data-resizezone-max-angle")),
			minAngle: Std.parseFloat(rootElement.getAttribute("data-resizezone-min-angle")),
		};
		rotateZone = {
			maxRadius: Std.parseFloat(rootElement.getAttribute("data-rotatezone-max-radius")),
			minRadius: Std.parseFloat(rootElement.getAttribute("data-rotatezone-min-radius")),
			maxAngle: Std.parseFloat(rootElement.getAttribute("data-rotatezone-max-angle")),
			minAngle: Std.parseFloat(rootElement.getAttribute("data-rotatezone-min-angle")),
		};
		// init radius
		radius = rootElement.clientWidth / 2;
	}
	/**
	 * move the knob over the components
	 * TODO: handle multi selection
	 */
	public function attachToComponents(components:Array<Component>){
		if (components.length > 0){
			var component = components[0];
			x = component.x + Math.round(component.width/2);
			y = component.y + Math.round(component.height/2);
			rotation = component.rotation;
			scale = 1;
			initialWidth = component.width;
			initialHeight = component.height;
			show();
		}
		else{
			hide();
		}
	}
	/**
	 * move the components according to the knob 
	 * TODO: handle multi selection
	 */
	public function applyToComponents(components:Array<Component>){
		if (components.length > 0){
			var component = components[0];
			component.x = x - Math.round(component.width/2);
			component.y = y - Math.round(component.height/2);
			component.rotation = rotation;
			component.width = Math.round(initialWidth * scale);
			component.height = Math.round(initialHeight * scale);
		}
	}
	/**
	 * attach the knob to the selection
	 */
	public function refresh(){
		var components = SLBuilder.getInstance().selection.getComponents();
		attachToComponents(components);
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
		initialX = x;
		initialY = y;
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

static public function isInZone(angle:Float, dist:Float, zone:ParametricZone){
	return dist < zone.maxRadius 
			&& dist > zone.minRadius
			&& (angle < zone.maxAngle
			|| angle > zone.minAngle);
}
	/**
	 * compute the state in function of the mouse position
	 */
	private function computeState(mouseX:Int, mouseY:Int){
		// do not change state while mouse is down (mouse may be out but we continue draging)
		if (isMouseDown)
			return;
		// compute coord relatively to center
		var polarX = mouseX - x;
		var polarY = mouseY - y;
		var dist = Utils.distance(polarX, polarY, 0, 0);
		//var angle = Math.atan2(polarY, polarX);
		var angle = Math.atan2(polarY, polarX) - rotation;
		if (angle > Math.PI) angle -= 2*Math.PI;
		if (angle < -Math.PI) angle += 2*Math.PI;


//			trace("param zone "+dist+", "+angle+", "+((angle%(2*Math.PI) - moveZone.minAngle%(2*Math.PI))%(2*Math.PI))+", "+((angle - moveZone.maxAngle)%(2*Math.PI)));

		// check in which zone we are
		if (isInZone(angle, dist, moveZone)){
			trace("MOVE ZONE");
			state = move;
		}
		else if (isInZone(angle, dist, resizeZone)){
			trace("RESIZE ZONE");
			state = resize;
		}
		else if (isInZone(angle, dist, rotateZone)){
			trace("ROTATE ZONE");
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
		var mouseX = e.clientX;
		var mouseY = e.clientY;
		
		computeState(mouseX, mouseY);

		if (isMouseDown){
			switch (state) {
				case none:
				case move:
					x = mouseX - initialMouseX + initialX;
					y = mouseY - initialMouseY + initialY;
					if (onMove != null){
						onMove();
					}

				case resize:
					var dist = Utils.distance(mouseX,mouseY,0,0);
					var initialDist = Utils.distance(initialMouseX,initialMouseY,0,0);
					scale = dist/initialDist;
					trace("scale="+scale);
					if (onResize != null){
						onResize();
					}
				
				case rotate:
					var polarX = mouseX - x;
					var polarY = mouseY - y;
					
					rotation = Math.atan2(polarY, polarX);

					x = initialX;
					y = initialY;

					if (onRotate != null){
						onRotate();
					}
			}
			//trace("onMouseMove " + mouseX +", "+mouseY+", "+moveZone.x+", "+moveZone.y+", "+Utils.distance(mouseX, mouseY, moveZone.x, moveZone.y));
			//initialMouseX = mouseX;
			//initialMouseY = mouseY;
			untyped __js__("return false;");
		}
	}
}
