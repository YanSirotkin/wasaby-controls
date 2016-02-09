/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
      'js!SBIS3.CONTROLS.Data.Collection.List',
      'js!SBIS3.CONTROLS.Data.Bind.ICollection',
      'js!SBIS3.CONTROLS.Data.Model',
      'js!SBIS3.CONTROLS.Data.Source.Memory',
      'js!SBIS3.CONTROLS.Data.Adapter.Json'
   ], function (RecordSet, List, IBindCollection, Model, MemorySource, JsonAdapter) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Collection.RecordSet', function() {
         var rs,
            items,
            getItems = function() {
               return [{
                  'Ид': 1,
                  'Фамилия': 'Иванов'
               }, {
                  'Ид': 2,
                  'Фамилия': 'Петров'
               }, {
                  'Ид': 3,
                  'Фамилия': 'Сидоров'
               }, {
                  'Ид': 4,
                  'Фамилия': 'Пухов'
               }, {
                  'Ид': 5,
                  'Фамилия': 'Молодцов'
               }, {
                  'Ид': 6,
                  'Фамилия': 'Годолцов'
               }, {
                  'Ид': 7,
                  'Фамилия': 'Арбузнов'
               }];
            };

         beforeEach(function() {
            items = getItems();
            rs = new RecordSet({
               rawData: getItems()
            });
         });

         afterEach(function() {
            items = undefined;
         });

         describe('.$constructor()', function () {
            it('should take limited time', function() {
               this.timeout(5000);

               var testFor = function(factory) {
                     var start = Date.now(),
                        obj;
                     obj = factory(getItems());
                     obj = undefined;
                     return Date.now() - start;
                  },
                  getItems = function() {
                     var items = [],
                        item,
                        i,
                        j;
                     for (i = 0; i < count; i++) {
                        item = {};
                        for (j = 0; j < fields; j++) {
                           item['f' + j] = j;
                        }
                        items.push(item);
                     }
                     return items;
                  },
                  count = 10000,
                  fields = 100;

               var mine = testFor(function(items) {
                     return new RecordSet({
                        rawData: items
                     });
                  }),
                  native = testFor(function(items) {
                     var arr = [],
                        i;
                     for (i = 0; i < items.length; i++) {
                        arr.push(items[i]);
                     }
                     return arr;
                  }),
                  rel = mine / native;
               if (window) {
                  window.console.log('RecordSet batch creating: ' + [mine, native, rel].join(', '));
               }
               assert.isBelow(rel, 5);
            });
         });

         describe('.isEqual()', function () {
            it('should accept an invalid argument', function () {
               var rs = new RecordSet();
               assert.isFalse(rs.isEqual());
               assert.isFalse(rs.isEqual(null));
               assert.isFalse(rs.isEqual(false));
               assert.isFalse(rs.isEqual(true));
               assert.isFalse(rs.isEqual(0));
               assert.isFalse(rs.isEqual(1));
               assert.isFalse(rs.isEqual({}));
               assert.isFalse(rs.isEqual([]));
            });
            it('should return true for the same recordset', function () {
               var same = new RecordSet({
                  rawData: getItems()
               });
               assert.isTrue(rs.isEqual(same));
            });
            it('should return true for itself', function () {
               assert.isTrue(rs.isEqual(rs));
            });
            it('should return true for the clone', function () {
               assert.isTrue(rs.isEqual(rs.clone()));
            });
            it('should return true for empties', function () {
               var rs = new RecordSet();
               assert.isTrue(rs.isEqual(new RecordSet()));
            });
            it('should return false if record added', function () {
               var same = new RecordSet({
                  rawData: getItems()
               });
               same.add(rs.at(0).clone());
               assert.isFalse(rs.isEqual(same));
            });
            it('should return true if same record replaced', function () {
               var same = new RecordSet({
                  rawData: getItems()
               });
               same.replace(rs.at(0).clone(), 0);
               assert.isTrue(rs.isEqual(same));
            });
            it('should return false if not same record replaced', function () {
               var same = new RecordSet({
                  rawData: getItems()
               });
               same.replace(rs.at(1).clone(), 0);
               assert.isFalse(rs.isEqual(same));
            });
            it('should return false if record removed', function () {
               var same = new RecordSet({
                  rawData: getItems()
               });
               same.removeAt(0);
               assert.isFalse(rs.isEqual(same));
            });
            it('should return false if record updated', function () {
               var same = new RecordSet({
                  rawData: getItems()
               });
               same.at(0).set('Фамилия', 'Aaa');
               assert.isFalse(rs.isEqual(same));
            });
         });

         describe('.append()', function() {
            it('should change raw data', function() {
               var rd = [{
                  'Ид': 50,
                  'Фамилия': '50'
               }, {
                  'Ид': 51,
                  'Фамилия': '51'
               }];
               rs.append(new RecordSet({
                  rawData: rd
               }));
               Array.prototype.push.apply(items,rd);
               assert.deepEqual(rs.getRawData(), items);
               assert.deepEqual(rs.getCount(), items.length);
               $ws.helpers.forEach(items, function (item, i) {
                  assert.deepEqual(rs.at(i).getRawData(), item);
               });
            });

         });

         describe('.prepend', function (){
            it('should change raw data', function() {
               var rd = [{
                  'Ид': 50,
                  'Фамилия': '50'
               }, {
                  'Ид': 51,
                  'Фамилия': '51'
               }];
               rs.prepend(new RecordSet({
                  rawData: rd
               }));
               Array.prototype.splice.apply(items,([0, 0].concat(rd)));
               assert.deepEqual(rs.getRawData(), items);
               assert.deepEqual(rs.getCount(), items.length);
               $ws.helpers.forEach(items, function (item, i) {
                  assert.deepEqual(rs.at(i).getRawData(), item);
               });
            });
         });

         describe('.assign()', function() {
            it('should change raw data and count', function() {
               var rs = new RecordSet({
                     rawData: [{id: 1}, {id: 2}, {id: 3}]
                  }),
                  data4 = {id: 4},
                  data5 = {id: 5};

               rs.assign([new Model({
                  rawData: data4
               }), new Model({
                  rawData: data5
               })]);
               assert.deepEqual(rs.getRawData()[0], data4);
               assert.deepEqual(rs.getRawData()[1], data5);
               assert.deepEqual(rs.at(0).getRawData(), data4);
               assert.deepEqual(rs.at(1).getRawData(), data5);
               assert.strictEqual(rs.getCount(), 2);
            });
         });

         describe('.clear()', function() {
            it('should change raw data', function() {
               rs.clear();
               assert.deepEqual(rs.getRawData(), []);
            });
         });

         describe('.add()', function() {
            it('should change raw data', function() {
               var rd = {
                     'Ид': 502,
                     'Фамилия': '502'
                  },
                  addItem = new Model({
                     rawData: rd
                  });
               rs.add(addItem);
               items.push(rd);
               assert.deepEqual(rs.getRawData(), items);
            });
         });

         describe('.removeAt()', function() {
            it('should change raw data', function() {
               rs.removeAt(0);
               assert.deepEqual(rs.getRawData(), items.slice(1));
            });

         });

         describe('.replace()', function() {
            it('should change raw data', function() {
               var rd = {
                     'Ид': 50,
                     'Фамилия': '50'
                  },
                  newItem = new Model({rawData: rd});
               rs.replace(newItem, 0);
               items[0] = rd;
               assert.deepEqual(rs.getRawData(), items);
            });
         });

         describe('.getIndex()', function (){
            it('should return an index of given item', function() {
               for (var i = 0; i < items.length; i++){
                  assert.equal(i, rs.getIndex(rs.at(i)));
               }
            });
         });

         describe('.saveChanges()', function (){
            it('should return an index of given item', function(done) {
               var source = new MemorySource({
                  data: getItems(),
                  idProperty: 'Ид'
               });
               source.query().addCallback(function(ds){
                  var rs = ds.getAll(),
                     length = rs.getCount(),
                     item_2 = $ws.core.clone(rs.at(0));
                  rs.at(2).setDeleted(true);
                  rs.at(6).setDeleted(true);
                  rs.saveChanges(source);
                  assert.equal(rs.getCount(), length-2);
                  assert.notDeepEqual(item_2, rs.at(2));
                  done();
               });
            });
         });

      });
   }
);
