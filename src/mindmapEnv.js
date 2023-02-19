/**
 * @author season <season-studio@outlook.com>
 * @license Apache-2.0
 */

import { generateID } from "../thirdpart/eblock";
import { MindmapError } from "./mindmapError";
import { assert } from "../thirdpart/toolkits/src/assert";
import { cloneObject } from "../thirdpart/toolkits/src/cloneObject";
import { TopicExtensionFactor } from "./topicExtension";

export
/**
 * The environment of the mindmap
 * @class
 */
class MindmapEnvironment extends EventTarget {

    /**
     * The default configuration of the mindmap
     * @static
     * @property {Number} padding The padding of the topic
     * @property {Number} secondaryPadding The padding of the extensions in the topic
     * @property {Number} levelMargin The margin between the first kind topic and it's children
     * @property {Number} secondaryLevelMargin The margin between the secondary kind topic and it's children
     * @property {Number} siblingMargin The margin during the children of the first kind topic
     * @property {Number} secondarySiblingMargin The margin during the children of the secondary kind topic
     * @property {Number} secondaryTopicLevel The level to distinguish the secondary kind topic from the first kind topic
     * @property {Number} suitableTitleLineWidth The suitable width of the title line of the topic. If the total width the title and the extension is larger then this value, the renderer will try to break them into two line
     * @property {String} directionPriority Special the primary side to layout the children of the first topic. The avaliable value is "left" or "right"
     * @property {Number} dragStartFocusFilterTimer The time to wake up the drag-drop action after mousedown in the focus topic
     * @property {Number} dragStartNoFocusFilterTimer The time to wake up the drag-drop action after mousedown in the nofocus topic
     * @property {String} resourceScheme The scheme of the resource
     * @property {String} defaultResourceAttachmentPrefix The default prefix of the name of the attachment
     * @property {String} placeholderImageId The id of the predefined symbol as the placeholder of the image
     * @static
     */
    static DefaultConfig = Object.freeze({
        padding: 10,
        secondaryPadding: 5,
        levelMargin: 26,
        secondaryLevelMargin: 17,
        siblingMargin: 10,
        secondarySiblingMargin: 6,
        secondaryTopicLevel: 2,
        suitableTitleLineWidth: 120,
        directionPriority: "right",
        dragStartFocusFilterTimer: 50,
        dragStartNoFocusFilterTimer: 100,
        resourceScheme: "xap",
        defaultResourceAttachmentPrefix: "resources/",
        placeholderImageId: "season-topic-predefine-image-picture-placeholder",
        backgroundColor: "transparent"
    });

    #extensionFactors = [];
    #config;

    /**
     * Create an instance of the enviroment
     * @constructor
     */
    constructor () {
        super();

        this.#config = Object.freeze(cloneObject({}, MindmapEnvironment.DefaultConfig));
    }

    /**
     * The working configuration of the mindmap
     * @see {@link #module_MindmapView.MindmapEnvironment+DefaultConfig|DefaultConfig} for more information
     */
    get config() {
        return this.#config;
    }

    /**
     * The list of the extensions' factor registered in the enviroment
     * @type {TopicExtensionFactor}
     */
    get extensionFactors() {
        return this.#extensionFactors;
    }

    /**
     * generation a random ID
     */
    get randomID() {
        return generateID();
    }

