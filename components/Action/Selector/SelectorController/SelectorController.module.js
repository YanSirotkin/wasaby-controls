/**
 * Created by am.gerasimov on 11.08.2016.
 */
define('js!SBIS3.CONTROLS.SelectorController', [
   "Core/CommandDispatcher",
   "js!SBIS3.CORE.CompoundControl",
   "js!WS.Data/Di",
   "Core/helpers/collection-helpers",
   "js!SBIS3.CONTROLS.SelectorWrapper",
   "js!WS.Data/Collection/List"
],
    function ( CommandDispatcher,CompoundControl, Di, collectionHelpers) {

       'use strict';

       var MULTISELECT_CLASS = 'controls-SelectorController__multiselect';

       /**
        * Класс компонента, который описывает логику выбора из диалога/панели.
        * Пример использования класса описан в статье <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/textbox/selector-action/'>Окно выбора из справочника</a>.
        *
        * @class SBIS3.CONTROLS.SelectorController
        * @extends $ws.proto.CompoundControl
        * @public
        * @author Герасимов Александр Максимович
        * @control
        */
       var SelectorController = CompoundControl.extend([], /**@lends SBIS3.CONTROLS.SelectorController.prototype  */{
           /**
            * @event onSelectComplete Происходит при выборе элементов коллекции.
            * @param {$ws.proto.EventObject} eventObject Дескриптор события.
            * @param {Array.<String>} Набор выбранных элементов (см. {@link selectedItems}).
            */
          $protected: {
             _options: {
                /**
                 * @cfg {Array.<String>} Устанавливает набор выбранных элементов.
                 */
                selectedItems: null,
                /**
                 * @cfg {Boolean} Устанавливает множественный выбор элементов.
                 */
                multiselect: false,
                /**
                 * @cfg {String} Устанавливает тип доступных для выбора элементов.
                 * @remark
                 * Опция актуальна для использования совместно с иерархическим списком.
                 * <br/>
                 * Возможные значения:
                 * <ul>
                 *     <li>all - для выбора доступны любые типы элементов;<li>
                 *     <li>node - для выбора доступны только элементы типа "Узел" и "Скрытый узел";<li>
                 *     <li>leaf - для выбора доступны только элементы типа "Лист".<li>
                 * </ul>
                 * Подробнее о каждом типе элементов читайте в разделе <a href='https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy'>Иерархия</a>.
                 */
                selectionType: 'all',
                /**
                 * @cfg {String} Устанавливает имя кнопки (см. {@link $ws.proto.Control#name}), клик по которой завершает выбор отмеченных элементов.
                 */
                selectButton: 'SelectorControllerButton'
             },
             _selectButton: null
          },
          $constructor: function () {
             var commandDispatcher = CommandDispatcher;
             this._publish('onSelectComplete');

             commandDispatcher.declareCommand(this, 'selectorWrapperSelectionChanged', this._selectorWrapperSelectionChanged);
             commandDispatcher.declareCommand(this, 'selectorWrapperInitialized', this._selectorWrapperInitialized);
             commandDispatcher.declareCommand(this, 'selectComplete', this._selectComplete);

             if(this._options.selectedItems) {
                if(Array.isArray(this._options.selectedItems)) {
                   this._options.selectedItems = Di.resolve('collection.list', {items: this._options.selectedItems});
                }
             } else {
                this._options.selectedItems = Di.resolve('collection.list');
             }
          },

          init: function() {
             SelectorController.superclass.init.apply(this, arguments);
             if(this.hasChildControlByName(this._options.selectButton)) {
                this._selectButton = this.getChildControlByName(this._options.selectButton);
                this.subscribeTo(this._selectButton, 'onActivated', this.sendCommand.bind(this, 'selectComplete'));
             }
          },

          _modifyOptions: function() {
             var opts = SelectorController.superclass._modifyOptions.apply(this, arguments);
             opts.className += ' controls-SelectorController';
             if(opts.multiselect) {
                opts.className += ' ' + MULTISELECT_CLASS;
             }
             return opts;
          },

          /**
           * Обновляет конфигурацию уже инициализированного экземпляра класса SBIS3.CONTROLS.SelectorController.
           * @remark
           * При выполнении команды обновляется конфигурацию для опций {@link multiselect}, {@link selectedItems} и {@link selectionType}.
           * @param {SBIS3.CONTROLS.SelectorController} chooserWrapper
           * @command selectorWrapperInitialized
           * @see selectorWrapperSelectionChanged
           * @see selectComplete
           */
          _selectorWrapperInitialized: function(chooserWrapper) {
             chooserWrapper.setProperties({
                multiselect: this._options.multiselect,
                selectedItems: this._options.selectedItems,
                selectionType: this._options.selectionType
             });
          },

          /**
           * Производит изменение списка выбранных элементов коллекции.
           * @remark
           * Массив выбранных элементов хранится в опции (см. {@link selectedItems}).
           * @param {Object} difference Объект с набором элементов, которые нужно добавить или убрать из списка выбранных.
           * @param {Array.<String>} difference.removed Массив с идентификаторами элементов, которые нужно убрать из списка выбранных.
           * @param {Array.<String>} difference.added Массив с идентификаторами элементов, которые нужно добавить в список выбранных.
           * @param {String} idProperty Поле с идентификатором элемента коллекции.
           * @command selectorWrapperSelectionChanged
           * @see selectorWrapperInitialized
           * @see selectComplete
           */
          _selectorWrapperSelectionChanged: function(difference, idProperty) {
             var currentItems = this._options.selectedItems,
                 multiselect = this.getProperty('multiselect'),
                 self = this;

             function onChangeSelection() {
                if(self._selectButton && multiselect) {
                   self._selectButton.show();
                }
             }

             if(difference.removed.length) {
                collectionHelpers.forEach(difference.removed, function (removedKey) {
                   currentItems.removeAt(currentItems.getIndexByValue(idProperty, removedKey));
                });
                onChangeSelection();
             }

             if(difference.added.length) {
                collectionHelpers.forEach(difference.added, function(item) {
                   var index = currentItems.getIndexByValue(idProperty, item.get(idProperty));

                   if(currentItems.getCount() && !multiselect && index === -1) {
                      index = 0;
                   }

                   if(index === -1) {
                      currentItems.add(item);
                   } else {
                      currentItems.replace(item, index);
                   }
                });
                onChangeSelection();
             }
          },
           /**
            * Производит подтверждение выбранных элементов коллекции.
            * @remark
            * Массив выбранных элементов хранится в опции (см. {@link selectedItems}).
            * При выполнении команды происходит событие {@link onSelectComplete}.
            * @command selectComplete
            * @see selectorWrapperInitialized
            * @see selectorWrapperSelectionChanged
            */
          _selectComplete: function() {
             this._notify('onSelectComplete', this._options.selectedItems.clone());
          }
       });

       return SelectorController;

    });
