define('Controls/Input/Render',
   [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'Controls/Utils/tmplNotify',

      'wml!Controls/Input/Render/Render',
      'css!theme?Controls/Input/Render/Render'
   ],
   function(Control, descriptor, tmplNotify, template) {
      'use strict';

      var Render = Control.extend({
         _template: template,

         /**
          * @type {Boolean} The content has active.
          * @private
          */
         _contentActive: false,

         _notifyHandler: tmplNotify,

         _getState: function() {
            if (this._options.readOnly) {
               if (this._options.multiline) {
                  return '_readOnly_multiline';
               }

               return '_readOnly';
            }
            if (this._contentActive) {
               return '_active';
            }

            return '';
         },

         _contentFocusInHandler: function() {
            this._contentActive = true;
         },

         _contentFocusOutHandler: function() {
            this._contentActive = false;
         }
      });

      Render.getDefaultTypes = function() {
         return {
            content: descriptor(Function).required(),
            afterFieldWrapper: descriptor(Function),
            beforeFieldWrapper: descriptor(Function),
            multiline: descriptor(Boolean),
            size: descriptor(String).oneOf([
               's',
               'm',
               'l'
            ]).required(),
            fontStyle: descriptor(String).oneOf([
               'default',
               'primary',
               'secondary'
            ]).required(),
            textAlign: descriptor(String).oneOf([
               'left',
               'right'
            ]).required(),
            style: descriptor(String).oneOf([
               'info',
               'danger',
               'invalid',
               'primary',
               'success',
               'warning'
            ]).required(),
            tagStyle: descriptor(String).oneOf([
               'info',
               'danger',
               'primary',
               'success',
               'warning',
               'secondary'
            ])
         };
      };

      return Render;
   });
