define('Controls-demo/LongRender/DelayedControl',
   [
      'Core/Control',
      'Env/Env',
      'wml!Controls-demo/LongRender/DelayedControl',
   ],
   function(Control, Env, template) {
      'use strict';

      var DelayedControlModule = Control.extend({
         _template: template,
         _delay: 0,

         _beforeMount: function (options) {
            this._delay = (options.delay !== undefined ? options.delay : 21000);
            var delay = this._delay;
            return new Promise(function (resolve) {
               setTimeout(function () {
                  Env.IoC.resolve('ILogger').info('We are loaded ' + options.name);
                  resolve();
               }, delay);
            });
         }

      });
      return DelayedControlModule;
   }
);
