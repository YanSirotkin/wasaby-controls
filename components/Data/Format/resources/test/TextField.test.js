/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Format.TextField'
   ], function (TextField) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Format.TextField', function() {
         var field;

         beforeEach(function() {
            field = new TextField();
         });

         afterEach(function() {
            field = undefined;
         });

         describe('.getDefaultValue()', function() {
            it('should return an empty string by default', function() {
               assert.strictEqual(field.getDefaultValue(), '');
            });
         });
      });
   }
);
