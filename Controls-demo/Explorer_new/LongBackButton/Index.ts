import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/Explorer_new/LongBackButton/LongBackButton';
import {DataWithLongFolderName} from '../DataHelpers/DataCatalog';
import * as MemorySource from 'Controls-demo/Explorer/ExplorerMemory';

import 'css!Controls-demo/Controls-demo';

export default class extends Control {
   protected _template: TemplateFunction = Template;
   protected _viewSource;
   protected _columns = DataWithLongFolderName.getColumns();
   protected _viewMode: string = 'table';
   protected _root = 1;

   protected _beforeMount() {
      this._viewSource = new MemorySource({
         keyProperty: 'id',
         data: DataWithLongFolderName.getData()
      });
   }
}
