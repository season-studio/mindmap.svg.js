/**
 * @author season <season-studio@outlook.com>
 * @license Apache-2.0
 */

import { MindmapEnvironment } from "./mindmapEnv";
import { generateDialogBubblePath } from "./miscUtilities";
import { assert } from "../thirdpart/toolkits/src/assert";
import { readonlyMember } from "../thirdpart/toolkits/src/readonly";

function getLimitProp(_val1, _val2) {
    return Math.min(Number(_val1) || Number.MAX_VALUE, Number(_val2) || Number.MAX_VALUE);
}

function setupBackground(_node, _bgNode, _context, _opt) {
    let generatorCfg = _node.getAttribute("mmap-layout-background");
    let generator = generatorCfg && (_opt[generatorCfg] || MindmapAddinPanel.backgroundGenerator[generatorCfg]);
    if (typeof generator === "function") {
        const box = _node.getBBox();
        const left = (box.x >= 0 ? 0 : box.x);
        const top = (box.y >= 0 ? 0 : box.y);
        const width = (box.width + Math.abs(box.x) * 2);
        const height = (box.height + Math.abs(box.y) * 2);
        _bgNode = generator.call(this, _bgNode, { left, top, width, height }, _node, _context, _opt);
        if (_bgNode) {
            _bgNode.classList.add("mmap-layout-background");
            //(_bgNode.style.display === "none") && (_bgNode.style.display = "");
            _node.insertAdjacentElement("afterbegin", _bgNode);
        }
    } /* else {
        _bgNode && _bgNode.remove();
    } */
}

function unspecialLayout(_node, _context, _opt) {
    _node.querySelectorAll(":scope > *").forEach(item => dispacthLayout.call(this, item, _context, _opt));
}

function prepareCurrentContext(_node, _context) {
    const maxWidth = getLimitProp(_node.getAttribute("mmap-layout-max-width"), _context.maxWidth);
    let margin = Number(_node.getAttribute("mmap-layout-margin") || undefined);
    isNaN(margin) && (margin = (Number(_context.margin) || 0));
    let padding = Number(_node.getAttribute("mmap-layout-padding") || undefined);
    isNaN(padding) && (padding = (Number(_context.padding) || 0));
    return { maxWidth, margin, padding };
}

function lineLayout(_node, _context, _opt) {
    const subContext = prepareCurrentContext(_node, _context);
    const { maxWidth, margin, padding } = subContext;
    let offsetX = padding;
    let offsetY = padding;
    let lineHeight = 0;
    _node.querySelectorAll(":scope > *").forEach(item => {
        dispacthLayout.call(this, item, subContext, _opt);
        if (item instanceof SVGGraphicsElement) {
            const { width:itemWidth, height:itemHeight } = item.getBBox();
            if (itemWidth > 0) {
                const transform = item.getAttribute("predefine-transform");
                if ((offsetX + itemWidth + padding) > maxWidth) {
                    offsetX = padding;
                    offsetY += lineHeight + margin;
                    lineHeight = itemHeight;
                } else {
                    (lineHeight < itemHeight) && (lineHeight = itemHeight);
                }
                item.setAttribute("transform", transform ? `translate(${offsetX},${offsetY}),${transform}` : `translate(${offsetX},${offsetY})`);
                offsetX += itemWidth + margin;
            }
        }
    });
}

function rowLayout(_node, _context, _opt) {
    const subContext = prepareCurrentContext(_node, _context);
    const { margin, padding } = subContext;
    const rightNodes = [];
    let offsetY = padding;
    let offsetX = padding;
    _node.querySelectorAll(":scope > *").forEach(item => {
        dispacthLayout.call(this, item, subContext, _opt);
        if (item instanceof SVGGraphicsElement) {
            const { width:itemWidth, height:itemHeight } = item.getBBox();
            if (itemWidth > 0 && itemHeight > 0) {
                if (item.getAttribute("mmap-layout-align") === "right") {
                    rightNodes.push({y:offsetY, node:item, width:itemWidth});
                } else {
                    const transform = item.getAttribute("predefine-transform");
                    item.setAttribute("transform", transform ? `translate(${offsetX},${offsetY}),${transform}` : `translate(${offsetX},${offsetY})`);
                }
                offsetY += itemHeight + margin;
            }
        }
    });
    const {width:nodeWidth} = _node.getBBox();
    rightNodes.forEach(item => {
        const transform = item.node.getAttribute("predefine-transform");
        item.node.setAttribute("transform", transform ? `translate(${nodeWidth - item.width},${item.y}),${transform}` : `translate(${nodeWidth - item.width},${item.y})`);
    })
}

