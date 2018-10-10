define('Controls/Input/resources/RenderHelper',
   [],
   function() {
      'use strict';

      var RenderHelper = {

         /**
          * Получить разбиение по введенной строке.
          * @param {String} oldValue строка до ввода.
          * @param {String} newValue строка после ввода.
          * @param {Number} caretPosition позиция каретки после ввода.
          * @param {Object} selection объект с информацией о выделении.
          * @param {String} inputType тип ввода(insert, delete, deleteBackward, deleteForward).
          * @returns {Object} [Строка до введенной, Введенная строка, Строка после введенной]
          */
         getSplitInputValue: function(oldValue, newValue, caretPosition, selection, inputType) {
            var
               selectionLength = selection.selectionEnd - selection.selectionStart,
               deleteValue, insertValue, beforeInsertValue, afterInsertValue;

            if (inputType === 'insertFromDrop') {
               return {
                  before: newValue.substring(0, caretPosition),
                  insert: '',
                  delete: '',
                  after: newValue.substring(caretPosition)
               };
            }

            afterInsertValue = newValue.substring(caretPosition);

            if (inputType === 'insert') {
               beforeInsertValue = oldValue.substring(0, oldValue.length - afterInsertValue.length - selectionLength);

               // AutoComplete completely replaces text, there is no value before the inserted substring
               if (newValue.indexOf(beforeInsertValue) === -1) {
                  beforeInsertValue = '';
               }
            } else {
               beforeInsertValue = newValue.substring(0, caretPosition);
            }

            insertValue = newValue.substring(beforeInsertValue.length, newValue.length - afterInsertValue.length);
            deleteValue = oldValue.substring(beforeInsertValue.length, oldValue.length - afterInsertValue.length);

            return {
               before: beforeInsertValue,
               insert: insertValue,
               delete: deleteValue,
               after: afterInsertValue
            };
         },

         /**
          * Получить тип ввода.
          * @variant insert ввод значения.
          * @variant delete удаление с помощью backspace [ + ctrl] или delete [ + ctrl] с выделением значения.
          * @variant deleteBackward удаление с помощью backspace [ + ctrl] без выделения значения.
          * @variant deleteForward удаление с помощью delete [ + ctrl] без выделения значения.
          * @param {String} oldValue строка до ввода.
          * @param {String} newValue строка после ввода.
          * @param {Number} caretPosition позиция каретки после ввода.
          * @param {Object} selection объект с информацией о выделении.
          * @returns {String} тип ввода.
          */
         getInputType: function(oldValue, newValue, caretPosition, selection) {
            var
               selectionLength = selection.selectionEnd - selection.selectionStart,
               isDelete = (oldValue.length - selectionLength >= newValue.length) << 2,
               isSelection = !!selectionLength << 1,
               isOffsetCaret = caretPosition === selection.selectionEnd;

            switch (isDelete + isSelection + isOffsetCaret) {
               case 4:
                  return 'deleteBackward';
               case 5:
                  return 'deleteForward';
               case 6:
               case 7:
                  return 'delete';
               default:
                  return 'insert';
            }
         },

         /**
          * Получить тип ввода.
          * @variant insert ввод значения.
          * @variant delete удаление с помощью backspace [ + ctrl] или delete [ + ctrl] с выделением значения.
          * @variant deleteBackward удаление с помощью backspace [ + ctrl] без выделения значения.
          * @variant deleteForward удаление с помощью delete [ + ctrl] без выделения значения.
          * @param {String} nativeInputType нативный тип ввода.
          * @param {Object} selection объект с информацией о выделении.
          * @returns {String} тип ввода.
          */
         getAdaptiveInputType: function(nativeInputType, selection) {
            var
               selectionLength,
               execType;

            if (nativeInputType === 'insertFromDrop') {
               return nativeInputType;
            }

            selectionLength = selection.selectionEnd - selection.selectionStart;
            execType = /^(insert|delete|).*?(Backward|Forward|)$/.exec(nativeInputType);

            return selectionLength ? execType[1] : execType[1] + execType[2];
         }

      };

      return RenderHelper;
   });
