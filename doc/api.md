# API of mindmap.svg.js

## Export Classes
- [MindmapAddinPanel](./mindmapAddinPanel.md#MindmapAddinPanel)
  Class of the addin panel in the mindmap container.The panel is implemented by SVG 
- [MindmapContainer](./mindmapContainer.md#MindmapContainer)
  Class of the container for displaying the mindmap 
- [MindmapDocument](./mindmapDocument.md#MindmapDocument)
  Class of document model describing the mindmap 
- [MindmapEnvironment](./mindmapEnv.md#MindmapEnvironment)
  The environment of the mindmap 
- [MindmapError](./mindmapError.md#MindmapError)
  Basic class of error from mindmap 
- [MindmapViewer](./mindmapViewer.md#MindmapViewer)
  Class of the viewer for displaying and operating the mindmap 
- [Topic](./topic.md#Topic)
  Class of the topic 
- [TopicExtension](./topicExtension.md#TopicExtension)
  Class of the extension of the topic 
- [TopicExtensionFactor](./topicExtension.md#TopicExtensionFactor)
  Class of the factor for extension of the topic 

## Export Functions
<a name="CreateTopicExtensionFactor"></a>

### CreateTopicExtensionFactor(_templateXML, _parseType, _rootSelector) ⇒ <code>TopicExtensionFactor</code>
Create a factor of the topic's extension

**Kind**: global function  
**Returns**: <code>TopicExtensionFactor</code> - The instance of the factor  

| Param | Type | Description |
| --- | --- | --- |
| _templateXML | <code>String</code> | The XML string of the template of the extension |
| _parseType | <code>String</code> | Optional. The MIME type of the XML string. "image/svg+xml" will be taken as default if the argument is empty. |
| _rootSelector | <code>String</code> | Optional. The selector to locate the root node in the template. "svg" will be taken as default |

## Export Constants
<a name="DefaultTopicEventActions"></a>

### DefaultTopicEventActions : <code>Object</code>
The default actions set of the topic

**Kind**: global constant  
<a name="DefaultTopicExtensions"></a>

### DefaultTopicExtensions : <code>Array.&lt;TopicExtensionFactor&gt;</code>
The list of the default extensions for the topic

**Kind**: global constant  
<a name="TopicFactor"></a>

### TopicFactor : <code>EBlockFactor</code>
The factor of the topic

**Kind**: global constant

## Declared Events
<a name="event_topic-event-after-render"></a>

### "topic-event-after-render"
Event emitted when the rendering action is completed.

**Kind**: event emitted  
<a name="event_topic-event-before-render"></a>

### "topic-event-before-render"
Event emitted before the rendering action will start.

**Kind**: event emitted  
<a name="event_topic-event-cancel-edit"></a>

### "topic-event-cancel-edit"
Event for cancelling the edit action in the viewer

**Kind**: event emitted  
<a name="event_topic-event-change"></a>

### "topic-event-change"
Event for broadcasting a topic is changed.

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| detail.eventTarget | <code>Topic</code> | Input. Indicate the topic this event belong to. |
| detail.action | <code>String</code> | Input. The type of changing. Such as "create", "move", "changeData", "drop", and so on.                                  "move" means the position of the topic is changed.                                  "changeData" means the data of the topic is changed.                                  "create" means the topic is created.                                  "drop" means the topic is removed from the view. |
| detail.key | <code>String</code> | Input. The key of the member which is changed in the topic's data. This value is valid when the action is "changeData". |
| detail.originValue | <code>Any</code> | Input. The origin value of the data before changed. This value is valid when the action is "changeData". |
| detail.originParent | <code>Topic</code> | Input. The origin parent topic before the position changed. This value is valid when the action is "move". |
| detail.originSibling | <code>Topic</code> | Input. The origin next sibling topic before the position changed. This value is valid when the action is "move". |

<a name="event_topic-event-edit"></a>

### "topic-event-edit"
Event for editing a topicGenerally, this event is emitted by double click the topic

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| detail.eventTarget | <code>Topic</code> | Input. Indicate the topic this event belong to. |
| detail.triggerContentType | <code>String</code> | Input. Indicate the content element which need editing. Undefined is set if you want to edit the default content element of the topic. The default content of the topic is the title. |
| detail.originEvent | <code>Event</code> | Input. Optional. The origin event which cause this event emitted. |

<a name="event_topic-event-get-href-type"></a>

### "topic-event-get-href-type"
Event for querying the type of the target the special href assigned to

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| detail.href | <code>String</code> | Input. The href of the target which would be queryed. |
| detail.type | <code>String</code> | Output. The type of the target the href assigned to. |

<a name="event_topic-event-kill-focus"></a>

### "topic-event-kill-focus"
Event for broadcasting a topic will lost the focus.

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| detail.eventTarget | <code>Topic</code> | Input. Indicate the topic this event belong to. |

<a name="event_topic-event-report-configuration"></a>

### "topic-event-report-configuration"
Event for reporting the configurations from each component bind to the enviroment

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| detail.result | <code>Object</code> | Input/Output. The container for storage the reported configurations. |

<a name="event_topic-event-set-focus"></a>

### "topic-event-set-focus"
Event for broadcasting a topic will has focus.

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| detail.eventTarget | <code>Topic</code> | Input. Indicate the topic this event belong to. |

<a name="event_topic-event-sheet-list-changed"></a>

### "topic-event-sheet-list-changed"
Event for broadcasting the list of the sheets in the document has been changed.Adding or removing any sheet will emit this event. But changing the data of a sheet will not emit this event.

**Kind**: event emitted  
<a name="event_topic-event-sync-configuration"></a>

### "topic-event-sync-configuration"
Event for notify the global configuration has been update

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| detail | <code>Object</code> | Input. The current global configurations. |

<a name="event_topic-event-translate-href-url"></a>

### "topic-event-translate-href-url"
Event for converting a href to a URL.

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| detail.source | <code>String</code> | Input. The href would be converted. |
| detail.destination | <code>String</code> | Output. The URL that the source is converted to. |

<a name="event_topic-event-trigger"></a>

### "topic-event-trigger"
Event for triggering a topicGenerally, this event is emitted by click the topic

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| detail.eventTarget | <code>Topic</code> | Input. Indicate the topic this event belong to. |
| detail.triggerContentType | <code>String</code> | Input. Indicate the content element which is triggered. Undefined is set if you trigger the default content element of the topic. The default content of the topic is the title. |
| detail.originEvent | <code>Event</code> | Input. Optional. The origin event which cause this event emitted. |

<a name="event_topic-event-view-export-image"></a>

### "topic-event-view-export-image"
Event for notifying the viewer to export the image of the view

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| detail.option.toBlob | <code>Boolean</code> | Input. Indicate if the result is store in a blob. |
| detail.image | <code>Promise.&lt;Object&gt;</code> \| <code>Object</code> | Output. The result of the image. |

<a name="event_topic-event-view-move"></a>

### "topic-event-view-move"
Event for broadcasting the viewport is moved.

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| detail.eventTarget | <code>Topic</code> | Input. Indicate the topic this event belong to. |

<a name="event_topic-event-view-resize"></a>

### "topic-event-view-resize"
Event for broadcasting the size of the viewer is changed.

**Kind**: event emitted  
<a name="event_topic-event-view-submit"></a>

### "topic-event-view-submit"
Event for notifying the viewer to submit the data of the topic to the document.Generally, this event is emitted by document to notify the viewer assigned.

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| detail.sheets | <code>Array.&lt;SheetData&gt;</code> | Output. The viewer push it's data into this array if the data should be submitted. |
| detail.attachments | <code>Object</code> | Output. The viewer set it's attachments into this object if the attachments should be submitted. |

<a name="event_topic-event-view-switch-sheet"></a>

### "topic-event-view-switch-sheet"
Event for switching the sheet in the viewer.Generally, this event is emitted by document to notify the viewer assigned.

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| detail | <code>SheetData</code> | Input. The target sheet would be show in the viewer. |

-------
Copyright ©2022 Season Studio