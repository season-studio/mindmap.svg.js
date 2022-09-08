import { Topic } from "../topic";
import { MindmapAddinPanel } from "../mindmapAddinPanel";

const TopicNotesEditorPanelXML = `
<!--template XML-->
<style>
    .season-topic-notes-editor-button > rect {
        width: 20px;
        height: 20px;
        /* clean-css ignore:start */x: 0px;/* clean-css ignore:end */
        /* clean-css ignore:start */y: 0px;/* clean-css ignore:end */
        /* clean-css ignore:start */rx: 5px;/* clean-css ignore:end */
        /* clean-css ignore:start */ry: 5px;/* clean-css ignore:end */
        fill: rgba(255,255,255,0.1);
        stroke: none;
    }
    .season-topic-notes-editor-button > use {
        fill: #000;
        stroke: none;
    }
    .season-topic-notes-editor-button > path {
        fill: #000;
        stroke: none;
    }
    .season-topic-notes-editor-button:hover > use {
        fill: var(--topic-ui-hover-front-color);
        stroke: none;
    }
    .season-topic-notes-editor-button:hover > path {
        fill: var(--topic-ui-hover-front-color);
        stroke: none;
    }
    .season-topic-notes-editor-button:hover > rect {
        fill: var(--topic-ui-hover-back-color);
    }
    .season-topic-notes-editor-delete:hover > rect {
        fill: var(--topic-ui-danger-color);
    }
    .season-topic-notes-editor-toolbar > g > rect {
        /* clean-css ignore:start */rx: 5px;/* clean-css ignore:end */
        /* clean-css ignore:start */ry: 5px;/* clean-css ignore:end */
        width: 20px;
        height: 20px;
        /* clean-css ignore:start */x: 0px;/* clean-css ignore:end */
        /* clean-css ignore:start */y: 0px;/* clean-css ignore:end */
    }
</style>
<g mmap-layout="line" mmap-layout-margin="5" mmap-layout-padding="0" class="season-topic-notes-editor-toolbar">
    <g class="season-topic-svg-button" mmap-event-click="setBold">
        <rect />
        <use href="#season-topic-predefine-image-bold" width="20" height="20" />
    </g>
    <g class="season-topic-svg-button" mmap-event-click="setItalic">
        <rect />
        <use href="#season-topic-predefine-image-italic" width="20" height="20" />
    </g>
    <g class="season-topic-svg-button" mmap-event-click="setUnderline">
        <rect />
        <use href="#season-topic-predefine-image-underline" width="20" height="20" />
    </g>
    <g class="season-topic-svg-button" mmap-event-click="setUnorderList">
        <rect />
        <use href="#season-topic-predefine-image-unorder-list" width="20" height="20" />
    </g>
    <g class="season-topic-svg-button" mmap-event-click="setOrderList">
        <rect />
        <use href="#season-topic-predefine-image-order-list" width="20" height="20" />
    </g>
    <rect width="60" height="20" fill="rgba(255,255,255,0.05)" stroke="none" />
    <g class="season-topic-svg-button" d-svg-button-danger="" mmap-event-click="delete">
        <rect />
        <use href="#season-topic-predefine-image-delete" width="20" height="20" />
    </g>
</g>
<foreignObject width="210" height="170">
    <style>
        .season-topic-notes-editor-box {
            overflow: scroll;
            border: 1px solid #666;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            outline: none;
            font-size: 12px;
            word-break: break-all;
        }
        .season-topic-notes-editor-box p {
            margin: 0px;
        }
        .season-topic-notes-editor-box ul,.season-topic-notes-editor-box ol {
            margin: 0px;
            padding-left: 2em;
        }
        .season-topic-notes-editor-box code {
            background-color: #ddd;
            color: darkorange;
        }
    </style>
    <div class="season-topic-notes-editor-box" contenteditable="true">
        <p><br /></p>
    </div>
</foreignObject>
`;

const EmptyInitialContent = "<p><br /></p>";

function showPlainText(_node, _data) {
    _node.innerHTML = _data.content ? `<p>${String(_data.content).split("\n").map(item => item.replace(/\s/gi, "&nbsp;")).join("</p><p>")}</p>`
                                    : EmptyInitialContent;
}

