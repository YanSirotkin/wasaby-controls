define('js!SBIS3.CONTROLS.DOCS.AutoAddHierarchy', // Устанавливаем имя, по которому будет доступен демо-компонент в других компонентах
   [ // Массив зависимостей компонента
      'js!SBIS3.CORE.CompoundControl', // Подключаем базовый компонент, от которого далее будем наследовать свой демо-компонент
      'html!SBIS3.CONTROLS.DOCS.AutoAddHierarchy', // Подключаем вёрстку демо-компонента
      'js!SBIS3.CONTROLS.DOCS.AutoAddHierarchy/resources/exampleSource', // Подключаем класс для работы с источником данных. Этот источник - статический, создан только для демо-примеров на wi.sbis.ru
      'js!SBIS3.CONTROLS.TreeDataGridView', // Подключаем контрол иерархического представления данных (список)
      'js!SBIS3.CONTROLS.TextBox', // Подключаем контрол, который будем использовать в качестве редактора
      'html!SBIS3.CONTROLS.DOCS.AutoAddHierarchy/resources/footerTpl', // Подключаем шаблон футера для всего представления данных
      'html!SBIS3.CONTROLS.DOCS.AutoAddHierarchy/resources/folderFooterTpl', // Подключаем шаблон футера для узлов иерархии
      'js!SBIS3.CONTROLS.Link' // Подключаем контрол кнопки, которая используется в футере
   ],
   function( // Подключенные в массиве зависимостей файлы будут доступны в следующих переменных
      CompoundControl, // В эту переменную импортируется класс CompoundControl из файла CompoundControl.module.js
      dotTplFn, // В эту переменную импортируется вёрстка демо-компонента из файла AutoAddHierarchy.html
      exampleSource // В эту переменную импортируется класс для работы со статическим источником данных
   ){
      var moduleClass = CompoundControl.extend({ // Наследуемся от базового компонента
         _dotTplFn: dotTplFn, // Устанавливаем шаблон, по которому будет построен демо-компонент
         init: function() { // Инициализация компонента, здесь все дочерние компоненты готовы к использованию
            moduleClass.superclass.init.call(this); // Обязательная конструкция, чтобы корректно работал указатель this
            this.getChildControlByName('ТаблицаДобавлениеПоМесту').setDataSource(exampleSource); // Устанавливаем источник данных для представления
            $ws.helpers.message("В примере демонстрируется работа добавления по месту в иерархическом списке. Активация добавления производится двумя способами: либо кнопками из футера, либо из режима редактирования по месту на последнем элементе коллекции нажатием клавиши Enter.");
         }
      });
      return moduleClass;
   }
);