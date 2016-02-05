/**
 * Created by as.suhoruchkin on 12.03.2015.
 */
define('js!SBIS3.CONTROLS.OperationsPanel', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.OperationsPanel',
   'js!SBIS3.CONTROLS.DSMixin',
   /*TODO это должна подключать не панель а прекладники, потом убрать*/
   'js!SBIS3.CONTROLS.OperationDelete',
   'js!SBIS3.CONTROLS.OperationsMark',
   'js!SBIS3.CONTROLS.OperationMove'
], function(Control, dotTplFn, DSMixin) {
   /**
    * Компонент "Панель действий" используют совместно с представлениями данных ({@link SBIS3.CONTROLS.ListView} или любой его контрол-наследник),
    * с записями которых требуется производить манипуляции. Он состоит из всплывающей панели, скрытой по умолчанию, и
    * кнопки управления её отображением - {@link SBIS3.CONTROLS.OperationsPanelButton}.
    *
    * <ul>
    *    <li>Связывание панели и представления данных производится при помощи {@link SBIS3.CONTROLS.ComponentBinder}.</li>
    *    <li>Кнопка управления должна быть связана с всплывающей панелью методом {@link SBIS3.CONTROLS.OperationsPanelButton#setLinkedPanel}. Одной кнопкой можно управлять несколькими панелями.</li>
    *    <li>Набор действий, отображаемых на панели, настраивают в опции {@link items}.</li>
    * </ul>
    *
    * Существуют следующие категории действий:
    * <ol>
    *    <li>Действия над отмеченными записями: Распечатать, Выгрузить, Переместить и Удалить.</li>
    *    <li>Действия над всем реестром. Они сгруппированы в кнопке-меню "Отметить", рядом с которой отображается
    *    счетчик выделенных записей. В меню доступны следующие действия: <br/>
    *       <ul>
    *          <li><i>Всю страницу</i>. Выделяет все записи в связанном представлении данных, которые отображены на данной
    *          веб-странице.</li>
    *          <li><i>Снять</i>. Сбрасывает выделенные записи.</li>
    *          <li><i>Инвертировать</i>. Сбрасывает выделенные записи, и выделяет те, что не были выделены ранее.</li>
    *       </ul>
    *    </li>
    * </ol>
    *
    * Также допустимо создание новых действий, для которых настраивается иконка и поведение при клике.
    * @class SBIS3.CONTROLS.OperationsPanel
    * @extends $ws.proto.CompoundControl
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    * @ignoreOptions contextRestriction independentContext
    * @initial
    * <component data-component='SBIS3.CONTROLS.OperationsPanel' style="height: 30px;">
    *
    * </component>
    */
   var OperationsPanel = Control.extend([DSMixin],/** @lends SBIS3.CONTROLS.OperationsPanel.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            /**
             * @typedef {Object} Type
             * @property {Boolean} mass Массовые операции.
             * @property {Boolean} mark Операции отметки.
             * @property {Boolean} selection Операции над выбранными записями.
             */
            /**
             * @typedef {Object} Items
             * @property {String} name Имя кнопки панели массовых операций.
             * @property {String} componentType Тип компонента, определяющий формат.
             * @property {Type} type Тип операций.
             * @property {Object} options Настройки компонента, переданного в componentType.
             *
             */
            /**
             * @cfg {Items[]} Набор исходных данных, по которому строится отображение
             */
            items: [
               {
                   name: 'delete',
                   componentType: 'js!SBIS3.CONTROLS.OperationDelete',
                   type: {
                       mass: true,
                       selection: true
                   },
                   options: {}
               },
               {
                   name: 'operationsMark',
                   componentType: 'js!SBIS3.CONTROLS.OperationsMark',
                   type: {
                       'mark': true
                   },
                   options: {}
               }
            ],
             /**
              * @noShow
              */
            keyField: 'name',
            /**
             * @cfg {Boolean} Флаг наличия блока с операциями отметки
             */
            hasMarkBlock: true,
            visible: false
         },
         _blocks: undefined,
         _itemsDrawn: false
      },
      $constructor: function() {
         this._publish('onToggle', 'onChangeEnabled');
         this._container.removeClass('ws-area');
      },
      _drawItemsCallback: function() {
         this._itemsDrawn = true;
         //TODO: После перехода на новую идеалогию, кнопки ни чего знать о view не будут, и этот костыль уйдёт.
         $ws.helpers.forEach(this.getItemsInstances(), function(item) {
            this.addItemOptions(item);
         }, this)
      },
      _setVisibility: function(show) {
         var self = this;
         if (!this._itemsDrawn && show) {
            this.reload();
         }
         if (this.isVisible() !== show) {
            this._isVisible = show;
            show && this._container.removeClass('ws-hidden');
            this._blocks.wrapper.animate({'margin-top': show ? 0 : '-30px'}, {
               duration: 150,
               easing: 'linear',
               queue: false,
               complete: function () {
                  self._container.toggleClass('ws-hidden', !show);
                  self._notify('onToggle');
               }
            });
         }
      },
      _initContainer: function() {
         OperationsPanel.superclass._initContainer.apply(this, arguments);
         this._container.removeClass('ws-area');
         this._blocks = {
            markOperations: this._container.find('.controls-operationsPanel__actionMark'),
            allOperations: this._container.find('.controls-operationsPanel__actions'),
            wrapper: this._container.find('.controls-operationsPanel__wrapper')
         };
      },
      _getTargetContainer: function(item) {
         return this._blocks[item.get('type').mark ? 'markOperations' : 'allOperations'];
      },
      _getItemTemplate: function() {
         var self = this;
         return function (cfg) {
            var
                item = cfg.item,
                options = item.get('options') || {},
                type = self._getItemType(item.get('type'));
            options.className = 'controls-operationsPanel__actionType-' + type;
            return '<component data-component="' + item.get('componentType').substr(3) + '" config="' + $ws.helpers.encodeCfgAttr(options) + '"></component>';
         }
      },
      _getItemType: function (type) {
         return type.mark ? 'mark' : type.mass && type.selection ? 'all' : type.mass ? 'mass' : 'selection';
      },
       /**
        * Установить возможность взаимодействия с панелью массовых операций.
        * @param enabled
        */
      setEnabled: function(enabled) {
         if (!enabled) {
            this.close();
         }
         OperationsPanel.superclass.setEnabled.apply(this, arguments);
         this._notify('onChangeEnabled');
      },
      /**
       * Получить инстансы всех элементов панели массовых операций.
       * @returns {Array}
       */
      getItemInstances: function() {
         var args = arguments;
         return this.reload().addCallback(function() {
            return OperationsPanel.superclass.getItemInstances.apply(this, args);
         }.bind(this));
      },
      getItemInstance: function() {
         var args = arguments;
         return this.reload().addCallback(function() {
            return OperationsPanel.superclass.getItemInstance.apply(this, args);
         }.bind(this));
      },
      onSelectedItemsChange: function(idArray) {
         this._blocks.wrapper.toggleClass('controls-operationsPanel__massMode', !idArray.length)
                             .toggleClass('controls-operationsPanel__selectionMode', !!idArray.length);
      },
      destroy: function() {
         this._blocks = null;
         OperationsPanel.superclass.destroy.apply(this);
      }
   });
   return OperationsPanel;
});