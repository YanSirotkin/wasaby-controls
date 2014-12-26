/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSourceBL', ['js!SBIS3.CONTROLS.IDataSource', 'js!SBIS3.CONTROLS.DataSet'], function (IDataSource, DataSet) {
   'use strict';
   return IDataSource.extend({
      $protected: {
         _options: {
            queryMethodName: 'Список',
            destroyMethodName: 'Удалить'
         },
         _BL: undefined
      },
      $constructor: function (cfg) {
         this._BL = new $ws.proto.ClientBLObject(cfg);
      },

      create: function () {

      },

      read: function (pk) {

      },

      update: function (record) {

      },

      destroy: function (pk) {

      },

      query: function (filter, sorting, offset, limit) {

         var self = this,
            def = new $ws.proto.Deferred();

         self._BL.call(self._options.queryMethodName, {'ДопПоля': [], 'Фильтр': {'d': [], 's': []}, 'Сортировка': null, 'Навигация': null}, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback(function (res) {

            var DS = new DataSet({
               strategy: 'DataStrategyBL',
               dataSource: self,
               data: res
            });

            console.log(DS);
            def.callback(DS);

         });

         return def;

      }

   });
});