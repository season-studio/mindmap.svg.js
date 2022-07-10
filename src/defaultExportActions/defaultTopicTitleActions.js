import { MindmapAddinPanel } from "../mindmapAddinPanel";
import { Topic } from "../topic";

const TopicTitleEditorTemplate = `
    <foreignObject>
        <style>
            .season-topic-title-editor {
                outline: none;
                border: 1px solid #777;
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                color: #000;
                background-color: #fff;
            }
        </style>
        <input xmlns="http://www.w3.org/1999/xhtml" class="season-topic-title-editor" tabindex="0" mmap-event-keydown="onKeydown"></input>
    </foreignObject>
`;

const TopicTitleEditorPanelOptions = {
    rootAttrs: {
        "mmap-bind-cancel-edit": "",
        "mmap-bind-hide-in-render": "relayout",
        "mmap-bind-filter-edit": "title"
    },
    singletonStamp: "topic-title-editor",
    onInitialize(_opt) {
        this.mainNode = this.rootNode.querySelector("foreignObject");
        this.inputNode = this.rootNode.querySelector(".season-topic-title-editor");
        this.topic = _opt.topic;

        this.onSubmit = (function () {
            const value = String(this.inputNode.value).trim();
            if (value !== this.topic.data.title) {
                this.topic.changeData("title", value);
                this.topic.queueAction(() => this.topic.render());
            }
        }).bind(this);

        this.onBlur = (function () {
            this.onSubmit();
            this.close();
        }).bind(this);

        this.inputNode.addEventListener("blur", this.onBlur);
    },
    onAfterLayout(_opt) {
        const config = this.topic.env.config;
        const padding = (Number(config.secondaryPadding) || 5);

        this.inputNode.value = String(this.topic.data.title || "").trim();
        this.inputNode.style.padding = (this.inputNode.style.borderRadius = `${padding}px`);

        const boxRect = this.topic.getGraphicRect();
        const titleRect = this.topic.getGraphicRect(".season-topic-title");
        const y = (this.topic.$assignedNode.querySelector(".season-topic-image") ? (titleRect.y - boxRect.y - padding) : 1);
        const height = boxRect.height - y - 1;
        this.mainNode.setAttribute("x", 1);
        this.mainNode.setAttribute("y", y);
        this.mainNode.setAttribute("width", boxRect.width - 2);
        this.mainNode.setAttribute("height", height);
        
        const titleNode = this.topic.$assignedNode.querySelector(":scope > [season-topic-content-group] > .season-topic-title");
        const titleNodeStyle = getComputedStyle(titleNode);
        if (titleNodeStyle) {
            this.inputNode.style.fontSize = titleNodeStyle["font-size"];
            this.inputNode.style.fontWeight = titleNodeStyle["font-weight"];
        }

        this.inputNode.focus();
        this.inputNode.select();
    },
    onKeydown(_event, _node, _opt) {
        let key = String(_event.key).toLowerCase();
        if (key === "enter") {
            key = undefined;
            this.onSubmit();
            this.close();
        } else if (key === "tab" ) {
            key = undefined;
        } else if (key === "escape") {
            key = undefined;
            this.close();
        }
        key || (_event.preventDefault(), _event.stopPropagation());
    },
    onClose() {
        this.inputNode.removeEventListener("blur", this.onBlur);
    }
}

export function TopicTitleEditAction(_eventDetail) {
    const topic = _eventDetail.eventTarget;
    (topic instanceof Topic) && MindmapAddinPanel(topic.$assignedNode, TopicTitleEditorTemplate, Object.assign({ topic, env:topic.env }, TopicTitleEditorPanelOptions));
}
