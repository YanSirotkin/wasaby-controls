/* global define */
define('js!SBIS3.CONTROLS.ListControl.CommonHandlers',[], function() {
   'use strict';
   
   var CommonHandlers = {
      deleteRecords: function(hashArray) {
         var
            isArray = Array.isArray(hashArray),
            message = isArray && hashArray.length !== 1 ? "Удалить записи?" : "Удалить текущую запись?",
            self = this;

         return $ws.helpers.question(message).addCallback(function(res) {
            if(!res) {
               return;
            }
            
            var hashes = isArray ? hashArray : [hashArray];
            for (var i = 0; i < hashes.length; i++) {
               var item = self.getItems().getByHash(hashes[i]),
                   contents = item.getContents();
               self.getItems().remove(item);
               
               try {
                  if ($ws.helpers.instanceOfModule(contents, 'SBIS3.CONTROLS.Data.Model')) {
                     contents.remove();
                  }
               } catch (e) {
                  console.error(e);
               }
            }
         })
      }
   };
   return CommonHandlers;
});
