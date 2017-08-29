define('js!WSControls/Lists/ItemsControl', [
   'Core/core-extend',
   'Core/Control',
   'Core/helpers/Object/isEmpty',
   'tmpl!WSControls/Lists/resources/ItemsTemplate',
   'tmpl!WSControls/Lists/resources/ItemTemplate',
   'tmpl!WSControls/Lists/resources/ItemContentTemplate',
   'js!WSControls/Lists/resources/utils/DataSourceUtil',
   'js!WSControls/Lists/resources/utils/ItemsUtil',
   'Core/helpers/functional-helpers',
   'Core/Deferred',
   'js!WS.Data/Type/descriptor',
   'js!WS.Data/Source/ISource',
   'Core/core-instance'
], function (extend,
             BaseControl,
             isEmpty,
             ItemsTemplate,
             ItemTemplate,
             ItemContentTemplate,
             DataSourceUtil,
             ItemsUtil,
             fHelpers,
             Deferred,
             Types,
             ISource,
             cInstance
   ) {
   'use strict';

   var ItemsControl = BaseControl.extend(
      {
         _controlName: 'WSControls/Lists/ItemsControl',
         _startIndex: 0,
         _stopIndex: 0,
         _curIndex: 0,
         iWantVDOM: true,
         _isActiveByClick: false,
         _items: null,

         _dataSource: null,
         _loader: null,

         //TODO пока спорные параметры
         _filter: undefined,
         _sorting: undefined,

         _defaultItemContentTemplate: ItemContentTemplate,
         _defaultItemTemplate: ItemTemplate,
         _groupTemplate: null,
         _defaultGroupTemplate: null,

         _itemsTemplate: ItemsTemplate,

         constructor: function (cfg) {
            ItemsControl.superclass.constructor.apply(this, arguments);

            this._onCollectionChangeFnc = this._onCollectionChange.bind(this);
            this._prepareMountingData(cfg);
            this._publish('onItemsReady', 'onDataLoad');
         },

         _prepareMountingData: function(newOptions) {
            //this._itemContentTpl = cfg.itemContentTpl || this._defaultItemContentTemplate;
            this._groupTemplate = newOptions.groupTemplate || this._defaultGroupTemplate;

            if (newOptions.items && (this._items != newOptions.items)) {
               this._items = newOptions.items;
               this._itemsChangeCallback(this._items, newOptions);
            }


         },

         _beforeMount: function(newOptions) {

            if (newOptions.dataSource != this._options.dataSource) {
               this._dataSource = DataSourceUtil.prepareSource(newOptions.dataSource);
               this.reload(newOptions);
            }
         },

         _beforeUpdate: function(newOptions) {
            this._prepareMountingData(newOptions);

            if (newOptions.dataSource != this._options.dataSource) {
               this._dataSource = DataSourceUtil.prepareSource(newOptions.dataSource);
               this.reload(newOptions);
            }
            //TODO обработать смену фильтров и т.д. позвать релоад если надо
         },

         _initItemBasedControllers: function(items, cfg) {
            if (this._items) {
               //TODO убрать дестрой, проверить утечки памяти
               if (this._display) {
                  this._display.destroy();
               }
               this._display = this._createDefaultDisplay(items, cfg);
               this._display.subscribe('onCollectionChange', this._onCollectionChangeFnc);
            }
         },

         _onCollectionChange: function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex, groupId) {
            this._displayChangeCallback(this._display, this._options);
            this._setDirty();
         },


         _itemsChangeCallback: function(items, cfg) {
            this._initItemBasedControllers(items, cfg);
            this._displayChangeCallback(this._display, cfg);
            this._notify('onItemsReady');
         },

         //при изменениях в проекции
         _displayChangeCallback: function(display, cfg) {
            this._startIndex = 0;
            this._stopIndex = this._display.getCount();
         },

         _getStartEnumerationPosition: function() {
            this._curIndex = this._startIndex;
         },

         _getNextEnumerationPosition: function() {
            this._curIndex++;
         },

         _getItemTpl: function() {
            return this._options.itemTpl || this._defaultItemTemplate;
         },

         _getItemContentTpl: function() {
            return this._options.itemContentTpl || this._defaultItemContentTemplate;
         },

         _getPropertyValue: function(itemContents, field) {
            return ItemsUtil.getPropertyValue(itemContents, field);
         },

         _getItemData: function(projItem, index) {
            return {};
         },

         _getGroupData: function() {
            var
               groupBy = this._options.groupBy,
               groupData;
            groupData = {
               multiselect : this._options.multiSelect,
               groupContentTemplate: groupBy.contentTemplate
            };
            return groupData;
         },

         _getGroupItem : function(groupId, item) {
            var groupData, groupTemplate;
            if (this._groupTemplate) {
               groupData = this._getGroupData();
               groupData.item = item;
               groupData.groupId = groupId;
               groupTemplate = this._groupTemplate
            }
            return {
               data : groupData,
               tpl : groupTemplate
            }
         },

         _createDefaultDisplay: function(items, cfg) {
            return ItemsUtil.getDefaultDisplayFlat(items, cfg)
         },


         /**
          * Метод получения проекции по hash итема
          */
         _getDisplayItemByHash: function(hash) {
            return this._display.getByHash(hash);
         },
   
         //<editor-fold desc='EventHandlers'>

         _onItemClick: function (evt) {
            //Method must be implemented
         },
         
   
         //</editor-fold>

         _prepareQueryParams: function() {
            return {
               filter: this._filter,
               sorting: this._sorting,
               limit: undefined,
               offset: undefined
            };
         },

         //<editor-fold desc='DataSourceMethods'>
         reload: function(options) {
            if (this._dataSource) {
               var
                  def,
                  self = this;

               this._cancelLoading();

               var queryParams = this._prepareQueryParams();

               var userParams = this._notify('onBeforeDataLoad', queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit);
               if (userParams) {
                  queryParams.filter = userParams['filter'] || queryParams.filter;
                  queryParams.sorting = userParams['sorting'] || queryParams.sorting;
                  queryParams.offset = userParams['offset'] || queryParams.offset;
                  queryParams.limit = userParams['limit'] || queryParams.limit;
               }
               //TODO решить с параметрами
               def = DataSourceUtil.callQuery(this._dataSource, this._options.idProperty, queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit)
                  .addCallback(fHelpers.forAliveOnly(function (list) {
                     self._notify('onDataLoad', list);
                     this._onDSReload(list, options);
                     return list;
                  }, self))
                  .addErrback(fHelpers.forAliveOnly(this._loadErrorProcess, self));
               this._loader = def;
            }
            else {
               throw new Error('Option dataSource is undefined. Can\'t reload view');
            }
         },

         loadPage: function(direction) {
            var def, self = this;
            if (this._dataSource) {
               var queryParams = this._prepareQueryParams(direction);
               def = DataSourceUtil.callQuery(this._dataSource, this._options.idProperty, queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit)
                  .addCallback(fHelpers.forAliveOnly(function (list) {
                     self._notify('onDataLoad', list);
                     this._onLoadPage(list, direction);
                     return list;
                  }, self))
                  .addErrback(fHelpers.forAliveOnly(this._loadErrorProcess, self));
               this._loader = def;
            }
            else {
               throw new Error('Option dataSource is undefined. Can\'t load page');
            }
         },

         _onLoadPage: function(list, direction) {
            if (direction == 'down') {
               this._items.append(list);
            }
         },

         _isLoading: function(){
            return this._loader && !this._loader.isReady();
         },

         _cancelLoading: function () {
            if (this._isLoading()) {
               this._loader.cancel();
            }
            this._loader = null;
         },

         _toggleIndicator: function () {
            /*Must be implemented*/
         },
         _onDSReload: function(list, options) {
            this._itemData = null;
            if (
               this._items && cInstance.instanceOfModule(this._items, 'WS.Data/Collection/RecordSet')
               && (list.getModel() === this._items.getModel())
               && (Object.getPrototypeOf(list).constructor == Object.getPrototypeOf(list).constructor)
               && (Object.getPrototypeOf(list.getAdapter()).constructor == Object.getPrototypeOf(this._items.getAdapter()).constructor)
               ) {
               this._items.setMetaData(list.getMetaData());
               this._items.assign(list);
               //this._drawItemsCallbackDebounce();
            } else {
               this._items = list;
               this._itemsChangeCallback(this._items, options);
            }
            this._toggleIndicator(false);
            //self._checkIdProperty();

            //this._dataLoadedCallback();
            //self._notify('onBeforeRedraw');
            return list;
         },
         //</editor-fold>

         destroy: function() {
            ItemsControl.superclass.destroy.apply(this, arguments);
            if (this._display) {
               this._display.destroy();
            }
         }
      });

   ItemsControl.getOptionTypes = function getOptionTypes(){
      return {
         dataSource: Types(ISource)
      }
   };

   return ItemsControl;
});