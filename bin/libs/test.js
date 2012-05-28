var dsLayers;

Ext.require([
    'Ext.form.*',
    'Ext.data.*',
    'Ext.grid.Panel',
    'Ext.layout.container.Column'
]);


Ext.onReady(function(){

    Ext.QuickTips.init();

    var bd = Ext.getBody();

    // sample static data for the store
    var myData = [
    	['Layersdfs54fsd', undefined, 'Layer test']
    ];

    dsLayers = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: 'id'},
            {name: 'parentId'},
            {name: 'displayName'}
        ],
        data: myData
    });


    // example of custom renderer function
    function change(val){
        if(val > 0){
            return '<span style="color:green;">' + val + '</span>';
        }else if(val < 0){
            return '<span style="color:red;">' + val + '</span>';
        }
        return val;
    }
    // example of custom renderer function
    function pctChange(val){
        if(val > 0){
            return '<span style="color:green;">' + val + '%</span>';
        }else if(val < 0){
            return '<span style="color:red;">' + val + '%</span>';
        }
        return val;
    }
    
    // render rating as "A", "B" or "C" depending upon numeric value.
    function rating(v) {
        if (v == 0) return "A";
        if (v == 1) return "B";
        if (v == 2) return "C";
    }
    /*
     * Here is where we create the Form
     */
    var gridForm = Ext.create('Ext.form.Panel', {
        id: 'slbuilder-form',
        frame: true,
        title: 'SLBuilder Editor',
        bodyPadding: 5,
        layout: 'column',    // Specifies that the items will now be arranged in columns

        fieldDefaults: {
            labelAlign: 'left',
            msgTarget: 'side'
        },

        items: [{
            columnWidth: 0.60,
            xtype: 'gridpanel',
            store: dsLayers,
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
                selectionchange: function(model, records) {
                    if (records[0]) {
                        this.up('form').getForm().loadRecord(records[0]);
                    }
                }
            },
	        buttons: [{
	        	cls:'addlayerBtn',
	        	text:'+',
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
            },{
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
            }]
        }],
        renderTo: bd
    });


    gridForm.child('gridpanel').getSelectionModel().select(0);


//myData.push(['Layersdfs54fsd', undefined, 'Layer test 2']);
//dsLayers.loadData(myData);

});