const opsAttrNodeMap = [{
    key: "bold",
    tag: "b"
}, {
    key: "underline",
    tag: "u"
}, {
    key: "italic",
    tag: "i"
}, {
    key: "code",
    tag: "code"
}, {
    key: "color",
    tag: "span",
    formatter: function (_attrs) {
        return ` style="color:${_attrs.color};"`;
    }
}];

const TextContentReplaceMap = {
    "<": "&lt;",
    ">": "&gt;"
};

function textContentReplacement(_src) {
    return TextContentReplaceMap[_src] || "&nbsp;"
}

function insertContentItem(_content, _value, _attrs) {
    let closeNodes;
    if (_attrs) {
        closeNodes = [];
        opsAttrNodeMap.forEach(item => {
            if (_attrs[item.key]) {
                const nodeTag = item.tag;
                const nodeClass = item.class;
                const nodeStyle = item.style;
                const formatter = item.formatter;
                _content.push(`<${nodeTag}${nodeClass ? ` class="${nodeClass}"` : ""}${nodeStyle ? ` style="${nodeStyle}"` : ""}${formatter ? formatter(_attrs) : ""}>`);
                closeNodes.unshift(`</${nodeTag}>`);
            }
        });
    }
    _content.push(_value.replace(/[\s<>]/gi, textContentReplacement));
    closeNodes && (closeNodes.length > 0) && _content.push.apply(_content, closeNodes);
}

const opsPTagMap = {
    bullet: { prefix:"<ul>", tag:"li", suffix: "</ul>" },
    ordered: { prefix:"<ol>", tag:"li", suffix: "</ol>" }
};

function showOpsContent(_node, _data) {
    const paragraphSet = [];
    let paragraph = [];
    paragraphSet.push(paragraph);

    (_data.ops instanceof Array) && _data.ops.forEach(item => {
        if (item) {
            const attrs = item.attributes;
            String(item.insert || "").split("\n").forEach((value, idx) => {
                if (idx > 0) {
                    paragraph.$type = (attrs && attrs.list);
                    paragraphSet.push(paragraph = []);
                }
                if (value) {
                    insertContentItem(paragraph, value, attrs);
                }
            });
        }
    });

    let ptagStack;
    (paragraph.length === 0) && paragraphSet.pop();
    _node.innerHTML = (paragraphSet.map(item => {
        const ptag = opsPTagMap[item.$type];
        const ret = [];
        if (ptag !== ptagStack) {
            ptagStack && ret.push(ptagStack.suffix);
            ptag && ret.push(ptag.prefix);
        }
        ptagStack = ptag;
        ret.push(`<${ptag ? ptag.tag : "p"}>`);
        ret.push(item.join("") || "<br />");
        ret.push(`</${ptag ? ptag.tag : "p"}>`);
        return ret.join("");
    }).join("") || EmptyInitialContent);
}

const htmlStyleNodeMap = [
    { key: "fo:font-weight", value: "bold", tag: "b" },
    { key: "fo:font-style", value: "italic", tag: "i" },
    { key: "fo:text-decoration", value: "underline", tag: "u" }
];

function insertHtmlContentSpan(_content, _span) {
    if (_span.text) {
        let closeNodes;
        const styleProps = (_span.style && _span.style.properties);
        if (styleProps) {
            closeNodes = [];
            htmlStyleNodeMap.forEach(item => {
                if (styleProps[item.key] === item.value) {
                    const nodeTag = item.tag;
                    const nodeClass = item.class;
                    const nodeStyle = item.style;
                    _content.push(`<${nodeTag}${nodeClass ? ` class="${nodeClass}"` : ""}${nodeStyle ? ` style="${nodeStyle}"` : ""}>`);
                    closeNodes.unshift(`</${nodeTag}>`);
                }
            });
        }
        _content.push(_span.text.replace(/\s/gi, "&nbsp;"));
        closeNodes && (closeNodes.length > 0) && _content.push.apply(_content, closeNodes);
    } else {
        _content.push("<br />");
    }
}

