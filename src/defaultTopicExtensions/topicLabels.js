export const topicLabelsTemplate = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <style eblock-predefined="" d-tag="topic-labels">
        .season-topic-label > rect {
            fill: rgba(255,255,255,0.7);
            stroke-width: 0.5px;
            stroke-dasharray: 2;
            stroke: #666;
            rx: 5px;
            ry: 5px;
        }
        .season-topic-label > text {
            alignment-baseline: before-edge;
            dominant-baseline: text-before-edge;
            font-size: 0.8em;
            fill: #666;
        }
    </style>
    <script eblock-script="">
    <![CDATA[
        declarer.getExtensionInfo = function () {
            return {
                name: "labels"
            };
        }
        declarer.onRendering = function (_data, _, _topic) {
            const labels = (_data && _data.labels);
            if (!labels || !_data.labels.length) {
                this.unmount();
            } else {
                const renderedLabels = [];
                this.$assignedNode.querySelectorAll(".season-topic-label").forEach(item => {
                    let labelVal = item.getAttribute("d-label");
                    if (!labels.includes(labelVal)) {
                        item.remove();
                    } else {
                        renderedLabels.push(labelVal);
                    }
                });
                labels.forEach(item => {
                    if (!renderedLabels.includes(item)) {
                        let gNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        gNode.setAttribute("class", "season-topic-label");
                        gNode.innerHTML = '<text transform="translate(2, 2)">' + item + '</text>';
                        this.$assignedNode.appendChild(gNode);
                        let box = gNode.getBBox();
                        gNode.insertAdjacentHTML("afterbegin", '<rect x="0" y="0" width="' + String(parseInt(box.width) + 4) + '" height="' + String(parseInt(box.height) + 4) + '" />');
                    }
                });
                let x = 0;
                this.$assignedNode.querySelectorAll(".season-topic-label").forEach(item => {
                    item.setAttribute("transform", "translate(" + x + ",0)");
                    let box = item.getBBox();
                    x += box.width + 2;
                });
            }
        }
    ]]>
    </script>
    <g eblock-template="" season-topic-content-type="labels" class="season-topic-labels" ebevent-rendering="onRendering">
    </g>
</svg>
`;