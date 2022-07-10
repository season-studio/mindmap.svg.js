export const topicHRefTemplate = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <style eblock-predefined="" d-tag="topic-href">
        .season-topic-href {
            fill: rgba(255,255,255,0.05);
            stroke: none;
        }
        .season-topic-href > use {
            fill: #333;
        }
        .season-topic-href:hover {
            fill: var(--topic-ui-focus-color);
            stroke: none;
        }
        .season-topic-href:hover > use {
            fill: var(--topic-ui-emphasize-front-color);
        }
    </style>
    <defs eblock-predefined="" d-tag="topic-href">
        <symbol id="topic-href-link-icon" width="20" height="20" viewBox="0 0 20 20">
            <path d="M 19,7.115 13.63,2.5 v 2.692 c -8.226,0.08 -8.339,8.658 -8.339,8.658 0,0 1.746,-4.562 8.339,-4.619 v 2.499 z"></path>
            <path d="m 15.77,11.44 v 4.91 H 4.127 V 4.424 H 12.5 V 3.269 H 3 V 17.5 l 13.89,-0.1 v -6.95 z"></path>
        </symbol>
        <symbol id="topic-href-resource-icon" width="20" height="20" viewBox="0 0 20 20">
            <path d="m 4.407,16.36 c -1.535,-1.53 -1.536,-4.02 -0,-5.55 L 11.87,3.344 c 1.11,-1.125 2.97,-1.125 4.09,0 1.12,1.126 1.12,2.968 0,4.094 L 9.086,14.31 c -0.729,0.73 -1.902,0.73 -2.632,0 -0.731,-0.72 -0.729,-1.9 0,-2.63 L 9.97,8.17 10.84,9.045 7.332,12.56 c -0.245,0.25 -0.247,0.63 0,0.87 0.248,0.25 0.63,0.25 0.876,0 L 15.08,6.56 c 0.65,-0.643 0.65,-1.696 0,-2.34 -0.65,-0.642 -1.7,-0.642 -2.34,0 l -7.457,7.47 c -1.05,1.04 -1.047,2.73 0,3.79 1.052,1.05 2.746,1.05 3.797,0 l 3.08,-3.08 0.88,0.87 -3.08,3.08 c -1.537,1.54 -4.022,1.53 -5.557,0 z"></path>
        </symbol>
    </defs>
    <script eblock-script="">
    <![CDATA[
        declarer.getExtensionInfo = function () {
            return {
                name: "href"
            };
        }
        declarer.onRendering = function (_data, _, _topic) {
            if (!_data || !_data.href) {
                this.unmount();
            } else {
                let type = _topic.env.getHRefType(_data.href);
                let node = this.$assignedNode.querySelector(":scope > use");
                node && node.setAttribute("href", (type === "link") ? "#topic-href-link-icon" : "#topic-href-resource-icon");
            }
        }
    ]]>
    </script>
    <g eblock-template="" season-topic-content-type="href" class="season-topic-href" ebevent-rendering="onRendering">
        <rect width="20" height="20" rx="3" ry="3"></rect>
        <use href="#topic-href-link-icon"></use>
    </g>
</svg>
`;