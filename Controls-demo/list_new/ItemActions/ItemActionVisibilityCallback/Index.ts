import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/list_new/ItemActions/ItemActionVisibilityCallback/ItemActionVisibilityCallback"
import {Memory} from "Types/source"
import {Model} from "Types/entity"
import {getContactsCatalog as getData} from "../../DemoHelpers/DataCatalog"
import {getActionsForContacts as getItemActions} from "../../DemoHelpers/ItemActionsCatalog"
import {showType} from "Controls/Utils/Toolbar"
import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _itemActions = getItemActions();

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getData()
        });
    }

    private _itemActionVisibilityCallback(itemAction, item: Model) {

        if (itemAction.title === 'Позвонить') {
            return false;
        } else if (itemAction.showType === showType.MENU && itemAction.id === 6) {
            return false;
        }

        const itemId = item.getId();
        if ((itemId === 0 || itemId === 2) && (itemAction.showType === showType.MENU || itemAction.showType === showType.MENU_TOOLBAR)) {
            return false;
        }

        return true;
    }
}