import { MindmapAddinPanel } from "../mindmapAddinPanel";
import { Topic } from "../topic";

const TopicTaskMarkerEditPanelXML = `
<!--template XML-->
<style>
    .topic-task-marker-item > rect {
        width: 20px;
        height: 20px; 
        /* clean-css ignore:start */x: 0; /* clean-css ignore:end */
        /* clean-css ignore:start */y: 0;/* clean-css ignore:end */
        /* clean-css ignore:start */rx: 5px;/* clean-css ignore:end */
        /* clean-css ignore:start */ry: 5px;/* clean-css ignore:end */
    }
    .topic-task-marker-item[d-task-marker-selected] > rect {
        fill: var(--topic-ui-focus-color);
        stroke: var(--topic-ui-focus-border-color);
        stroke-width: 1px;
        stroke-dasharray: 2;
    }
    .topic-task-marker-placeholder {
        fill: none;
        stroke: none;
        width: 20px;
        height: 20px; 
        /* clean-css ignore:start */x: 0;/* clean-css ignore:end */
        /* clean-css ignore:start */y: 0;/* clean-css ignore:end */
        /* clean-css ignore:start */rx: 5px;/* clean-css ignore:end */
        /* clean-css ignore:start */ry: 5px;/* clean-css ignore:end */
    }
</style>
<g mmap-layout="line">
    <g class="topic-task-marker-item season-topic-svg-button" mmap-event-click="selectTaskMarker" d-task-marker-value="0">
        <rect />
        <use href="#topic-task-marker-0" />
    </g>
    <g class="topic-task-marker-item season-topic-svg-button" mmap-event-click="selectTaskMarker" d-task-marker-value="1">
        <rect />
        <use href="#topic-task-marker-1" />
    </g>
    <g class="topic-task-marker-item season-topic-svg-button" mmap-event-click="selectTaskMarker" d-task-marker-value="2">
        <rect />
        <use href="#topic-task-marker-2" />
    </g>
    <g class="topic-task-marker-item season-topic-svg-button" mmap-event-click="selectTaskMarker" d-task-marker-value="3">
        <rect />
        <use href="#topic-task-marker-3" />
    </g>
</g>
<g mmap-layout="line">
    <g class="topic-task-marker-item season-topic-svg-button" mmap-event-click="selectTaskMarker" d-task-marker-value="4">
        <rect />
        <use href="#topic-task-marker-4" />
    </g>
    <g class="topic-task-marker-item season-topic-svg-button" mmap-event-click="selectTaskMarker" d-task-marker-value="5">
        <rect />
        <use href="#topic-task-marker-5" />
    </g>
    <g class="topic-task-marker-item season-topic-svg-button" mmap-event-click="selectTaskMarker" d-task-marker-value="6">
        <rect />
        <use href="#topic-task-marker-6" />
    </g>
    <g class="topic-task-marker-item season-topic-svg-button" mmap-event-click="selectTaskMarker" d-task-marker-value="7">
        <rect />
        <use href="#topic-task-marker-7" />
    </g>
</g>
<g mmap-layout="line">
    <g class="topic-task-marker-item season-topic-svg-button" mmap-event-click="selectTaskMarker" d-task-marker-value="8">
        <rect />
        <use href="#topic-task-marker-8" />
    </g>
    <g class="topic-task-marker-item season-topic-svg-button" mmap-event-click="selectTaskMarker" d-task-marker-value="unknown">
        <rect />
        <use href="#topic-task-marker-unknown" />
    </g>
    <rect class="topic-task-marker-placeholder" />
    <g class="topic-task-marker-item season-topic-svg-button" d-svg-button-danger="" mmap-event-click="deleteTaskMarker">
        <rect />
        <use href="#season-topic-predefine-image-delete" width="20" height="20" />
    </g>
</g>
`;

const TopicTaskMarkerEditPanelOptions = {
    rootAttrs: {
        "mmap-layout": "row",
        "mmap-layout-margin": "5",
        "mmap-layout-padding": "5",
        "mmap-layout-background": "dialogBubble",
        "mmap-bind-cancel-edit": "",
        "mmap-bind-hide-in-render": "relayout",
        "mmap-bind-filter-edit": "task-marker",
        "mmap-bind-filter-trigger": "task-marker"
    },
    singletonStamp: "topic-task-marker-editor",
    onInitialize(_opt) {
        if (_opt.topic.data["task-marker"] !== undefined) {
            const taskMarker = Number(_opt.topic.data["task-marker"]);
            const node = this.rootNode.querySelector(`g[d-task-marker-value="${(taskMarker >=0 && taskMarker <= 8) ? taskMarker : "unknown"}"]`);
            node && node.setAttribute("d-task-marker-selected", "");
        }
    },
    onAfterLayout(_opt) {
        const panelBox = this.rootNode.getBBox();
        const topicBox = _opt.topic.getGraphicRect();
        this.rootNode.setAttribute("transform", `translate(${topicBox.x + (topicBox.width - panelBox.width) / 2}, ${topicBox.y + topicBox.height + 11})`);
        Topic.showNodeInSvgView(this.rootNode, this.rootNode.ownerSVGElement);
    },
    selectTaskMarker(_event, _node, _opt, _key) {
        let value = Number(_node.getAttribute("d-task-marker-value"));
        isNaN(value) && (value = "unknown");
        if (_opt.topic && (value !== _opt.topic.data["task-marker"])) {
            _opt.topic.changeData("task-marker", value);
            _opt.topic.queueAction(() => _opt.topic.render());
        }
        this.close();
    },
    deleteTaskMarker(_event, _node, _opt, _key) {
        if (_opt.topic) {
            _opt.topic.changeData("task-marker");
            _opt.topic.queueAction(() => _opt.topic.render());
        }
        this.close();
    }
}

export function TopicTaskMarkerEditAction(_eventDetail) {
    const topic = _eventDetail.eventTarget;
    (topic instanceof Topic) && MindmapAddinPanel(topic.$assignedNode.ownerSVGElement, TopicTaskMarkerEditPanelXML, Object.assign({topic, env:topic.env, singletonMutex:topic.id}, TopicTaskMarkerEditPanelOptions));
}