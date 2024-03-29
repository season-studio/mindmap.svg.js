/**
 * @author season <season-studio@outlook.com>
 * @license Apache-2.0
 */

import { generateID } from "../thirdpart/eblock";
import { MindmapError } from "./mindmapError";
import { MindmapEnvironment } from "./mindmapEnv";
import { assert } from "../thirdpart/toolkits/src/assert";
import { cloneObject } from "../thirdpart/toolkits/src/cloneObject";
import { readonlyMember } from "../thirdpart/toolkits/src/readonly";
import { registerInstanceEventHandler, unregisterInstanceEventHandler } from "./miscUtilities";
import { Topic } from "./topic";

/**
 * The data model of the topic's image
 * @static
 * @typedef {Object} TopicImageData
 * @property {String} href The href of the image
 * @property {Number} width The width when the image is displaying
 * @property {Number} height The height when the image is displaying
 */

/**
 * The data model of the topic
 * The following properties are defined by default. Any other property can be defined by custom.
 * @static
 * @typedef {Object} TopicData
 * @property {String} id The id of the topic
 * @property {String} title The title of the topic
 * @property {TopicImageData} image Optional. The image of the topic
 * @property {Array<TopicData>} children Optional. The list of the children topic of the topic
 */

/**
 * The data model of the sheet
 * @static
 * @typedef {Object} SheetData
 * @property {String} id The id of the sheet
 * @property {String} title The title of the sheet
 * @property {TopicData} topic The root topic of the sheet
 */

export
/**
 * Class of document model describing the mindmap
 * @class
 * @property {MindmapEnvironment} env The environment of the mindmap
 */
class MindmapDocument {
    /**
     * The template of the default sheet
     * @static
     */
    static DefaultSheetTemplate = {
        title: "Untitled Sheet",
        topic: { 
            title: "Main Topic" 
        }
    };

    /**
     * The template of the default topic
     * @static
     */
    static DefaultTopicTemplate = {
        title: "New Topic"
    };

    #attachments;
    #sheets;
    #eventHandler;
    #dirty;

    /**
     * Create the instance of the MindmapDocument
     * @constructor
     * @param {MindmapEnvironment} _env The environment of the mindmap
     */
    constructor(_env) {
        assert(_env instanceof MindmapEnvironment, MindmapError, -1, "_env must be an instance of MindmapEnvironment");

        readonlyMember(this, "env", _env);
        this.#attachments = {};
        this.#sheets = [];
        this.#eventHandler = registerInstanceEventHandler(this, _env);
        this.#dirty = false;
    }

    /**
     * The count of the sheets in the mindmap document
     * @type {Number}
     */
    get sheetCount() {
        return this.#sheets.length;
    }

    /**
     * The first sheet of the mindmap document
     * @type {SheetData}
     */
    get firstSheet() {
        return this.#sheets[_index];
    }

