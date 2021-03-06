/**
 * Created by am.gerasimov on 18.04.2018.
 */

import BaseLayer from './__BaseLayer';
import template = require('wml!Controls/_suggestPopup/Layer/__ContentLayer');
import 'css!theme?Controls/suggest';

var _private = {
   getSizes: function(self, dropDownContainer) {
      var boundingClientToJSON = function(bc) {
         var resultObj = {};

         // firefox bug, clientRect object haven't method toJSON
         if (bc.toJSON) {
            resultObj = bc.toJSON();
         } else {
            for (var i in bc) {
               // hasOwnProperty does not work correctly on clientRect object in FireFox and IE (not all versions)
               if (Object.prototype.hasOwnProperty.call(bc, i)) {
                  resultObj[i] = bc[i];
               }
            }
         }

         return resultObj;
      };
      var result;

      var container = self._container;
      var targetContainer = self._options.target;

      //TODO https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
      if (container.get) {
         container = container.get(0);
      }
      if (targetContainer.get) {
         targetContainer = targetContainer.get(0);
      }

      var oldHeight = container.style.height;

      //reset height to get real height of content
      //the only solution is to get height avoiding synchronization
      container.style.height = '';

      var suggestBCR = boundingClientToJSON(container.getBoundingClientRect());
      var containerBCR =  boundingClientToJSON(targetContainer.getBoundingClientRect());
      var dropDownContainerBCR = _private.getDropDownContainerSize(dropDownContainer);

      /* because dropDownContainer can have height smaller, than window height */
      function fixSizesByDDContainer(size) {
         size.top -= dropDownContainerBCR.top;
         size.bottom -= dropDownContainerBCR.top;
         return size;
      }

      result = {
         suggest: fixSizesByDDContainer(suggestBCR),
         container: fixSizesByDDContainer(containerBCR)
      };

      //after reset height need to return old height, new height will be set by VDOM after synchronization
      container.style.height = oldHeight;
      return result;
   },

   getDropDownContainerSize: function(container) {
      container = container || document.getElementsByClassName('controls-Popup__stack-target-container')[0] || document.body;
      return container.getBoundingClientRect();
   },

   updateHeight: function(self) {
      const height = _private.calcHeight(self);
      const heightChanged = self._height !== height;

      if (heightChanged) {
         self._height = height;
      }
   },

   /**
    * calculate height of suggestions container by orient and suggestions container sizes
    * @param self
    * @param sizes size of suggestions container and input container
    * @param dropDownContainer container for dropDown
    * @returns {string}
    */
   calcHeight: function(self, dropDownContainer) {
      var sizes = _private.getSizes(self, dropDownContainer);
      var dropDownContainerSize = _private.getDropDownContainerSize(dropDownContainer);
      var suggestSize = sizes.suggest;
      var containerSize = sizes.container;
      var height = self._height;
      var optionValue = containerSize.bottom;
      var suggestBottomSideCoord = optionValue + suggestSize.height;

      if (suggestBottomSideCoord < 0) {
         height = suggestSize.height + suggestBottomSideCoord + 'px';
      } else if (suggestBottomSideCoord > dropDownContainerSize.height) {
         height = dropDownContainerSize.height - suggestSize.top + 'px';
      } else if (height) {
         height = 'auto';
      }

      return height;
   }
};

var __ContentLayer = BaseLayer.extend({

   _template: template,
   _height: 'auto',

   _afterUpdate: function() {
      /* 1) checking suggestionsContainer in children, because suggest initializing asynchronously
       2) do not change orientation of suggest, if suggest already showed or data loading now */
      if (this._options.showContent) {
         _private.updateHeight(this);
      }
   },

   _resize: function() {
      _private.updateHeight(this);
   },

   close: function() {
      this._notify('close', [], {bubbling: true});
   }

});

__ContentLayer._private = _private;

export default __ContentLayer;

