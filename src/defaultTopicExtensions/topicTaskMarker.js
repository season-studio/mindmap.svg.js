export const topicTaskMarkerTemplate = `
<!--template XML-->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs eblock-predefined="" d-tag="topic-task-marker">
        <symbol id="topic-task-marker-0" width="20" height="20" viewBox="-1 -1 22 22">
            <path fill="#fff" fill-opacity="0.8" stroke="#093" stroke-width="1" stroke-opacity="0.8" d="M1 10A9 9 0 1 1 20 10A9 9 0 1 1 1 10M8 14V5L15 10L8 15V6"></path>
        </symbol>
        <symbol id="topic-task-marker-1" width="20" height="20" viewBox="-1 -1 22 22">
            <circle cx="10.5" cy="10.5" r="10" stroke="none" fill="#093" fill-opacity="0.8"></circle>
            <path stroke="none" fill="#fff" fill-opacity="0.8" d="M10.5 10.5V2A8.5 8.5 180 1 0 16.5 4.5L10.5 10.5"></path>
        </symbol>
        <symbol id="topic-task-marker-2" width="20" height="20" viewBox="-1 -1 22 22">
            <circle cx="10.5" cy="10.5" r="10" stroke="none" fill="#093" fill-opacity="0.8"></circle>
            <path stroke="none" fill="#fff" fill-opacity="0.8" d="M10.5 10.5V2A8.5 8.5 180 1 0 19 10.5L10.5 10.5"></path>
        </symbol>
        <symbol id="topic-task-marker-3" width="20" height="20" viewBox="-1 -1 22 22">
            <circle cx="10.5" cy="10.5" r="10" stroke="none" fill="#093" fill-opacity="0.8"></circle>
            <path stroke="none" fill="#fff" fill-opacity="0.8" d="M10.5 10.5V2A8.5 8.5 180 1 0 16.5 16.5L10.5 10.5"></path>
        </symbol>
        <symbol id="topic-task-marker-4" width="20" height="20" viewBox="-1 -1 22 22">
            <circle cx="10.5" cy="10.5" r="10" stroke="none" fill="#093" fill-opacity="0.8"></circle>
            <path stroke="none" fill="#fff" fill-opacity="0.8" d="M10.5 10.5V2A8.5 8.5 180 0 0 10.5 19L10.5 10.5"></path>
        </symbol>
        <symbol id="topic-task-marker-5" width="20" height="20" viewBox="-1 -1 22 22">
            <circle cx="10.5" cy="10.5" r="10" stroke="none" fill="#093" fill-opacity="0.8"></circle>
            <path stroke="none" fill="#fff" fill-opacity="0.8" d="M10.5 10.5V2A8.5 8.5 180 0 0 4.5 16.5L10.5 10.5"></path>
        </symbol>
        <symbol id="topic-task-marker-6" width="20" height="20" viewBox="-1 -1 22 22">
            <circle cx="10.5" cy="10.5" r="10" stroke="none" fill="#093" fill-opacity="0.8"></circle>
            <path stroke="none" fill="#fff" fill-opacity="0.8" d="M10.5 10.5V2A8.5 8.5 180 0 0 2 10.5L10.5 10.5"></path>
        </symbol>
        <symbol id="topic-task-marker-7" width="20" height="20" viewBox="-1 -1 22 22">
            <circle cx="10.5" cy="10.5" r="10" stroke="none" fill="#093" fill-opacity="0.8"></circle>
            <path stroke="none" fill="#fff" fill-opacity="0.8" d="M10.5 10.5V2A8.5 8.5 180 0 0 4.5 4.5L10.5 10.5"></path>
        </symbol>
        <symbol id="topic-task-marker-8" width="20" height="20" viewBox="-1 -1 22 22">
            <path fill="#093" fill-opacity="0.8" stroke="#fff" stroke-width="2" stroke-opacity="0.8" d="M1 10A9 9 0 1 1 20 10A9 9 0 1 1 1 10M15 6L10 13L6 9"></path>
        </symbol>
        <symbol id="topic-task-marker-unknown" width="20" height="20" viewBox="-1 -1 22 22">
            <path fill="#fff" fill-opacity="0.8" stroke="#093" stroke-width="1" stroke-opacity="0.8" d="M1 10A9 9 0 1 1 20 10A9 9 0 1 1 1 10M7 8A3.5 3.5 0 1 1 10.5 10.5V13M10.5 14V16M9.5 15H11.5"></path>
        </symbol>
    </defs>
    <script eblock-script="">
    <![CDATA[
        declarer.getExtensionInfo = function () {
            return {
                name: "task-marker"
            };
        };
        declarer.onRendering = function (_data) {
            if (_data && ("task-marker" in _data)) {
                let task = Number(_data["task-marker"]);
                if ((task >= 0) && (task <= 8)) {
                    this.$assignedNode.setAttribute("href", "#topic-task-marker-" + task);
                } else {
                    this.$assignedNode.setAttribute("href", "#topic-task-marker-unknown");
                }
            } else {
                this.unmount();
            }
        };
    ]]>
    </script>
    <use eblock-template="" season-topic-content-type="task-marker" ebevent-rendering="onRendering" width="22" height="22" />
</svg>
`;