function dispacthLayout(_node, _context, _opt) {
    _context || (_context = {});
    
    const bgNode = _node.querySelector(":scope > .mmap-layout-background");
    bgNode && bgNode.remove();//(bgNode.style.display = "none");

    const layoutType = _node.getAttribute("mmap-layout");
    const fn = (MindmapAddinPanel.layout[layoutType] || unspecialLayout);
    (typeof fn === "function") && fn.call(this, _node, _context, _opt);

    setupBackground.call(this, _node, bgNode, _context, _opt);
}

// the map of the instance of the MindmapAddinPanel
const InstanceMap = new WeakMap();

/**
 * @classdesc Class of the addin panel in the mindmap container.
 * The panel is implemented by SVG
 * @constructor
 * @param {SVGGraphicsElement} _parentNode the parent node for containing the panel
 * @param {Node|String} _content the content of the panel, it can be an instance of Node or a string of SVG
 * @param {Object} _opt the options
 * @param {*} _opt.singletonStamp Optional. The stamp if the panel should be singleton.
 * @param {*} _opt.singletonMutex Optional. The mutex symbol for the singleton panel. The acquiring will close the existed panel with the same singletonStamp but with the different mutex symbol.
 * @param {*} _opt.rootAttrs Optional. The set of key-value pair which will be set as the attributes of the root node of the panel.
 * @param {MindmapEnvironment} _opt.env Optional. The enviroment of the mindmap viewer. This value must be set if the panel should be bind with the topic event. Such as the "mmap-bind-cancel-edit" or "mmap-bind-hide-in-render" is set as the attribute of the root node.
 * @param {Function} _opt.onInitialize Optional. The fucntion will be call when initializing the panel. This function will be called with the _opt as the argument.
 * @param {Function} _opt.onBeforeLayout Optional. The fucntion will be call before setting the layout of the panel. This function will be called with the _opt as the argument.
 * @param {Function} _opt.onAfterLayout Optional. The fucntion will be call after setting the layout of the panel. This function will be called with the _opt as the argument.
 * @param {Function} _opt.onClose Optional. The fucntion will be call when closing the panel. This function will be called with the _opt as the argument.
 * @returns an instance of MindmapAddinPanel
 */
