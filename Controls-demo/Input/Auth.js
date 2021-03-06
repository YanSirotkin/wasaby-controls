define('Controls-demo/Input/Auth',
   [
      'Core/Control',
      'wml!Controls-demo/Input/Auth/Auth',
      'i18n!Controls-demo',

      'Controls/input',
      'css!Controls-demo/Input/Auth/Auth'
   ],
   function(Control, template, rk) {
      'use strict';

      return Control.extend({
         _template: template,

         _login: '',

         _password: '',

         _update: function() {
            this._children.form.submit();
         },

         _signIn: function() {
            if (this._login === '' || this._password === '') {
               this._children.confirmationEmptyField.open({
                  type: 'ok',
                  style: 'danger',
                  message: rk('Для входа укажите логин и пароль')
               });

               return;
            }

            this._update();
         }
      });
   });
