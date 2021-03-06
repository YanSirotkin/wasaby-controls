define('Controls-demo/Popup/Opener/DialogPG',
   [
      'Core/Control',
      'tmpl!Controls-demo/Popup/Opener/OpenerDemoPG',
      'json!Controls-demo/PropertyGrid/pgtext',
      'wml!Controls-demo/Popup/Opener/DialogTpl',
      'wml!Controls-demo/Popup/Opener/ConfirmationTpl',


      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper',
   ],

   function(Control, template, config) {
      'use strict';
      var DialogPG = Control.extend({
         _template: template,
         _metaData: null,
         _dataOptions: null,
         _content: 'Controls/popup:Dialog',
         _nameOpener: 'dialogOpener',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               name: {
                  readOnly: true
               },
               template: {
                  items: [
                     {
                        id: 1,
                        title: 'Dialog template',
                        template: 'wml!Controls-demo/Popup/Opener/DialogTpl'
                     },
                     {
                        id: 2,
                        title: 'Confirmation template',
                        template:  'Controls-demo/Popup/Opener/ConfirmationTpl'
                     }
                  ],
                  value: 'Dialog template'
               },
               templateOptions: {
                     items: [
                        { id: '1', title: '{ value: \'My text\' }', items: { value: 'My text' }},
                        { id: '2', title: '{ value: \'Сustom text\' }' , items: { value: 'Сustom text' } }
                     ],
                     value:  '{ value: \'My text\' }'
               }

            };
            this._componentOptions = {
               autofocus: true,
               name: 'Dialog',
               modal: false,
               className: 'controls_Dialog-Opener',
               closeOnOutsideClick: true,
               template:  'wml!Controls-demo/Popup/Opener/DialogTpl',
               templateOptions:  { value: 'My text' },
               width: 550,
               height: 200,
               maxHeight: 200,
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return DialogPG;
   });
