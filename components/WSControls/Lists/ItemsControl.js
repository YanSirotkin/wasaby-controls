define('js!WSControls/Lists/ItemsControl', [
   'Core/core-extend',
   'Core/Abstract.compatible',
   'js!SBIS3.CORE.Control/Control.compatible',
   'js!SBIS3.CORE.AreaAbstract/AreaAbstract.compatible',
   'js!SBIS3.CORE.BaseCompatible',
   'js!WS.Data/Entity/InstantiableMixin',
   'tmpl!WSControls/Lists/ItemsControl',
   'tmpl!WSControls/Lists/one'
], function (extend,
             AbstractCompatible,
             ControlCompatible,
             AreaAbstractCompatible,
             BaseCompatible,
             InstantiableMixin,
             template,
             one) {

   'use strict';

   var ItemsControl = extend.extend([AbstractCompatible, ControlCompatible, AreaAbstractCompatible, BaseCompatible, InstantiableMixin],
      {
         _controlName: 'WSControls/Lists/ItemsControl',
         _template: template,
         iWantVDOM: false,
         _isActiveByClick: false,

         items: null,
         itemTemplate: null,

         constructor: function (cfg) {

            this.items = cfg.items || [];
            this.itemTemplate = cfg.itemTemplate || one;

            this.deprecatedContr(cfg);
         },

         setItems: function(items){
            this.items = items;
            this._setDirty();
         }


      });

   return ItemsControl;
});