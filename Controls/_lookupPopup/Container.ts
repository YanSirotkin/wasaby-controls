import Control = require('Core/Control');
import template = require('tmpl!Controls/_lookupPopup/Container');
import ControllerContext = require('Controls/_lookupPopup/__ControllerContext');
import ContextOptions = require('Controls/Container/Data/ContextOptions');
import chain = require('Types/chain');
import Utils = require('Types/util');
import {Controller as SourceController} from 'Controls/source';
import selectionToRecord = require('Controls/Container/MultiSelector/selectionToRecord');
import Deferred = require('Core/Deferred');

/**
 *
 * Control _lookupPopup/Container
 *
 * @class Controls/_lookupPopup/Container
 * @extends Core/Control
 * @control
 * @public
 * @author Kraynov D.
 */

      var SELECTION_TYPES = ['all', 'leaf', 'node'];

      var _private = {
         getFilteredItems: function(items, filterFunc) {
            return chain.factory(items).filter(filterFunc).value();
         },

         getKeysByItems: function(items, keyProperty) {
            return chain.factory(items).reduce(function(result, item) {
               result.push(item.get(keyProperty));
               return result;
            }, []);
         },

         getFilterFunction: function(func) {
            return func ? func : function() {
               return true;
            };
         },

         getSelectedKeys: function(options, context) {
            var items = _private.getFilteredItems(context.selectorControllerContext.selectedItems, _private.getFilterFunction(options.selectionFilter));
            return _private.getKeysByItems(items, context.dataOptions.keyProperty);
         },

         getSourceController: function(source, navigation) {
            return new SourceController({
               source: source,
               navigation: navigation
            });
         },

         getEmptyItems: function(currentItems) {
            /* make clone and clear to save items format */
            var emptyItems = currentItems.clone();
            emptyItems.clear();
            return emptyItems;
         },

         getValidSelectionType: function(selectionType) {
            let type;

            if (SELECTION_TYPES.indexOf(selectionType) !== -1) {
               type = selectionType;
            } else {
               type = 'all'
            }

            return type;
         },

         prepareFilter: function(filter, selection, source, selectionType) {
            var adapter = source.getAdapter();
            filter.selection = selectionToRecord(selection, adapter, selectionType);
            return filter;
         },

         prepareResult: function(result, selectedKeys, keyProperty) {
            return {
               resultSelection: result,
               initialSelection: selectedKeys,
               keyProperty: keyProperty
            };
         }

      };

      var Container = Control.extend({

         _template: template,
         _selectedKeys: null,
         _selection: null,
         _excludedKeys: null,

         _beforeMount: function(options, context) {
            this._selectedKeys = _private.getSelectedKeys(options, context);
            this._excludedKeys = [];
            this._items = context.dataOptions.items;

            this._initialSelectedKeys = this._selectedKeys.slice();
         },

         _beforeUpdate: function(newOptions, context) {
            var currentSelectedItems = this.context.get('selectorControllerContext').selectedItems;
            var newSelectedItems = context.selectorControllerContext.selectedItems;

            if (currentSelectedItems !== newSelectedItems) {
               this._selectedKeys = _private.getSelectedKeys(newOptions, context);
            }
         },

         _selectComplete: function():void {
            const self = this;
            const dataOptions = this.context.get('dataOptions');
            const keyProperty = dataOptions.keyProperty;

            let loadDef;

            function prepareResult(result) {
               return _private.prepareResult(result, self._initialSelectedKeys, keyProperty);
            }

            if (this._selectedKeys.length || this._excludedKeys.length) {
               const source = dataOptions.source;
               const sourceController = _private.getSourceController(source, dataOptions.navigation);
               const selection = {
                  selected: this._selectedKeys,
                  excluded: this._excludedKeys
               };
               const filter = Utils.object.clone(dataOptions.filter);

               loadDef = sourceController.load(_private.prepareFilter(filter, selection, source, _private.getValidSelectionType(this._options.selectionType)));

               loadDef.addCallback(function(result) {
                  return prepareResult(result);
               });
            } else {
               loadDef = Deferred.success(prepareResult(_private.getEmptyItems(self._items)));
            }

            this._notify('selectionLoad', [loadDef], {bubbling: true});
         },

         _selectedKeysChanged: function(event, selectedKeys, added, removed) {
            this._notify('selectedKeysChanged', [selectedKeys, added, removed], {bubbling: true});
         }

      });

      Container.contextTypes = function() {
         return {
            selectorControllerContext: ControllerContext,
            dataOptions: ContextOptions
         };
      };

      Container._private = _private;

      export = Container;

