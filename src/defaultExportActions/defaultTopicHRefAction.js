import { Topic } from "../topic";
import { MindmapAddinPanel } from "../mindmapAddinPanel";
import { pickFile } from "../../thirdpart/toolkits/src/fileDlgKit";

export function TopicHRefTriggerAction(_eventDetail) {
    const topic = _eventDetail.eventTarget;
    (topic instanceof Topic) && topic.env.activeLink(topic.env.translateHRefToURL(topic.data.href));
}

const TopicHRefEditPanelXML = `
<style>
    .topic-href-edit-button > rect {
        x: 0;
        y: 0;
        rx: 5px;
        ry: 5px;
        width: 26px;
        height: 26px;
    }
</style>
<foreignObject width="100" height="26" style="padding:0px 5px 0px 0px;">
    <style>
        .season-topic-href-editor {
            outline: none;
            border: 1px solid #777;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            color: #000;
            background-color: #fff;
            font-size: 12px;
        }
    </style>
    <input xmlns="http://www.w3.org/1999/xhtml" class="season-topic-href-editor" tabindex="0"></input>
</foreignObject>
<g class="season-topic-svg-button topic-href-edit-button" mmap-event-click="browser">
    <rect />
    <use href="#season-topic-predefine-image-open" width="26" height="26" />
</g>
<g class="season-topic-svg-button topic-href-edit-button" d-svg-button-danger="" mmap-event-click="delete">
    <rect />
    <use href="#season-topic-predefine-image-delete" width="26" height="26" />
</g>
`;

const TopicHRefEditPanelOptions = {
    rootAttrs: {
        "mmap-layout": "line",
        "mmap-layout-margin": "0",
        "mmap-layout-padding": "5",
        "mmap-layout-background": "generateBackground",
        "mmap-bind-cancel-edit": "",
        "mmap-bind-hide-in-render": "relayout",
        "mmap-bind-filter-edit": "href"
    },
    singletonStamp: "topic-href-editor",
    onInitialize(_opt) {
        const inputNode = (this.inputNode = this.rootNode.querySelector(".season-topic-href-editor"));
        if (inputNode && (_opt.topic instanceof Topic)) {
            inputNode.value = (_opt.topic.data.href || "");
            inputNode.select();
        }
    },
    generateBackground() {
        return MindmapAddinPanel.backgroundGenerator.dialogBubbleBackground(...arguments, {});
    },
    onAfterLayout(_opt) {
        const panelBox = this.rootNode.getBBox();
        const topicBox = _opt.topic.getGraphicRect();
        this.rootNode.setAttribute("transform", `translate(${topicBox.x + (topicBox.width - panelBox.width) / 2}, ${topicBox.y + topicBox.height + 11})`);
        Topic.showNodeInSvgView(this.rootNode, this.rootNode.ownerSVGElement);
        this.inputNode.focus();
    },
    async browser(_event, _node, _opt, _key) {
        try {
            const file = await pickFile();
            if (file instanceof Blob) {
                const param = {
                    name: file.name,
                    resource: file
                };
                _opt.env.fireEvent("topic-event-update-attachment", param);
                param.href && (this.inputNode.value = param.href);
                this.close();
            }
        } catch (err) {
            _opt.env.warn("Fail in pickup file as the attachment of the topic", err);
        }
    },
    delete(_event, _node, _opt, _key) {
        this.inputNode.value = "";
        this.close();
    },
    onClose(_opt) {
        const topic = _opt.topic;
        if (topic instanceof Topic) {
            const newValue = String(this.inputNode.value).trim();
            if (newValue !== topic.data.href) {
                topic.changeData("href", newValue || undefined);
                topic.queueAction(() => topic.render());
            }
        }
    }
}

export function TopicHRefEditAction(_eventDetail) {
    const topic = _eventDetail.eventTarget;
    (topic instanceof Topic) && MindmapAddinPanel(topic.$assignedNode.ownerSVGElement, TopicHRefEditPanelXML, Object.assign({topic, env:topic.env, singletonMutex:topic.id}, TopicHRefEditPanelOptions));
}