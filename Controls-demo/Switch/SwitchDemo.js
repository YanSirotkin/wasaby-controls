define('Controls-demo/Switch/SwitchDemo', [
   'Core/Control',
   'Types/source',
   'wml!Controls-demo/Switch/SwitchDemo',
   'css!Controls-demo/Headers/resetButton',
   'css!Controls-demo/Switch/UnionSwitchDemo'
], function(Control, source, template) {
   'use strict';
   var ModuleClass = Control.extend(
      {
         _template: template,
         _captionPositionSource: null,
         _selectedCaptionPosition: 'left',
         _caption: 'on',
         _tooltip: '',
         _eventName: 'no event',
         _beforeMount: function() {
            this._captionPositionSource = new source.Memory({
               keyProperty: 'title',
               data: [
                  {
                     title: 'left'
                  },
                  {
                     title: 'right'
                  }
               ]
            });
         },

         changeCaptionPosition: function(e, key) {
            this._selectedCaptionPosition = key;
         },

         changeValue: function(e, value) {
            this._value = value;
            this._eventName = 'valueChanged';
         },
         reset: function() {
            this._eventName = 'no event';
         }
      });
   return ModuleClass;
});
