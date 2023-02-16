/**
 * file for subscribing to events from the old application
 */

import {fromEvent} from 'rxjs';

/**
 * observable event click by document
 */
export const sourceDocumentClick = fromEvent(document, 'click');
export const sourceDocumentInitSortable = fromEvent(document, 'init_sortable');


