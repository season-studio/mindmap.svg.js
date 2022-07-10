/**
 * @author season <season-studio@outlook.com>
 * @license Apache-2.0
 */

import { TopicExtensionFactor } from "../topicExtension";
import { topicHRefTemplate } from "./topicHRef";
import { topicLabelsTemplate } from "./topicLabels";
import { topicNotesTemplate } from "./topicNotes";
import { topicPriorityTemplate } from "./topicPriority";
import { topicTaskMarkerTemplate } from "./topicTaskMarker";

export 
/**
 * Create a factor of the topic's extension
 * @param {String} _templateXML The XML string of the template of the extension
 * @param {String} _parseType Optional. The MIME type of the XML string. "image/svg+xml" will be taken as default if the argument is empty.
 * @param {String} _rootSelector Optional. The selector to locate the root node in the template. "svg" will be taken as default
 * @returns {TopicExtensionFactor} The instance of the factor
 */
function CreateTopicExtensionFactor(_templateXML, _parseType, _rootSelector) {
    return new TopicExtensionFactor((new DOMParser()).parseFromString(_templateXML, _parseType || "image/svg+xml").querySelector(_rootSelector || "svg"));
}

export 
/**
 * The list of the default extensions for the topic
 * @constant
 * @type {Array<TopicExtensionFactor>}
 */
const DefaultTopicExtensions = [
    CreateTopicExtensionFactor(topicPriorityTemplate),
    CreateTopicExtensionFactor(topicTaskMarkerTemplate),
    CreateTopicExtensionFactor(topicHRefTemplate),
    CreateTopicExtensionFactor(topicLabelsTemplate),
    CreateTopicExtensionFactor(topicNotesTemplate)
];