function showHtmlContent(_node, _data) {
    const content = [];
    if (_data.paragraphs instanceof Array) {
        _data.paragraphs.forEach(paragraph => {
            content.push("<p>");
            (paragraph.spans instanceof Array) && paragraph.spans.forEach(span => insertHtmlContentSpan(content, span));
            content.push("</p>");
        });
    }
    _node.innerHTML = (content.join("") || EmptyInitialContent);
}

function showContent(_node, _notes) {
    if (_node instanceof Node) {
        _notes || (_notes = {});
        if (_notes.ops) {
            showOpsContent(_node, _notes.ops);
        } else if (_notes.html && _notes.html.content) {
            showHtmlContent(_node, _notes.html.content);
        } else if (_notes.plain) {
            showPlainText(_node, _notes.plain);
        } else {
            _node.innerHTML = EmptyInitialContent;
        }
    }
}

export function serializeNoteFromNodeAsParagraphs(_node, _paragraphSet, _paragraph, _attr) {
    const paragraphSet = (_paragraphSet || []);
    if (_node) {
        _node.normalize();
        _node.childNodes.forEach(subNode => {
            if (subNode instanceof HTMLBRElement) {
                (_node.childElementCount > 1) && paragraphSet.push(_paragraph = []);
            } else if (subNode.nodeType === Node.TEXT_NODE ) {
                _paragraph || paragraphSet.push(_paragraph = []);
                _paragraph.push({
                    attr: _attr,
                    text: subNode.textContent
                });
            } else if (subNode.childNodes.length <= 0) {
                return;
            } else if (subNode instanceof HTMLParagraphElement) {
                paragraphSet.push(_paragraph = []);
                _paragraph = serializeNoteFromNodeAsParagraphs(subNode, paragraphSet, _paragraph, _attr).paragraph;
            } else if (subNode instanceof HTMLLIElement) {
                paragraphSet.push(_paragraph = []);
                _paragraph.$type = ((_node instanceof HTMLUListElement) ? "bullet" : "ordered");
                serializeNoteFromNodeAsParagraphs(subNode, paragraphSet, _paragraph, _attr).paragraph;
                _paragraph = undefined;
            } else if ((subNode instanceof HTMLUListElement) || (subNode instanceof HTMLOListElement)) {
                _paragraph = serializeNoteFromNodeAsParagraphs(subNode, paragraphSet, undefined, _attr).paragraph;
            } else if (subNode instanceof HTMLSpanElement) {
                let newAttr = Object.assign({}, _attr);
                let style = subNode.style;
                style.color  && (newAttr.color = style.color);
                _paragraph = serializeNoteFromNodeAsParagraphs(subNode, paragraphSet, _paragraph, newAttr).paragraph;
            } else if (subNode instanceof HTMLElement) {
                let tag = String(subNode.nodeName).toLowerCase();
                if (tag === "code") {
                    let newAttr = Object.assign({}, _attr);
                    newAttr.code = true;
                    _paragraph = serializeNoteFromNodeAsParagraphs(subNode, paragraphSet, _paragraph, newAttr).paragraph;
                } else if (tag === "b") {
                    let newAttr = Object.assign({}, _attr);
                    newAttr.bold = true;
                    _paragraph = serializeNoteFromNodeAsParagraphs(subNode, paragraphSet, _paragraph, newAttr).paragraph;
                } else if (tag === "i") {
                    let newAttr = Object.assign({}, _attr);
                    newAttr.italic = true;
                    _paragraph = serializeNoteFromNodeAsParagraphs(subNode, paragraphSet, _paragraph, newAttr).paragraph;
                } else if (tag === "u") {
                    let newAttr = Object.assign({}, _attr);
                    newAttr.underline = true;
                    _paragraph = serializeNoteFromNodeAsParagraphs(subNode, paragraphSet, _paragraph, newAttr).paragraph;
                } else {
                    _paragraph = serializeNoteFromNodeAsParagraphs(subNode, paragraphSet, _paragraph, Object.assign({}, _attr)).paragraph;
                }
            }
        });
    }
    return { paragraphSet, paragraph: _paragraph };
}

