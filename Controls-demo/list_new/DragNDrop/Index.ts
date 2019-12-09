import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/DragNDrop/DragNDrop';
import * as ListEntity from 'Controls-demo/DragNDrop/ListEntity';
import {Memory} from 'Types/source';
import {getFewCategories as getData} from '../DemoHelpers/DataCatalog';

import 'css!Controls-demo/Controls-demo';
import * as Dnd from "../../../Controls/dragnDrop";


export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _itemsReadyCallback = this._itemsReady.bind(this);
    private _selectedKeys = [];

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getData()
        });
    }

    private _itemsReady(items) {
        this._itemsFirst = items;
    }

    private _dragStart(event, items) {
        var firstItem = this._itemsFirst.getRecordById(items[0]);

        return new Dnd.ItemsEntity({
            items: items,
            title: firstItem.get('title'),
        });
    }
    private _dragEnd(_, entity, target, position): void {
        this._children.listMover.moveItems(entity.getItems(), target, position);
    }

}