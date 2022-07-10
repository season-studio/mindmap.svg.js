import { MindmapAddinPanel } from "../mindmapAddinPanel";
import { Topic } from "../topic";

const TopicPriorityEditPanelXML = `
<style>
    .topic-priority-edit-item > rect {
        width: 20px;
        height: 20px; 
        x: 0; 
        y: 0;
        rx: 5px;
        ry: 5px;
    }
    .topic-priority-edit-item[d-priority-selected] > rect {
        fill: var(--topic-ui-focus-color);
        stroke: var(--topic-ui-focus-border-color);
        stroke-width: 1px;
        stroke-dasharray: 2;
    }
    .topic-priority-placeholder {
        fill: none;
        stroke: none;
        width: 20px;
        height: 20px;
        x: 0; 
        y: 0;
        rx: 5px;
        ry: 5px;
    }
</style>
<g mmap-layout="line">
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="1">
        <rect />
        <use href="#topic-priority-1" />
    </g>
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="2">
        <rect />
        <use href="#topic-priority-2" />
    </g>
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="3">
        <rect />
        <use href="#topic-priority-3" />
    </g>
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="4">
        <rect />
        <use href="#topic-priority-4" />
    </g>
</g>
<g mmap-layout="line">
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="5">
        <rect />
        <use href="#topic-priority-5" />
    </g>
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="6">
        <rect />
        <use href="#topic-priority-6" />
    </g>
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="7">
        <rect />
        <use href="#topic-priority-7" />
    </g>
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="8">
        <rect />
        <use href="#topic-priority-8" />
    </g>
</g>
<g mmap-layout="line">
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="9">
        <rect />
        <use href="#topic-priority-9" />
    </g>
    <rect class="topic-priority-placeholder" />
    <rect class="topic-priority-placeholder" />
    <g class="topic-priority-edit-item season-topic-svg-button" d-svg-button-danger="" mmap-event-click="deletePriority">
        <rect />
        <use href="#season-topic-predefine-image-delete" width="20" height="20" />
    </g>
</g>
`;

const TopicPriorityEditPanelOptions = {
    rootAttrs: {
        "mmap-layout": "row",
        "mmap-layout-margin": "5",
        "mmap-layout-padding": "5",
        "mmap-layout-background": "generateBackground",
        "mmap-bind-cancel-edit": "",
        "mmap-bind-hide-in-render": "relayout",
        "mmap-bind-filter-edit": "priority"
    },
    singletonStamp: "topic-priority-editor",
    onInitialize(_opt) {
        const node = this.rootNode.querySelector(`g[d-priority-value="${_opt.topic.data.priority}"]`);
        node && node.setAttribute("d-priority-selected", "");
    },
    generateBackground() {
        return MindmapAddinPanel.backgroundGenerator.dialogBubbleBackground(...arguments, {});
    },
    onAfterLayout(_opt) {
        const panelBox = this.rootNode.getBBox();
        const topicBox = _opt.topic.getGraphicRect();
        this.rootNode.setAttribute("transform", `translate(${topicBox.x + (topicBox.width - panelBox.width) / 2}, ${topicBox.y + topicBox.height + 11})`);
        Topic.showNodeInSvgView(this.rootNode, this.rootNode.ownerSVGElement);
    },
    selectPriority(_event, _node, _opt, _key) {
        const value = (Number(_node.getAttribute("d-priority-value")) || 0);
        if (_opt.topic && (value !== _opt.topic.data.priority)) {
            _opt.topic.changeData("priority", value);
            _opt.topic.queueAction(() => _opt.topic.render());
        }
        this.close();
    },
    deletePriority(_event, _node, _opt, _key) {
        if (_opt.topic) {
            _opt.topic.changeData("priority");
            _opt.topic.queueAction(() => _opt.topic.render());
        }
        this.close();
    }
}

export function TopicPriorityEditAction(_eventDetail) {
    const topic = _eventDetail.eventTarget;
    (topic instanceof Topic) && MindmapAddinPanel(topic.$assignedNode.ownerSVGElement, TopicPriorityEditPanelXML, Object.assign({topic, env:topic.env, singletonMutex:topic.id}, TopicPriorityEditPanelOptions));
}