function serializeNoteOpsFromParagraphs(_paragraphSet) {
    const ops = [];
    let simpleLines = [];
    _paragraphSet.forEach(paragraph => {
        if (paragraph instanceof Array) {
            paragraph.forEach(item => {
                if (item.attr) {
                    (simpleLines.length > 0) && ops.push({ insert: simpleLines.join("") });
                    simpleLines = [];
                    ops.push({
                        attributes: item.attr,
                        insert: (item.text || "")
                    });
                } else {
                    simpleLines.push(item.text || "");
                }
            });
            if (paragraph.$type) {
                (simpleLines.length > 0) && ops.push({ insert: simpleLines.join("") });
                simpleLines = [];
                ops.push({
                    attributes: {
                        list: paragraph.$type
                    },
                    insert: "\n"
                });
            } else {
                simpleLines.push("\n");
            }
        }
    });
    (simpleLines.length > 0) && ops.push({ insert: simpleLines.join("") });
    return ops;
}

function serializeNoteHtmlFromParagraphs(_paragraphSet) {
    const paragraphs = [];
    _paragraphSet.forEach(paragraph => {
        let spans = [];
        paragraphs.push({ spans });
        if (paragraph instanceof Array) {
            paragraph.forEach(item => {
                if (item.attr) {
                    let props = {};
                    let style = {
                        type: "text",
                        properties: props
                    };
                    item.attr.bold && (props["fo:font-weight"] = "bold");
                    item.attr.italic && (props["fo:font-style"] = "italic");
                    item.attr.underline && (props["fo:text-decoration"] = "underline");
                    spans.push({
                        style,
                        text: item.text
                    });
                } else {
                    spans.push({ text: item.text });
                }
            });
        }
    });
    return paragraphs;
}

function serializeNoteFromNode(_node) {
    const paragraphSet = serializeNoteFromNodeAsParagraphs(_node).paragraphSet;
    return {
        plain: {
            content: _node.textContent
        },
        ops: {
            ops: serializeNoteOpsFromParagraphs(paragraphSet)
        }, 
        html: {
            content: {
                paragraphs: serializeNoteHtmlFromParagraphs(paragraphSet)
            }
        }
    };
}

const NormalizeFlag = Symbol("season.topic.notes.normalize");

function normalizeNoteNodeAsSimpleText(_node) {
    let retNode;
    if (_node.getAttribute("style")) {
        const color = _node.style.color;
        if (color) {
            retNode = document.createElement("span");
            color && (retNode.style.color = color);
        } else if (_node.childElementCount) {
            retNode = document.createElement("span");
        }
    } else if (_node.childElementCount) {
        retNode = document.createElement("span");
    }
    return retNode || document.createTextNode(_node.textContent);
}

const NoteNodeNormalizeMap = {
    "p": "p",
    "b": "b",
    "u": "u",
    "i": "i",
    "ul": "ul",
    "ol": "ol",
    "li": "li",
    "br": "br",
    "h1": "p",
    "h2": "p",
    "h3": "p",
    "h4": "p",
    "h5": "p",
    "h6": "p",
    "div": "p",
    "code": "code"
};

function noteNodeNormalize(_node) {
    if ((_node instanceof Node) && (!_node[NormalizeFlag])) {
        switch (_node.nodeType) {
            case Node.ELEMENT_NODE:
                _node.normalize();
                let tag = NoteNodeNormalizeMap[String(_node.nodeName).toLocaleLowerCase()];
                let newNode;
                if (typeof tag === "string") {
                    newNode = document.createElementNS(_node.namespaceURI, tag);
                } else if (typeof tag === "function") {
                    newNode = tag(_node);
                } else {
                    newNode = normalizeNoteNodeAsSimpleText(_node);
                }
                if (newNode) {
                    newNode[NormalizeFlag] = true;
                    if (newNode instanceof Element) {
                        _node.childNodes.forEach(subNode => {
                            subNode = noteNodeNormalize(subNode);
                            subNode && newNode.appendChild(subNode);
                        });
                    }
                }
                newNode.normalize();
                return ((newNode.childNodes.length > 0) || (newNode instanceof HTMLBRElement) || (newNode.nodeType === Node.TEXT_NODE)) && newNode;
                break;

            case Node.TEXT_NODE:
                const textNode = _node.cloneNode(true);
                textNode[NormalizeFlag] = true;
                return textNode;
                break;

            default:
                return null;
        }
    } else {
        return _node;
    }
}

