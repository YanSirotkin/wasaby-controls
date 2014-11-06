define('js!SBIS3.Engine.FieldLink', ['js!SBIS3.CORE.Control'], function(Control) {

   'use strict';

   /**
    * Поле связи. Можно выбирать значение из списка, можно из автодополнения
    * @class SBIS3.Engine.FieldLink
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS._MultiSelectorMixin
    * @mixes SBIS3.CONTROLS._CollectionMixin
    * @mixes SBIS3.CONTROLS._FormWidgetMixin
    * @control
    */

   var FieldLink = Control.Control.extend(/** @lends SBIS3.Engine.FieldLink.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Выбирается одно или несколько значений
             */
            multiSelect: false
         }
      },

      $constructor: function() {

      }
   });

   return FieldLink;

});