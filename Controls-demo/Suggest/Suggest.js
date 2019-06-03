/**
 * Created by am.gerasimov on 13.04.2018.
 */
/**
 * Created by am.gerasimov on 13.12.2017.
 */
define('Controls-demo/Suggest/Suggest', [
   'Core/Control',
   'wml!Controls-demo/Suggest/Suggest',
   'Types/source',
   'Controls-demo/Search/SearchMemory',
   'Controls-demo/Utils/MemorySourceFilter',
   'Controls-demo/Utils/MemorySourceData',
   'css!Controls-demo/Suggest/Suggest'
], function(Control, template, source, SearchMemory, memorySourceFilter, MemorySourceData) {
   
   'use strict';
   
   var VDomSuggest = Control.extend({
      _template: template,
      _suggestDownValue: '',
      _suggestNoFooterValue: '',
      _suggestWithTabsValue: '',
      _suggestNoDataValue: '',
      _suggestCustomFooterValue: '',
      _suggestUpValue: '',

      constructor: function() {
         VDomSuggest.superclass.constructor.apply(this, arguments);

         this._companiesData = MemorySourceData.companies.slice();
         this._departmentsData = MemorySourceData.departments.concat([
            {id: 8, department: 'Разработка Сбис', owner: 'Новиков Д.В.', title: 'Разработка Сбис'},
            {id: 9, department: 'Разработка Ядра', owner: 'Новиков Д.В.', title: 'Разработка Ядра'}
         ]);

         this._departmentsData.forEach(function(companie) {
            companie.currentTab = 1;
         });
         this._companiesData.forEach(function(companie) {
            companie.currentTab = 2;
         });

         this._suggestTabSource = new SearchMemory({
            idProperty: 'id',
            data: this._companiesData.concat(this._departmentsData),
            searchParam: 'title',
            filter: memorySourceFilter()
         });
         this._suggestSource = new SearchMemory({
            idProperty: 'id',
            data: this._departmentsData,
            searchParam: 'title',
            filter: memorySourceFilter()
         });

         this._emptySource = new source.Memory({
            data: []
         });
      }
   });
   
   return VDomSuggest;
});