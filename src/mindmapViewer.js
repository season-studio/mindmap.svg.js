/**
 * @author season <season-studio@outlook.com>
 * @license Apache-2.0
 */

import { MindmapError } from "./mindmapError";
import { MindmapContainer } from "./mindmapContainer";
import { MindmapDocument } from "./mindmapDocument";
import { assert } from "../thirdpart/toolkits/src/assert";
import { cloneObject } from "../thirdpart/toolkits/src/cloneObject";
import { readonlyMember } from "../thirdpart/toolkits/src/readonly";
import { Topic } from "./topic";
import { TopicFactor } from "./topicFactor";

export
/**
 * Class of the viewer for displaying and operating the mindmap
 * @class
 * @extends MindmapContainer
 */
class MindmapViewer extends MindmapContainer {

    /**
     * translate the event to a string used as the key of the control-map
     * @static
     * @param {Event} _event The event to be translate, such as keydown, mousedown, and so on
     * @returns {String} The destination key
     */
    static getContrlMapKey(_event) {
        let mapKey = [];
        if (_event instanceof UIEvent) {
            _event.ctrlKey && mapKey.push("ctrl");
            _event.altKey && mapKey.push("alt");
            _event.shiftKey && mapKey.push("shift");
            if (_event instanceof MouseEvent) {
                (_event instanceof WheelEvent) && mapKey.push("wheel");
                (0 !== (_event.buttons & 1)) && mapKey.push("mouseleft");
                (0 !== (_event.buttons & 2)) && mapKey.push("mouseright");
                (0 !== (_event.buttons & 4)) && mapKey.push("mousemiddle");
                (0 !== (_event.buttons & 8)) && mapKey.push("mouseback");
                (0 !== (_event.buttons & 16)) && mapKey.push("mouseforward");
            } else if (_event instanceof KeyboardEvent) {
                mapKey.push(String(_event.key).toLocaleLowerCase());
            }
        }
        return mapKey.join("-");
    }

    /**
     * Dispatch the "topic-event-trigger" or "topic-event-edit" with the binding map.
     * This function should be called with binding a map as the "this" object. This map is an object with the members of the actions for each element of the topic. 
     * @static
     * @param {Event} _event The event
     * @param {String} _type Optional. The type of the action. The _event.type will be used instead if this argument is ignored.
     * @example 
     * // Dispatch the event with the custom map
     * MindmapViwer.dispatchTopicEventAction.call({ 
     *     title: { 
     *         trigger: function () { ... },
     *         edit: function () { ... }
     *     }, image: {
     *         trigger: function () { ... },
     *         edit: function () { ... }
     *     }
     * }, event);
     * @example 
     * // Dispatch the event with the default map
     * MindmapView.MindmapViewer.dispatchTopicEventAction.call(
     *     MindmapView.DefaultTopicEventActions, 
     *     event
     * );
     */
    static dispatchTopicEventAction(_event, _type) {
        const eventDetail = ((_event instanceof Event) ? _event.detail : _event);
        const contentConfig = eventDetail && this[eventDetail.triggerContentType || "title"];
        const fn = contentConfig && contentConfig[_type || ((_event instanceof Event) && String(_event.type).replace(/^topic-event-/gi, ""))];
        (typeof fn === "function") && fn(eventDetail);
    }

    /**
     * Dispatch the event in the control-map
     * @param {Event} _event The DOM's event to be dispatched
     * @param {Object} _instance The instance contains the control-map
     * @param {Function} _prefixCb Optional. The callback function before calling the action in the map
     * @returns {Object} return the matched item if the action is processed.
     */
    static dispatchControlMapAction(_event, _instance, _prefixCb) {
        let key = MindmapViewer.getContrlMapKey(_event);
        let mapItem = _instance.UIControlMap[key];
        if (mapItem) {
            let fn = mapItem.action;
            (typeof fn === "function") || _instance[fn];
            if (typeof fn === "function") {
                (typeof _prefixCb === "function") && _prefixCb(mapItem);
                fn(_event, ...(mapItem.args || []));
                return mapItem;
            }
        }
        return undefined;
    }
    
    #eventHandlers;
    #sheetID;
    #uiCtrlContext;