export function MindmapAddinPanel(_parentNode, _content, _opt) {
    if (!(this instanceof MindmapAddinPanel)) {
        return new MindmapAddinPanel(...arguments);
    }

    assert(_parentNode instanceof SVGGraphicsElement, Error, "_parentNode must be an instance of SVGGraphicsElement");
    assert(_content, Error, "_content must be an instance of Node or a XML snippet of the content");

    _opt || (_opt = {});

    if (_opt.singletonStamp) {
        let singletonNode = _parentNode.querySelector(`:scope > [mmap-singleton="${_opt.singletonStamp}"]`);
        let singleton = (singletonNode && InstanceMap.get(singletonNode));
        if (singleton instanceof MindmapAddinPanel) {
            if ((_opt.singletonMutex !== undefined) && (String(_opt.singletonMutex) !== singletonNode.getAttribute("mmap-singleton-mutex"))) {
                singleton.close();
            } else {
                return singleton;
            }
        }
    }

    let rootNode;
    if (_content instanceof Node) {
        rootNode = _content;
    } else {
        rootNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
        rootNode.insertAdjacentHTML("afterbegin", _content);
    }
    if (_opt.singletonStamp) {
        rootNode.setAttribute("mmap-singleton", _opt.singletonStamp);
        (_opt.singletonMutex !== undefined) && rootNode.setAttribute("mmap-singleton-mutex", _opt.singletonMutex);
    }
    _parentNode.appendChild(rootNode);
    InstanceMap.set(rootNode, this);

    if (_opt.rootAttrs) {
        for (let key in _opt.rootAttrs) {
            rootNode.setAttribute(key, _opt.rootAttrs[key]);
        }
    }

    const onBeforeRender = (function () {
        rootNode.remove();
    }).bind(this);

    const onAfterRender = (function () {
        _parentNode.appendChild(rootNode);
        if (rootNode.getAttribute("mmap-bind-hide-in-render") === "relayout") {
            this.relayout();
        }
    }).bind(this);

    const onClick = (function (_event) {
        try {
            _event.composedPath().forEach(node => {
                const eventMapKey = node.getAttribute("mmap-event-click");
                const fn = (eventMapKey && _opt[eventMapKey]);
                if (typeof fn === "function") {
                    fn.call(this, _event, node, _opt, eventMapKey);
                    _event.preventDefault();
                    _event.stopPropagation();
                    throw null;
                }
                if (node === rootNode) {
                    _event.preventDefault();
                    _event.stopPropagation();
                    throw null;
                }
            });
        } catch (_err) {
            _err && console.warn("Fail in processing click event in MindmapAddinPanel", _err);
        }
    }).bind(this);

    const onDoubleClick = (function (_event) {
        try {
            _event.composedPath().forEach(node => {
                const eventMapKey = node.getAttribute("mmap-event-dblclick");
                const fn = (eventMapKey && _opt[eventMapKey]);
                if (typeof fn === "function") {
                    fn.call(this, _event, node, _opt, eventMapKey);
                    _event.preventDefault();
                    _event.stopPropagation();
                    throw null;
                }
                if (node === rootNode) {
                    _event.preventDefault();
                    _event.stopPropagation();
                    throw null;
                }
            });
        } catch (_err) {
            _err && console.warn("Fail in processing dblclick event in MindmapAddinPanel", _err);
        }
    }).bind(this);

    const onKeydown = (function (_event) {
        try {
            _event.composedPath().forEach(node => {
                const eventMapKey = node.getAttribute("mmap-event-keydown");
                const fn = (eventMapKey && _opt[eventMapKey]);
                if (typeof fn === "function") {
                    fn.call(this, _event, node, _opt, eventMapKey);
                    throw null;
                }
                if (node === rootNode) {
                    (String(_event.target.nodeName).toLowerCase() !== "input") && (!Boolean(_event.target.getAttribute("contenteditable"))) && _event.preventDefault();
                    throw null;
                }
            });
        } catch (_err) {
            _err && console.warn("Fail in processing keydown event in MindmapAddinPanel", _err);
        } finally {
            _event.stopPropagation();
        }
    }).bind(this);

    const onFilter = (function (_event) {
        const eventDetail = _event.detail;
        const contentType = (eventDetail && eventDetail.triggerContentType);
        const filterCode = rootNode.getAttribute(_event.type === "topic-event-trigger" ? "mmap-bind-filter-trigger" : "mmap-bind-filter-edit");
        (filterCode ? (contentType !== filterCode) : (contentType && (contentType !== "title"))) && this.close();
    }).bind(this);

    function onFilterMouseDown(_event) {
        _event.stopPropagation();
    }

    function onFilterMouseUp(_event) {
        _event.stopPropagation();
    }

    const onClose = (function () {
        (typeof _opt.onClose === "function") && _opt.onClose.call(this, _opt);
        if (_opt.env) {
            _opt.env.removeEventListener("topic-event-cancel-edit", onClose);
            _opt.env.removeEventListener("topic-event-before-render", onBeforeRender);
            _opt.env.removeEventListener("topic-event-after-render", onAfterRender);
            _opt.env.removeEventListener("topic-event-trigger", onFilter);
            _opt.env.removeEventListener("topic-event-edit", onFilter);
        }
        rootNode.removeEventListener("click", onClick);
        rootNode.removeEventListener("dblclick", onDoubleClick);
        rootNode.removeEventListener("mousedown", onFilterMouseDown);
        rootNode.removeEventListener("mouseup", onFilterMouseUp);
        rootNode.removeEventListener("keydown", onKeydown);

        const svg = rootNode.ownerSVGElement;
        svg ? svg.focus() : _parentNode.focus();

        rootNode.remove();
    }).bind(this);

    readonlyMember(this, {
        rootNode,
        relayout: () => { 
            (typeof _opt.onBeforeLayout === "function") && _opt.onBeforeLayout.call(this, _opt);
            dispacthLayout.call(this, rootNode, undefined, _opt); 
            (typeof _opt.onAfterLayout === "function") && _opt.onAfterLayout.call(this, _opt);
        },
        close: onClose
    });

    rootNode.addEventListener("click", onClick);
    rootNode.addEventListener("dblclick", onDoubleClick);
    rootNode.addEventListener("mousedown", onFilterMouseDown);
    rootNode.addEventListener("mouseup", onFilterMouseUp);
    rootNode.addEventListener("keydown", onKeydown);
    if (_opt.env) {
        rootNode.hasAttribute("mmap-bind-cancel-edit") && _opt.env.addEventListener("topic-event-cancel-edit", onClose);
        if (rootNode.hasAttribute("mmap-bind-hide-in-render")) {
            _opt.env.addEventListener("topic-event-before-render", onBeforeRender);
            _opt.env.addEventListener("topic-event-after-render", onAfterRender);
        }
        rootNode.hasAttribute("mmap-bind-filter-trigger") && _opt.env.addEventListener("topic-event-trigger", onFilter);
        rootNode.hasAttribute("mmap-bind-filter-edit") && _opt.env.addEventListener("topic-event-edit", onFilter);
    }

    (typeof _opt.onInitialize === "function") && _opt.onInitialize.call(this, _opt);
    
    this.relayout();
}

