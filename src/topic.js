/**
 * @author season <season-studio@outlook.com>
 * @license Apache-2.0
 */

import { EBlock, EBlockFactor, generateID } from "../thirdpart/eblock";
import { MindmapError } from "./mindmapError";
import { MindmapEnvironment } from "./mindmapEnv";
import { assert } from "../thirdpart/toolkits/src/assert";
import { cloneObject } from "../thirdpart/toolkits/src/cloneObject";
import { readonlyMember } from "../thirdpart/toolkits/src/readonly";
import { TopicExtension } from "./topicExtension";

const FOCUS_ATTR_KEY = "season-topic-focus";

const CHILDREN_GROUP_NODE = Symbol("topic.children.group.node");
const TOPIC_LEVEL = Symbol("topic.level");
const TOPIC_DIRECTION = Symbol("topic.direction");
const TOPIC_FOLD = Symbol("topic.fold");

export
/**
 * Class of the topic
 * @class
 * @extends EBlock
 */
class Topic extends EBlock {
    //#region static methods

    /**
     * Enumerate each resource referenced by the topic
     * @param {MindmapEnvironment} _env The enviroment of the mindmap
     * @param {TopicData} _data The data of the topic
     */
    static *enumerateReferenceResource(_env, _data) {
        if ((_env instanceof MindmapEnvironment) && _data) {
            if (_data.image && _data.image.src) {
                yield _data.image.src;
            }
            let extResList = [];
            try {
                _env.extensionFactors.forEach(extFactor => {
                    let extRes = extFactor.callScript("getReferenceResources", undefined, _env, _data);
                    if (extRes) {
                        if (extRes instanceof Array) {
                            extResList = extResList.concat(extRes);
                        } else {
                            extResList.push(extRes);
                        }
                    }
                });
            } catch (err) {
                _env.warn("Exception raised in enumerateReferenceResource", err);
            }
            for (let item of extResList) {
                yield item;
            }
            if (_data.children instanceof Array) {
                for (let subTopicData of _data.children) {
                    yield * Topic.enumerateReferenceResource(_env, subTopicData);
                }
            }
        }
    }

    /**
     * Get the first child topic of the given topic
     * @static
     * @param {Node|Topic} _nodeOrTopic The parent topic or a node contains the topic
     * @returns {Topic} The target child
     */
    static getFirstChildTopic(_nodeOrTopic) {
        let node = undefined;
        if (_nodeOrTopic instanceof Node) {
            node = _nodeOrTopic.querySelector(":scope > g[season-topic-global]");
        } else if (_nodeOrTopic instanceof Topic) {
            const childrenGroupNode = _nodeOrTopic[CHILDREN_GROUP_NODE];
            childrenGroupNode && childrenGroupNode.isConnected && (node = childrenGroupNode.querySelector(":scope > g[season-topic-global]"));
        }

        return Topic.GetInstance(node);
    }

    /**
     * Get the root node of the stage of all the topics
     * @static
     * @param {Node} _node The node contains the root
     * @returns {Node} The target node
     */
    static getMindRootNode(_node) {
        return (_node instanceof SVGSVGElement) 
                ? _node.querySelector("g[season-topic-root-node]")
                : ((_node instanceof SVGElement) 
                        ? _node.ownerSVGElement.querySelector("g[season-topic-root-node]") 
                        : undefined);
    }

    /**
     * Find the special topic in the given node
     * @static
     * @param {Node} _node The given node that may contain the special topic
     * @param {String} _id The ID of the special topic
     * @returns {Topic} The target topic
     */
    static getTopicByID(_node, _id) {
        return Topic.GetInstance((_node instanceof Node) && _node.querySelector(`g[season-topic-global="${_id}"]`));
    }

    /**
     * Find the focus topic in the given node
     * @static
     * @param {Node} _node The given node that may contain the focus topic
     * @returns {Topic} The target topic
     */
    static getFocusTopic(_node) {
        try {
            if (_node instanceof Node) {
                const focusNode = _node.querySelector(`g[eblock-template][${FOCUS_ATTR_KEY}]`);
                return Topic.GetInstance(focusNode);
            }
        } catch {
            return null;
        }
    }

    /**
     * Convert the given coordinate value into the coordinate system of the special svg node
     * @param {SVGGraphicsElement|SVGSVGElement} _node The special svg node
     * @param {Number} _x the given coordinate value
     * @param {Number} _y the given coordinate value
     * @returns {{x: Number, y: Number}} The destination coordinate value 
     */
    static convertWindowPointToGraphic(_node, _x, _y) {
        (_node instanceof SVGSVGElement) || (_node = (_node instanceof SVGGraphicsElement) && _node.ownerSVGElement);
        let ctm = _node && (_node.getCTM() || _node.getScreenCTM());
        if (ctm) {
            ctm = (new DOMMatrix([ctm.a, ctm.b, ctm.c, ctm.d, 0, 0])).inverse().translate(_x, _y);
            return { x: ctm.e, y: ctm.f };
        } else {
            return { x:_x, y:_y };
        }
    }

    /**
     * Move the node into the viewport of the special SVG node
     * @param {Node} _node The node would be moved
     * @param {SVGGradientElement|SVGSVGElement} _svg The special SVG node
     */
    static showNodeInSvgView(_node, _svg) {
        const topicRect = _node.getBoundingClientRect();
        const viewRect = _svg.getBoundingClientRect();
        let deltaX, deltaY;
        if (topicRect.top < viewRect.top) {
            deltaY = viewRect.top - topicRect.top;
        } else if (topicRect.bottom > viewRect.bottom) {
            deltaY = Math.max(viewRect.bottom - topicRect.bottom, viewRect.top - topicRect.top);
        } else {
            deltaY = 0;
        }
        if (topicRect.left < viewRect.left) {
            deltaX = viewRect.left - topicRect.left;
        } else if (topicRect.right > viewRect.right) {
            deltaX = Math.max(viewRect.right - topicRect.right, viewRect.left - topicRect.left);
        } else {
            deltaX = 0;
        }
        let { x:viewX, y:viewY, width:viewWidth, height:viewHeight} = (_svg.viewBox.baseVal || {x:0, y:0, width:0, height:0});
        (viewWidth <= 0) && (viewWidth = _svg.width.baseVal.value);
        (viewHeight <= 0) && (viewHeight = _svg.height.baseVal.value);
        let ctp = Topic.convertWindowPointToGraphic(_svg, deltaX, deltaY);
        _svg.setAttribute("viewBox", `${viewX - ctp.x} ${viewY - ctp.y} ${viewWidth} ${viewHeight}`);
    }
    //#endregion

