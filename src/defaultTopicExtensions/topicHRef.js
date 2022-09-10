export const topicHRefTemplate = `
<!--template XML-->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <style eblock-predefined="" d-tag="topic-href">
        .season-topic-href {
            fill: rgba(255,255,255,0.05);
            stroke: none;
        }
        .season-topic-href > use {
            fill: var(--topic-font-color);
        }
        .season-topic-href:hover {
            fill: var(--topic-ui-focus-color);
            fill-opacity: 0.3;
            stroke: none;
        }
        .season-topic-href:hover > use {
            fill-opacity: 1;
        }
    </style>
    <defs eblock-predefined="" d-tag="topic-href">
        <symbol id="topic-href-link-icon" width="20" height="20" viewBox="0 0 20 20">
            <path d="M 19,7.115 13.63,2.5 v 2.692 c -8.226,0.08 -8.339,8.658 -8.339,8.658 0,0 1.746,-4.562 8.339,-4.619 v 2.499 z"></path>
            <path d="M 5 3.625 C 3.892 3.625 3 4.517 3 5.625 L 3 14.62 C 3 15.73 3.892 16.62 5 16.62 L 15.01 16.62 C 16.12 16.62 17.01 15.73 17.01 14.62 L 17.01 10.33 L 15.81 11.35 L 15.81 13.76 C 15.81 14.68 15.07 15.42 14.15 15.42 L 5.857 15.42 C 4.939 15.42 4.199 14.68 4.199 13.76 L 4.199 6.482 C 4.199 5.564 4.939 4.824 5.857 4.824 L 12.49 4.824 L 12.5 3.625 L 5 3.625 z"></path>
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
        };
        declarer.onRendering = function (_data, _, _topic) {
            if (!_data || !_data.href) {
                this.unmount();
            } else {
                let type = _topic.env.getHRefType(_data.href);
                let node = this.$assignedNode.querySelector(":scope > use");
                node && node.setAttribute("href", (type === "link") ? "#topic-href-link-icon" : "#topic-href-resource-icon");
            }
        };
    ]]>
    </script>
    <g eblock-template="" season-topic-content-type="href" class="season-topic-href" ebevent-rendering="onRendering">
        <rect width="20" height="20" rx="3" ry="3" />
        <use href="#topic-href-link-icon" width="20" height="20" />
    </g>
</svg>
`;