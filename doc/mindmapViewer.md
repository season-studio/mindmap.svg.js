<a name="MindmapViewer"></a>

## MindmapViewer ⇐ <code>MindmapContainer</code>
Class of the viewer for displaying and operating the mindmap

**Kind**: global class  
**Extends**: <code>MindmapContainer</code>  

* [MindmapViewer](#MindmapViewer) ⇐ <code>MindmapContainer</code>
    * _instance_
        * [.MindmapViewer](#MindmapViewer+MindmapViewer)
            * [new exports.MindmapViewer(_doc, _node)](#new_MindmapViewer+MindmapViewer_new)
        * [.sheetID](#MindmapViewer+sheetID) : <code>String</code>
        * [.rootTopic](#MindmapViewer+rootTopic) : <code>Topic</code>
        * [.focusTopic](#MindmapViewer+focusTopic) : <code>Topic</code>
        * [.UIControlMap](#MindmapViewer+UIControlMap) : <code>Object</code>
        * [.dispose()](#MindmapViewer+dispose)
        * [.getTopicByID(_id)](#MindmapViewer+getTopicByID) ⇒ <code>Topic</code>
        * [.createChildTopic()](#MindmapViewer+createChildTopic) ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
        * [.createSiblingTopic()](#MindmapViewer+createSiblingTopic) ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
        * [.editFocusTopic(_triggerContentType)](#MindmapViewer+editFocusTopic) ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
        * [.deleteFocusTopic()](#MindmapViewer+deleteFocusTopic) ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
        * [.gotoNextSiblingTopic()](#MindmapViewer+gotoNextSiblingTopic) ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
        * [.gotoPreviousSiblingTopic()](#MindmapViewer+gotoPreviousSiblingTopic) ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
        * [.gotoParentTopic()](#MindmapViewer+gotoParentTopic) ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
        * [.gotoChildrenTopic()](#MindmapViewer+gotoChildrenTopic) ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
        * [.gotoRootTopic()](#MindmapViewer+gotoRootTopic) ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
        * [.render()](#MindmapViewer+render) ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
        * [.exportImage(_opt)](#MindmapViewer+exportImage) ⇒ <code>Promise.&lt;{width: Number, height: Number, data: Any}&gt;</code>
        * [.move-view(_event)](#MindmapViewer+move-view)
        * [.zoom-view(_event, _opt)](#MindmapViewer+zoom-view)
        * [.goto-topic-with-direction(_event, _dir)](#MindmapViewer+goto-topic-with-direction)
    * _static_
        * [.getControlMapKey(_event, _keepCase, _allowSingleMetaKey)](#MindmapViewer.getControlMapKey) ⇒ <code>String</code>
        * [.dispatchTopicEventAction(_event, _type)](#MindmapViewer.dispatchTopicEventAction) ⇒ <code>Boolean</code>
        * [.dispatchControlMapAction(_event, _instance, _prefixCb)](#MindmapViewer.dispatchControlMapAction) ⇒ <code>Object</code>

<a name="MindmapViewer+MindmapViewer"></a>

### mindmapViewer.MindmapViewer
**Kind**: instance class of [<code>MindmapViewer</code>](#MindmapViewer)  
<a name="new_MindmapViewer+MindmapViewer_new"></a>

#### new exports.MindmapViewer(_doc, _node)
Create an instance of the MindmapViewer


| Param | Type | Description |
| --- | --- | --- |
| _doc | <code>MindmapDocument</code> | The document assigned with this viewer |
| _node | <code>Node</code> | The node to contain this viewer |

<a name="MindmapViewer+sheetID"></a>

### mindmapViewer.sheetID : <code>String</code>
The ID of the current sheet displayed in this viewer

**Kind**: instance property of [<code>MindmapViewer</code>](#MindmapViewer)  
<a name="MindmapViewer+rootTopic"></a>

### mindmapViewer.rootTopic : <code>Topic</code>
The root topic in the current viewer

**Kind**: instance property of [<code>MindmapViewer</code>](#MindmapViewer)  
<a name="MindmapViewer+focusTopic"></a>

### mindmapViewer.focusTopic : <code>Topic</code>
The focus topic in the current viewer

**Kind**: instance property of [<code>MindmapViewer</code>](#MindmapViewer)  
<a name="MindmapViewer+UIControlMap"></a>

### mindmapViewer.UIControlMap : <code>Object</code>
The name of each member should be a value generated by the MindmapView.getControlMapKeyEach member in the map should be the type of UIControlMapItem

**Kind**: instance property of [<code>MindmapViewer</code>](#MindmapViewer)  
**Summary**: Control-map for defining the actions of the UI event.  
**Example**  
```js
// Map the arrow-left key and arrow-right key to move the focusUIControlMap = {    "arrowright": { action: "$goto-topic-with-direction", args: [true]},    "arrowleft": { action: "$goto-topic-with-direction", args: [false]}};
```
<a name="MindmapViewer+dispose"></a>

### mindmapViewer.dispose()
Dispose the resource if you don't need this viewer any more.

**Kind**: instance method of [<code>MindmapViewer</code>](#MindmapViewer)  
<a name="MindmapViewer+getTopicByID"></a>

### mindmapViewer.getTopicByID(_id) ⇒ <code>Topic</code>
Get the topic with special ID in the current viewer

**Kind**: instance method of [<code>MindmapViewer</code>](#MindmapViewer)  
**Returns**: <code>Topic</code> - The topic matched the special ID  

| Param | Type | Description |
| --- | --- | --- |
| _id | <code>String</code> | The special ID |

<a name="MindmapViewer+createChildTopic"></a>

### mindmapViewer.createChildTopic() ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
Create a child topic in the focus topic in the current viewer

**Kind**: instance method of [<code>MindmapViewer</code>](#MindmapViewer)  
**Returns**: [<code>MindmapViewer</code>](#MindmapViewer) - This viewer  
<a name="MindmapViewer+createSiblingTopic"></a>

### mindmapViewer.createSiblingTopic() ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
Create a sibling topic of the focus topic in the current viewer

**Kind**: instance method of [<code>MindmapViewer</code>](#MindmapViewer)  
**Returns**: [<code>MindmapViewer</code>](#MindmapViewer) - This viewer  
<a name="MindmapViewer+editFocusTopic"></a>

### mindmapViewer.editFocusTopic(_triggerContentType) ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
Let the focus topic into edit mode

**Kind**: instance method of [<code>MindmapViewer</code>](#MindmapViewer)  
**Returns**: [<code>MindmapViewer</code>](#MindmapViewer) - This viewer  

| Param | Type | Description |
| --- | --- | --- |
| _triggerContentType | <code>String</code> | Optional. The type of the content to be edit. The title will be edit if this argument is ignored. |

<a name="MindmapViewer+deleteFocusTopic"></a>

### mindmapViewer.deleteFocusTopic() ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
Delete the focus topic in this viewer

**Kind**: instance method of [<code>MindmapViewer</code>](#MindmapViewer)  
**Returns**: [<code>MindmapViewer</code>](#MindmapViewer) - This viewer  
<a name="MindmapViewer+gotoNextSiblingTopic"></a>

### mindmapViewer.gotoNextSiblingTopic() ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
Move the focus to the next sibling topic from the current focus topic

**Kind**: instance method of [<code>MindmapViewer</code>](#MindmapViewer)  
**Returns**: [<code>MindmapViewer</code>](#MindmapViewer) - This viewer  
<a name="MindmapViewer+gotoPreviousSiblingTopic"></a>

### mindmapViewer.gotoPreviousSiblingTopic() ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
Move the focus to the previous sibling topic from the current focus topic

**Kind**: instance method of [<code>MindmapViewer</code>](#MindmapViewer)  
**Returns**: [<code>MindmapViewer</code>](#MindmapViewer) - This viewer  
<a name="MindmapViewer+gotoParentTopic"></a>

### mindmapViewer.gotoParentTopic() ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
Move the focus to the parent topic from the current focus topic

**Kind**: instance method of [<code>MindmapViewer</code>](#MindmapViewer)  
**Returns**: [<code>MindmapViewer</code>](#MindmapViewer) - This viewer  
<a name="MindmapViewer+gotoChildrenTopic"></a>

### mindmapViewer.gotoChildrenTopic() ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
Move the focus to the first child topic from the current focus topic

**Kind**: instance method of [<code>MindmapViewer</code>](#MindmapViewer)  
**Returns**: [<code>MindmapViewer</code>](#MindmapViewer) - This viewer  
<a name="MindmapViewer+gotoRootTopic"></a>

### mindmapViewer.gotoRootTopic() ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
Move to the root topic in this view

**Kind**: instance method of [<code>MindmapViewer</code>](#MindmapViewer)  
**Returns**: [<code>MindmapViewer</code>](#MindmapViewer) - This viewer  
<a name="MindmapViewer+render"></a>

### mindmapViewer.render() ⇒ [<code>MindmapViewer</code>](#MindmapViewer)
Render the view

**Kind**: instance method of [<code>MindmapViewer</code>](#MindmapViewer)  
**Returns**: [<code>MindmapViewer</code>](#MindmapViewer) - This viewer  
<a name="MindmapViewer+exportImage"></a>

### mindmapViewer.exportImage(_opt) ⇒ <code>Promise.&lt;{width: Number, height: Number, data: Any}&gt;</code>
Export the image  of the viewer

**Kind**: instance method of [<code>MindmapViewer</code>](#MindmapViewer)  
**Returns**: <code>Promise.&lt;{width: Number, height: Number, data: Any}&gt;</code> - The promise resolved with the data of the image  

| Param | Type | Description |
| --- | --- | --- |
| _opt | <code>Object</code> | Optional. The option |
| _opt.fill | <code>String</code> | The color of the background |
| _opt.type | <code>String</code> | Optional. The type of the destination image. Such as png, jpeg, and so on |
| _opt.toBlob | <code>Boolean</code> | Optional. Set true if the image storged in a Blob |

<a name="MindmapViewer+move-view"></a>

### mindmapViewer.move-view(_event)
Processor of moving the content in this viewer.It can be used as an action in the control-map.

**Kind**: instance method of [<code>MindmapViewer</code>](#MindmapViewer)  

| Param | Type |
| --- | --- |
| _event | <code>Event</code> | 

<a name="MindmapViewer+zoom-view"></a>

### mindmapViewer.zoom-view(_event, _opt)
Processor of changing the scale of this viewer.It can be used as an action in the control-map.

**Kind**: instance method of [<code>MindmapViewer</code>](#MindmapViewer)  

| Param | Type | Description |
| --- | --- | --- |
| _event | <code>Event</code> |  |
| _opt | <code>Object</code> | Optional. The options |
| _opt.min | <code>Number</code> | Optional. The min scale of the viewer. The default value is 0.1 |
| _opt.max | <code>Number</code> | Optional. The max scale of the viewer. The default valule is 2 |
| _opt.delta | <code>Number</code> | Optional. The changing value of the scale each time. The default value is 0.02 |
| _opt.by | <code>String</code> | Optional. Indicate the changing of the scale is base on which axis does the pointer changed. The default value is "y" |

<a name="MindmapViewer+goto-topic-with-direction"></a>

### mindmapViewer.goto-topic-with-direction(_event, _dir)
Processor of moving the focus to an other topic.It can be used as an action in the control-map.

**Kind**: instance method of [<code>MindmapViewer</code>](#MindmapViewer)  

| Param | Type | Description |
| --- | --- | --- |
| _event | <code>Event</code> |  |
| _dir | <code>String</code> | Optional. The direction of the destination topic from the the current focus topic. This parameter can be "left" or "right" |

<a name="MindmapViewer.getControlMapKey"></a>

### MindmapViewer.getControlMapKey(_event, _keepCase, _allowSingleMetaKey) ⇒ <code>String</code>
translate the event to a string used as the key of the control-map

**Kind**: static method of [<code>MindmapViewer</code>](#MindmapViewer)  
**Returns**: <code>String</code> - The destination key  

| Param | Type | Description |
| --- | --- | --- |
| _event | <code>Event</code> | The event to be translate, such as keydown, mousedown, and so on |
| _keepCase | <code>Boolean</code> | Set true to let the case left in the result |
| _allowSingleMetaKey | <code>Boolean</code> | Set true to let the meta key without the normal key left in the result |

<a name="MindmapViewer.dispatchTopicEventAction"></a>

### MindmapViewer.dispatchTopicEventAction(_event, _type) ⇒ <code>Boolean</code>
Dispatch the "topic-event-trigger" or "topic-event-edit" with the binding map.This function should be called with binding a map as the "this" object. This map is an object with the members of the actions for each element of the topic.

**Kind**: static method of [<code>MindmapViewer</code>](#MindmapViewer)  
**Returns**: <code>Boolean</code> - "true" means a function has been invoked, otherwise return "false".  

| Param | Type | Description |
| --- | --- | --- |
| _event | <code>Event</code> | The event |
| _type | <code>String</code> | Optional. The type of the action. The _event.type will be used instead if this argument is ignored. |

**Example**  
```js
// Dispatch the event with the custom mapMindmapViwer.dispatchTopicEventAction.call({     title: {         trigger: function () { ... },        edit: function () { ... }    }, image: {        trigger: function () { ... },        edit: function () { ... }    }}, event);
```
**Example**  
```js
// Dispatch the event with the default mapMindmapView.MindmapViewer.dispatchTopicEventAction.call(    MindmapView.DefaultTopicEventActions,     event);
```
<a name="MindmapViewer.dispatchControlMapAction"></a>

### MindmapViewer.dispatchControlMapAction(_event, _instance, _prefixCb) ⇒ <code>Object</code>
Dispatch the event in the control-map

**Kind**: static method of [<code>MindmapViewer</code>](#MindmapViewer)  
**Returns**: <code>Object</code> - return the matched item if the action is processed.  

| Param | Type | Description |
| --- | --- | --- |
| _event | <code>Event</code> | The DOM's event to be dispatched |
| _instance | <code>Object</code> | The instance contains the control-map |
| _prefixCb | <code>function</code> | Optional. The callback function before calling the action in the map |

<a name="UIControlMapItem"></a>

## .UIControlMapItem : <code>Object</code>
Type of the member in the control-map

**Kind**: static typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| action | <code>function</code> \| <code>String</code> | The action binded to this item. It can be a function or the method name in the assigned instance. |
| args | <code>Array</code> | The external arguments passed to the action. Note: the event will be taken as the first argument automatically any time. |