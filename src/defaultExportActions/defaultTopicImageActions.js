import { MindmapError } from "../mindmapError";
import { assert } from "../../thirdpart/toolkits/src/assert";
import { pickFile } from "../../thirdpart/toolkits/src/fileDlgKit";
import { Topic } from "../topic";
import { MindmapEnvironment } from "../mindmapEnv";

async function changeTopicImage(_topic) {
    const file = await pickFile(".jpg,.jpeg,.png,.gif,.ico,.bmp,.svg");
    if (file instanceof Blob) {
        const param = {
            name: (_topic.env.config.defaultResourceAttachmentPrefix || "") + file.name,
            resource: file
        };
        _topic.env.fireEvent("topic-event-update-attachment", param);
        if (param.href) {
            const image = _topic.data.image;
            if (image) {
                _topic.changeData("image", {
                    src: param.href,
                    width: image.width,
                    height: image.height
                });
            } else {
                const config = _topic.env.config;
                const topicWidth = _topic.getRect().width - (config.padding * 2);
                const suitableWidth = Math.max(topicWidth, Number(config.suitableTitleLineWidth) || MindmapEnvironment.DefaultConfig.suitableTitleLineWidth);
                const imageObj = new Image();
                imageObj.src = URL.createObjectURL(file);
                await imageObj.decode();
                URL.revokeObjectURL(imageObj.src);
                let { width, height } = imageObj;
                if (width > suitableWidth) {
                    height = height / width * suitableWidth;
                    width = suitableWidth;
                }
                _topic.changeData("image", {
                    src: param.href,
                    width,
                    height
                });
            }
            _topic.queueAction(() => _topic.render());
        }
    }
}

export async function TopicImageEditAction(_eventDetail) {
    if (_eventDetail.force) {
        const topic = _eventDetail.eventTarget;
        assert(topic instanceof Topic, MindmapError, -1, "Cannot invoke the image edit action without an instance of Topic");
        await changeTopicImage(topic);
    }
}

const topicImageTriggerTemplate = `
<!--template XML-->
<style>
    .season-topic-image-trigger {
        position: relative;
    }
    .season-topic-image-size-box {
        box-sizing: border-box;
        position: absolute;
        top: var(--padding);
        left: var(--padding);
        right: var(--padding);
        bottom: var(--padding);
        border: 1px dashed #666;
        background: none;
    }
    .season-topic-image-size-corner {
        box-sizing: border-box;
        position: absolute;
        --corner-size: calc((var(--padding) + 1px) / 2);
        border: var(--corner-size) solid rgba(0,0,0,0.3);
        width: calc(var(--corner-size) + var(--corner-size));
        height: calc(var(--corner-size) + var(--corner-size));
    }
    .season-topic-image-size-corner:hover {
        border-color: rgba(0,0,0,0.6);
    }
    .season-topic-image-size-corner-lefttop {
        border-right: none;
        border-bottom: none;
        top: calc(0px - var(--corner-size));
        left: calc(0px - var(--corner-size));
        cursor: nwse-resize;
    }
    .season-topic-image-size-corner-leftbottom {
        border-right: none;
        border-top: none;
        bottom: calc(0px - var(--corner-size));
        left: calc(0px - var(--corner-size));
        cursor: nesw-resize;
    }
    .season-topic-image-size-corner-righttop {
        border-left: none;
        border-bottom: none;
        top: calc(0px - var(--corner-size));
        right: calc(0px - var(--corner-size));
        cursor: nesw-resize;
    }
    .season-topic-image-size-corner-rightbottom {
        border-left: none;
        border-top: none;
        bottom: calc(0px - var(--corner-size));
        right: calc(0px - var(--corner-size));
        cursor: nwse-resize;
    }
</style>
<div class="season-topic-image-size-box">
    <div class="season-topic-image-size-corner season-topic-image-size-corner-lefttop"></div>
    <div class="season-topic-image-size-corner season-topic-image-size-corner-leftbottom"></div>
    <div class="season-topic-image-size-corner season-topic-image-size-corner-righttop"></div>
    <div class="season-topic-image-size-corner season-topic-image-size-corner-rightbottom"></div>
</div>
`;

