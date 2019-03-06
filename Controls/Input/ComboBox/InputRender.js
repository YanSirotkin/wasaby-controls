define('Controls/Input/ComboBox/InputRender', [
   'Controls/Input/Base'
], function(InputBase) {
   'use strict';

   var SuggestInputRender = InputBase.extend({
      _initProperties: function(options) {
         SuggestInputRender.superclass._initProperties.call(this, options);
         
         this._afterFieldWrapper.template = options.afterFieldWrapper;
         this._field.scope.readOnly = true;
      }
   });

   return SuggestInputRender;
});
