import CollectionItem, {IOptions as ICollectionItemOptions} from './CollectionItem';
import {register} from 'Types/di';

interface IOptions<T> extends ICollectionItemOptions<T> {
}

/**
 * Элемент коллекции "Группа"
 * @class Controls/_display/GroupItem
 * @extends Controls/_display/CollectionItem
 * @public
 * @author Мальцев А.А.
 */
export default class GroupItem<T> extends CollectionItem<T> {
   /**
    * Развернута или свернута группа. По умолчанию развернута.
    */
   protected _$expanded: boolean;

   constructor(options?: IOptions<T>) {
      super(options);
      this._$expanded = !!this._$expanded;
   }

   /**
    * Возвращает признак, что узел развернут
    */
   isExpanded(): boolean {
      return this._$expanded;
   }

   /**
    * Устанавливает признак, что узел развернут или свернут
    * @param expanded Развернут или свернут узел
    * @param [silent=false] Не генерировать событие
    */
   setExpanded(expanded: boolean, silent?: boolean): void {
      if (this._$expanded === expanded) {
         return;
      }
      this._$expanded = expanded;
      if (!silent) {
         this._notifyItemChangeToOwner('expanded');
      }
   }

   /**
    * Переключает признак, что узел развернут или свернут
    */
   toggleExpanded(): void {
      this.setExpanded(!this.isExpanded());
   }
}

Object.assign(GroupItem.prototype, {
   '[Controls/_display/GroupItem]': true,
   _moduleName: 'Controls/display:GroupItem',
   _instancePrefix: 'group-item-',
   _$expanded: true
});

register('Controls/display:GroupItem', GroupItem);
