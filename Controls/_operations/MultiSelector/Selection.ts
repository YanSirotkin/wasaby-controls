import {default as ArraySimpleValuesUtil} from 'Controls/Utils/ArraySimpleValuesUtil';
import FlatSelectionStrategy from 'Controls/_operations/MultiSelector/SelectionStrategy/Flat';

type TKeys = number[] | string[];
/**
 * @class Controls/_operations/MultiSelector/Selection
 * @extends Core/core-simpleExtend
 * @author Авраменко А.С.
 * @private
 */

/**
 * @name Controls/_operations/MultiSelector/Selection#selectedKeys
 * @cfg {Array} Array of selected items' keys.
 * @variant [null] Everything selected.
 * @variant [] Nothing selected.
 */

/**
 * @name Controls/_operations/MultiSelector/Selection#excludedKeys
 * @cfg {Array} Array of keys for items that should be excluded from the selection.
 */

/**
 * @name Controls/_operations/MultiSelector/Selection#keyProperty
 * @cfg {String|Number} Name of the item property that uniquely identifies collection item.
 */

const ALL_SELECTION_VALUE = null;

class Selection {
   protected _selectionStrategy: FlatSelectionStrategy;
   protected _listModel;
   protected _keyProperty: string;
   protected _items;
   protected _selectedKeys: TKeys = [];
   protected _excludedKeys: TKeys = [];
   protected _limit: number = 0;

   public get selectedKeys(): TKeys {
      return this._selectedKeys;
   }

   public set selectedKeys(keys: TKeys): void {
      this._selectedKeys = keys;
   }

   public get excludedKeys(): TKeys {
      return this._excludedKeys;
   }

   public set excludedKeys(keys: TKeys): void {
      this._excludedKeys = keys;
   }

   constructor(options: Object): void {
      this._listModel = options.listModel;
      this._keyProperty = options.keyProperty;
      this._selectedKeys = options.selectedKeys.slice();
      this._excludedKeys = options.excludedKeys.slice();
      this._items = options.items;
      this._selectionStrategy = options.selectionStrategy;
   }

   /**
    * Add keys to selection.
    * @param {Array} keys Keys to add to selection.
    */
   public select(keys: TKeys): void {
      let selection: ISelection = this._selectionStrategy.select(keys, this._selectedKeys, this._excludedKeys);

      if (this._limit && keys.length === 1 && !this._excludedKeys.includes(keys[0])) {
         this._increaseLimit(keys.slice());
      }

      this._selectedKeys = selection.selectedKeys;
      this._excludedKeys = selection.excludedKeys;
   }

   /**
    * Remove keys from selection.
    * @param {Array} keys Keys to remove from selection.
    */
   public unselect(keys: TKeys): void {
      let selection: ISelection = this._selectionStrategy.unSelect(keys, this._selectedKeys, this._excludedKeys);

      this._selectedKeys = selection.selectedKeys;
      this._excludedKeys = selection.excludedKeys;
   }

   /**
    * Delete keys from anywhere.
    * @param {Array} keys Keys to remove.
    */
   public remove(keys: TKeys): void {
      this._excludedKeys = ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, keys);
      this._selectedKeys = ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, keys);
   }

   /**
    * Select all items.
    * @remark Sets selectedKeys to [null].
    */
   public selectAll(): void {
      this._selectedKeys = [ALL_SELECTION_VALUE];

      // При выборе "Отметить все" лимит не передается, а предыдущий установленный сбрасывается раньше вызова selectAll,
      // в этом случае массив с исключениями всегда будут очищаться.
      if (!this._limit) {
         this._excludedKeys = [];
      }
   }

   /**
    * Remove selection from all items.
    */
   public unselectAll(): void {
      this._selectedKeys = [];
      this._excludedKeys = [];
   }

   /**
    * Invert selection.
    */
   public toggleAll(): void {
      if (this._selectionStrategy.isAllSelected()) {
         let excludedKeys: TKeys = this._excludedKeys.slice();
         this.unselectAll();
         this.select(excludedKeys);
      } else {
         let selectedKeys: TKeys = this._selectedKeys.slice();
         this.selectAll();
         this.unselect(selectedKeys);
      }
   }

   /**
    * Sets limit.
    * @param {Number} value
    */
   public setLimit(value: number): void {
      this._limit = value;
   }

   /**
    * Set items which will be used to calculate selectedKeys for render.
    * @param {Types/collection:RecordSet} items
    */
   public setItems(items): void {
      this._items = items;
      this.updateSelectionForRender();
   }

   /**
    * Returns the number of selected items.
    * @returns {number}
    */
   public getCount(): Promise {
      return this._selectionStrategy.getCount(this._selectedKeys, this._excludedKeys, this._items, this._limit);
   }

   /**
    * Transforms selection to single array of selectedKeys and returns it. Used for rendering checkboxes in lists.
    * @returns {Object}
    */
   public updateSelectionForRender(): void {
      let
         selectionResult: Object = {},
         selectedItemsCount: number = 0,
         limit: number = this._limit ? this._limit - this._excludedKeys.length : 0;

      this._items.forEach((item) => {
         let isSelected: boolean = (!limit || selectedItemsCount < limit) &&
            this._selectionStrategy.isSelected(item, this._selectedKeys, this._excludedKeys, this._keyProperty);

         isSelected && selectedItemsCount++;
         selectionResult[item.get(this._keyProperty)] = isSelected;
      });

      this._listModel.updateSelection(selectionResult);
   }

   public setListModel(listModel): void {
      this._listModel = listModel;
      this.updateSelectionForRender();
   }

   /**
    * Increases the limit on the number of selected items, placing all other unselected in excluded list
    * Увеличивает лимит на количество выбранных записей, все предыдущие невыбранные записи при этом попадают в исключение
    * @param {Array} keys
    * @private
    */
   protected _increaseLimit(keys: TKeys): void {
      let
         selectedItemsCount: number = 0,
         limit: number = this._limit ? this._limit - this._excludedKeys.length : 0;

      this._items.forEach((item) => {
         let key: string|number = item.get(this._keyProperty);
         let isSelected: boolean = this._selectionStrategy.isSelected(item, this._selectedKeys, this._excludedKeys, this._keyProperty);

         if (selectedItemsCount < limit && isSelected !== false) {
            selectedItemsCount++;
         } else if (selectedItemsCount >= limit && keys.length) {
            selectedItemsCount++;
            this._limit++;

            if (keys.includes(key)) {
               keys.splice(keys.indexOf(key), 1);
            } else {
               this._excludedKeys.push(key);
            }
         }
      });
   }
}

export default Selection;
