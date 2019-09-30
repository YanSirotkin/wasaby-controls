import CoreExtend = require('Core/core-extend');
import entity = require('Types/entity');
import source = require('Types/source');
import Constants = require('Controls/_history/Constants');
import Deferred = require('Core/Deferred');
import coreClone = require('Core/core-clone');
import Env = require('Env/Env');

var STORAGES = {};
var STORAGES_USAGE = {};
var STORAGES_DATA_LOAD = {};

var _private = {
   getHistoryDataSource: function (self) {
      if (!self._historyDataSource) {
         self._historyDataSource = new source.SbisService({
            endpoint: {
               address: '/input-history/service/',
               contract: 'InputHistory'
            }
         });
      }
      return self._historyDataSource;
   },

   getMethodNameByIdType: function (stringMethod, intMethod, id) {
      return typeof id === 'number' ? intMethod : stringMethod;
   },

   updateHistory: function (self, data, meta) {
      if (meta.parentKey) {
         _private.getHistoryDataSource(self).call('AddHierarchy', {
            history_id: self._historyId,
            parent1: meta.parentKey,
            id: data.id
         });
      } else if (data.ids) {
         _private.getHistoryDataSource(self).call(_private.getMethodNameByIdType('AddList', 'AddIntList', data.ids[0]), {
            history_id: self._historyId,
            ids: data.ids,
            history_context: null
         });
      } else {
         var id = data.getId();
         _private.getHistoryDataSource(self).call(_private.getMethodNameByIdType('Add', 'AddInt', id), {
            history_id: data.get('HistoryId') || self._historyId,
            id: id,
            history_context: null
         });
      }
   },

   addFromData: function (self, data) {
      return _private.getHistoryDataSource(self).call('AddFromData', {
         history_id: self._historyId,
         data: data
      });
   },

   updatePinned: function (self, data, meta) {
      var id = data.getId();
      _private.getHistoryDataSource(this).call(_private.getMethodNameByIdType('SetPin', 'SetIntPin', id), {
         history_id: data.get('HistoryId') || self._historyId,
         id: id,
         history_context: null,
         pin: !!meta['$_pinned']
      });
   },

   incrementUsage: function (self) {
      if (!STORAGES_USAGE[self._historyId]) {
         STORAGES_USAGE[self._historyId] = 0;
      }
      STORAGES_USAGE[self._historyId]++;
   },

   decrementUsage: function (self) {
      STORAGES_USAGE[self._historyId]--;
      if (STORAGES_USAGE[self._historyId] === 0) {
         delete STORAGES[self._historyId];
      }
   }
};

/**
 * Источник, который работает с <a href="/doc/platform/developmentapl/middleware/input-history-service/">сервисом истории ввода</a>.
 *
 * @class Controls/_history/Service
 * @extends Core/core-extend
 * @implements Types/_source/ICrud
 * @mixes Types/_entity/OptionsToPropertyMixin
 * @public
 * @author Герасимов А.М.
 * @example
 * <pre>
 *    new history.Service({
 *       historyId: 'TEST_HISTORY_ID'
 *    })
 * </pre>
 */

/*
 * Source working with the service of InputHistory
 *
 * @class Controls/_history/Service
 * @extends Core/core-extend
 * @implements Types/_source/ICrud
 * @mixes Types/_entity/OptionsToPropertyMixin
 * @public
 * @author Герасимов А.М.
 * @example
 * <pre>
 *    new historyService({
 *       historyId: 'TEST_HISTORY_ID'
 *    })
 * </pre>
 */ 

/**
 * @name Controls/_history/Service#historyId
 * @cfg {String} Уникальный идентификатор <a href="/doc/platform/developmentapl/middleware/input-history-service/">сервиса истории</a>.
 */

/*
 * @name Controls/_history/Service#historyId
 * @cfg {String} unique service history identifier
 */ 

/**
 * @name Controls/_history/Service#historyIds
 * @cfg {Array of String} Уникальные идентификаторы <a href="/doc/platform/developmentapl/middleware/input-history-service/">сервиса истории</a>.
 */

/*
 * @name Controls/_history/Service#historyIds
 * @cfg {Array of String} unique service history identifiers
 */ 

/**
 * @name Controls/_history/Service#pinned
 * @cfg {Boolean} Загружает закрепленные записи из БЛ.
 * @remark
 * true - Load items
 * false - No load items
 */

/*
 * @name Controls/_history/Service#pinned
 * @cfg {Boolean} Loads pinned items from BL
 * @remark
 * true - Load items
 * false - No load items
 */ 

/**
 * @name Controls/_history/Service#frequent
 * @cfg {Boolean} Загружает наиболее часто выбираемые записи из БЛ.
 * @remark
 * true - Load items
 * false - No load items
 */

