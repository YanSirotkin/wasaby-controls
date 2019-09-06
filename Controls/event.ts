/**
 * Библиотека контролов, позволяющих организовать работу событий сверху вниз.
 * @library Controls/event
 * @includes Register Controls/_event/Register
 * @includes Listener Controls/_event/Listener
 * @public
 * @author Крайнов Д.О.
 * @deprecated Использование механизма допускается только для авторесайза, в остальных случаях его не рекомендуется использовать, поскольку это неконтролируемый поток распространения данных. 
 */

/*
 * event library
 * @library Controls/event
 * @includes Register Controls/_event/Register
 * @includes Listener Controls/_event/Listener
 * @public
 * @author Крайнов Д.О.
 */

import Register = require('Controls/_event/Register');
import Listener = require('Controls/_event/Listener');
import Registrar = require('Controls/_event/Registrar');
import {register as RegisterUtil,unregister as UnregisterUtil} from 'Controls/_event/ListenerUtils'

export {
   Register,
   Listener,
   Registrar,
   RegisterUtil,
    UnregisterUtil
}
