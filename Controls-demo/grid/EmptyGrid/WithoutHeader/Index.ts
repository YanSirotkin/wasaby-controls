import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/grid/EmptyGrid/WithoutHeader/WithoutHeader"
import {Memory} from "Types/source"
import {getCountriesStats} from "../../DemoHelpers/DataCatalog"

import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns = getCountriesStats().getColumnsWithoutWidths();

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: []
        });
    }
}