const topicImageTriggerToolbarTemplate = `
<!--template XML-->
<style>
    .season-topic-image-trigger-toolbutton > rect {
        /* clean-css ignore:start */rx: 6px;/* clean-css ignore:end */
        /* clean-css ignore:start */ry: 6px;/* clean-css ignore:end */
        width: 24px;
        height: 24px;
    }
</style>
<g class="season-topic-svg-3d-button season-topic-image-trigger-toolbutton" d-btn-action="browser">
    <rect />
    <use x="1" width="22" height="22" href="#season-topic-predefine-image-picture" />
</g>
<g class="season-topic-svg-3d-button season-topic-image-trigger-toolbutton" d-svg-button-danger="" d-btn-action="delete" transform="translate(26, 0)">
    <rect />
    <use x="1" width="22" height="22" href="#season-topic-predefine-image-delete" />
</g>
`;

function setupTopicImageTrigger(_topic, _triggerNode, _toolbarNode) {
    const imageNode = _topic.$assignedNode.querySelector(":scope > [season-topic-content-group] > .season-topic-image");
    if (_topic.data.image && imageNode) {
        const padding = _topic.env.config.padding;
        const secondaryPadding = _topic.env.config.secondaryPadding;
        let width = 0, height = 0, x = 0, y = 0;
        let sizingContext = null;

        _triggerNode.setAttribute("style", `--padding:${padding}px;--secondary-padding:${secondaryPadding}px;`);
        _triggerNode.setAttribute("class", "season-topic-image-trigger");
        _triggerNode.setAttribute("season-topic-image-trigger", "");
        _triggerNode.innerHTML = "";
        _topic.$assignedNode.appendChild(_triggerNode);
        _triggerNode.insertAdjacentHTML("afterbegin", topicImageTriggerTemplate);
        _topic.$assignedNode.appendChild(_toolbarNode);
        _toolbarNode.insertAdjacentHTML("afterbegin", topicImageTriggerToolbarTemplate);

        function resetSizingBox() {
            const boxRect = _topic.getGraphicRect();
            const imageRect = _topic.getGraphicRect(".season-topic-image");
            width = imageRect.width, height = imageRect.height;
            x = imageRect.x - boxRect.x - padding;
            y = imageRect.y - boxRect.y - padding;
            _triggerNode.setAttribute("x", x);
            _triggerNode.setAttribute("y", y);
            _triggerNode.setAttribute("width", width + padding * 2);
            _triggerNode.setAttribute("height", height + padding * 2);
            _toolbarNode.setAttribute("transform", `translate(${boxRect.width - padding - 48}, -26)`);
        }

        function cancelSizing() {
            if (sizingContext) {
                sizingContext = undefined;
                resetSizingBox();
            }
        }

        async function onBrowser(_event) {
            changeTopicImage(_topic);
            _event.preventDefault();
            _event.stopPropagation();
        }

        function onDelete(_event) {
            _topic.changeData("image");
            _topic.queueAction(() => _topic.render());
            exitImageTrigger();
            _event.preventDefault();
            _event.stopPropagation();
        }

        function sizingProgress(_event) {
            if (0 !== (_event.buttons & 1)) {
                if (sizingContext) {
                    let { e: deltaX, f: deltaY } = _triggerNode.ownerSVGElement.getScreenCTM().inverse().translate(_event.clientX, _event.clientY);
                    width = sizingContext.oriWidth + (deltaX -= sizingContext.startX) * sizingContext.dx;
                    height = sizingContext.oriHeight + (deltaY -= sizingContext.startY) * sizingContext.dy;
                    (sizingContext.dx < 0) && (x = sizingContext.oriX + deltaX);
                    (sizingContext.dy < 0) && (y = sizingContext.oriY + deltaY);
                    if (width < 0) {
                        (sizingContext.dx < 0) && (x += width);
                        width = 0;
                    }
                    if (height < 0) {
                        (sizingContext.dy < 0) && (y += height);
                        height = 0;
                    }
                    _triggerNode.setAttribute("x", x);
                    _triggerNode.setAttribute("y", y);
                    _triggerNode.setAttribute("width", width + padding * 2);
                    _triggerNode.setAttribute("height", height + padding * 2);
                }
            } else {
                cancelSizing();
            }
        }

        const sizingNodeMap = {
            ".season-topic-image-size-corner-rightbottom": {dx:1, dy:1},
            ".season-topic-image-size-corner-righttop": {dx:1, dy:-1},
            ".season-topic-image-size-corner-lefttop": {dx:-1, dy:-1},
            ".season-topic-image-size-corner-leftbottom": {dx:-1, dy:1}
        };

        function startSizing(_event) {
            for (let item in sizingNodeMap) {
                if (_event.target.matches(item)) {
                    const {dx, dy} = sizingNodeMap[item];
                    const startCTM = _triggerNode.ownerSVGElement.getScreenCTM().inverse().translate(_event.clientX, _event.clientY);
                    sizingContext = { dx, dy, startX: startCTM.e, startY: startCTM.f, oriWidth: width, oriHeight: height, oriX: x, oriY: y };
                    _event.preventDefault();
                    _event.stopPropagation();
                    break;
                }
            }
        }

        function submitSizing(_event) {
            if ((0 === (_event.buttons & 1)) && sizingContext) {
                if ((width > 0) && (height > 0)) {
                    let image = _topic.data.image;
                    image && _topic.changeData("image", {
                        src: image.src,
                        width,
                        height
                    });
                    _topic.queueAction(() => _topic.render().queueAction(resetSizingBox));    
                }
                sizingContext = undefined;
                _event.preventDefault();
                _event.stopPropagation();
            }
        }

        function filterClick(_event) {
            _event.preventDefault();
            _event.stopPropagation();
        }

        function waitEscKey(_event) {
            (String(_event.key).toLowerCase() === "escape") && cancelSizing();
        }

        function exitImageTrigger() {
            _topic.notify("topic-event-image-trigger-clear");
            _triggerNode.remove();
            _toolbarNode.remove();
        }

        function filteOtherTrigger(_event) {
            const eventDetail = _event.detail;
            eventDetail && (eventDetail.triggerContentType !== "image") && exitImageTrigger();
        }

        function clearDomEnv() {
            _triggerNode.removeEventListener("mousedown", startSizing);
            _triggerNode.removeEventListener("click", filterClick);
            _triggerNode.removeEventListener("dblclick", onBrowser);
            _triggerNode.ownerSVGElement.removeEventListener("mousemove", sizingProgress);
            _triggerNode.ownerSVGElement.removeEventListener("mouseup", submitSizing);
            _triggerNode.ownerSVGElement.removeEventListener("keydown", waitEscKey);
            _topic.env.removeEventListener("topic-event-cancel-edit", exitImageTrigger);
            _topic.env.removeEventListener("topic-event-trigger", filteOtherTrigger);
            _topic.env.removeEventListener("topic-event-image-trigger-clear", clearDomEnv);

            let btnNode = _toolbarNode.querySelector('[d-btn-action="browser"]');
            btnNode && btnNode.removeEventListener("click", onBrowser);
            (btnNode = _toolbarNode.querySelector('[d-btn-action="delete"]'))
                && btnNode.removeEventListener("click", onDelete);
        }

        function initTriggerUI() {
            _topic.notify("topic-event-image-trigger-clear");

            resetSizingBox();

            _triggerNode.addEventListener("mousedown", startSizing);
            _triggerNode.addEventListener("click", filterClick);
            _triggerNode.addEventListener("dblclick", onBrowser);
            _triggerNode.ownerSVGElement.addEventListener("mousemove", sizingProgress);
            _triggerNode.ownerSVGElement.addEventListener("mouseup", submitSizing);
            _triggerNode.ownerSVGElement.addEventListener("keydown", waitEscKey);
            _topic.env.addEventListener("topic-event-cancel-edit", exitImageTrigger, { once: true });
            _topic.env.addEventListener("topic-event-trigger", filteOtherTrigger, { once: true });
            _topic.env.addEventListener("topic-event-image-trigger-clear", clearDomEnv, { once: true });

            let btnNode = _toolbarNode.querySelector('[d-btn-action="browser"]');
            btnNode && btnNode.addEventListener("click", onBrowser);
            (btnNode = _toolbarNode.querySelector('[d-btn-action="delete"]'))
                && btnNode.addEventListener("click", onDelete);
        }

        initTriggerUI();
    } else {
        _triggerNode.remove();
    }
}

export function TopicImageTriggerAction(_eventDetail) {
    return new Promise((resolve, reject) => {
        try {
            const topic = _eventDetail.eventTarget;
            if (topic instanceof Topic) {
                let triggerNode = topic.$assignedNode.ownerSVGElement.querySelector("foreignObject[season-topic-image-trigger]");
                triggerNode || (triggerNode = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject"));
                let toolbarNode = topic.$assignedNode.ownerSVGElement.querySelector("foreignObject[season-topic-image-trigger-toolbar]");
                toolbarNode || (toolbarNode = document.createElementNS("http://www.w3.org/2000/svg", "g"));
                if (triggerNode && toolbarNode) {
                    setupTopicImageTrigger(topic, triggerNode, toolbarNode);
                    resolve();
                    return ;
                }
            }
            reject(MindmapError(-1, "cannot setup the trigger"));
        } catch (err) {
            reject(err);
        }
    });
}