    /**
     * Create an instance of the MindmapViewer
     * @constructor
     * @param {MindmapDocument} _doc The document assigned with this viewer
     * @param {Node} _node The node to contain this viewer
     */
    constructor(_doc, _node) {
        assert(_doc instanceof MindmapDocument, MindmapError, -1, "_doc must be an instance of MindmapDocument");

        super(_node, _doc.env);
        const env = _doc.env;

        readonlyMember(this, "doc", _doc);

        this.enableDomEvent("wheel");
        this.enableDomEvent("contextmenu");
        TopicFactor.register(this);
        this.#sheetID = undefined;
        this.#eventHandlers = {};
        this.#uiCtrlContext = {};

        for (let key of Object.getOwnPropertyNames(this.constructor.prototype)) {
            if (key.startsWith("@")) {
                let fn = this[key];
                if (typeof fn === "function") {
                    key = key.substring(1);
                    fn = (this.#eventHandlers[key] = fn.bind(this));
                    env.addEventListener(key, fn);
                }
            }
        }
    }

    /**
     * Dispose the resource if you don't need this viewer any more.
     */
    dispose() {
        for (let event in this.#eventHandlers) {
            this.env.removeEventListener(event, this.#eventHandlers[event]);
        }
        this.disableDomEvent("wheel");
        this.disableDomEvent("contextmenu");
        MindmapContainer.prototype.dispose.call(this);
    }

    /**
     * The ID of the current sheet displayed in this viewer
     * @type {String}
     */
    get sheetID() {
        return this.#sheetID;
    }

    /**
     * The root topic in the current viewer
     * @type {Topic}
     */
    get rootTopic() {
        return Topic.getFirstChildTopic(this.stageContainer);
    }

    /**
     * The focus topic in the current viewer
     * @type {Topic}
     */
    get focusTopic() {
        return Topic.getFocusTopic(this.stageContainer);
    }

    /**
     * Get the topic with special ID in the current viewer
     * @param {String} _id The special ID
     * @returns {Topic} The topic matched the special ID
     */
    getTopicByID(_id) {
        return Topic.getTopicByID(this.stageContainer, _id);
    }

    /**
     * Create a child topic in the focus topic in the current viewer
     * @returns {MindmapViewer} This viewer
     */
    createChildTopic() {
        let topic = this.focusTopic;
        topic && (topic = topic.createChild(cloneObject({}, this.doc.constructor.DefaultTopicTemplate)));
        topic && topic.setFocus().render().showInView().notify("topic-event-edit", {eventTarget:topic});
        return this;
    }

    /**
     * Create a sibling topic of the focus topic in the current viewer
     * @returns {MindmapViewer} This viewer
     */
    createSiblingTopic() {
        let topic = this.focusTopic;
        let parentTopic = (topic && (topic.parentTopic || topic));
        parentTopic && (topic = parentTopic.createChild(cloneObject({}, this.doc.constructor.DefaultTopicTemplate), topic.nextSiblingTopic));
        topic && topic.setFocus().render().showInView().notify("topic-event-edit", {eventTarget:topic});
        return this;
    }

    /**
     * Let the focus topic into edit mode
     * @param {String} _triggerContentType Optional. The type of the content to be edit. The title will be edit if this argument is ignored.
     * @returns {MindmapViewer} This viewer
     */
    editFocusTopic(_triggerContentType) {
        let topic = this.focusTopic;
        topic && topic.showInView().notify("topic-event-edit", {eventTarget:topic, triggerContentType:_triggerContentType});
        return this;
    }

    /**
     * Delete the focus topic in this viewer
     * @returns {MindmapViewer} This viewer
     */
    deleteFocusTopic() {
        let topic = this.focusTopic;
        let newFocus = topic && (topic.nextSiblingTopic || topic.previousSiblingTopic || topic.parentTopic);
        topic && topic.drop();
        newFocus && newFocus.setFocus().render().showInView();
        return this;
    }

    /**
     * Move the focus to the next sibling topic from the current focus topic
     * @returns {MindmapViewer} This viewer
     */
    gotoNextSiblingTopic() {
        let topic = this.focusTopic;
        topic && (topic = topic.nextSiblingTopic);
        topic && topic.setFocus();
        return this;
    }
    
    /**
     * Move the focus to the previous sibling topic from the current focus topic
     * @returns {MindmapViewer} This viewer
     */
    gotoPreviousSiblingTopic() {
        let topic = this.focusTopic;
        topic && (topic = topic.previousSiblingTopic);
        topic && topic.setFocus();
        return this;
    }
    
    /**
     * Move the focus to the parent topic from the current focus topic
     * @returns {MindmapViewer} This viewer
     */
    gotoParentTopic() {
        let topic = this.focusTopic;
        topic && (topic = topic.parentTopic);
        topic && topic.setFocus();
        return this;
    }
    
    /**
     * Move the focus to the first child topic from the current focus topic
     * @returns {MindmapViewer} This viewer
     */
    gotoChildrenTopic() {
        let topic = this.focusTopic;
        topic && (topic = topic.firstChildTopic);
        topic && topic.setFocus();
        return this;
    }
    
    /**
     * Render the view
     * @returns {MindmapViewer} This viewer
     */
    render() {
        this.rootTopic.render();
        return this;
    }
    
    /**
     * Export the image  of the viewer
     * @param {Object} _opt Optional. The option
     * @param {String} _opt.type Optional. The type of the destination image. Such as png, jpeg, and so on
     * @param {Boolean} _opt.toBlob Optional. Set true if the image storged in a Blob
     * @returns {Promise<{width: Number, height: Number, data: Any}>} The promise resolved with the data of the image
     */
    exportImage(_opt) {
        _opt || (_opt = {});
        this.env.fireEvent("topic-event-cancel-edit");
        const { x, y, width, height } = this.stageContainer.getBBox();
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
        svg.setAttribute("overflow", "hidden");
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        svg.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
        svg.insertAdjacentHTML("afterbegin", this.svgElement.innerHTML);
        const serializer = new XMLSerializer();
        const source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(svg);
        return this.env.getImageData("data:image/svg+xml;charset=utf-8," + encodeURIComponent(source), {
            width, 
            height,
            type: _opt.type,
            toBlob: _opt.toBlob
        });
    }

    /**
     * Handle the event of "topic-event-view-export-image"
     * @private
     * @param {Event} _event 
     */
    ["@topic-event-view-export-image"](_event) {
        _event && _event.detail && (_event.detail.image = this.exportImage(_event.detail.option));
    }

    /**
     * Handle the event of "topic-event-view-switch-sheet"
     * @private
     * @param {Event} _event 
     */
    ["@topic-event-view-switch-sheet"](_event) {
        if (_event.detail) {
            this.env.fireEvent("topic-event-cancel-edit");
            const sheet = _event.detail && _event.detail.sheet;
            if (sheet && sheet.id) {
                let rootTopic = this.rootTopic;
                rootTopic && rootTopic.drop(a => a + 1);
                rootTopic = TopicFactor.generate(this.stageContainer, Topic, cloneObject({}, sheet.topic), 0, this.env)
                    .render()
                    .queueAction(() => {
                        this.#sheetID = sheet.id;
                        rootTopic && rootTopic.showInCenterOfView()
                    });
            }
        }
    }

    /**
     * Handle the event of "topic-event-view-submit"
     * @private
     * @param {Event} _event 
     */
    ["@topic-event-view-submit"](_event) {
        const topicData = this.rootTopic.exportTopicData();
        const eventParam = _event && _event.detail;
        if (topicData && eventParam) {
            const sheets = eventParam.sheets;
            (sheets instanceof Array) && sheets.push({
                sheetID: this.#sheetID,
                topicData: topicData
            });
            this.rootTopic.collectImageStorage();
            if (eventParam.attachments) {
                for (let item in this.rootTopic.enumerateImageInStorage()) {
                    eventParam.attachments[item.sourceURL] = item.href;
                }
            }
        }
    }

    /**
     * Handle the event of "topic-domevent-mousedown" and dispatching the actions in the control-map
     * @private
     * @param {Event} _event 
     */
    ["@topic-domevent-mousedown"](_event) {
        const eventDetail = _event && _event.detail;
        const originEvent = eventDetail && eventDetail.originEvent;
        if (eventDetail && !eventDetail.eventTarget) {
            MindmapViewer.dispatchControlMapAction(originEvent, this);
        }
    }

    /**
     * Handle the event of "topic-domevent-mousemove" and dispatching the actions in the control-map
     * @private
     * @param {Event} _event 
     */
    ["@topic-domevent-mousemove"](_event) {
        const eventDetail = _event && _event.detail;
        const originEvent = eventDetail && eventDetail.originEvent;
        if (eventDetail && !eventDetail.eventTarget) {
            if (!MindmapViewer.dispatchControlMapAction(originEvent, this, (mapItem) => {
                if (this.#uiCtrlContext.type && (this.#uiCtrlContext.type !== mapItem.action)) {
                    this.#uiCtrlContext.type = undefined;
                }
            })) {
                this.#uiCtrlContext.type && (this.#uiCtrlContext.type = undefined);
            }
        }
    }

    /**
     * Handle the event of "topic-domevent-mouseup"
     * @private
     * @param {Event} _event 
     */
    ["@topic-domevent-mouseup"](_event) {
        const eventDetail = _event && _event.detail;
        const originEvent = eventDetail && eventDetail.originEvent;
        if (eventDetail && !eventDetail.eventTarget) {
            this.#uiCtrlContext.type && this[this.#uiCtrlContext.type](originEvent);
        }
    }

    /**
     * Handle the event of "topic-domevent-click"
     * @private
     * @param {Event} _event 
     */
    ["@topic-domevent-click"](_event) {
        const eventDetail = _event && _event.detail;
        const topic = eventDetail && !eventDetail.eventTarget && this.focusTopic && this.focusTopic;
        topic && topic.killFocus();
    }

    /**
     * Handle the event of "topic-domevent-wheel" and dispatching the actions in the control-map
     * @private
     * @param {Event} _event 
     */
    ["@topic-domevent-wheel"](_event) {
        const eventDetail = _event && _event.detail;
        const originEvent = eventDetail && eventDetail.originEvent;
        if (eventDetail) {
            MindmapViewer.dispatchControlMapAction(originEvent, this);
        }
    }

    /**
     * Handle the event of "topic-domevent-keydown" and dispatching the actions in the control-map
     * @private
     * @param {Event} _event 
     */
    ["@topic-domevent-keydown"](_event) {
        const eventDetail = _event && _event.detail;
        const originEvent = eventDetail && eventDetail.originEvent;
        if (MindmapViewer.dispatchControlMapAction(originEvent, this)) {
            originEvent.preventDefault();
            originEvent.stopPropagation();
        }
    }

    /**
     * Handle the event of "topic-domevent-contextmenu" for disable the default context menu
     * @private
     * @param {Event} _event 
     */
    ["@topic-domevent-contextmenu"](_event) {
        const eventDetail = _event && _event.detail;
        const originEvent = eventDetail && eventDetail.originEvent;
        originEvent.preventDefault();
        originEvent.stopPropagation();
    }

    /**
     * Processor of moving the content in this viewer.
     * It can be used as an action in the control-map.
     * @param {Event} _event 
     */
    ["move-view"](_event) {
        if (_event instanceof WheelEvent) {
            this.move(_event.deltaX, _event.deltaY);
            _event.preventDefault();
            _event.stopPropagation();
        } else if (_event instanceof MouseEvent) {
            const uiCtrlContext = this.#uiCtrlContext;
            if (_event.type === "mousedown") {
                uiCtrlContext.type = "$move-view";
                uiCtrlContext.x = _event.clientX;
                uiCtrlContext.y = _event.clientY;
                this.svgElement.style.cursor = "grabbing";
            } else if (_event.type === "mousemove") {
                if (uiCtrlContext.type === "$move-view") {
                    let deltaX = uiCtrlContext.x - _event.clientX;
                    let deltaY = uiCtrlContext.y - _event.clientY;
                    uiCtrlContext.x = _event.clientX;
                    uiCtrlContext.y = _event.clientY;
                    let ctp = Topic.convertWindowPointToGraphic(this.svgElement, deltaX, deltaY);
                    this.move(ctp.x, ctp.y);
                }
                _event.preventDefault();
                _event.stopPropagation();
            } else {
                uiCtrlContext.type = null;
                this.svgElement.style.cursor = "";
            }
        }
    }

    /**
     * Processor of changing the scale of this viewer.
     * It can be used as an action in the control-map.
     * @param {Event} _event 
     * @param {Object} _opt Optional. The options
     * @param {Number} _opt.min Optional. The min scale of the viewer. The default value is 0.1
     * @param {Number} _opt.max Optional. The max scale of the viewer. The default valule is 2
     * @param {Number} _opt.delta Optional. The changing value of the scale each time. The default value is 0.02
     * @param {String} _opt.by Optional. Indicate the changing of the scale is base on which axis does the pointer changed. The default value is "y"
     */
    ["zoom-view"](_event, _opt) {
        _opt || (_opt = {});
        if (_event instanceof WheelEvent) {
            let scale = (_opt.by === "x") ? (_event.deltaX > 0) : ((_opt.by === "z") ? (_event.deltaZ > 0) : (_event.deltaY > 0));
            scale = scale ? this.scale - (Number(_opt.delta) || 0.02)
                          : this.scale + (Number(_opt.delta) || 0.02);
            this.scale = Math.min(Math.max(scale, (Number(_opt.min) || 0.1)), (Number(_opt.max) || 2));
            _event.preventDefault();
            _event.stopPropagation();
        } else if (_event instanceof MouseEvent) {
            const uiCtrlContext = this.#uiCtrlContext;
            if (_event.type === "mousedown") {
                uiCtrlContext.type = "$zoom-view";
                uiCtrlContext.x = _event.clientX;
                uiCtrlContext.y = _event.clientY;
                this.svgElement.style.cursor = "zoom-in";
            } else if (_event.type === "mousemove") {
                if (uiCtrlContext.type === "$zoom-view") {
                    let zoomDelta = (_opt.by === "x" ? (uiCtrlContext.x < _event.clientX) : (uiCtrlContext.y < _event.clientY));
                    zoomDelta = (zoomDelta ? (0 - (Number(_opt.delta) || 0.02)) : (Number(_opt.delta) || 0.02));
                    uiCtrlContext.x = _event.clientX;
                    uiCtrlContext.y = _event.clientY;
                    this.svgElement.style.cursor = (zoomDelta > 0) ? "zoom-in" : "zoom-out";
                    this.scale = Math.min(Math.max(this.scale + zoomDelta, (Number(_opt.min) || 0.1)), (Number(_opt.max) || 2));
                }
            } else {
                uiCtrlContext.type = null;
                this.svgElement.style.cursor = "";
            }
            _event.preventDefault();
            _event.stopPropagation();
        }
    }

    /**
     * Processor of moving the focus to an other topic.
     * It can be used as an action in the control-map.
     * @param {Event} _event 
     * @param {Boolean} _right Optional. Set true means move to the topic in the right of the the current focus topic.
     */
    ["goto-topic-with-direction"](_event, _right) {
        let topic = this.focusTopic;
        if (topic) {
            if (topic.level < 1) {
                for (topic = topic.firstChildTopic; topic; topic = topic.nextSiblingTopic) {
                    if (topic.direction == _right) {
                        topic.setFocus();
                        break;
                    }
                }
            } else {
                if (topic.direction == _right) {
                    this.gotoChildrenTopic();
                } else {
                    this.gotoParentTopic();
                }
            }
            _event.preventDefault();
            _event.stopPropagation();
        }
    }

    /**
     * @summary Control-map for defining the actions of the UI event.
     * @type {Object}
     * The name of each member should be a value generated by the MindmapView.getContrlMapKey
     * Each member in the map should be the type of UIControlMapItem
     * @example 
     * // Map the arrow-left key and arrow-right key to move the focus
     * UIControlMap = {
     *     "arrowright": { action: "$goto-topic-with-direction", args: [true]},
     *     "arrowleft": { action: "$goto-topic-with-direction", args: [false]}
     * };
     */
    UIControlMap = {
        "ctrl-wheel": { action: "zoom-view", args: [{}] },
        "mousemiddle": { action: "move-view" },
        "arrowright": { action: "goto-topic-with-direction", args: [true]},
        "arrowleft": { action: "goto-topic-with-direction", args: [false]},
        "arrowup": { action: "gotoPreviousSiblingTopic" },
        "arrowdown": { action: "gotoNextSiblingTopic" },
        "f2": { action: "editFocusTopic" },
        "delete": { action: "deleteFocusTopic" },
        "tab": { action: "createChildTopic" },
        "enter": { action: "createSiblingTopic" },
    };
}

/**
 * Type of the member in the control-map
 * @static
 * @typedef {Object} UIControlMapItem
 * @property {Function|String} action The action binded to this item. It can be a function or the method name in the assigned instance.
 * @property {Array} args The external arguments passed to the action. Note: the event will be taken as the first argument automatically any time.
 */