/**
 * Модуль возвращает метод, с помощью которого можно запросить данные с учетом фильтрации.
 * @class Controls/_dataSource/requestDataUtil
 * @author Сухоручкин А.С.
 */

import {Controller as SourceController} from 'Controls/source';
import {Controller as FilterController} from 'Controls/filter';
import {RecordSet} from 'Types/collection';
import {SbisService} from 'Types/source';

type HistoryItems = object[];

interface IFilter {
   filter: Record<string, unknown>;
   historyItems: HistoryItems;
}
export interface IRequestDataResult {
   data: RecordSet;
   historyItems?: HistoryItems;
}

export interface ISourceConfig {
   source: SbisService;
   filterButtonSource?: SbisService;
   fastFilterSource?: SbisService;
   navigation?: object;
   historyId?: string;
   filter?: object;
   sorting?: object;
   historyItems?: HistoryItems;
}

export default function requestDataUtil(cfg: ISourceConfig): Promise<IRequestDataResult> {
   const sourceController = new SourceController({
      source: cfg.source,
      navigation: cfg.navigation
   });

   if (cfg.historyId && cfg.filterButtonSource && cfg.fastFilterSource && cfg.filter) {
      // Load filter, then load data
      return FilterController.getCalculatedFilter(cfg).then((filterObject: IFilter) => {
         return sourceController.load(filterObject.filter, cfg.sorting).then((data: RecordSet) => {
            return {
               data,
               historyItems: filterObject.historyItems
            };
         });
      });
   } else {
      return sourceController.load(cfg.filter, cfg.sorting).then((data: RecordSet) => {
         return {
            data
         };
      });
   }
}