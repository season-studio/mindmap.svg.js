import { MindmapAddinPanel } from "../mindmapAddinPanel";
import { Topic } from "../topic";

const TopicPriorityEditPanelXML = `
<!--template XML-->
<style>
    .topic-priority-edit-item > rect {
        width: 20px;
        height: 20px; 
        /* clean-css ignore:start */x: 0; /* clean-css ignore:end */
        /* clean-css ignore:start */y: 0;/* clean-css ignore:end */
        /* clean-css ignore:start */rx: 5px;/* clean-css ignore:end */
        /* clean-css ignore:start */ry: 5px;/* clean-css ignore:end */
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
        /* clean-css ignore:start */x: 0; /* clean-css ignore:end */
        /* clean-css ignore:start */y: 0;/* clean-css ignore:end */
        /* clean-css ignore:start */rx: 5px;/* clean-css ignore:end */
        /* clean-css ignore:start */ry: 5px;/* clean-css ignore:end */
    }
</style>
<g mmap-layout="line">
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="1">
        <rect />
        <use href="#topic-priority-1" width="22" height="22" />
    </g>
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="2">
        <rect />
        <use href="#topic-priority-2" width="22" height="22" />
    </g>
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="3">
        <rect />
        <use href="#topic-priority-3" width="22" height="22" />
    </g>
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="4">
        <rect />
        <use href="#topic-priority-4" width="22" height="22" />
    </g>
</g>
<g mmap-layout="line">
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="5">
        <rect />
        <use href="#topic-priority-5" width="22" height="22" />
    </g>
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="6">
        <rect />
        <use href="#topic-priority-6" width="22" height="22" />
    </g>
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="7">
        <rect />
        <use href="#topic-priority-7" width="22" height="22" />
    </g>
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="8">
        <rect />
        <use href="#topic-priority-8" width="22" height="22" />
    </g>
</g>
<g mmap-layout="line">
    <g class="topic-priority-edit-item season-topic-svg-button" mmap-event-click="selectPriority" d-priority-value="9">
        <rect />
        <use href="#topic-priority-9" width="22" height="22" />
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
        "mmap-layout-background": "dialogBubble",
        "mmap-bind-cancel-edit": "",
        "mmap-bind-hide-in-render": "relayout",
        "mmap-bind-filter-edit": "priority",
        "mmap-bind-filter-trigger": "priority"
    },
    singletonStamp: "topic-priority-editor",
    onInitialize(_opt) {
        const node = this.rootNode.querySelector(`g[d-priority-value="${_opt.topic.data.priority}"]`);
        node && node.setAttribute("d-priority-selected", "");
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