const DefaultBackgroundStyle = "fill:#fff;stroke-width:0.5px;stroke:#ccc;filter:drop-shadow(0px 3px 5px #aaa);";

function setAttrStyleForNode(_node, _opt) {
    if (_opt.attrs) {
        for (let key in _opt.attrs) {
            _node.setAttribute(key, _opt.attrs[key]);
        }
    }
    if (_opt.style) {
        for (let key in _opt.style) {
            _node.style[key] = _opt.style[key];
        }
    }
}

readonlyMember(MindmapAddinPanel, {
    layout: readonlyMember({}, {
        line: lineLayout,
        row: rowLayout
    }),
    InstanceMap,
    backgroundGenerator: readonlyMember({}, {
        dialogBubble(_bgNode, { left, top, width, height }, _node, _context, _opt, _opt2) {
            if (!(_bgNode instanceof SVGPathElement)) {
                _bgNode && _bgNode.remove();
                _bgNode = document.createElementNS("http://www.w3.org/2000/svg", "path");
            }
            if (_bgNode) {
                _opt2 || (_opt2 = {});
                _bgNode.setAttribute("d", 
                    generateDialogBubblePath(left, top, width, height, 
                                             (Number(_opt2.cornerRadius) || 7), 
                                             (Number(_opt2.raiseHeight) || 10),
                                             (Number(_opt2.raiseBase) || 10),
                                             (Number(_opt2.raiseOffset) || 0),
                                             _opt2.raiseEdge));
                _bgNode.setAttribute("style", DefaultBackgroundStyle);
                setAttrStyleForNode(_bgNode, _opt2);
            }
            return _bgNode;
        },
        roundRect(_bgNode, { left, top, width, height }, _node, _context, _opt, _opt2) {
            if (!(_bgNode instanceof SVGRectElement)) {
                _bgNode && _bgNode.remove();
                _bgNode = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            }
            if (_bgNode) {
                _bgNode.setAttribute("style", DefaultBackgroundStyle);
                _bgNode.setAttribute("rx", (Number(_opt2 && _opt2.cornerRadius) || 7));
                _bgNode.setAttribute("ry", (Number(_opt2 && _opt2.cornerRadius) || 7));
                _bgNode.setAttribute("x", left);
                _bgNode.setAttribute("y", top);
                _bgNode.setAttribute("width", width);
                _bgNode.setAttribute("height", height);
                setAttrStyleForNode(_bgNode, _opt2);
            }
            return _bgNode;
        },
        auto(_bgNode, { left, top, width, height }, _node, _context, _opt, _opt2) {
            if (!(_bgNode instanceof SVGRectElement)) {
                _bgNode && _bgNode.remove();
                _bgNode = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            }
            if (_bgNode) {
                _opt2 || (_opt2 = {});
                const attrOpt = (_node.hasAttribute("d-auto-background") && JSON.parse(`{${String(_node.getAttribute(d-auto-background)).replace("\'", "\"")}}`));
                attrOpt && (_opt2 = Object.assign(attrOpt, _opt2));
                _bgNode.setAttribute("x", left);
                _bgNode.setAttribute("y", top);
                _bgNode.setAttribute("width", width);
                _bgNode.setAttribute("height", height);
                setAttrStyleForNode(_bgNode, _opt2);
            }
            return _bgNode;
        }
    })
});