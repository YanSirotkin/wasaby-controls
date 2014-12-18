/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.ContextMenu', ['js!SBIS3.CONTROLS.Menu', 'js!SBIS3.CONTROLS._PopupMixin', 'html!SBIS3.CONTROLS.ContextMenu'], function(Menu, PopupMixin, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий горизонтальное меню
    * @class SBIS3.CONTROLS.ContextMenu
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS._CollectionMixin
    */

   var ContextMenu = Menu.extend([PopupMixin], /** @lends SBIS3.CONTROLS.ContextMenu.prototype */ {
      _dotTplFn : dotTplFn,
      _itemActivatedHandler : function(menuItem) {
         if (!(menuItem.getContainer().hasClass('controls-Menu__hasChild'))) {
            this.hide();

            for (var j in this._subMenus) {
               if (this._subMenus.hasOwnProperty(j)) {
                  this._subMenus[j].hide();
               }
            }
         }


      },
   });

   return ContextMenu;

});