    //#region private fields
    #topicContentNode = undefined;
    //#endregion

    //#region private methods
    #getMindRootNode() {
        return Topic.getMindRootNode(this.$assignedNode);
    }

    #getChildrenNods() {
        return this[CHILDREN_GROUP_NODE] && this[CHILDREN_GROUP_NODE].querySelectorAll(":scope > g[season-topic-global]")
    }

    #calculatePositionAsRightChild(_context) {
        const itemNode = this.$assignedNode;
        let { y:itemOffsetY, height:itemHeight } = itemNode.getBBox();
        let info = { 
            startX: _context.contentWidth,
            endX: _context.contentWidth + _context.levelMargin,
            endY: _context.listHeight,
            id: this.data.id,
            itemOffsetY,
            itemHeight,
            itemNode
        };
        _context.listHeight += itemHeight + _context.siblingMargin;
        _context.itemList.push(info);
    }
    
    #calculatePositionAsLeftChild(_context) {
        const itemNode = this.$assignedNode;
        let { y:itemOffsetY, height:itemHeight } = itemNode.getBBox();
        let { x:itemContentOffsetX, width:itemContentWidth } = this.#topicContentNode.getBBox();
        let info = { 
            startX: 0,
            endX: 0 - _context.levelMargin,
            endY: _context.listHeight,
            id: this.data.id,
            itemOffsetY,
            itemHeight,
            itemContentWidth: itemContentWidth + itemContentOffsetX,
            itemNode
        };
        _context.listHeight += itemHeight + _context.siblingMargin;
        _context.itemList.push(info);
    }
    
    #balanceChildListPosition(_leftContext, _rightContext) {
        if (_leftContext.listHeight > _rightContext.listHeight) {
            let delta = (_leftContext.listHeight - _rightContext.listHeight) / 2;
            _rightContext.itemList.forEach(item => {
                item.endY += delta;
            });
        } else if (_rightContext.listHeight > _leftContext.listHeight) {
            let delta = (_rightContext.listHeight - _leftContext.listHeight) / 2;
            _leftContext.itemList.forEach(item => {
                item.endY += delta;
            });
        }
    }
    
    #locateChild(_context) {
        _context.itemList.forEach(item => {
            item.itemNode.setAttribute("transform", `translate(${item.itemContentWidth ? item.endX - item.itemContentWidth : item.endX}, ${item.endY - item.itemOffsetY})`);
            item.endY += item.itemHeight / 2;
        });
    }
    
    #drawChildConnectLine(_context, _childrenGroupNode, _centerY) {
        _context.itemList.forEach(item => {
            let lineNode = _childrenGroupNode.querySelector(`path[d-topic-id="${item.id}"]`);
            if (!lineNode) {
                lineNode = document.createElementNS("http://www.w3.org/2000/svg", "path");
                _childrenGroupNode.appendChild(lineNode);
                lineNode.setAttribute("d-topic-id", item.id);
            }
            lineNode.setAttribute("class", "season-topic-connect-line");
            const midX = (item.endX - item.startX) / 2 + item.startX;
            lineNode.setAttribute("d", `M${item.startX} ${_centerY}C${midX} ${_centerY} ${midX} ${item.endY} ${item.endX} ${item.endY}`);
        });
    }

    #changeLevel(_newLevel) {
        this[TOPIC_LEVEL] = _newLevel;
        const childrenNodes = this.#getChildrenNods();
        const nextLevel = _newLevel + 1;
        childrenNodes && childrenNodes.forEach(item => {
            let child = item && Topic.GetInstance(item);
            (child instanceof Topic) && child.#changeLevel(nextLevel);
        });
    }

    async #loadImageInStorage(_url, _href, _node, _width, _height, _config) {
        try {
            const storageNode = this.$assignedNode.ownerSVGElement.querySelector("[season-topic-image-storage]");
            if (storageNode) {
                let symbolNode = storageNode.querySelector(`symbol[d-url="${_url}"]`);
                if (symbolNode) {
                    _node.setAttribute("href", "#" + symbolNode.getAttribute("id"));
                } else {
                    
                    const id = "storeimg-" + generateID();
                    symbolNode = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
                    symbolNode.setAttribute("id", id);
                    symbolNode.setAttribute("d-href", _href);
                    symbolNode.setAttribute("d-url", _url);
                    symbolNode.setAttribute("preserveAspectRatio", "none");
                    symbolNode.setAttribute("width", _width);
                    symbolNode.setAttribute("height", _height);
                    symbolNode.setAttribute("viewBox", `0 0 ${_width} ${_height}`);
                    symbolNode.insertAdjacentHTML("afterbegin", `<use href="#${_config.placeholderImageId || MindmapEnvironment.DefaultConfig.placeholderImageId}" width="${_width}" height="${_height}" style="mix-blend-mode:difference;fill:#000;" stroke="none" />`);
                    storageNode.appendChild(symbolNode);
                    
                    _node.setAttribute("href", "#" + id);

                    const imgRet = await this.env.getImageData(_url, {type:"png"});

                    if (imgRet) {
                        const { width, height } = imgRet;
                        symbolNode.setAttribute("width", symbolNode.$width = width);
                        symbolNode.setAttribute("height", symbolNode.$height = height);
                        symbolNode.setAttribute("viewBox", `0 0 ${width} ${height}`);
                        symbolNode.innerHTML = `<image class="season-topic-image" x="0" y="0" width="${width}" height="${height}" href="${imgRet.data}" />`;
                    } else {
                        this.env.warn("Fail in loading image", _url);
                    }
                }
            } else {
                throw "Fail in locating the storage node for images";
            }
        } catch(err) {
            this.env.warn("Exception in loadImageInStorage:", _url, err);
        }
    }

    #renderTopicExtensions(_extGroupNode, _config, _data, ..._args) {
        if (_extGroupNode && _data) {
            // peek up all extensions have been rendered
            const hasExtensions = {};
            let nodes = _extGroupNode.querySelectorAll(":scope > *");
            nodes && nodes.forEach(node => {
                let extension = TopicExtension.GetInstance(node);
                (extension && extension.name) && (hasExtensions[extension.name] = extension);
            });
            // render each extension
            nodes = [];
            this.env.extensionFactors.forEach(extFactor => {
                let extension;
                let name = extFactor.$info && extFactor.$info.name;
                if (name in hasExtensions) {
                    extension = hasExtensions[name];
                } else if (name in _data) {
                    extension = extFactor.generate(_extGroupNode, TopicExtension, _data, this);
                }
                if (extension) {
                    extension.render.apply(extension, _args);
                    extension.$assignedNode.isConnected && nodes.push(extension.$assignedNode);
                }
            });
            // locate extension
            let maxHeight = 0;
            nodes.forEach(node => {
                let bbox = node.getBBox();
                node.$width = bbox.width;
                let height = (node.$height = bbox.height);
                (maxHeight < height) && (maxHeight = height);
            });
            const padding = Number(_config.secondaryPadding) || 0;
            let x = 0;
            nodes.forEach(node => {
                node.setAttribute("transform", `translate(${x}, ${(maxHeight - node.$height) / 2})`);
                x += node.$width + padding;
            });
        }
    }

    #renderTopic() {
        let args = Array.prototype.splice.call(arguments, 0);
        args[2] || (args[2] = this.env.config);
        EBlock.prototype.render.apply(this, args);
        return this;
    }
    //#endregion

    //#region public members
    /**
     * @summary Create an new instance of Topic or query an exist intsance
     * You should call TopicFactor.generate to create the instance of Topic instead. 
     * @contructor
     * @param {EBlockFactor|Node} _factorOrNode The factor or the node of the exist topic
     * @param {Any} _data The data of the topic
     * @param {Number} _level The level of the topic
     * @param {MindmapEnvironment} _env The environment of the mindmap
     */
    constructor (_factorOrNode, _data, _level, _env) {

        super(...arguments);
        
        // initialize the local field and the nodes
        readonlyMember(this, {
            env: this.$env,
            handleDomEvent: true,
            eventSelectorPrefix: ":scope > [season-topic-content-group] > "//`:not([season-topic-children-group="${this.blockID}"]) `
        });
        const topicContentNode = (this.#topicContentNode = this.$assignedNode.querySelector(":scope > [season-topic-content-group]"));
        
        if (!this.$stubFlag) {
            topicContentNode.setAttribute("season-topic-content-group", this.id);

            const childrenGroupNode = this[CHILDREN_GROUP_NODE];
            if (childrenGroupNode) {
                
                childrenGroupNode.innerHTML = "";
                childrenGroupNode.setAttribute("season-topic-children-group", this.id);
                
                // create the children topic
                if (_data.children instanceof Array) {
                    const nextLevel = this[TOPIC_LEVEL] + 1;
                    _data.children.forEach((item) => {
                        _factorOrNode.generate(childrenGroupNode, Topic, item, nextLevel, _env);
                    });
                    delete _data.children;
                }
            }
        }
    }

    /**
     * @summary Initialize the metadata of the topic
     * Do not call this method manually.
     * @param {Object} _metadata The container of the metadata
     * @param {Any} _data The data of the topic
     * @param {Node} _node The assigned node of the topic
     * @param {Number} _level The level of the topic
     * @param {MindmapEnvironment} _env The environment of the mindmap
     */
    initMetadata(_metadata, _data, _node, _level, _env) {
        assert(_env instanceof MindmapEnvironment, MindmapError, -1, "_env must be an instance of MindmapEnvironment");

        readonlyMember(_metadata, "env", _env);
        _metadata[CHILDREN_GROUP_NODE] = _node.querySelector(":scope > [season-topic-children-group]");
        _metadata[TOPIC_LEVEL] = (Number(_level) || 0);
        _metadata[TOPIC_DIRECTION] = undefined;
        _metadata[TOPIC_FOLD] = false;

        let id = _data.id;
        const invalidID = ((id === undefined) || (id === null));
        invalidID && (id = generateID());
        try {
            Object.defineProperty(_data, "id", {
                value: id,
                writable: false,
                configurable: false,
                enumerable: true
            });
        } catch(err) {
            if (invalidID) {
                throw err;
            }
        }
    }

    /**
     * The ID of the topic
     * @type {String}
     */
    get id() {
        return this.data.id;
    }

    /**
     * The level of the topic
     * @type {level}
     */
    get level() {
        return this[TOPIC_LEVEL];
    }

    /**
     * The direction of the topic.
     * true for right, false for left
     * @type {Boolean}
     */
    get direction() {
        return this[TOPIC_DIRECTION];
    }

    /**
     * The parent topic
     * @type {Topic}
     */
    get parentTopic() {
        let parentChildrenGroupNode = this.$assignedNode.parentNode;
        let parentNode = parentChildrenGroupNode && parentChildrenGroupNode.parentNode;
        return (parentNode && parentNode.hasAttribute("season-topic-global")) ? Topic.GetInstance(parentNode) : undefined;
    }

    /**
     * Indicate if the topic has any child
     * @type {Boolean}
     */
    get hasChildren() {
        const childrenNodes = this.#getChildrenNods();
        return childrenNodes && (childrenNodes.length > 0);
    }

    /**
     * The root topic
     * @type {Topic}
     */
    get rootTopic() {
        return Topic.getFirstChildTopic(this.#getMindRootNode());
    }

    /**
     * The first child topic
     * @type {Topic}
     */
    get firstChildTopic() {
        return Topic.getFirstChildTopic(this);
    }

    /**
     * Get the list of the children topics
     * @returns {Array<Topic>} The list of the children topics
     */
    getChildrenTopics() {
        return [...this.#getChildrenNods()].map(item => Topic.GetInstance(item));
    }

    /**
     * Get an iterator for enumerating the children topics
     * @yields {Topic} The child topic
     */
    * enumerateChilrenTopics() {
        const childrenNodes = this.#getChildrenNods();
        const count = (childrenNodes && childrenNodes.length);
        for (let idx = 0; idx < count; idx++) {
            let child = Topic.GetInstance(childrenNodes[idx]);
            if (child instanceof Topic) {
                yield child;
            }
        } 
    }

    /**
     * Get an iterator for enumerating the descendant topics
     * @yields {Topic} The topic
     */
    * enumerateDescendantTopics() {
        const childrenNodes = this.#getChildrenNods();
        const count = (childrenNodes && childrenNodes.length);
        for (let idx = 0; idx < count; idx++) {
            let child = Topic.GetInstance(childrenNodes[idx]);
            if (child instanceof Topic) {
                yield child;
                yield * child.enumerateDescendantTopics();
            }
        } 
    }

    /**
     * Get an iterator for enumerating the descendant topics include this instance itself
     * @yields {Topic} The topic
     */
    * enumerateTopics() {
        yield this;
        yield * this.enumerateDescendantTopics();
    }

    /**
     * The sibling topic next to this instance
     * @type {Topic}
     */
    get nextSiblingTopic() {
        for (let siblingNode = this.$assignedNode.nextSibling; siblingNode; siblingNode = siblingNode.nextSibling) {
            let topic = Topic.GetInstance(siblingNode);
            if (topic instanceof Topic) {
                return topic;
            }
        }
        return null;
    }

    /**
     * The sibling topic before this instance
     * @type {Topic}
     */
    get previousSiblingTopic() {
        for (let siblingNode = this.$assignedNode.previousSibling; siblingNode; siblingNode = siblingNode.previousSibling) {
            let topic = Topic.GetInstance(siblingNode);
            if (topic instanceof Topic) {
                return topic;
            }
        }
        return null;
    }

    /**
     * Find a special topic contained in this instance
     * @param {String} _id The ID of the special topic
     * @returns {Topic} The target topic
     */
    getTopicByID(_id) {
        return (String(this.id) === String(_id)) ? this : Topic.getTopicByID(this.$assignedNode, _id);
    }

    /**
     * The node of the instance
     * @type {Node}
     */
    get topicNode() {
        return this.$assignedNode;
    }

    /**
     * @summary Export the data of the topic
     * The exposed data is include the children topic of this instance
     * @param {Boolean} _removeID if remove the ID of the topic from the data
     * @returns {TopicData} The data of the topic
     */
    exportTopicData(_removeID) {
        const data = cloneObject({}, this.data);
        _removeID && (delete data.id);
        const children = [];
        for (let childTopic of this.enumerateChilrenTopics()) {
            children.push(childTopic.exportTopicData());
        }
        (children.length > 0) && (data.children = children);
        return data;
    }

    /**
     * Collect the unused elements in the storage of the image resource
     */
    collectImageStorage() {
        try {
            const storageNode = this.$assignedNode.ownerSVGElement.querySelector("[season-topic-image-storage]");
            const rootNode = this.#getMindRootNode();
            if (storageNode && rootNode) {
                const nodeList = storageNode.querySelectorAll(":scope > *");
                nodeList && nodeList.forEach(item => {
                    let id = item.getAttribute("id");
                    if (id) { 
                        rootNode.querySelector(`use[href="#${id}"]`) || item.remove();
                    } else {
                        item.remove();
                    }
                });
            }
        } catch(err) {
            this.env.warn("Fail in collecting the images in the storage", err);
        }
    }

    /**
     * Get an iterator for enumerating the image in the storage
     * @yields {{id: String, href: String, width: Number, height: Number, sourceHRef: String}} The data of the image
     */
    * enumerateImageInStorage() {
        try {
            const storageNode = this.$assignedNode.ownerSVGElement.querySelector("[season-topic-image-storage]");
            if (storageNode) {
                const nodeList = [...storageNode.querySelectorAll(":scope > *")];
                for (let item of nodeList) {
                    let imageNode = item.querySelector(":scope > image");
                    yield {
                        id: item.getAttribute("id"),
                        href: imageNode && imageNode.getAttribute("href"),
                        width: item.$width || Number(item.getAttribute("width")) || 0,
                        height: item.$height || Number(item.getAttribute("height")) || 0,
                        sourceURL: item.getAttribute("d-url"),
                        sourceHRef: item.getAttribute("d-href")
                    };
                }
            }
        } catch(err) {
            this.env.warn("Fail in enumerating the images in the storage", err);
        }
    }

    /**
     * Move this topic to the center of the viewport
     * @returns {Topic} This instance
     */
    showInCenterOfView() {
        const { width:topicWidth, height:topicHeight } = this.#topicContentNode.getBBox();
        let topicCTM = this.#topicContentNode.getCTM();
        let topicX = topicCTM.e / topicCTM.a;
        let topicY = topicCTM.f / topicCTM.d;
        const svgNode = this.#topicContentNode.ownerSVGElement;
        let { x:viewX, y:viewY, width:viewWidth, height:viewHeight} = (svgNode.viewBox.baseVal || {x:0, y:0, width:0, height:0});
        (viewWidth <= 0) && (viewWidth = svgNode.width.baseVal.value);
        (viewHeight <= 0) && (viewHeight = svgNode.height.baseVal.value);
        topicX = parseInt(topicX + topicWidth / 2);
        topicY = parseInt(topicY + topicHeight / 2);
        const centerX = parseInt(viewWidth / 2);
        const centerY = parseInt(viewHeight / 2);
        viewX -= (centerX - topicX);
        viewY -= (centerY - topicY);
        svgNode.setAttribute("viewBox", `${viewX} ${viewY} ${viewWidth} ${viewHeight}`);

        this.notify("topic-event-view-move");

        return this;
    }

    /**
     * Move this topic into the viewport
     * @returns {Topic} This instance
     */
    showInView() {
        Topic.showNodeInSvgView(this.#topicContentNode, this.$assignedNode.ownerSVGElement);
        this.notify("topic-event-view-move");
        return this;
    }

    /**
     * Fire an event to notify a state
     * @param {String} _event The name of the event
     * @param {Any} _param The detail of the event
     * @returns {Topic} This instance
     */
    notify(_event, _param) {
        (typeof _param === "object") ? (_param.eventTarget = this) : (_param = {eventTarget: this});
        this.fireEvent(_event, _param);
        this.env.fireEvent(_event, _param);

        return this;
    }

    ["on-ebevent-rendering"](_data, _context, _limitLevel, _direction, _config) {
        ///////////////////////////////////////////////////////////////////////
        // rendering the content of the topic
        const curLevel = this[TOPIC_LEVEL];
        this.$assignedNode.setAttribute("season-topic-global", _data.id);
        this.$assignedNode.setAttribute("d-topic-level", curLevel);
        (curLevel > 0) && (this[TOPIC_DIRECTION] = _direction);
        // render the content of the title
        const topicContentNode = this.#topicContentNode;
        topicContentNode.setAttribute("d-topic-id", _data.id);
        topicContentNode.setAttribute("d-topic-level", curLevel);
        const titleNode = topicContentNode.querySelector(".season-topic-title");
        titleNode && ((titleNode.textContent = _data.title) || (titleNode.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"));
        const { width:titleWidth, height:titleHeight } = titleNode.getBBox();
        // render the extends
        const extendsNode = topicContentNode.querySelector("[season-topic-extends]");
        this.#renderTopicExtensions(extendsNode, _config, _data, this, _limitLevel, _direction);
        const { width:extendsWidth, height:extendsHeight } = extendsNode.getBBox();
        let titleTop;
        // render the image
        let imageWidth = 0, imageHeight = 0, topicImageNode;
        const imageRes = _data.image && this.env.translateHRefToURL(_data.image.src);
        if (imageRes) {
            topicImageNode = this.acquireNode(":scope > [season-topic-content-group] > .season-topic-image", this.#topicContentNode, "beforeend");
            imageWidth = (Number(_data.image.width) || Math.max(titleWidth, Number(_config.suitableTitleLineWidth) || MindmapEnvironment.DefaultConfig.suitableTitleLineWidth));
            imageHeight = (Number(_data.image.height) || 0);
            imageHeight || (imageHeight = imageWidth / 4 * 3);
            if (topicImageNode) {
                topicImageNode.setAttribute("width", imageWidth);
                topicImageNode.setAttribute("height", imageHeight);
                this.#loadImageInStorage(imageRes.destination, imageRes.source, topicImageNode, imageWidth, imageHeight, _config);
                titleTop = _config.padding * 2 + imageHeight;
            } else {
                titleTop = _config.padding;
            }
        } else {
            topicImageNode = this.acquireNode(":scope > [season-topic-content-group] > .season-topic-image");
            topicImageNode && topicImageNode.remove();
            topicImageNode = undefined;
            titleTop = _config.padding;
        }
        // locate the content
        let titleAndExtendWidth = titleWidth + ((extendsWidth > 0) ? (_config.padding + extendsWidth) : 0);
        let maxWidth;
        const suitableTitleLineWidth = (Number(_config.suitableTitleLineWidth) || MindmapEnvironment.DefaultConfig.suitableTitleLineWidth);
        if ((titleAndExtendWidth > imageWidth) && (titleWidth > suitableTitleLineWidth || extendsWidth > suitableTitleLineWidth) && (extendsWidth > titleWidth)) {
            // the title + extends line is too long, so split them to two lines
            maxWidth = Math.max(titleWidth, imageWidth, extendsWidth);
            titleNode.setAttribute("transform", `translate(${(titleWidth >= maxWidth) ? _config.padding : (_config.padding + (maxWidth - titleWidth) / 2)}, ${titleTop})`);
            extendsNode.setAttribute("transform", `translate(${(extendsWidth >= maxWidth) ? _config.padding : (_config.padding + (maxWidth - extendsWidth) / 2)}, ${titleTop += _config.padding + titleHeight})`);
            titleTop += extendsHeight;
        } else {
            // the title and extends are in the same line
            let centerPadding;
            if (titleAndExtendWidth < imageWidth) {
                centerPadding = _config.padding + (imageWidth - titleAndExtendWidth) / 2;
                maxWidth = imageWidth;
            } else {
                centerPadding = _config.padding;
                maxWidth = titleAndExtendWidth;
            }
            titleNode.setAttribute("transform", `translate(${centerPadding}, ${titleTop})`);
            extendsNode.setAttribute("transform", `translate(${centerPadding + _config.padding + titleWidth}, ${titleTop})`);
            titleTop += Math.max(titleHeight, extendsHeight);
        }
        topicImageNode && topicImageNode.setAttribute("transform", `translate(${(imageWidth >= maxWidth) ? _config.padding : (_config.padding + ((maxWidth - imageWidth) / 2))}, ${_config.padding})`);
        const boxNode = topicContentNode.querySelector(".season-topic-box");
        const boxWidth = (_context.contentWidth = _config.padding * 2 + maxWidth);
        const boxHeight = (_context.contentHeight = _config.padding + titleTop);
        if (boxNode) {
            boxNode.setAttribute("href", `#${_config.topicBoxRefID || "topic-default-box"}`);
            boxNode.setAttribute("width", boxWidth);
            boxNode.setAttribute("height", boxHeight);
            let style = boxNode.style;
            style.setProperty("--topic-rect-width", `${boxWidth}px`);
            style.setProperty("--topic-rect-height", `${boxHeight}px`);
            style.setProperty("--topic-title-top", `${titleTop}px`);
        }
        // render the fold icon
        const childrenNodes = (_context.childrenNodes = this.#getChildrenNods());
        let isFold;
        if ((curLevel > 0) && childrenNodes && (childrenNodes.length > 0)) {
            isFold = !((_limitLevel > curLevel) || ((isNaN(_limitLevel) || (_limitLevel <= 0)) && (!this[TOPIC_FOLD])));
            this[TOPIC_FOLD] = isFold;
            const topicFoldNode = this.acquireNode(':scope > [season-topic-content-group] > [season-topic-content-type="fold"]', this.#topicContentNode, "beforeend");
            if (topicFoldNode) {
                topicFoldNode.setAttribute("href", isFold ? "#topic-fold-icon-plus" : "#topic-fold-icon-minus");
                topicContentNode.insertAdjacentElement("beforeend", topicFoldNode);
                const { width:foldWidth, height:foldHeight } = topicFoldNode.getBBox();
                topicFoldNode.setAttribute("transform", `translate(${_direction ? (boxWidth - (foldWidth / 2)) : (0 - foldWidth / 2)}, ${(boxHeight - foldHeight) / 2})`);
            }
        } else {
            isFold = (this[TOPIC_FOLD] = false);
            const topicFoldNode = this.acquireNode(':scope > [season-topic-content-group] > [season-topic-content-type="fold"]');
            topicFoldNode && topicFoldNode.remove();
        }

        ///////////////////////////////////////////////////////////////////////
        // triger rendering the children topics
        const childrenGroupNode = this[CHILDREN_GROUP_NODE];
        if (!isFold) {
            try {
                childrenGroupNode && childrenGroupNode.isConnected || this.$assignedNode.insertAdjacentElement("afterbegin", childrenGroupNode);
                const dirIndexThresold = (_context.dirIndexThresold = parseInt((childrenNodes.length + 1) / 2));
                const rightPriority = (_context.rightPriority = (String(_config.directionPriority).toLowerCase() !== "left"));
                childrenNodes.forEach((item, index) => {
                    let childTopic = Topic.GetInstance(item);
                    childTopic && childTopic.#renderTopic(_limitLevel, (this[TOPIC_LEVEL] <= 0) ? (rightPriority ^ (index >= dirIndexThresold)) : _direction);
                });
            } catch (_err) {
                console.error("Exception raised in rendering children", _err);
            }
        } else {
            childrenGroupNode && childrenGroupNode.remove();
        }
    }

    ["on-ebevent-rendered"](_data, _context, _limitLevel, _direction, _config) {
        const childrenNodes = _context.childrenNodes;
        const childrenGroupNode = this[CHILDREN_GROUP_NODE];
        if (childrenNodes && (childrenNodes.length > 0) && childrenGroupNode) {
            let siblingMargin, levelMargin;
            if ((this.level + 1) >= _config.secondaryTopicLevel) {
                siblingMargin = _config.secondarySiblingMargin;
                levelMargin = _config.secondaryLevelMargin;
            } else {
                siblingMargin = _config.siblingMargin;
                levelMargin = _config.levelMargin;
            }
            //const { width:contentWidth, height:contentHeight } = this.#topicContentNode.getBBox();
            const { contentWidth, contentHeight} = _context;
            
            // locate each child and draw the connect line
            if (this[TOPIC_LEVEL] < 1) {
                // the root topic should divid the children to left and right
                let leftContext = {
                    itemList: [],
                    _config,
                    siblingMargin,
                    levelMargin,
                    contentWidth,
                    listHeight: 0
                };
                let rightContext = {
                    itemList: [],
                    _config,
                    siblingMargin,
                    levelMargin,
                    contentWidth,
                    listHeight: 0
                };
                const dirIndexThresold = _context.dirIndexThresold;
                const rightPriority = _context.rightPriority;
                childrenNodes.forEach((item, index) => {
                    let childTopic = Topic.GetInstance(item);
                    if (childTopic) {
                        (rightPriority ^ (index >= dirIndexThresold))
                            ? childTopic.#calculatePositionAsRightChild(rightContext) 
                            : childTopic.#calculatePositionAsLeftChild(leftContext);
                    }
                });
                leftContext.listHeight -= siblingMargin;
                rightContext.listHeight -= siblingMargin;
                this.#balanceChildListPosition(leftContext, rightContext);
                this.#locateChild(rightContext);
                this.#locateChild(leftContext);
                const centerY = ((rightContext.listHeight >= leftContext.listHeight) ? rightContext.listHeight : leftContext.listHeight) / 2;
                this.#drawChildConnectLine(rightContext, childrenGroupNode, centerY);
                this.#drawChildConnectLine(leftContext, childrenGroupNode, centerY);
            } else if (!this[TOPIC_FOLD]) {
                // the no-root topic locatet the children in the specail side
                let context = {
                    itemList: [],
                    _config,
                    siblingMargin,
                    levelMargin,
                    contentWidth,
                    listHeight: 0
                };
                _direction 
                    ? _context.childrenNodes.forEach(item => {
                        let childTopic = Topic.GetInstance(item);
                        childTopic && childTopic.#calculatePositionAsRightChild(context);
                    }) : _context.childrenNodes.forEach(item => {
                        let childTopic = Topic.GetInstance(item);
                        childTopic && childTopic.#calculatePositionAsLeftChild(context);
                    });
                context.listHeight -= siblingMargin;
                this.#locateChild(context);
                const centerY = context.listHeight / 2;
                this.#drawChildConnectLine(context, childrenGroupNode, centerY);
            }

            // locate the global children group
            const { y:childrenTop, height:childrenHeight } = childrenGroupNode.getBBox();
            childrenGroupNode.setAttribute("transform", `translate(0, ${(contentHeight - (childrenHeight + childrenTop)) / 2})`);
        }
    }

    /**
     * Render all the topic
     * @returns {Topic} This instance
     */
    render() {
        this.env.fireEvent("topic-event-before-render");
        ((this[TOPIC_LEVEL] < 1) ? this : this.rootTopic).#renderTopic(...arguments);
        this.env.fireEvent("topic-event-after-render");
        return this;
    }

    /**
     * Get the focus topic
     * @returns {Topic} The focus topic
     */
    getFocus() {
        return Topic.getFocusTopic(this.#getMindRootNode());
    }

    /**
     * Kill the focus of this topic
     * @returns {Topic} This instance
     */
    killFocus() {
        if (this.$assignedNode.hasAttribute(FOCUS_ATTR_KEY) || this.#topicContentNode.hasAttribute(FOCUS_ATTR_KEY)) {
            this.notify("topic-event-cancel-edit");
            this.notify("topic-event-kill-focus");
            
            this.$assignedNode.removeAttribute(FOCUS_ATTR_KEY);
            this.#topicContentNode.removeAttribute(FOCUS_ATTR_KEY);
        }

        return this;
    }

    /**
     * Set the focus of this topic
     * @param {Boolean} _resultForChecked Optional. Indicate if the result is the result of the setting action
     * @returns {Boolean|Topic} If the _resultForCheched is true, the function return true means the topic was not focus and the setting action is successful. If the _resultForChecked is not true, the function return the instance of this topic.
     */
    setFocus(_resultForChecked) {
        const oriFocus = this.getFocus();
        if (!this.equal(oriFocus)) {
            (oriFocus instanceof Topic) && oriFocus.killFocus();

            this.$assignedNode.setAttribute(FOCUS_ATTR_KEY, "true");
            this.#topicContentNode.setAttribute(FOCUS_ATTR_KEY, "true");

            this.notify("topic-event-set-focus");

            return _resultForChecked ? true : this;
        } else {
            return _resultForChecked ? false : this;
        }
    }

    /**
     * Check if the topic has focus
     * @type {Boolean}
     */
    get hasFocus() {
        return this.$assignedNode.hasAttribute(FOCUS_ATTR_KEY);
    }

    /**
     * Create a child topic in this topic.
     * If the data contains the children, all the descendant topics will be created.
     * @param {TopicData} _data The data of the child topic
     * @param {Topic} _nextSiblingTopic Optional. Indicate the new topic insert before which topic. The new topic will add at the end of the children topics if the argument is ignored.
     * @param {Boolean} _forbitNotify Set true to forbit emitting the notification event
     * @returns {Topic} The new topic
     */
    createChild(_data, _nextSiblingTopic, _forbitNotify) {
        const newTopic = this.factor.generate(this[CHILDREN_GROUP_NODE], Topic, _data, this[TOPIC_LEVEL] + 1, this.env);
        if (newTopic) {
            (_nextSiblingTopic instanceof Topic) && this.equal(_nextSiblingTopic.parentTopic) && _nextSiblingTopic.$assignedNode.insertAdjacentElement("beforebegin", newTopic.$assignedNode);
            (!_forbitNotify) && newTopic.notify("topic-event-change", {
                action: "create"
            });
        }
        return newTopic;
    }

    /**
     * @summary Change the data of the topic
     * It's the best practice to change the data of the topic by this fucntion. Changing the data directly by the data member will not notify the changing singal to the watchers.
     * @param {String} _key The key of the member in the data
     * @param {Any} _newVal The new value of the member. If this argument is undefined, the member with the key will be deleted.
     * @param {Boolean} _forbitNotify Set true to forbit emitting the notification event
     * @returns {Topic} This instance
     */
    changeData(_key, _newVal, _forbitNotify) {
        if (_key) {
            const originValue = (_forbitNotify || cloneObject({}, this.data));
            if (undefined === _newVal) {
                delete this.data[_key];
            } else {
                this.data[_key] = _newVal;
            }
            (!_forbitNotify) && this.notify("topic-event-change", {
                action: "changeData",
                key: _key,
                originValue
            });
        }
        return this;
    }

    /**
     * Move the topic to an other position
     * @param {Topic} _parentTopic The destination parent topic
     * @param {Topic} _nextSiblingTopic Optional. The destination sibling topic. The topic will move to the end of the _parentTopic's children if this argument is ignored.
     * @param {Boolean} _forbitNotify Set true to forbit emitting the notification event
     * @returns {Topic} This instance
     */
    moveTo(_parentTopic, _nextSiblingTopic, _forbitNotify) {
        if (_parentTopic instanceof Topic) {

            const originParent = this.parentTopic;
            const originSibling = this.nextSiblingTopic;
            
            if (!Topic.equal(originParent, _parentTopic)) {
                let parentChildrenGroupNode = this.$assignedNode.parentNode;
                let connectLineNode = parentChildrenGroupNode && parentChildrenGroupNode.querySelector(`path[d-topic-id="${this.id}"]`);
                connectLineNode && connectLineNode.remove();
            }

            if (_nextSiblingTopic && Topic.equal(_nextSiblingTopic.parentTopic, _parentTopic)) {
                _nextSiblingTopic.$assignedNode.insertAdjacentElement("beforebegin", this.$assignedNode);
            } else {
                _parentTopic[CHILDREN_GROUP_NODE] && _parentTopic[CHILDREN_GROUP_NODE].insertAdjacentElement("beforeend", this.$assignedNode);
            }
            this.#changeLevel(_parentTopic[TOPIC_LEVEL] + 1);

            (!_forbitNotify) && this.notify("topic-event-change", {
                action: "move",
                originParent,
                originSibling
            });
        } else {
            this.env.warn("No effect if the _parentTopic is not an instance of Topic");
        }

        return this;
    }

    /**
     * Drop the topic
     * @param {Function} _rootChecker Optional. If you want to drop the root topic, you should pass a function impelement increasing action as this argument.
     * @param {Boolean} _forbitNotify Set true to forbit emitting the notification event
     */
    drop(_rootChecker, _forbitNotify) {
        let rndCode;
        if ((this.level > 0) 
            || ((typeof _rootChecker === "function") 
                && (_rootChecker(rndCode = parseInt(Math.random() * 100)) === (rndCode + 1)))) {

            (this.level > 0) && (!_forbitNotify) && this.notify("topic-event-change", {
                action: "drop",
            });

            this.killFocus();

            for (let descendant of this.enumerateDescendantTopics()) {
                descendant[CHILDREN_GROUP_NODE] = undefined;
                descendant.unmount();
            }

            const parent = this.parentTopic;
            if (parent) {
                let connectLineNode = parent[CHILDREN_GROUP_NODE].querySelector(`path[d-topic-id="${this.id}"]`);
                connectLineNode && connectLineNode.remove();
            }

            this[CHILDREN_GROUP_NODE] = undefined;
            this.unmount();
        }
    }

    /**
     * Get the rect of the topic in the screen
     * @param {String} _type Optional. The selector to matche the content of the topic. The ".season-topic-box" will be taken as default.
     * @returns {DOMRect} The destination rect
     */
    getRect(_type) {
        let node = (_type ? this.#topicContentNode.querySelector(_type)
                          : (this.#topicContentNode.querySelector(".season-topic-box") || this.#topicContentNode));
        let rect = node && node.getBoundingClientRect();

        return rect || new DOMRect();
    }

    /**
     * Get the box of the topic
     * @param {String} _type Optional. The selector to matche the content of the topic. The ".season-topic-box" will be taken as default.
     * @returns {SVGRect} The destination box
     */
    getBBox(_type) {
        let node = (_type ? this.#topicContentNode.querySelector(_type)
                          : (this.#topicContentNode.querySelector(".season-topic-box") || this.#topicContentNode));
        let box = (node instanceof SVGGraphicsElement) && node.getBBox();

        return box || {x:0,y:0,width:0,height:0};
    }

    /**
     * Get the rect of the topic in the svg image
     * @param {String} _type Optional. The selector to matche the content of the topic. The ".season-topic-box" will be taken as default.
     * @returns {{x: Number, y: Number, width: Number, height: Number}} The destination rect
     */
    getGraphicRect(_type) {
        let node = (_type ? this.#topicContentNode.querySelector(_type)
                          : (this.#topicContentNode.querySelector(".season-topic-box") || this.#topicContentNode));

        if (node instanceof SVGGraphicsElement) {
            let ctm = (node.getCTM() || node.getScreenCTM());
            let bbox = node.getBBox();
            const svgCTM = this.#topicContentNode.ownerSVGElement.getScreenCTM().inverse();
            const { e:x, f:y } = svgCTM.translate(ctm.e, ctm.f);
            let { e:width, f:height} = ctm.translate(bbox.width, bbox.height);
            width -= ctm.e, height -= ctm.f;
            return { x, y, width, height };
        } else {
            return { x: 0, y: 0, width: 0, height: 0 };
        }
    }

    /**
     * Get the transform matrix of the topic
     * @param {String} _type Optional. The selector to matche the content of the topic. The ".season-topic-box" will be taken as default.
     * @returns {DOMMatrix} The destination matrix
     */
    getMatrix(_type) {
        let node = (_type ? this.#topicContentNode.querySelector(_type)
                          : (this.#topicContentNode.querySelector(".season-topic-box") || this.#topicContentNode));
        let ctm = (node instanceof SVGGraphicsElement) && (node.getCTM() || node.getScreenCTM());

        return ctm || new DOMMatrix([1, 0, 0, 1, 0, 0]);
    }

    /**
     * Get the rect of the topic in the viewport
     * @param {String} _type Optional. The selector to matche the content of the topic. The ".season-topic-box" will be taken as default.
     * @returns {{x: Number, y: Number, width: Number, height: Number}} The destination rect
     */
    getRectInViewport(_type) {
        let node = (_type ? this.#topicContentNode.querySelector(_type)
                          : (this.#topicContentNode.querySelector(".season-topic-box") || this.#topicContentNode));

        if (node instanceof SVGGraphicsElement) {
            let ctm = (node.getCTM() || node.getScreenCTM());
            let bbox = node.getBBox();
            let pt = ctm.translate(bbox.x, bbox.y);
            let et = ctm.translate(bbox.x + bbox.width, bbox.y + bbox.height);
            return { x: pt.e, y: pt.f, width: et.e - pt.e, height: et.f - pt.f };
        } else {
            return { x: 0, y: 0, width: 0, height: 0 };
        }
    }

    /**
     * Get the box of the global stage of this topic
     * @returns {{x: Number, y: Number, width: Number, height: Number}} The destination rect
     */
    getGlobalRect() {
        const rootNode = this.#getMindRootNode();
        return rootNode ? rootNode.getBBox() : {x:0, y:0, width:0, height:0};
    }

    /**
     * The visible state of the topic
     * @type {Boolean}
     */
    set visible(_val) {
        const display = (_val ? "" : "none");
        this.$assignedNode.style.display = display;
        const lineNode = this.$assignedNode.parentNode.querySelector(`path[d-topic-id="${this.id}"]`);
        lineNode && (lineNode.style.display = display);
    }

    /**
     * The visible state of the topic
     * @ignore
     */
    get visible() {
        return this.$assignedNode.style.display != "none";
    }

    /**
     * Get an instance of the special extension element in this topic
     * @param {String} _extensionName The name of the extension element. such as "task-marker", "priority", and so on.
     * @returns {TopicExtension} The instance of the extension element
     */
    getExtensionInstance(_extensionName) {
        if (_extensionName) {
            let ret = undefined;
            try {
                const extendsNode = this.#topicContentNode.querySelector("[season-topic-extends]");
                const nodes = extendsNode && extendsNode.querySelectorAll(":scope > *");
                nodes && nodes.forEach(node => {
                    let extension = TopicExtension.GetInstance(node);
                    if (extension && (extension.name === _extensionName)) {
                        ret = extension;
                        throw null;
                    }
                });
            } catch (err) {
                err && this.env.warn("Fail in get extension instance of", _extensionName, err);
            }
            return ret;
        }
    }

    /**
     * Export the image of this topic
     * @param {Object} _opt Optional. The options
     * @param {String} _opt.fill The color of the background
     * @param {String} _opt.type Optional. The type of the destination image. Such as png, jpeg, and so on
     * @returns {Promise<{width:Number, height:Number: data:Any}>} The result
     */
    exportImage(_opt) {
        let hasFocus = this.hasFocus;
        this.env.fireEvent("topic-event-before-render");
        hasFocus && this.killFocus();
        let ret;
        try {
            _opt || (_opt = {});
            const srcSVG = this.$assignedNode.ownerSVGElement;
            const cloneSVG = srcSVG.cloneNode(true);
            const stage = cloneSVG.querySelector("g[season-topic-root-node]");
            if (stage) {
                const { x, y, width, height } = this.$assignedNode.getBBox();
                cloneSVG.setAttribute("overflow", "hidden");
                cloneSVG.setAttribute("width", width);
                cloneSVG.setAttribute("height", height);
                cloneSVG.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
                cloneSVG.style.fontSize = getComputedStyle(srcSVG)["font-size"];
                stage.innerHTML = "";
                const cloneTopicNode = this.$assignedNode.cloneNode(true);
                cloneTopicNode.removeAttribute("transform");
                cloneTopicNode.style.transform = "";
                stage.appendChild(cloneTopicNode);
                stage.querySelectorAll("[season-topic-focus]").forEach(item => item.removeAttribute("season-topic-focus"));
                const serializer = new XMLSerializer();
                const source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(cloneSVG);
                ret = this.env.getImageData("data:image/svg+xml;charset=utf-8," + encodeURIComponent(source), Object.assign({}, _opt, {
                    width, 
                    height
                }));
            }
        } catch (err) {
            ret = Promise.resolve(undefined);
            this.env.warn("Exception raised in export image from topic", err);
        }
        hasFocus && this.setFocus();
        this.env.fireEvent("topic-event-after-render");
        return ret;
    }
    
    ["on-topic-domevent-click"](_eventDetail) {
        _eventDetail.preventDefault = true;
        if (!this.setFocus(true)) {
            const triggerContentType = _eventDetail.triggerContentType;
            if (triggerContentType === "fold") {
                this[TOPIC_FOLD] = !this[TOPIC_FOLD];
                this.render();
            } else {
                _eventDetail.extensionInstance = this.getExtensionInstance(triggerContentType);
                this.notify("topic-event-trigger", _eventDetail);
            }
        } else {
            _eventDetail.triggerContentType = undefined;
            this.notify("topic-event-trigger", _eventDetail);
        }
    }

    ["on-topic-domevent-dblclick"](_eventDetail) {
        _eventDetail.preventDefault = true;
        if (this.env.editable) {
            this.showInView();
            this.notify("topic-event-edit", _eventDetail);
        }
    }

    ["on-topic-domevent-mousedown"](_eventDetail) {
        const originEvent = _eventDetail.originEvent;
        if ((originEvent.buttons === 1) && (!this.env.dragContext) && this.env.editable && this.env.dragable && (this[TOPIC_LEVEL] > 0)) {
            const dragContext = {
                sourceTopic: this,
                parentTopic: this.parentTopic,
                draging: false,
                timeStamp: Date.now()
            };
            this.env.dragContext = dragContext;
        }
    }

    ["on-topic-domevent-mousemove"](_eventDetail) {
        const dragContext = this.env.dragContext;
        if (dragContext && !dragContext.draging) {
            const config = this.env.config;
            const deltaTime = Date.now() - dragContext.timeStamp;
            if ((this.hasFocus && (deltaTime >= config.dragStartFocusFilterTimer)) || (deltaTime >= config.dragStartNoFocusFilterTimer)) {
                if (this.equal(dragContext.sourceTopic)) {
                    this.notify("topic-event-cancel-edit");
                    _eventDetail.preventDefault = true;
                    dragContext.draging = true;
                    this.factor.prepareDragTipElements(this, dragContext);
                    this.visible = false;
                } else {
                    this.factor.clearDragContext(this.env);
                }
            }
        }
    }

    ["on-topic-domevent-mouseover"](_eventDetail) {
        const dragContext = this.env.dragContext;
        if (dragContext && dragContext.draging && !this.equal(dragContext.parentTopic)) {
            this.factor.clearDragoverTimer(dragContext);

            dragContext.dragoverTopic = this;
            dragContext.dragoverTimer = setTimeout(() => {
                dragContext.parentTopic = dragContext.dragoverTopic;
                this.factor.updateDragTipElements(dragContext);
                this.factor.clearDragoverTimer(dragContext);
            }, 1000);
        }
    }

    ["on-topic-domevent-mouseout"](_eventDetail) {
        const dragContext = this.env.dragContext;
        if (dragContext && this.equal(dragContext.dragoverTopic)) {
            this.factor.clearDragoverTimer(dragContext);
        }
    }
    //#endregion
}