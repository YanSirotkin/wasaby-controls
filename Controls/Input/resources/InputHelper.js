define('Controls/Input/resources/InputHelper',
   [],
   function() {

      'use strict';

      return {

         /**
          * Хелпер для вставки текста в поле ввода. В нём происходит вставка и выставляется позиция каретки dom-элемета
          * @param inputRender экземпляр контрола InputRender
          * @param domInputElement инпут (dom-элемент)
          * @param textToPaste текст для вставки в поле
          * @param [selection] the selection in the field
          */
         pasteHelper: function(inputRender, domInputElement, textToPaste, selection) {
            var selectionStart, selectionEnd;

            if (selection) {
               selectionStart = selection.start;
               selectionEnd = selection.end;
            } else {
               selectionStart = domInputElement.selectionStart;
               selectionEnd = domInputElement.selectionEnd;
            }

            return inputRender.paste(textToPaste, selectionStart, selectionEnd);
         }
      };
   }
);
