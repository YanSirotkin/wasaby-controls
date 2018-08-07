define('Controls/Input/Password',
   [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'Controls/Utils/tmplNotify',
      'tmpl!Controls/Input/Password/Password',
      'Controls/Input/resources/InputRender/BaseViewModel',

      'css!Controls/Input/Password/Password'
   ],

   function(Control, types, tmplNotify, template, BaseViewModel) {

   /**
    * Password input.
    * <a href="/materials/demo-ws4-input">Демо-пример</a>.
    *
    * @class Controls/Input/Password
    * @extends Core/Control
    * @mixes Controls/Input/interface/IInputText
    * @mixes Controls/Input/interface/IInputPlaceholder
    * @mixes Controls/Input/interface/IValidation
    * @mixes Controls/Input/interface/IInputTag
    * @mixes Controls/Input/Password/PasswordStyles
    * @mixes Controls/Input/resources/InputRender/InputRenderStyles
    * @control
    * @public
    * @category Input
    * @demo Controls-demo/Input/Password/Password
    * @author Золотова Э.Е.
    */

      'use strict';

      var PasswordInput = Control.extend({
         _template: template,

         _notifyHandler: tmplNotify,

         _passwordVisible: false,

         constructor: function(options) {
            PasswordInput.superclass.constructor.apply(this, arguments);
            this._simpleViewModel = new BaseViewModel({
               value: options.value
            });
         },

         _beforeUpdate: function(newOptions) {
            this._simpleViewModel.updateOptions({
               value: newOptions.value
            });
         },

         _toggleVisibilityHandler: function() {
            this._passwordVisible = !this._passwordVisible;
         }
      });

      PasswordInput.getDefaultOptions = function() {
         return {
            value: ''
         };
      };

      PasswordInput.getOptionTypes = function getOptionsTypes() {
         return {
            placeholder: types(String)
         };
      };

      return PasswordInput;
   });
