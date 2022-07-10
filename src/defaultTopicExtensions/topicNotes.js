export const topicNotesTemplate = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <style eblock-predefined="" d-tag="topic-notes">
        .season-topic-notes {
            fill: rgba(255,255,255,0.05);
            stroke: none;
        }
        .season-topic-notes > use {
            fill: rgba(255,255,255,0.3);
            stroke-width: 1.5px;
            stroke: #111;
        }
        .season-topic-notes:hover > use {
            fill: #fff;
            stroke-width: 1.5px;
            stroke: #000;
        }
    </style>
    <script eblock-script="">
    <![CDATA[
        declarer.getExtensionInfo = function () {
            return {
                name: "notes"
            };
        }
        declarer.onRendering = function (_data, _, _topic) {
            if (!_data || !_data.notes) {
                this.unmount();
            }
        }
    ]]>
    </script>
    <g eblock-template="" season-topic-content-type="notes" class="season-topic-notes" ebevent-rendering="onRendering">
        <use href="#season-topic-predefine-image-nodepad" width="20" height="20" />
    </g>
</svg>
`;