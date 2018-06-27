define('Controls-demo/EngineBrowser/Browser', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/EngineBrowser/Browser',
   'css!Controls-demo/EngineBrowser/Browser',
   'Controls/EngineBrowser',
   'tmpl!Controls-demo/EngineBrowser/resources/filterPanelAddItemsTemplate',
   'tmpl!Controls-demo/EngineBrowser/resources/filterPanelItemsTemplate'
], function(Control, Memory, template) {
   'use strict';

   var countries = [
      {key: 1, title: 'USA'},
      {key: 2, title: 'Russia'},
      {key: 3, title: 'UK'},
      {key: 4, title: 'Japan'},
      {key: 5, title: 'China'}
   ];

   var sourceData = [
      {id: 1, title: 'Sasha', country: 'USA'},
      {id: 2, title: 'Dmitry', country: 'Russia'},
      {id: 3, title: 'Andrey', country: 'UK'},
      {id: 4, title: 'Aleksey', country: 'China'},
      {id: 5, title: 'Sasha', country: 'UK'},
      {id: 6, title: 'Ivan', country: 'USA'},
      {id: 7, title: 'Petr', country: 'Japan'},
      {id: 8, title: 'Roman', country: 'China'},
      {id: 9, title: 'Maxim', country: 'Japan'},
      {id: 10, title: 'Andrey', country: 'UK'},
      {id: 12, title: 'Sasha', country: 'Russia'},
      {id: 13, title: 'Sasha', country: 'Japan'},
      {id: 14, title: 'Sasha', country: 'USA'},
      {id: 15, title: 'Sasha', country: 'Japan'},
      {id: 16, title: 'Sasha', country: 'Japan'},
      {id: 17, title: 'Sasha', country: 'Russia'},
      {id: 18, title: 'Dmitry', country: 'UK'},
      {id: 19, title: 'Andrey', country: 'USA'},
      {id: 20, title: 'Aleksey', country: 'China'},
      {id: 21, title: 'Sasha', country: 'Russia'},
      {id: 22, title: 'Ivan', country: 'USA'},
      {id: 23, title: 'Petr', country: 'USA'}
   ];

   var items = [
      {
         id: 'title',
         value: 'Sasha',
         resetValue: '',
         textValue: 'Name',
         source: new Memory({
            idProperty: 'id',
            data: sourceData
         }),
         visibility: true
      },
      {
         id: 'FIO',
         value: '',
         resetValue: '',
         textValue: 'FIO',
         visibility: true
      },
      {
         id: 'country',
         value: ['USA'],
         resetValue: ['USA'],
         textValue: 'country',
         visibility: false,
         source: new Memory({
            idProperty: 'title',
            data: countries
         })
      }
   ];

   var ModuleClass = Control.extend(
      {
         _template: template,

         _source: new Memory({
            idProperty: 'id',
            data: sourceData
         }),

         _items: items
      });
   return ModuleClass;
});