/*
 * @name Controls/_history/Service#frequent
 * @cfg {Boolean} Loads frequent items from BL
 * @remark
 * true - Load items
 * false - No load items
 */ 

/**
 * @name Controls/_history/Service#recent
 * @cfg {Boolean} Загружает последние записи из БЛ.
 * @remark
 * true - Load items
 * false - No load items
 */

/*
 * @name Controls/_history/Service#recent
 * @cfg {Boolean} Loads recent items from BL
 * @remark
 * true - Load items
 * false - No load items
 */ 

/**
 * @name Controls/_history/Service#dataLoaded
 * @cfg {Boolean} Записи, загруженные с данными объекта.
 * @remark
 * true - БЛ вернет записи с данными.
 * false - Бл вернет записи без данных.
 */

/*
 * @name Controls/_history/Service#dataLoaded
 * @cfg {Boolean} Items loaded with object data
 * @remark
 * true - BL return items with data
 * false - BL return items without data
 */ 

var Service = CoreExtend.extend([source.ICrud, entity.OptionsToPropertyMixin, entity.SerializableMixin], {
   _historyDataSource: null,
   _historyId: null,
   _historyIds: null,
   _pinned: null,
   _frequent: null,
   _dataLoaded: false,

   constructor: function Memory(cfg) {
      if (!cfg.historyId && !cfg.historyIds) {
         throw new Error('"historyId" not found in options.');
      }
      this._historyId = cfg.historyId;
      this._historyIds = cfg.historyIds;
      this._pinned = cfg.pinned;
      this._frequent = cfg.frequent;
      this._recent = cfg.recent;
      this._dataLoaded = cfg.dataLoaded;
   },

   update: function (data, meta) {
      if (meta.hasOwnProperty('$_addFromData')) {
         return _private.addFromData(this, data);
      }
      if (meta.hasOwnProperty('$_pinned')) {
         _private.updatePinned(this, data, meta);
      }
      if (meta.hasOwnProperty('$_history')) {
         _private.updateHistory(this, data, meta);
      }

      return {};
   },

   query(): Deferred<source.DataSet> {
      const self = this;
      const historyId = self._historyId;

      let resultDef;

      if (STORAGES_DATA_LOAD[historyId] && !Env.constants.isBuildOnServer) {
         resultDef = new Deferred();
         // create new deferred, so in the first callback function, the result of the query will be changed
         STORAGES_DATA_LOAD[historyId].addCallback(() => {
            resultDef.callback(self.getHistory(historyId));
         });
      } else if (!STORAGES[historyId] || Env.constants.isBuildOnServer) {
         resultDef = _private.getHistoryDataSource(this).call('UnionMultiHistoryIndexesList', {
            params: {
               historyIds: historyId ? [historyId] : this._historyIds,
               pinned: {
                  count: this._pinned ? Constants.MAX_HISTORY : 0
               },
               frequent: {
                  count: this._frequent ? (Constants.MAX_HISTORY - Constants.MIN_RECENT) : 0
               },
               recent: {
                  count: this._recent || Constants.MAX_HISTORY
               },
               getObjectData: this._dataLoaded
            }
         });

         // необходимо кэшировать запрос только на клиенте
         // на сервере возможны проблемы при посторении страниц, т.к. объект глобальный,
         // как минимум, стэк очистится от вызова сборщика мусора
         // https://online.sbis.ru/opendoc.html?guid=37eb3bdd-19b1-4b36-b889-92e798fc2cf7
         if (!Env.constants.isBuildOnServer) {
            STORAGES_DATA_LOAD[historyId] = resultDef;
         }

         resultDef.addCallback((res) => {
            delete STORAGES_DATA_LOAD[historyId];
            return res;
         });
      } else {
         resultDef = Deferred.success(new source.DataSet({
            rawData: self.getHistory(historyId)
         }));
      }
      _private.incrementUsage(this);
      return resultDef;
   },

   destroy(keys: number|string|Array<number|string>): Deferred<null> {
      let  result;

      if (keys) {
         const key = keys instanceof Array ? keys[0] : keys;
         result = _private.getHistoryDataSource(this).call('Delete', {
            params: {
               history_id: this._historyId,
               object_id: key
            }
         });
      } else {
         result = Deferred.success(null);
      }

      _private.decrementUsage(this);
      return result;
   },

   /**
    * Returns a service history identifier
    * @returns {String}
    */
   getHistoryId: function () {
      return this._historyId;
   },

   /**
    * Save new history
    */
   saveHistory: function (historyId, newHistory) {
      STORAGES[historyId] = coreClone(newHistory);
   },

   /**
    * Returns a set of history items
    * @returns {Object}
    */
   getHistory: function (historyId) {
      return STORAGES[historyId];
   }
});

Service._private = _private;
export = Service;
