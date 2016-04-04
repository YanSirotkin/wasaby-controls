/**
 * @author Быканов А.А.
 */
define('js!SBIS3.CONTROLS.Demo.FieldLinkDemo', // Устанавливаем имя, по которому демо-компонент будет доступен в других компонентах
   [ // Массив зависимостей компонента
      'js!SBIS3.CORE.CompoundControl', // Подключаем базовый класс, от которого далее будем наследоваться
      'html!SBIS3.CONTROLS.Demo.FieldLinkDemo', // Подключаем вёрстку демо-компонента
      'js!SBIS3.CONTROLS.Data.Source.Memory', // Подключаем класс для работы со статическим источником данных
      'css!SBIS3.CONTROLS.Demo.FieldLinkDemo', // Подключаем CSS-файл демо-компонента
      'js!SBIS3.CONTROLS.FieldLink', // Подключаем контрол поля связи
      'js!SBIS3.CONTROLS.DataGridView' // Подключаем контрол табличного представления данных, используется для построения автодополнения
   ],
   function( // Подключенные в массиве зависимостей файлы будут доступны в следующих переменных
      CompoundControl, // В эту переменную импортируется класс CompoundControl из файла CompoundControl.module.js
      dotTplFn, // В эту переменную импортируется вёрстка демо-компонента из файла FieldLinkDemo.xhtml
      Memory // В эту переменную импортируется класс для работы со статическим источником данных
   ){
      var moduleClass = CompoundControl.extend({ // Наследуемся от базового компонента
         _dotTplFn: dotTplFn, // Устанавливаем шаблон, по которому будет построен демо-компонент
         $constructor: function() {
            this.getContext().setValue({ // Предустановим значения в контекст, используеются для подпримера № 3
               НазваниеПолеСвязи: 'Технический писатель', // Значение, которое по умолчанию будет использовано в качестве отображаемого значения
               КлючПолеСвязи: '123' // Значение, которое по умолчанию будет использовано в качестве ключа
            })
         },
         init: function() { // Инициализация компонента, здесь все дочерние компоненты готовы к использованию
            moduleClass.superclass.init.call(this); // Обязательная конструкция, чтобы корректно работал указатель this
            var myData = [ // Создаём "сырые" данные, из которых потом будет создан статический источник
                   {'Ид': 1, 'Название': 'Инженер-программист'},
                   {'Ид': 2, 'Название': 'Руководитель группы'},
                   {'Ид': 3, 'Название': 'Менеджер'},
                   {'Ид': 4, 'Название': 'Тестировщик'},
                   {'Ид': 5, 'Название': 'Технолог'},
                   {'Ид': 6, 'Название': 'Бухгалтер'}
                ],
                dataSource = new Memory({ // Производим инициализацию статического источника данных
                   data: myData, // Передаём наши данные в качестве исходных для будущих записей
                   idProperty: 'Ид' // Устанавливаем поле первичного ключа
                });
            this.getChildControlByName('FieldLinkMultiSelect').setDataSource(dataSource); // Устанавливаем источник данных для контрола
         }
      });
      return moduleClass;
   }
);