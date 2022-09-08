/**
 * @author season <season-studio@outlook.com>
 * @license Apache-2.0
 */

import { TopicHRefEditAction, TopicHRefTriggerAction } from "./defaultTopicHRefAction";
import { TopicImageEditAction, TopicImageTriggerAction } from "./defaultTopicImageActions";
import { TopicLabelsEditAction } from "./defaultTopicLabelsAction";
import { TopicNotesEditAction, TopicNotesTriggerAction } from "./defaultTopicNotesAction";
import { TopicPriorityEditAction } from "./defaultTopicPriorityAction";
import { TopicTaskMarkerEditAction } from "./defaultTopicTaskMarkerAction";
import { TopicTitleEditAction } from "./defaultTopicTitleActions";

export
/**
 * The default actions set of the topic
 * @static
 * @constant
 * @type {Object}
 */
const DefaultTopicEventActions = {
    "title": { edit: TopicTitleEditAction },
    "image": { edit: TopicImageEditAction, trigger: TopicImageTriggerAction },
    "priority": { edit: TopicPriorityEditAction },
    "href": { edit: TopicHRefEditAction, trigger: TopicHRefTriggerAction },
    "task-marker": { edit: TopicTaskMarkerEditAction },
    "labels": { edit: TopicLabelsEditAction },
    "notes": { edit: TopicNotesEditAction, trigger: TopicNotesTriggerAction }
};