    /**
     * Get a sheet matched the special ID
     * @param {String} _id The id of the target sheet
     * @returns {SheetData} The data of the sheet
     */
    getSheetByID(_id) {
        let sheet;
        try {
            this.#sheets.forEach(item => {
                if (_id === item.id) {
                    sheet = item;
                }
            });
        } catch (err) {
            err && console.warn(err);
        }
        return sheet;
    }

    /**
     * Switch the sheet into the view assigned to this document
     * @param {String} _id The id of the target sheet
     * @param {Boolean} _syncCurrentView Optional. Pass true if you want to save the change in the view first
     * @returns {MindmapDocument} This object
     */
    switchToSheet(_id, _syncCurrentView) {
        const sheet = this.getSheetByID(_id);
        if (sheet) {
            _syncCurrentView && this.synchronizeSheetWithView();
            this.env.fireEvent("topic-event-view-switch-sheet", { sheet });
        } else {
            this.env.warn(`sheet[${_id}] no found`);
        }
        return this;
    }

    /**
     * Enumerate each sheet in the mindmap document
     * @yields {{index: Number, sheet: SheetData}} The data of each sheet
     */
    * enumerateSheet() {
        for (let index in this.#sheets) {
            yield {
                index,
                sheet: this.#sheets[index]
            };
        }
    }

    /**
     * Remove a special sheet.
     * This function will switch the view to the sheet before the sheet removed.
     * A new sheet will be inserted automatically if there is no sheet in the document after remove the special sheet.
     * @param {String} _id The id of the sheet which will be removed
     * @param {Boolean} _syncCurrentView Optional. Pass true if you want to save the change in the view first
     * @returns {SheetData} The data of the sheet which is removed
     */
    removeSheet(_id, _syncCurrentView) {
        _syncCurrentView && this.synchronizeSheetWithView();
        let oriSheet, index;
        for (index in this.#sheets) {
            if (this.#sheets[index].id === _id) {
                oriSheet = this.#sheets.splice(index, 1);
                this.#dirty = true;
                (index > 0) && (index -= 1);
                break;
            }
        }
        let sheet = this.#sheets[index];
        if (!sheet) {
            sheet = cloneObject({}, this.constructor.DefaultSheetTemplate);
            this.addSheet(sheet);
        }
        this.env.fireEvent("topic-event-view-switch-sheet", { sheet });
        return oriSheet;
    }

    /**
     * Insert a new sheet into the document.
     * If the id of the sheet had been contained in the document, this function will be failed.
     * @param {SheetData} _newSheet The data of the sheet inserted. A new id will be created if there is no special one in the data.
     * @param {Number} _index Optional. The position of the sheet will be insert to. If the argument is ignored, the sheet will be insert to the end of the document.
     * @returns {MindmapDocument} This object
     */
    addSheet(_newSheet, _index) {
        if (_newSheet) {
            _newSheet.id || (_newSheet.id = generateID());

            assert(!this.getSheetByID(_newSheet.id), MindmapError, -1, "The id of the sheet had been contained in the document");

            if (isNaN(_index)) {
                this.#sheets.push(_newSheet);
            } else {
                this.#sheets.splice(_index, 0, _newSheet);
            }
            this.#dirty = true;
            this.env.fireEvent("topic-event-sheet-list-changed");
        }
        return this;
    }

    /**
     * Save the change of the view into the document
     * @returns {MindmapDocument} This object
     */
    synchronizeSheetWithView() {
        const param = {
            sheets: [],
            attachments: {}
        };
        this.env.fireEvent("topic-event-view-submit", param);
        let count = 0;
        for (let { sheetID, topicData } of param.sheets) {
            count ++;
            let sheet = this.getSheetByID(sheetID);
            if (sheet) {
                sheet.topic = topicData;
            } else {
                this.addSheet({ topic: topicData });
            }
        }
        (count > 0) && (this.#dirty = true);
        for (let name in param.attachments) {
            this.hasAttachment(name) || this.setAttachment(name, param.attachments[name]);
        }
        return this;
    }

    /**
     * Enumerate the attachments in the document
     * @generator
     * @yields {{name: String, data: Any}} the data of each attachment
     */
    * enumerateAttachment() {
        for (let name in this.#attachments) {
            yield {
                name,
                data: this.#attachments[name]
            };
        }
    }

    /**
     * Remove a special attachment
     * @param {String} _name The name of the attachment will be removed
     * @returns {MindmapDocument} This object
     */
    removeAttachment(_name) {
        const data = this.#attachments[_name];
        (data instanceof Blob) && data.$url && URL.revokeObjectURL(data.$url);
        delete this.#attachments[_name];
        this.#dirty = true;
        return this;
    }

    /**
     * Get a special attachment
     * @param {String} _name The name of the attchment
     * @returns {Any} The data of the attachment
     */
    getAttachment(_name) {
        return this.#attachments[_name];
    }

    /**
     * Set an attachment.
     * If the name of the attachment had been contained in the document, the data of the attachment will be changed to the new one.
     * @param {String} _name The name of the attachment
     * @param {Any} _data The data of the attachment
     * @returns {MindmapDocument} This object
     */
    setAttachment(_name, _data) {
        this.removeAttachment(_name);
        this.#attachments[_name] = _data;
        this.#dirty = true;
        return this;
    }

    /**
     * Remove all of the attachment in the document
     * @returns {MindmapDocument} This object
     */
    clearAttachment() {
        for (let name in this.#attachments) {
            let data = this.#attachments[name];
            (data instanceof Blob) && data.$url && URL.revokeObjectURL(data.$url);
        }
        this.#attachments = {};
        this.#dirty = true;
        return this;
    }

    /**
     * Check if the an attachment specialed by the name is contained in the document
     * @param {String} _name The name of the attachment
     * @returns {Boolean} true means the attachment is contained in the document
     */
    hasAttachment(_name) {
        return _name in this.#attachments;
    }

    /**
     * Collect and remove the unused attachments in this document
     */
    collectAttachments() {
        let referencedSet = new Set();
        const xapPrefix = `${this.env.config.resourceScheme}:`;
        const xapLen = xapPrefix.length;
        (this.#sheets instanceof Array) && this.#sheets.forEach(sheet => {
            for (let item of Topic.enumerateReferenceResource(this.env, sheet.topic)) {
                String(item).startsWith(xapPrefix) && (item = String(item).substring(xapLen));
                referencedSet.add(item);
            }
        });
        Object.getOwnPropertyNames(this.#attachments).forEach(item => {
            if (!referencedSet.has(item)) {
                this.removeAttachment(item);
            }
        });
    }

    /**
     * Reset the document as a new one.
     * An template sheet will be inserted if the content is empty after calling the callback fucntion.
     * The view assigned to the document will switch to the first sheet automatically after this function.
     * @param {Function} _fn The callback function for preparing the content of the document
     * @param  {...any} _args The arguments passed to the callback function
     * @returns {Promise<MindmapDocument>} This object
     */
    async newDocument(_fn, ..._args) {
        this.clearAttachment();
        this.#sheets = [];
        let ret = (typeof _fn === "function") && _fn.apply(this, _args);
        (ret instanceof Promise) && await ret;
        (this.#sheets.length <= 0) && (this.#sheets = [cloneObject({id: generateID()}, this.constructor.DefaultSheetTemplate)]);
        this.env.fireEvent("topic-event-sheet-list-changed");
        this.env.fireEvent("topic-event-view-switch-sheet", { sheet: this.#sheets[0] });
        this.#dirty = false;
        return this;
    }

    /**
     * Save the document.
     * Almost as the same as the synchronizeSheetWithView.
     * @param {Function} _fn Optional. The callback function for saving the document
     * @param {Boolean} _keepWorkState Optional. If this argument is set to true, the working element such as editbox will keep in alive during saving
     * @returns {Any} The result returned by the callback function
     */
    saveDocument(_fn, _keepWorkState) {
        _keepWorkState || this.env.fireEvent("topic-event-cancel-edit");
        this.synchronizeSheetWithView();
        return (typeof _fn === "function") && _fn.apply(this, Array.prototype.slice.call(arguments, 1));
    }

    /**
     * Generate the thumb image of the current view of the document
     * @param {Boolean} _toBlob Optional. Set true if the thumb image is strored as a blob
     * @param {Boolean} _keepWorkState Optional. If this argument is set to true, the working element such as editbox will keep in alive during gettig the thumb
     * @returns {Promise<String|Blob>} A promise that will resolve with the thumb image.
     */
    getThumbImage(_toBlob, _keepWorkState) {
        _keepWorkState || this.env.fireEvent("topic-event-cancel-edit");
        const param = { image: undefined, option: { toBlob: (_toBlob || false) } };
        this.env.fireEvent("topic-event-view-export-image", param);
        return param.image instanceof Promise ? param.image : Promise.resolve(param.image);
    }

    /**
     * Dispose the resource if you do need this document any more.
     */
    dispose() {
        unregisterInstanceEventHandler(this.env, this.#eventHandler);
    }

    /**
     * Check if the document has been changed
     */
    get dirty() {
        return this.#dirty;
    }

    /**
     * Clear the dirty flag of the document
     * @param {Function} _fn A checker function impelement increasing action.
     */
    clearDirtyFlag(_fn) {
        let rndCode;
        (typeof _fn === "function") && (_fn(rndCode = parseInt(Math.random() * 100)) === (rndCode + 1)) && (this.#dirty = false);
    }

    /**
     * Event handler for translating a href to a URL
     * @private
     * @param {Event} _event 
     */
    ["@topic-event-translate-href-url"](_event) {
        const param = _event.detail;
        if (param) {
            let url = String(param.source);
            const xapLen = String(this.env.config.resourceScheme || "").length;
            if (url.startsWith(`${this.env.config.resourceScheme}:`)) {
                url = (param.source = url.substring(xapLen + 1));
                const data = this.#attachments[url];
                if (data instanceof Blob) {
                    param.destination = (data.$url || (data.$url = URL.createObjectURL(data)));
                } else if (data) {
                    param.destination = String(data);
                }
            }
        }
    }

    /**
     * Event handler for getting the type of a href
     * @private
     * @param {Event} _event 
     */
    ["@topic-event-get-href-type"](_event) {
        const param = _event.detail;
        if (param) {
            if (String(param.href).startsWith(`${this.env.config.resourceScheme}:`)) {
                param.type = "resource";
            }
        }
    }

    /**
     * Event handler for updating the attachment
     * @private
     * @param {*} _event 
     */
    ["@topic-event-update-attachment"](_event) {
        const param = _event.detail;
        if (param && param.resource) {
            const name = (param.name || generateID());
            this.setAttachment(name, param.resource);
            param.href = this.env.config.resourceScheme + ":" + name;
        }
    }
}