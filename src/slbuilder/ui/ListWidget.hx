package slbuilder.ui;

import js.Lib;
import js.Dom;
import slbuilder.core.Template;
import slbuilder.core.Config;
import slbuilder.core.Utils;
import slbuilder.data.Types;

/**
 * list widget
 * display the layers or components in a list
 * this class has to be overriden
 */
class ListWidget<ElementClass> {
	/**
	 * name of the "name" column
	 */
	private var widgetTitle:String;
	/**
	 * extjs data store
	 */
	private var arrayStore : ext.data.ArrayStore;
	/**
	 * on change callback
	 */
	public var onChange:ElementClass->Void;
	/**
	 * button
	 */
	private var addBtn:HtmlDom;
	/**
	 * button
	 */
	private var removeBtn:HtmlDom;
	/**
	 * parent container, provided as a constructor param
	 */
	private var parent:HtmlDom;
	/**
	 * container of this component 
	 */
	private var root:HtmlDom;
	/**
	 * extjs container
	 */
	private var panel:ext.form.Panel;
	/**
	 * extjs container
	 */
	private var grid:Dynamic;
	/**
	 * init the widget
	 */
	public function new(parent:HtmlDom, panel:ext.form.Panel, title:String){
		widgetTitle = title;
		this.parent = parent;
		this.panel = panel;
		initExtJsUi();
	}
	/**
	 * get elements by class names 
	 * initializes the process of refreshing the list
	 */
	private function initDomReferences() {
		trace(root.id);

		addBtn = Utils.getElementsByClassName(root, "addBtn")[0];
		addBtn.onclick = add;
		removeBtn = Utils.getElementsByClassName(root, "removeBtn")[0];
		removeBtn.onclick = remove;
		refresh();
	}
	/**
	 * refresh the list, i.e. arrayStore.loadData( ... )
	 * to be overriden to handle the model
	 */
	public function refresh() {
	}
	/**
	 * add an element to the model and refresh the list
	 * to be overriden to handle the model
	 */
	private function add(e:js.Event) {
		refresh();
	}
	/**
	 * remove an element from the model and refresh the list
	 * to be overriden to handle the model
	 */
	private function remove(e:js.Event) {
		refresh();
	}
	/**
	 * handle a selection change
	 * call onChange if defined
	 */
	private function onSelectionChanged(model:Dynamic, records:Array<Dynamic>) {
		//trace("onSelectionChanged "+Type.typeof(model.selected)+" - "+Type.typeof(records));
		//Utils.inspectTrace(model.selected);
//		trace("------");
//		Utils.inspectTrace(records[0].data);

		var selected:ElementClass = null;
		if (records[0] != null)
			selected = records[0].data;

		if (onChange != null){
			onChange(selected);
		}
	}
	/**
	 * init the extjs list 
	 */
	private function initExtJsUi(){

		// init data store
	    arrayStore = Ext.create('Ext.data.ArrayStore', {
	        fields: [
	            {name: 'id'},
	            {name: 'parentId'},
	            {name: 'displayName'}
	        ]
	    });
	    grid = Ext.create('Ext.grid.GridPanel', {
            columnWidth: 0.60,
            xtype: 'gridpanel',
            store: arrayStore,
            height: 150,
            minWidth: 150,
            width: 150,
            style: {
	            minWidth: "150px",
	            width: "150px",
				float: "left",
				position: "relative",
				height: "250px"
           	},
/*
*/
            columns: [
                {
                    id       :'col',
                    text   : widgetTitle,
                    flex: 1,
                    sortable : true,
                    dataIndex: 'displayName'
                },
            ],

            listeners: {
                selectionchange: onSelectionChanged
                //function(model, records) {
            },
	        buttons: [{
	        	cls:'addBtn',
	        	text:'+',
	            xtype: 'button'
	        },{
	        	cls:'removeBtn',
	        	text:'-',
	            xtype: 'button'
	        }],
	    });
	    panel.add(grid);
	    root = grid.getEl().dom;

		root.style.position="relative";
		cast(root.style).float="left";
		//root.style.width="380px";
		//root.style.height="400px";


	    initDomReferences();

/*	        items: [{
	            columnWidth: 0.60,
	            xtype: 'gridpanel',
	            store: arrayStore,
	            height: 250,

	            columns: [
	                {
	                    id       :'layers',
	                    text   : 'Layers',
	                    flex: 1,
	                    sortable : true,
	                    dataIndex: 'displayName'
	                },
	            ],

	            listeners: {
	                selectionchange: onSelectionChanged
	                //function(model, records) {
	            },
		        buttons: [{
		        	cls:'addBtn',
		        	text:'+',
		            xtype: 'button'
		        },{
		        	cls:'removeBtn',
		        	text:'-',
		            xtype: 'button'
		        }]
	       }, {
	            columnWidth: 0.4,
	            margin: '0 0 0 10',
	            xtype: 'fieldset',
	            title:'Company details',
	            defaults: {
	                width: 240,
	                labelWidth: 90
	            },
	            defaultType: 'textfield',
	            items: [{
	                fieldLabel: 'Name',
	                name: 'displayName'
	            }/*,{
	                fieldLabel: 'Price',
	                name: 'price'
	            },{
	                fieldLabel: '% Change',
	                name: 'pctChange'
	            },{
	                xtype: 'datefield',
	                fieldLabel: 'Last Updated',
	                name: 'lastChange'
	            }, {
	                xtype: 'radiogroup',
	                fieldLabel: 'Rating',
	                columns: 3,
	                defaults: {
	                    name: 'rating' //Each radio has the same name so the browser will make sure only one is checked at once
	                },
	                items: [{
	                    inputValue: '0',
	                    boxLabel: 'A'
	                }, {
	                    inputValue: '1',
	                    boxLabel: 'B'
	                }, {
	                    inputValue: '2',
	                    boxLabel: 'C'
	                }]
	            }*//*]
	        }]*/
	}


}