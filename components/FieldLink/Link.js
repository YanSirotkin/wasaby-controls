define('SBIS3.CONTROLS/FieldLink/Link', [
      'SBIS3.CONTROLS/WSControls/Buttons/ButtonBase',
      'tmpl!SBIS3.CONTROLS/FieldLink/Link/FieldLink_Link',
      'css!SBIS3.CONTROLS/FieldLink/Link/FieldLink_Link'
   ],
   function(ButtonBase, dotTplFn) {
      
      'use strict';
      
      /**
       * Сслыка, которая может использоваться в качестве метки поля связи.
       * Пример создания метки в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/textbox/field-link/config/#_3 статье}.
       * @class SBIS3.CONTROLS/FieldLink/Link
       * @extends WSControls/Buttons/ButtonBase
       * @mixes SBIS3.CONTROLS/FieldLink/LinkDocs
       * @author Герасимов А.М.
       *
       * @cssModifier controls-FieldLink-Link__filterButton Стилизация ссылки для кнопки фильтров.
       *
       * @control
       * @public
       */
      
      var FieldLink_Link = ButtonBase.extend({
         _dotTplFn: dotTplFn,
         $constructor: function() {

            /**
             * @command showSelector
             * @name SBIS3.CONTROLS/FieldLink/Link#showSelector
             * @type {string}
             */

            this._options.command = 'showSelector';
            // Если ссылка находится внутри поля связи (placeholder) фокус принимать она не должна.
            this._options.activableByClick = false;
            this.setTabindex(0);
         },
         setCaption: function() {
            FieldLink_Link.superclass.setCaption.apply(this, arguments);
            this.getContainer().html(this._options.caption);
         },
         _setEnabled: function(enabled) {
            FieldLink_Link.superclass._setEnabled.apply(this, arguments);
            this.getContainer()
               .toggleClass('controls-FieldLink__Link_enabled', enabled)
               .toggleClass('controls-FieldLink__Link_disabled', !enabled);
         }
      });
      
      return FieldLink_Link;
   });
