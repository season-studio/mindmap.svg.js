/**
 * @author season <season-studio@outlook.com>
 * @license Apache-2.0
 */

import { EBlock, EBlockContainer, EBlockFactor } from "../thirdpart/eblock";
import { MindmapError } from "./mindmapError";
import { functionWithBindMap } from "./miscUtilities";
import { assert } from "../thirdpart/toolkits/src/assert";
import { readonlyMember } from "../thirdpart/toolkits/src/readonly";

const TopicTemplateXML = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs eblock-predefined="">
        <path id="topic-fold-icon-plus" fill="#fff" fill-opacity="0.8" stroke="#000" stroke-width="1" transform="translate(-3, -1), scale(1.5, 1.5)" d="M1 4A3 3 0 1 0 8 4A3 3 0 1 0 1 4M2.5 4L6.5 4M4.5 2L4.5 6" />
        <path id="topic-fold-icon-minus" fill="#fff" fill-opacity="0.8" stroke="#000" stroke-width="1" transform="translate(-3, -1), scale(1.5, 1.5)" d="M1 4A3 3 0 1 0 8 4A3 3 0 1 0 1 4M2.5 4L6.5 4" />
        <pattern id="season-topic-drag-mask" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect x="2" y="0" width="2" height="2" fill="#000" stroke="none"></rect>
            <rect x="0" y="2" width="2" height="2" fill="#000" stroke="none"></rect>
        </pattern>
    </defs>
    <style eblock-predefined="">
    <![CDATA[
            
        .season-topic-drag-group {
            opacity: 0.7;
        }

        .season-topic-drag-mask {
            rx: 6px;
            ry: 6px;
            fill: url(#season-topic-drag-mask);
            fill-opacity: 0.3;
            stroke: none;
        }

        .season-topic-drag-line {
            fill: none;
            stroke: #2c3e50;
            stroke-width: 3px;
            stroke-dasharray: 5, 5;
            stroke-opacity: 0.6;
        }

        [season-topic-global] * {
            outline: none;
        }

        [season-topic-content-group] {
            font-size: 13px;
        }

        [season-topic-content-group][d-topic-level="0"] {
            font-size: 17px;
        }

        .season-topic-box {
            rx: 6px;
            ry: 6px;
            fill: #eee;
            fill-opacity: 0.3;
            stroke: #438ac9;
            stroke-opacity: 0.3;
            stroke-dasharray: 3,1;
            stroke-width: 0.5px;
        }

        .season-topic-title {
            alignment-baseline: before-edge;
            dominant-baseline: text-before-edge;
            fill: #000;
        }

        .season-topic-connect-line {
            fill: none;
            stroke: #1a2530;
            stroke-width: 2px;
        }

        .season-topic-image {
            
        }

        [d-topic-level="0"] > .season-topic-box {
            rx: 6px;
            ry: 6px;
            fill: #438ac9;
            fill-opacity: 0.9;
            stroke: #4472c4;
            stroke-opacity: 0.6;
            stroke-width: 1.5px;
            stroke-dasharray: none;
        }

        [d-topic-level="0"] > .season-topic-title {
            fill: #fff;
            font-weight: 700;
        }

        [d-topic-level="1"] > .season-topic-box {
            rx: 6px;
            ry: 6px;
            fill: #438ac9;
            fill-opacity: 0.3;
            stroke: #438ac9;
            stroke-opacity: 0.6;
            stroke-width: 1px;
            stroke-dasharray: none;
        }

        [d-topic-level="1"] > .season-topic-title {
            font-weight: 700;
        }

        [season-topic-focus] > .season-topic-box {
            fill: #ff0;
            fill-opacity: 0.9;
            stroke: #000;
            stroke-opacity: 0.7;
            stroke-width: 2px;
            stroke-dasharray: none;
        }

        [season-topic-focus] > .season-topic-title {
            fill: #000;
        }
    ]]>
    </style>
    <g eblock-template="" season-topic-global="">
        <g season-topic-children-group="" />
        <g season-topic-content-group="" tabindex="0" >
            <rect class="season-topic-box" />
            <text class="season-topic-title" season-topic-content-type="title" />
            <use class="season-topic-image" season-topic-content-type="image" href="" />
            <g season-topic-extends="" />
            <use href="#" season-topic-content-type="fold" />
        </g>
    </g>
</svg>
`;

function getEventPointInGraphic(_event) {
    let target = _event.target;
    if (target instanceof SVGGraphicsElement) {
        (target instanceof SVGSVGElement) || (target = target.ownerSVGElement);
        const ctm = target.getCTM().inverse();
        const svgRect = target.getBoundingClientRect();
        const targetMatrix = ctm.translate(_event.clientX - svgRect.x, _event.clientY - svgRect.y);
        return { x: targetMatrix.e, y: targetMatrix.f };
    } else {
        return { x: 0, y: 0 };
    }
}

function prepareDragTipElements(_topic, _dragContext) {
    if ((_topic instanceof EBlock) && (_topic.$assignedNode instanceof SVGGraphicsElement) && _dragContext) {
        const svgNode = _topic.$assignedNode.ownerSVGElement;
        if (svgNode) {
            let dragStubNode = svgNode.querySelector(".season-topic-drag-group");
            if (!dragStubNode) {
                dragStubNode = (_dragContext.dragStubNode = document.createElementNS("http://www.w3.org/2000/svg", "g"));
                if (dragStubNode) {
                    dragStubNode.setAttribute("class", "season-topic-drag-group");
                    let contentNode = _topic.acquireNode(":scope > [season-topic-content-group]");
                    let size = { $width:0, $height:0, $x:0, $y:0 };
                    if (contentNode) {
                        contentNode = contentNode.cloneNode(true);
                        let itemNode = contentNode.querySelector('.season-topic-box');
                        if (itemNode && (itemNode = itemNode.cloneNode())) {
                            itemNode.setAttribute("class", "season-topic-drag-mask");
                            size.$width = (parseInt(itemNode.getAttribute("width")) || 0);
                            size.$height = (parseInt(itemNode.getAttribute("height")) || 0);
                        }
                        contentNode.appendChild(itemNode);
                        itemNode = contentNode.querySelector('[season-topic-content-type="fold"]');
                        itemNode && itemNode.remove();
                        dragStubNode.appendChild(contentNode);
                    }
                    /* let { x:offsetX, y:offsetY, width, height } = _topic.getRectInViewport();
                    width += 1, height += 1;
                    const stubImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
                    if (stubImage) {
                        stubImage.setAttribute("width", width);
                        stubImage.setAttribute("height", height);
                        _topic.env.getImageData("data:image/svg+xml;charset=utf-8,"+encodeURIComponent('<?xml version="1.0" standalone="no"?>\r\n'+(new XMLSerializer()).serializeToString(svgNode)), {
                            offsetX,
                            offsetY,
                            width,
                            height
                        }).then(imgRet => imgRet && stubImage.setAttribute("href", imgRet.data));
                        dragStubNode.appendChild(stubImage);
                    }
                    const maskNode = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    if (maskNode) {
                        maskNode.setAttribute("class", "season-topic-drag-mask");
                        maskNode.setAttribute("width", width);
                        maskNode.setAttribute("height", height);
                        dragStubNode.appendChild(maskNode);
                    } */

                    svgNode.appendChild(dragStubNode);
                    Object.assign(dragStubNode, size);//{ $x:0, $y:0, $width:width, $height:height });
                }
            }

            let dragLine = svgNode.querySelector(".season-topic-drag-line");
            if (!dragLine) {
                dragLine = (_dragContext.dragLine = document.createElementNS("http://www.w3.org/2000/svg", "path"));
                if (dragLine) {
                    dragLine.setAttribute("class", "season-topic-drag-line");
                    svgNode.appendChild(dragLine);
                }
            }
        }
    }
}

function clearDragTipElements(_dragContext) {
    if (_dragContext) {
        _dragContext.dragStubNode && _dragContext.dragStubNode.remove();
        _dragContext.dragStubNode = undefined;

        _dragContext.dragLine && _dragContext.dragLine.remove();
        _dragContext.dragLine = undefined;
    }
}

function updateDragTipElements(_dragContext, _mouseEvent) {
    if (_dragContext) {
        const dragStubNode = _dragContext.dragStubNode;
        let endX = 0, endY = 0;
        if (dragStubNode) {
            const { x, y } = (_mouseEvent instanceof MouseEvent) ? getEventPointInGraphic(_mouseEvent) : {x:dragStubNode.$x, y:dragStubNode.$y};
            dragStubNode.setAttribute("transform", `translate(${x + 2}, ${y + 2})`);
            endX = x + 1 + dragStubNode.$width / 2;
            endY = y + 1 + dragStubNode.$height / 2;
            dragStubNode.$x = x;
            dragStubNode.$y = y;
        }

        const dragLine = _dragContext.dragLine;
        if (dragLine && _dragContext.parentTopic) {
            const startRect = _dragContext.parentTopic.getGraphicRect();
            dragLine.setAttribute("d", `M${startRect.x + startRect.width / 2} ${startRect.y + startRect.height / 2}L${endX} ${endY}`);
        }
    }
}

function clearDragoverTimer(_dragContext) {
    if (_dragContext) {
        _dragContext.dragoverTimer && clearTimeout(_dragContext.dragoverTimer);
        _dragContext.dragoverTimer = undefined;
        _dragContext.dragoverTopic = undefined;
    }
}

function clearDragContext(_env) {
    if (_env) {
        const dragContext = _env.dragContext;
        if (dragContext) {
            clearDragoverTimer(dragContext);
            clearDragTipElements(dragContext);
            dragContext.sourceTopic && (dragContext.sourceTopic.visible = true);
            dragContext.sourceTopic = undefined;
            _env.dragContext = undefined;
        }
    }
}

const onDomMouseMoveForDrag = functionWithBindMap(function (_event) {
    const eventDetail = _event.detail;
    const originEvent = eventDetail.originEvent;
    const dragContext = this.env.dragContext;
    if (0 !== (originEvent.buttons & 1)) {
        if (dragContext && dragContext.draging && dragContext.sourceTopic) {
            updateDragTipElements(dragContext, originEvent);
        }
    } else if (dragContext) {
        clearDragContext(this.env);
    }
});

const onDomMouseUpForDrag = functionWithBindMap(function (_event) {
    const eventDetail = _event.detail;
    const originEvent = eventDetail.originEvent;
    if (0 === (originEvent.buttons & 1)) {
        const dragContext = this.env.dragContext;
        if (dragContext) {
            if (dragContext.draging) {
                // drag-drop
                eventDetail.preventDefault = true;

                const destPoint = getEventPointInGraphic(originEvent);
                const destParent = dragContext.parentTopic;
                const sourceTopic = dragContext.sourceTopic;

                let sibling;
                if (destParent.level > 0) {
                    for (sibling = destParent.firstChildTopic; sibling; sibling = sibling.nextSiblingTopic) {
                        const siblingPoint = sibling.getGraphicRect();
                        if (!sibling.equal(sourceTopic) && (siblingPoint.y >= destPoint.y)) {
                            break;
                        }
                    }
                } else {
                    const destParentRect = destParent.getGraphicRect();
                    const directionThreshold = (destParentRect.x + destParentRect.width / 2);
                    const toRight = (destPoint.x >= directionThreshold);
                    let matchDirection = false;
                    for (sibling = destParent.firstChildTopic; sibling; sibling = sibling.nextSiblingTopic) {
                        let siblingRect = sibling.getGraphicRect();
                        if (toRight === (siblingRect.x >= directionThreshold)) {
                            matchDirection = true;
                            if (!sibling.equal(sourceTopic) && (siblingRect.y >= destPoint.y)) {
                                break;
                            }
                        } else if (matchDirection) {
                            break;
                        }
                    }
                }

                if (!EBlock.equal(destParent, sourceTopic.parentTopic) || !EBlock.equal(sibling, sourceTopic.nextSiblingTopic)) {
                    sourceTopic.moveTo(destParent, sibling);
                }

                sourceTopic.queueAction(() => {
                    sourceTopic.render();
                    sourceTopic.$assignedNode.ownerSVGElement.focus();
                });
            }

            clearDragContext(this.env);
        }
    }
});

const onDomKeyDownForDrag = functionWithBindMap(function (_event) {
    const eventDetail = _event.detail;
    const originEvent = eventDetail.originEvent;
    const key = String(originEvent.key).toLowerCase();
    if (key === "escape") {
        clearDragContext(this.env);
        eventDetail.preventDefault = true;
    }
});

export
/**
 * The factor of the topic
 * @static
 * @constant
 * @type {EBlockFactor} 
 */
const TopicFactor = new EBlockFactor((new DOMParser()).parseFromString(TopicTemplateXML, "image/svg+xml").querySelector("svg"));

readonlyMember(TopicFactor, {

    getEventPointInGraphic,

    clearDragoverTimer,

    prepareDragTipElements,

    clearDragTipElements,

    updateDragTipElements,

    clearDragContext,

    onFactorRegister(_container) {
        assert(_container instanceof EBlockContainer, MindmapError, -1, "_container must be an instance of EBlockContainer");

        _container.enableDomEvent("click");
        _container.enableDomEvent("dblclick");
        _container.enableDomEvent("mousedown");
        _container.enableDomEvent("mousemove");
        _container.enableDomEvent("mouseover");
        _container.enableDomEvent("mouseout");
        _container.enableDomEvent("mouseup");
        _container.enableDomEvent("keydown");
        _container.addEventListener("topic-domevent-mousemove", onDomMouseMoveForDrag.binding(_container));
        _container.addEventListener("topic-domevent-mouseup", onDomMouseUpForDrag.binding(_container));
        _container.addEventListener("topic-domevent-keydown", onDomKeyDownForDrag.binding(_container));
    },

    onFactorUnregister(_container) {
        assert(_container instanceof EBlockContainer, MindmapError, -1, "_container must be an instance of EBlockContainer");

        _container.disableDomEvent("click");
        _container.disableDomEvent("dblclick");
        _container.disableDomEvent("mousedown");
        _container.disableDomEvent("mousemove");
        _container.disableDomEvent("mouseover");
        _container.disableDomEvent("mouseout");
        _container.disableDomEvent("mouseup");
        _container.disableDomEvent("keydown");
        _container.removeEventListener("topic-domevent-mousemove", onDomMouseMoveForDrag.binding(_container));
        _container.removeEventListener("topic-domevent-mouseup", onDomMouseUpForDrag.binding(_container));
        _container.removeEventListener("topic-domevent-keydown", onDomKeyDownForDrag.binding(_container));
        onDomMouseMoveForDrag.deleteBinding(_container);
        onDomMouseUpForDrag.deleteBinding(_container);
        onDomKeyDownForDrag.deleteBinding(_container);
    }

});