function filterPaste(_event) {
    try {
        let clipboardData = (_event.clipboardData || window.clipboardData);
        if (clipboardData) {
            let value = clipboardData.getData("text/html");
            if (value) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(value, "text/html");
                if (doc && !doc.querySelector('parsererror')) {
                    const newNodes = [];
                    doc.body.childNodes.forEach(item => {
                        let newItem = noteNodeNormalize(item);
                        (newItem instanceof Node) && newNodes.push((newItem.nodeType === Node.TEXT_NODE) ? newItem.wholeText : newItem.outerHTML);
                    });
                    /*
                    const selection = getSelection();
                    if (selection.rangeCount) {
                        selection.deleteFromDocument();
                        selection.getRangeAt(0).insertNode(insertContent);
                    }
                    */
                    document.execCommand("insertHTML", false, newNodes.join(""));
                }
                _event.preventDefault();
            }
        }
    } catch(err) {
        _event.preventDefault();
        console.warn("Fail in filte the paste content for the note's editor. The action is cancelled.", err);
    }
}

const TopicNotesEditorPanelOptions = {
    rootAttrs: {
        "mmap-layout": "row",
        "mmap-layout-margin": "5",
        "mmap-layout-padding": "10",
        "mmap-layout-background": "dialogBubble",
        "mmap-bind-cancel-edit": "",
        "mmap-bind-hide-in-render": "relayout",
        "mmap-bind-filter-edit": "notes",
        "mmap-bind-filter-trigger": "notes"
    },
    singletonStamp: "topic-notes-shower",
    onInitialize(_opt) {
        const editorNode = (this.editorNode = this.rootNode.querySelector(".season-topic-notes-editor-box"));
        if (editorNode) {
            // connectEditorMutationObserver(editorNode);
            editorNode.addEventListener("paste", this.onPaste = filterPaste.bind(this));
            if (_opt.topic instanceof Topic) {
                showContent(editorNode, _opt.topic.data.notes);
            }
        }
    },
    onAfterLayout(_opt) {
        const panelBox = this.rootNode.getBBox();
        const topicBox = _opt.topic.getGraphicRect();
        this.rootNode.setAttribute("transform", `translate(${topicBox.x + (topicBox.width - panelBox.width) / 2}, ${topicBox.y + topicBox.height + 11})`);
        Topic.showNodeInSvgView(this.rootNode, this.rootNode.ownerSVGElement);
    },
    setBold(_event, _node, _opt) {
        document.execCommand("bold", false);
    },
    setItalic(_event, _node, _opt) {
        document.execCommand("italic", false);
    },
    setUnderline(_event, _node, _opt) {
        document.execCommand("underline", false);
    },
    setUnorderList(_event, _node, _opt) {
        document.execCommand("insertUnorderedList", false);
    },
    setOrderList(_event, _node, _opt) {
        document.execCommand("insertOrderedList", false);
    },
    delete(_event, _node, _opt) {
        this.editorNode && (this.editorNode.innerHTML = EmptyInitialContent);
        this.close();
    },
    onClose(_opt) {
        if (this.editorNode) {
            // disconnectEditorMutationObserver(this.editorNode);
            this.editorNode.removeEventListener("paste", this.onPaste);
            let notes = serializeNoteFromNode(this.editorNode);
            notes && (!String(notes.plain.content).trim()) && (notes = undefined);

            const topic = _opt.topic;
            if (topic instanceof Topic) {
                const oriValue = topic.data.notes;
                topic.changeData("notes", notes);
                ((oriValue && true) ^ (notes && true)) && topic.queueAction(() => topic.render());
            } 
        }
    }
}

export function TopicNotesTriggerAction(_eventDetail) {
    const topic = _eventDetail.eventTarget;
    (topic instanceof Topic) && MindmapAddinPanel(topic.$assignedNode.ownerSVGElement, TopicNotesEditorPanelXML, Object.assign({topic, env:topic.env, singletonMutex:topic.id}, TopicNotesEditorPanelOptions));
}

export const TopicNotesEditAction = TopicNotesTriggerAction;
