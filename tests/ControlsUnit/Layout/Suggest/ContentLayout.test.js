define(['Controls/_suggestPopup/Layer/__ContentLayer'], function(__ContentLayer) {

   describe('Controls._suggestPopup.Layer.__ContentLayer', function() {


      var getComponentObject = function() {
         var self = {};
         self._options = {};
         self._options.suggestTemplate = {};
         self._options.footerTemplate = {};
         return self;
      };

      var getContainer = function(size) {
         return {
            style: {height: ''},
            getBoundingClientRect: function() {
               return {
                  toJSON: function() {
                     return size;
                  }
               };
            }
         };
      };

      var getDropDownContainer = function(height) {
         return {
            getBoundingClientRect: function() {
               return {
                  bottom: 0,
                  top: 0,
                  height: height
               };
            }
         };
      };

      it('Suggest::close', function() {
         var suggestComponent = new __ContentLayer.default();
         var closed = false;

         suggestComponent._notify = function(event) {
            if (event === 'close') {
               closed = true;
            }
         };
         suggestComponent.close();
         assert.isTrue(closed);
      });

      it('Suggest::_getChildContext', function() {
         var suggestComponent = new __ContentLayer.default();
         var context;
         var afterUpdateContext;
         var contextFilterValue;
         var contextSearchValue;
         var afterUpdateFilterValue;
         var afterUpdateSearchValue;

         suggestComponent._options.filter = {test: 'test'};
         suggestComponent._options.searchValue = 'test';
         suggestComponent._beforeMount(suggestComponent._options);

         context = suggestComponent._getChildContext();
         contextFilterValue = context.filterLayoutField.filter;
         contextSearchValue = context.searchLayoutField.searchValue;

         var newOptions = {
            filter: {test: 'test2'},
            searchValue: 'test2'
         };
         suggestComponent._beforeUpdate(newOptions);

         afterUpdateContext = suggestComponent._getChildContext();
         afterUpdateFilterValue = afterUpdateContext.filterLayoutField.filter;
         afterUpdateSearchValue = afterUpdateContext.searchLayoutField.searchValue;

         assert.isTrue(contextFilterValue !== afterUpdateFilterValue);
         assert.isTrue(contextSearchValue !== afterUpdateSearchValue);
      });

      it('Suggest::_private.calcHeight', function() {
         var self = getComponentObject();
         var suggestHeight = 200;

         self._container = getContainer({
            top: 100,
            bottom: 0,
            get height() {
               return suggestHeight;
            }
         });
         self._options.target = getContainer({
            bottom: 324,
            top: 300
         });
         self._height = 'auto';
         assert.equal(__ContentLayer.default._private.calcHeight(self, getDropDownContainer(900)), 'auto');
         assert.equal(__ContentLayer.default._private.calcHeight(self, getDropDownContainer(400)), '300px');
         self._height = '76px';
         assert.equal(__ContentLayer.default._private.calcHeight(self, getDropDownContainer(900)), 'auto');
      });

      it('Suggest::_private.updateHeight', function() {
         var self = getComponentObject();
         self._height = '200px';
         self._forceUpdate = function() {};
         __ContentLayer.default._private.calcHeight = function() {
            return '400px';
         }
         __ContentLayer.default._private.updateHeight(self, false);
         assert.equal(self._height, '400px');
      });
   });

});
