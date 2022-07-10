import { Topic } from "../topic";
import { MindmapAddinPanel } from "../mindmapAddinPanel";

const TopicLabelsEditPanelXML = `
<style>
    .season-topic-label-edit-item {
        font-size: 12px;
    }
    .season-topic-label-edit-item > text {
        alignment-baseline: before-edge;
        dominant-baseline: text-before-edge;
        fill: #666;
    }
    .season-topic-label-edit-item > rect {
        fill: none;
        stroke-width: 0.5px;
        stroke: #666;
        stroke-dasharray: 2;
    }
    .season-topic-label-edit-delete > rect {
        fill: #ddd;
        stroke: none;
    }
    .season-topic-label-edit-delete > use {
        fill: #fff;
        stroke: none;
    }
    .season-topic-label-edit-delete:hover > rect {
        fill: var(--topic-ui-danger-color);
        stroke: none;
    }
</style>
<g mmap-layout="line" mmap-layout-max-width="120" mmap-layout-margin="5" mmap-layout-padding="0" class="season-topic-labels-edit-list">

</g>
<foreignObject width="120" height="26">
    <style>
        .season-topic-label-edit-input {
            width: 100%;
            height: 100%;
            outline: none;
            border: 1px solid #ccc;
            box-sizing: border-box;
            font-size: 12px;
        }
    </style>
    <input class="season-topic-label-edit-input" placeholder="new label..." mmap-event-keydown="onInputKeydown" />
</foreignObject>
`;

function createLabelItemUI(_label, _container) {
    if (_label && (_container instanceof Node)) {
        let gNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
        gNode.setAttribute("class", "season-topic-label-edit-item");
        gNode.setAttribute("d-label", _label);
        gNode.innerHTML = `<text>${_label}</text>`;
        _container.appendChild(gNode);
        let { width, height } = gNode.getBBox();
        gNode.insertAdjacentHTML("afterbegin", `<rect x="0" y="0" width="${width + height}" height="${height}" />`);
        gNode.insertAdjacentHTML("beforeend", `<g class="season-topic-label-edit-delete" transform="translate(${width},0)" mmap-event-click="delete">
            <rect x="0" y="0"  width="${height}" height="${height}" />
            <use href="#season-topic-predefine-image-cross" width="${height}" height="${height}" />
        </g>`);
    }
}

const TopicLabelsEditPanelOptions = {
    rootAttrs: {
        "mmap-layout": "row",
        "mmap-layout-margin": "5",
        "mmap-layout-padding": "10",
        "mmap-layout-background": "generateBackground",
        "mmap-bind-cancel-edit": "",
        "mmap-bind-hide-in-render": "relayout",
        "mmap-bind-filter-edit": "labels"
    },
    singletonStamp: "topic-labels-editor",
    onInitialize(_opt) {
        let labels = ((_opt.topic instanceof Topic) && _opt.topic.data.labels);
        labels = Array.from((labels instanceof Array) ? labels : []);
        this.labels = labels;
        const listContainer = this.rootNode.querySelector(".season-topic-labels-edit-list");
        labels.forEach(item => createLabelItemUI(item, listContainer));
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
    onInputKeydown(_event, _node, _opt) {
        const inputNode = _event.target;
        if (inputNode) {
            let key = String(_event.key).toLowerCase();
            if (key === "enter") {
                key = undefined;
                let label = String(inputNode.value).trim();
                if (!this.labels.includes(label)) {
                    inputNode.value = "";
                    this.labels.push(label);
                    createLabelItemUI(label, this.rootNode.querySelector(".season-topic-labels-edit-list"));
                    this.relayout();
                }
            } else if (key === "tab" ) {
                key = undefined;
            } else if (key === "escape") {
                key = undefined;
                inputNode.value = "";
            }
            key || (_event.preventDefault(), _event.stopPropagation());
        }
    },
    onClose(_opt) {
        const topic = _opt.topic;
        if (topic instanceof Topic) {
            const labels = this.labels;
            if (String(labels) !== String(topic.data.labels)) {
                topic.changeData("labels", labels.length > 0 ? labels : undefined);
                topic.queueAction(() => topic.render());
            }
        }
    },
    delete(_event, _node, _opt) {
        while (_node) {
            if (_node.hasAttribute("d-label")) {
                break;
            }
            _node = _node.parentNode;
            if (_node === this.rootNode) {
                _node = undefined;
            }
        }
        if (_node && this.labels) {
            const label = _node.getAttribute("d-label");
            const idx = this.labels.indexOf(label);
            (idx >= 0) && this.labels.splice(idx, 1);
            _node.remove();
            this.relayout();
        }
    }
}

export function TopicLabelsEditAction(_eventDetail) {
    const topic = _eventDetail.eventTarget;
    (topic instanceof Topic) && MindmapAddinPanel(topic.$assignedNode.ownerSVGElement, TopicLabelsEditPanelXML, Object.assign({topic, env:topic.env, singletonMutex:topic.id}, TopicLabelsEditPanelOptions));
}