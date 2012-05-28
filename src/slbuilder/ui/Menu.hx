package slbuilder.ui;

import js.Lib;
import js.Dom;
import slbuilder.core.Template;
import slbuilder.core.Config;

/**
 * Menu class
 * load a menu template, for the list elements, attach a callback to let you catch the click
 */
class Menu {
	/**
	 * on click callback
	 */
	public var onClick:String->Void;
	/**
	 * ViewMenu root container
	 */
	private var root:HtmlDom;
	/**
	 * ViewMenu parent container, provided as a constructor param
	 */
	private var parent:HtmlDom;
	/**
	 * init the ViewMenu
	 */
	public function new(parent:HtmlDom, teamplateName:String){
		this.parent = parent;
		initTemplates(teamplateName);
	}
	/**
	 * load the templates
	 */
	private function initTemplates(teamplateName){
		new Template(teamplateName).onLoad = attachTemplate;
	}
	/**
	 * init the buttons contained in the template
	 */
	private function initButtons(container:HtmlDom){
		var buttons:HtmlCollection<HtmlDom> = container.getElementsByTagName("li");
		for (buttonIdx in 0...buttons.length){
			buttons[buttonIdx].onclick = onClickBtn;
		}
	}
	/**
	 * callback for loaded teplates
	 */
	private function attachTemplate(template:Template){
		root = Lib.document.createElement("div");
		root.innerHTML = template.execute({Config:Config});
		parent.appendChild(root);
		initButtons(root);
	}
	private function onClickBtn(e:js.Event) 
	{
		//trace("click "+e.target.className);
		if (onClick != null)
			onClick(e.target.className);
	}
}