    /**
     * Synchronize the configuration in the enviroment
     * Use this method to let the components in the enviroment report their configurations, and then the configurations will be set as the global parameters.
     */
    syncConfig() {
        let detail = {
            result: cloneObject({}, MindmapEnvironment.DefaultConfig)
        };
        this.fireEvent("topic-event-report-configuration", detail);
        this.#config = Object.freeze(detail.result || cloneObject({}, MindmapEnvironment.DefaultConfig));
        this.fireEvent("topic-event-sync-configuration", this.#config);
    }

    /**
     * Fire an event in the environment
     * @param {String} _type The name of the event
     * @param {Any} _param The detail of the event
     */
    fireEvent(_type, _param) {
        this.dispatchEvent((_type instanceof Event) ? _type : new CustomEvent(_type, { detail: _param }));
    }

    /**
     * Translate a href to an URL
     * @param {String} _href The href need to be translating
     * @returns {String} The destination URL
     */
    translateHRefToURL(_href) {
        const param = {
            source: _href,
            destination: _href
        };
        this.fireEvent("topic-event-translate-href-url", param);
        return param;
    }

    /**
     * get the type of the resource assigned with the href
     * @param {String} _href The href
     * @returns {String} The type of the resource, such as "link", "resource", or so on.
     */
    getHRefType(_href) {
        const param = {
            href: _href,
            type: "link"
        };
        this.fireEvent("topic-event-get-href-type", param);
        return param.type;
    }

    /**
     * Render a element as an image
     * @param {HTMLElement} _element The element which will be rendered
     * @param {Object} _opt The option
     * @param {Number} _opt.width Optional. The width of the image
     * @param {Number} _opt.height Optional. The height of the image
     * @param {Number} _opt.offsetX Optional. The left offset when rendering the image
     * @param {Number} _opt.offsetY Optional. The top offset when rendering the image
     * @param {String} _opt.type Optional. The type of the image, such as "png", "jpeg", etc. The default type is "png".
     * @param {String} _opt.fill Optional. The color of the background. The default is rgba(255,255,255,0).
     * @returns {{width: Number, height: Number, data: Any}} The data of the image
     */
    getImageDataFromElement(_element, _opt) {
        try {
            _opt || (_opt = {});
            const canvas = document.createElement("canvas");
            const width = Number(_opt.width) || Number(_element.width);
            const height = Number(_opt.height) || Number(_element.height);
            assert(width && height, MindmapError, -1, "The width and height is invalid!");
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext("2d");
            context.fillStyle = (_opt.fill || 'rgba(255,255,255,0)');
            context.fillRect(0, 0, width, height);
            context.drawImage(_element, (Number(_opt.offsetX) || 0), (Number(_opt.offsetY) || 0));
            return _opt.toBlob ? new Promise(r => canvas.toBlob(data => {
                r({
                    width,
                    height,
                    data
                })
            }, `image/${_opt.type || "png"}`)) : Promise.resolve({
                width,
                height,
                data: canvas.toDataURL(`image/${_opt.type || "png"}`)
            });
        } catch (err) {
            this.warn("Fail in get image's data from an element", err);
        }
    }

    /**
     * Render a resource specialed by the URL as an image
     * @param {String} _url The URL
     * @param {Object} _opt The option
     * @param {Number} _opt.width Optional. The width of the image
     * @param {Number} _opt.height Optional. The height of the image
     * @param {Number} _opt.offsetX Optional. The left offset when rendering the image
     * @param {Number} _opt.offsetY Optional. The top offset when rendering the image
     * @param {String} _opt.type Optional. The type of the image, such as "png", "jpeg", etc. The default type is "png".
     * @param {String} _opt.fill Optional. The color of the background. The default is rgba(255,255,255,0).
     * @param {String} _opt.crossOrigin Optional. The cross-origin setting when loading the resource.
     * @returns {Promise<{width: Number, height: Number, data: Any}>} The promise resolved with the data of the image
     */
    async getImageData(_url, _opt) {
        try {
            _opt || (_opt = {});
        
            const image = new Image();
            image.src = _url;
            _opt.crossOrigin && (image.crossOrigin = _opt.crossOrigin);

            await image.decode();

            return await this.getImageDataFromElement(image, _opt);
        } catch(err) {
            this.warn("Fail in load image:", _url, err);
        }
    }

    /**
     * Output the warning information
     * @param  {...any} _args The warning information
     */
    warn(..._args) {
        console.warn(..._args);
    }

    async confirm(_tip, _opt) {
        return (_opt || {}).default || 0;
    }

    /**
     * active a link
     * @param {String} _url The URL of the link
     */
    activeLink(_url) {
        _url && window.open(_url, "_blank");
    }

    /**
     * Indicate if the topic is dragable.
     * This option is invalid if the editable is set to false
     * @type {Boolean}
     */
    dragable = true;
    
    /**
     * Indicate if the mindmap is editable.
     * @type {Boolean}
     */
    editable = true;

    /**
     * The context for drag-drop action.
     * This data is used by the drag-drop action processor. Don't use it without the processor.
     * The subclass of MindmapEnvironment should keep this member writable.
     */
    dragContext = undefined;
}
