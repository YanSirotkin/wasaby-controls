define('Controls/Controllers/QueryParamsController/Offset',
   ['Core/Abstract', 'WS.Data/Source/SbisService'],
   function(Abstract, SbisService) {
      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var OffsetNavigation = Abstract.extend({
         constructor: function(cfg) {
            this._options = cfg;
            OffsetNavigation.superclass.constructor.apply(this, arguments);

            if (!this._options.pageSize) {
               throw new Error ('Option pageSize is undefined in OffsetNavigation')
            }
         },

         prepareQueryParams: function(direction) {

         },

         calculateState: function(list, direction) {

         },

         hasMoreData: function(direction) {

         },

         prepareSource: function(source) {
            var options = source.getOptions();
            options.navigationType = SbisService.prototype.NAVIGATION_TYPE.OFFSET;
            source.setOptions(options);
         },

         setEdgeState: function(direction) {

         }
      });

      return OffsetNavigation;
   });


