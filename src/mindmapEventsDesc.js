/**
 * @author season <season-studio@outlook.com>
 * @license Apache-2.0
 */

/**
 * Event for editing a topic
 * Generally, this event is emitted by double click the topic
 * @event topic-event-edit
 * @type {Event}
 * @property {Topic} detail.eventTarget Input. Indicate the topic this event belong to.
 * @property {String} detail.triggerContentType Input. Indicate the content element which need editing. Undefined is set if you want to edit the default content element of the topic. The default content of the topic is the title.
 * @property {Event} detail.originEvent Input. Optional. The origin event which cause this event emitted.
 */

/**
 * Event for triggering a topic
 * Generally, this event is emitted by click the topic
 * @event topic-event-trigger
 * @type {Event}
 * @property {Topic} detail.eventTarget Input. Indicate the topic this event belong to.
 * @property {String} detail.triggerContentType Input. Indicate the content element which is triggered. Undefined is set if you trigger the default content element of the topic. The default content of the topic is the title.
 * @property {Event} detail.originEvent Input. Optional. The origin event which cause this event emitted.
 */

/**
 * Event for cancelling the edit action in the viewer
 * 
 * @event topic-event-cancel-edit
 * @type {Event}
 */

/**
 * Event emitted before the rendering action will start.
 * 
 * @event topic-event-before-render
 * @type {Event}
 */

/**
 * Event emitted when the rendering action is completed.
 * 
 * @event topic-event-after-render
 * @type {Event}
 */

/**
 * Event for switching the sheet in the viewer.
 * Generally, this event is emitted by document to notify the viewer assigned.
 * @event topic-event-view-switch-sheet
 * @type {Event}
 * @property {SheetData} detail Input. The target sheet would be show in the viewer.
 */

/**
 * Event for notifying the viewer to submit the data of the topic to the document.
 * Generally, this event is emitted by document to notify the viewer assigned.
 * @event topic-event-view-submit
 * @type {Event}
 * @property {Array<SheetData>} detail.sheets Output. The viewer push it's data into this array if the data should be submitted.
 * @property {Object} detail.attachments Output. The viewer set it's attachments into this object if the attachments should be submitted.
 */

/**
 * Event for broadcasting the list of the sheets in the document has been changed.
 * Adding or removing any sheet will emit this event. But changing the data of a sheet will not emit this event.
 * @event topic-event-sheet-list-changed
 * @type {Event}
 */

/**
 * Event for broadcasting the size of the viewer is changed.
 * 
 * @event topic-event-view-resize
 * @type {Event}
 */

/**
 * Event for notifying the viewer to export the image of the view
 * 
 * @event topic-event-view-export-image
 * @type {Event}
 * @property {Boolean} detail.option.toBlob Input. Indicate if the result is store in a blob. 
 * @property {Promise<Object>|Object} detail.image Output. The result of the image.
 */

/**
 * Event for converting a href to a URL.
 * 
 * @event topic-event-translate-href-url
 * @type {Event}
 * @property {String} detail.source Input. The href would be converted.
 * @property {String} detail.destination Output. The URL that the source is converted to.
 */

/**
 * Event for querying the type of the target the special href assigned to
 * 
 * @event topic-event-get-href-type
 * @type {Event}
 * @property {String} detail.href Input. The href of the target which would be queryed.
 * @property {String} detail.type Output. The type of the target the href assigned to.
 */

/**
 * Event for broadcasting the viewport is moved.
 * 
 * @event topic-event-view-move
 * @type {Event}
 * @property {Topic} detail.eventTarget Input. Indicate the topic this event belong to.
 */

/**
 * Event for broadcasting a topic will lost the focus.
 * 
 * @event topic-event-kill-focus
 * @type {Event}
 * @property {Topic} detail.eventTarget Input. Indicate the topic this event belong to.
 */

/**
 * Event for broadcasting a topic will has focus.
 * 
 * @event topic-event-set-focus
 * @type {Event}
 * @property {Topic} detail.eventTarget Input. Indicate the topic this event belong to.
 */

/**
 * Event for broadcasting a topic is changed.
 * 
 * @event topic-event-change
 * @type {Event}
 * @property {Topic} detail.eventTarget Input. Indicate the topic this event belong to.
 * @property {String} detail.action Input. The type of changing. Such as "create", "move", "changeData", "drop", and so on.
 *                                  "move" means the position of the topic is changed.
 *                                  "changeData" means the data of the topic is changed.
 *                                  "create" means the topic is created.
 *                                  "drop" means the topic is removed from the view.
 * @property {String} detail.key Input. The key of the member which is changed in the topic's data. This value is valid when the action is "changeData".
 * @property {Any} detail.originValue Input. The origin value of the data before changed. This value is valid when the action is "changeData".
 * @property {Topic} detail.originParent Input. The origin parent topic before the position changed. This value is valid when the action is "move".
 * @property {Topic} detail.originSibling Input. The origin next sibling topic before the position changed. This value is valid when the action is "move".
 */

/**
 * Event for reporting the configurations from each component bind to the enviroment
 * 
 * @event topic-event-report-configuration
 * @type {Event}
 * @property {Object} detail.result Input/Output. The container for storage the reported configurations.
 */

/**
 * Event for notify the global configuration has been update
 * 
 * @event topic-event-sync-configuration
 * @type {Event}
 * @property {Object} detail Input. The current global configurations.
 */