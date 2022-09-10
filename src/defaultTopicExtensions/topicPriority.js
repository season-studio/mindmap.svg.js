export const topicPriorityTemplate = `
<!--template XML-->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs eblock-predefined="" d-tag="topic-priority">
        <symbol id="topic-priority-1" width="20" height="20" viewBox="-1 -1 22 22">
            <path fill="#f00" fill-opacity="0.8" stroke="#fff" stroke-width="2" stroke-opacity="0.8" d="M1 10A9 9 0 1 1 20 10A9 9 0 1 1 1 10M8 7L10.5 6V16"></path>
        </symbol>
        <symbol id="topic-priority-2" width="20" height="20" viewBox="-1 -1 22 22">
            <path fill="#f00" fill-opacity="0.8" stroke="#fff" stroke-width="2" stroke-opacity="0.8" d="M1 10A9 9 0 1 1 20 10A9 9 0 1 1 1 10M7 8C10.5 1 20 8 7 14M6 14H16"></path>
        </symbol>
        <symbol id="topic-priority-3" width="20" height="20" viewBox="-1 -1 22 22">
            <path fill="#f0f" fill-opacity="0.8" stroke="#fff" stroke-width="2" stroke-opacity="0.8" d="M1 10A9 9 0 1 1 20 10A9 9 0 1 1 1 10M7 7C10.5 1 20 8 10 10C21 10 10.5 21 6 12"></path>
        </symbol>
        <symbol id="topic-priority-4" width="20" height="20" viewBox="-1 -1 22 22">
            <path fill="#f0f" fill-opacity="0.8" stroke="#fff" stroke-width="2" stroke-opacity="0.8" d="M1 10A9 9 0 1 1 20 10A9 9 0 1 1 1 10M12 4Q10 10 6 13M5 13H15M13 8L11 16"></path>
        </symbol>
        <symbol id="topic-priority-5" width="20" height="20" viewBox="-1 -1 22 22">
            <path fill="#06f" fill-opacity="0.8" stroke="#fff" stroke-width="2" stroke-opacity="0.8" d="M1 10A9 9 0 1 1 20 10A9 9 0 1 1 1 10M9 4Q9 7 8 9M7 9C18 5 16 20 6 14M9 5H14"></path>
        </symbol>
        <symbol id="topic-priority-6" width="20" height="20" viewBox="-1 -1 22 22">
            <path fill="#06f" fill-opacity="0.8" stroke="#fff" stroke-width="2" stroke-opacity="0.8" d="M1 10A9 9 0 1 1 20 10A9 9 0 1 1 1 10M7 9C13 7 16 13 10 15C4 15 4 9 13 4"></path>
        </symbol>
        <symbol id="topic-priority-7" width="20" height="20" viewBox="-1 -1 22 22">
            <path fill="#093" fill-opacity="0.8" stroke="#fff" stroke-width="2" stroke-opacity="0.8" d="M1 10A9 9 0 1 1 20 10A9 9 0 1 1 1 10M7 8V6Q11 7 13 6.5Q10 12 9 16"></path>
        </symbol>
        <symbol id="topic-priority-8" width="20" height="20" viewBox="-1 -1 22 22">
            <path fill="#093" fill-opacity="0.8" stroke="#fff" stroke-width="2" stroke-opacity="0.8" d="M1 10A9 9 0 1 1 20 10A9 9 0 1 1 1 10M10 9C6 8 7 3 12 4C15 5 15 10 10 9C16 10 16 16.5 10 16C4 15 4 9 10 9"></path>
        </symbol>
        <symbol id="topic-priority-9" width="20" height="20" viewBox="-1 -1 22 22">
            <path fill="#993" fill-opacity="0.8" stroke="#fff" stroke-width="2" stroke-opacity="0.8" d="M1 10A9 9 0 1 1 20 10A9 9 0 1 1 1 10M15 10C6 16 5 3.5 12 4.5C18 6 16 17 7 16"></path>
        </symbol>
    </defs>
    <script eblock-script="">
    <![CDATA[
        declarer.getExtensionInfo = function () {
            return {
                name: "priority"
            };
        };
        declarer.onRendering = function (_data) {
            if (_data) {
                let priority = Number(_data.priority);
                if (priority && (priority > 0) && (priority < 10)) {
                    this.$assignedNode.setAttribute("href", "#topic-priority-" + priority);
                } else {
                    this.unmount();
                }
            }
        };
    ]]>
    </script>
    <use eblock-template="" season-topic-content-type="priority" ebevent-rendering="onRendering" width="22" height="22" />
</svg>
`;
