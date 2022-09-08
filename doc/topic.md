<a name="Topic"></a>

## Topic ⇐ <code>EBlock</code>
Class of the topic

**Kind**: global class  
**Extends**: <code>EBlock</code>  

* [Topic](#Topic) ⇐ <code>EBlock</code>
    * _instance_
        * [.Topic](#Topic+Topic)
            * [new exports.Topic(_factorOrNode, _data, _level, _env)](#new_Topic+Topic_new)
        * [.id](#Topic+id) : <code>String</code>
        * [.level](#Topic+level) : <code>level</code>
        * [.direction](#Topic+direction) : <code>Boolean</code>
        * [.parentTopic](#Topic+parentTopic) : [<code>Topic</code>](#Topic)
        * [.hasChildren](#Topic+hasChildren) : <code>Boolean</code>
        * [.rootTopic](#Topic+rootTopic) : [<code>Topic</code>](#Topic)
        * [.firstChildTopic](#Topic+firstChildTopic) : [<code>Topic</code>](#Topic)
        * [.nextSiblingTopic](#Topic+nextSiblingTopic) : [<code>Topic</code>](#Topic)
        * [.previousSiblingTopic](#Topic+previousSiblingTopic) : [<code>Topic</code>](#Topic)
        * [.topicNode](#Topic+topicNode) : <code>Node</code>
        * [.hasFocus](#Topic+hasFocus) : <code>Boolean</code>
        * [.visible](#Topic+visible) : <code>Boolean</code>
        * [.initMetadata(_metadata, _data, _node, _level, _env)](#Topic+initMetadata)
        * [.getChildrenTopics()](#Topic+getChildrenTopics) ⇒ [<code>Array.&lt;Topic&gt;</code>](#Topic)
        * [.enumerateChilrenTopics()](#Topic+enumerateChilrenTopics)
        * [.enumerateDescendantTopics()](#Topic+enumerateDescendantTopics)
        * [.enumerateTopics()](#Topic+enumerateTopics)
        * [.getTopicByID(_id)](#Topic+getTopicByID) ⇒ [<code>Topic</code>](#Topic)
        * [.exportTopicData(_removeID)](#Topic+exportTopicData) ⇒ <code>TopicData</code>
        * [.collectImageStorage()](#Topic+collectImageStorage)
        * [.enumerateImageInStorage()](#Topic+enumerateImageInStorage)
        * [.showInCenterOfView()](#Topic+showInCenterOfView) ⇒ [<code>Topic</code>](#Topic)
        * [.showInView()](#Topic+showInView) ⇒ [<code>Topic</code>](#Topic)
        * [.notify(_event, _param)](#Topic+notify) ⇒ [<code>Topic</code>](#Topic)
        * [.render()](#Topic+render) ⇒ [<code>Topic</code>](#Topic)
        * [.getFocus()](#Topic+getFocus) ⇒ [<code>Topic</code>](#Topic)
        * [.killFocus()](#Topic+killFocus) ⇒ [<code>Topic</code>](#Topic)
        * [.setFocus(_resultForChecked)](#Topic+setFocus) ⇒ <code>Boolean</code> \| [<code>Topic</code>](#Topic)
        * [.createChild(_data, _nextSiblingTopic, _forbitNotify)](#Topic+createChild) ⇒ [<code>Topic</code>](#Topic)
        * [.changeData(_key, _newVal, _forbitNotify)](#Topic+changeData) ⇒ [<code>Topic</code>](#Topic)
        * [.moveTo(_parentTopic, _nextSiblingTopic, _forbitNotify)](#Topic+moveTo) ⇒ [<code>Topic</code>](#Topic)
        * [.drop(_rootChecker, _forbitNotify)](#Topic+drop)
        * [.getRect(_type)](#Topic+getRect) ⇒ <code>DOMRect</code>
        * [.getBBox(_type)](#Topic+getBBox) ⇒ <code>SVGRect</code>
        * [.getGraphicRect(_type)](#Topic+getGraphicRect) ⇒ <code>Object</code>
        * [.getMatrix(_type)](#Topic+getMatrix) ⇒ <code>DOMMatrix</code>
        * [.getRectInViewport(_type)](#Topic+getRectInViewport) ⇒ <code>Object</code>
        * [.getGlobalRect()](#Topic+getGlobalRect) ⇒ <code>Object</code>
        * [.getExtensionInstance(_extensionName)](#Topic+getExtensionInstance) ⇒ <code>TopicExtension</code>
        * [.exportImage(_opt)](#Topic+exportImage) ⇒ <code>Promise.&lt;{width:Number, height:Number: data:Any}&gt;</code>
    * _static_
        * [.enumerateReferenceResource(_env, _data)](#Topic.enumerateReferenceResource)
        * [.getFirstChildTopic(_nodeOrTopic)](#Topic.getFirstChildTopic) ⇒ [<code>Topic</code>](#Topic)
        * [.getMindRootNode(_node)](#Topic.getMindRootNode) ⇒ <code>Node</code>
        * [.getTopicByID(_node, _id)](#Topic.getTopicByID) ⇒ [<code>Topic</code>](#Topic)
        * [.getFocusTopic(_node)](#Topic.getFocusTopic) ⇒ [<code>Topic</code>](#Topic)
        * [.convertWindowPointToGraphic(_node, _x, _y)](#Topic.convertWindowPointToGraphic) ⇒ <code>Object</code>
        * [.showNodeInSvgView(_node, _svg)](#Topic.showNodeInSvgView)

<a name="Topic+Topic"></a>

### topic.Topic
**Kind**: instance class of [<code>Topic</code>](#Topic)  
**Summary**: Create an new instance of Topic or query an exist intsanceYou should call TopicFactor.generate to create the instance of Topic instead.  
**Contructor**:   
<a name="new_Topic+Topic_new"></a>

#### new exports.Topic(_factorOrNode, _data, _level, _env)

| Param | Type | Description |
| --- | --- | --- |
| _factorOrNode | <code>EBlockFactor</code> \| <code>Node</code> | The factor or the node of the exist topic |
| _data | <code>Any</code> | The data of the topic |
| _level | <code>Number</code> | The level of the topic |
| _env | <code>MindmapEnvironment</code> | The environment of the mindmap |

<a name="Topic+id"></a>

### topic.id : <code>String</code>
The ID of the topic

**Kind**: instance property of [<code>Topic</code>](#Topic)  
<a name="Topic+level"></a>

### topic.level : <code>level</code>
The level of the topic

**Kind**: instance property of [<code>Topic</code>](#Topic)  
<a name="Topic+direction"></a>

### topic.direction : <code>Boolean</code>
The direction of the topic.true for right, false for left

**Kind**: instance property of [<code>Topic</code>](#Topic)  
<a name="Topic+parentTopic"></a>

### topic.parentTopic : [<code>Topic</code>](#Topic)
The parent topic

**Kind**: instance property of [<code>Topic</code>](#Topic)  
<a name="Topic+hasChildren"></a>

### topic.hasChildren : <code>Boolean</code>
Indicate if the topic has any child

**Kind**: instance property of [<code>Topic</code>](#Topic)  
<a name="Topic+rootTopic"></a>

### topic.rootTopic : [<code>Topic</code>](#Topic)
The root topic

**Kind**: instance property of [<code>Topic</code>](#Topic)  
<a name="Topic+firstChildTopic"></a>

### topic.firstChildTopic : [<code>Topic</code>](#Topic)
The first child topic

**Kind**: instance property of [<code>Topic</code>](#Topic)  
<a name="Topic+nextSiblingTopic"></a>

### topic.nextSiblingTopic : [<code>Topic</code>](#Topic)
The sibling topic next to this instance

**Kind**: instance property of [<code>Topic</code>](#Topic)  
<a name="Topic+previousSiblingTopic"></a>

### topic.previousSiblingTopic : [<code>Topic</code>](#Topic)
The sibling topic before this instance

**Kind**: instance property of [<code>Topic</code>](#Topic)  
<a name="Topic+topicNode"></a>

### topic.topicNode : <code>Node</code>
The node of the instance

**Kind**: instance property of [<code>Topic</code>](#Topic)  
<a name="Topic+hasFocus"></a>

### topic.hasFocus : <code>Boolean</code>
Check if the topic has focus

**Kind**: instance property of [<code>Topic</code>](#Topic)  
<a name="Topic+visible"></a>

### topic.visible : <code>Boolean</code>
The visible state of the topic

**Kind**: instance property of [<code>Topic</code>](#Topic)  
<a name="Topic+initMetadata"></a>

### topic.initMetadata(_metadata, _data, _node, _level, _env)
**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Summary**: Initialize the metadata of the topicDo not call this method manually.  

| Param | Type | Description |
| --- | --- | --- |
| _metadata | <code>Object</code> | The container of the metadata |
| _data | <code>Any</code> | The data of the topic |
| _node | <code>Node</code> | The assigned node of the topic |
| _level | <code>Number</code> | The level of the topic |
| _env | <code>MindmapEnvironment</code> | The environment of the mindmap |

<a name="Topic+getChildrenTopics"></a>

### topic.getChildrenTopics() ⇒ [<code>Array.&lt;Topic&gt;</code>](#Topic)
Get the list of the children topics

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: [<code>Array.&lt;Topic&gt;</code>](#Topic) - The list of the children topics  
<a name="Topic+enumerateChilrenTopics"></a>

### topic.enumerateChilrenTopics()
Get an iterator for enumerating the children topics

**Kind**: instance method of [<code>Topic</code>](#Topic)  
<a name="Topic+enumerateDescendantTopics"></a>

### topic.enumerateDescendantTopics()
Get an iterator for enumerating the descendant topics

**Kind**: instance method of [<code>Topic</code>](#Topic)  
<a name="Topic+enumerateTopics"></a>

### topic.enumerateTopics()
Get an iterator for enumerating the descendant topics include this instance itself

**Kind**: instance method of [<code>Topic</code>](#Topic)  
<a name="Topic+getTopicByID"></a>

### topic.getTopicByID(_id) ⇒ [<code>Topic</code>](#Topic)
Find a special topic contained in this instance

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: [<code>Topic</code>](#Topic) - The target topic  

| Param | Type | Description |
| --- | --- | --- |
| _id | <code>String</code> | The ID of the special topic |

<a name="Topic+exportTopicData"></a>

### topic.exportTopicData(_removeID) ⇒ <code>TopicData</code>
**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Summary**: Export the data of the topicThe exposed data is include the children topic of this instance  
**Returns**: <code>TopicData</code> - The data of the topic  

| Param | Type | Description |
| --- | --- | --- |
| _removeID | <code>Boolean</code> | if remove the ID of the topic from the data |

<a name="Topic+collectImageStorage"></a>

### topic.collectImageStorage()
Collect the unused elements in the storage of the image resource

**Kind**: instance method of [<code>Topic</code>](#Topic)  
<a name="Topic+enumerateImageInStorage"></a>

### topic.enumerateImageInStorage()
Get an iterator for enumerating the image in the storage

**Kind**: instance method of [<code>Topic</code>](#Topic)  
<a name="Topic+showInCenterOfView"></a>

### topic.showInCenterOfView() ⇒ [<code>Topic</code>](#Topic)
Move this topic to the center of the viewport

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: [<code>Topic</code>](#Topic) - This instance  
<a name="Topic+showInView"></a>

### topic.showInView() ⇒ [<code>Topic</code>](#Topic)
Move this topic into the viewport

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: [<code>Topic</code>](#Topic) - This instance  
<a name="Topic+notify"></a>

### topic.notify(_event, _param) ⇒ [<code>Topic</code>](#Topic)
Fire an event to notify a state

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: [<code>Topic</code>](#Topic) - This instance  

| Param | Type | Description |
| --- | --- | --- |
| _event | <code>String</code> | The name of the event |
| _param | <code>Any</code> | The detail of the event |

<a name="Topic+render"></a>

### topic.render() ⇒ [<code>Topic</code>](#Topic)
Render all the topic

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: [<code>Topic</code>](#Topic) - This instance  
<a name="Topic+getFocus"></a>

### topic.getFocus() ⇒ [<code>Topic</code>](#Topic)
Get the focus topic

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: [<code>Topic</code>](#Topic) - The focus topic  
<a name="Topic+killFocus"></a>

### topic.killFocus() ⇒ [<code>Topic</code>](#Topic)
Kill the focus of this topic

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: [<code>Topic</code>](#Topic) - This instance  
<a name="Topic+setFocus"></a>

### topic.setFocus(_resultForChecked) ⇒ <code>Boolean</code> \| [<code>Topic</code>](#Topic)
Set the focus of this topic

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: <code>Boolean</code> \| [<code>Topic</code>](#Topic) - If the _resultForCheched is true, the function return true means the topic was not focus and the setting action is successful. If the _resultForChecked is not true, the function return the instance of this topic.  

| Param | Type | Description |
| --- | --- | --- |
| _resultForChecked | <code>Boolean</code> | Optional. Indicate if the result is the result of the setting action |

<a name="Topic+createChild"></a>

### topic.createChild(_data, _nextSiblingTopic, _forbitNotify) ⇒ [<code>Topic</code>](#Topic)
Create a child topic in this topic.If the data contains the children, all the descendant topics will be created.

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: [<code>Topic</code>](#Topic) - The new topic  

| Param | Type | Description |
| --- | --- | --- |
| _data | <code>TopicData</code> | The data of the child topic |
| _nextSiblingTopic | [<code>Topic</code>](#Topic) | Optional. Indicate the new topic insert before which topic. The new topic will add at the end of the children topics if the argument is ignored. |
| _forbitNotify | <code>Boolean</code> | Set true to forbit emitting the notification event |

<a name="Topic+changeData"></a>

### topic.changeData(_key, _newVal, _forbitNotify) ⇒ [<code>Topic</code>](#Topic)
**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Summary**: Change the data of the topicIt's the best practice to change the data of the topic by this fucntion. Changing the data directly by the data member will not notify the changing singal to the watchers.  
**Returns**: [<code>Topic</code>](#Topic) - This instance  

| Param | Type | Description |
| --- | --- | --- |
| _key | <code>String</code> | The key of the member in the data |
| _newVal | <code>Any</code> | The new value of the member. If this argument is undefined, the member with the key will be deleted. |
| _forbitNotify | <code>Boolean</code> | Set true to forbit emitting the notification event |

<a name="Topic+moveTo"></a>

### topic.moveTo(_parentTopic, _nextSiblingTopic, _forbitNotify) ⇒ [<code>Topic</code>](#Topic)
Move the topic to an other position

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: [<code>Topic</code>](#Topic) - This instance  

| Param | Type | Description |
| --- | --- | --- |
| _parentTopic | [<code>Topic</code>](#Topic) | The destination parent topic |
| _nextSiblingTopic | [<code>Topic</code>](#Topic) | Optional. The destination sibling topic. The topic will move to the end of the _parentTopic's children if this argument is ignored. |
| _forbitNotify | <code>Boolean</code> | Set true to forbit emitting the notification event |

<a name="Topic+drop"></a>

### topic.drop(_rootChecker, _forbitNotify)
Drop the topic

**Kind**: instance method of [<code>Topic</code>](#Topic)  

| Param | Type | Description |
| --- | --- | --- |
| _rootChecker | <code>function</code> | Optional. If you want to drop the root topic, you should pass a function impelement increasing action as this argument. |
| _forbitNotify | <code>Boolean</code> | Set true to forbit emitting the notification event |

<a name="Topic+getRect"></a>

### topic.getRect(_type) ⇒ <code>DOMRect</code>
Get the rect of the topic in the screen

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: <code>DOMRect</code> - The destination rect  

| Param | Type | Description |
| --- | --- | --- |
| _type | <code>String</code> | Optional. The selector to matche the content of the topic. The ".season-topic-box" will be taken as default. |

<a name="Topic+getBBox"></a>

### topic.getBBox(_type) ⇒ <code>SVGRect</code>
Get the box of the topic

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: <code>SVGRect</code> - The destination box  

| Param | Type | Description |
| --- | --- | --- |
| _type | <code>String</code> | Optional. The selector to matche the content of the topic. The ".season-topic-box" will be taken as default. |

<a name="Topic+getGraphicRect"></a>

### topic.getGraphicRect(_type) ⇒ <code>Object</code>
Get the rect of the topic in the svg image

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: <code>Object</code> - The destination rect  

| Param | Type | Description |
| --- | --- | --- |
| _type | <code>String</code> | Optional. The selector to matche the content of the topic. The ".season-topic-box" will be taken as default. |

<a name="Topic+getMatrix"></a>

### topic.getMatrix(_type) ⇒ <code>DOMMatrix</code>
Get the transform matrix of the topic

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: <code>DOMMatrix</code> - The destination matrix  

| Param | Type | Description |
| --- | --- | --- |
| _type | <code>String</code> | Optional. The selector to matche the content of the topic. The ".season-topic-box" will be taken as default. |

<a name="Topic+getRectInViewport"></a>

### topic.getRectInViewport(_type) ⇒ <code>Object</code>
Get the rect of the topic in the viewport

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: <code>Object</code> - The destination rect  

| Param | Type | Description |
| --- | --- | --- |
| _type | <code>String</code> | Optional. The selector to matche the content of the topic. The ".season-topic-box" will be taken as default. |

<a name="Topic+getGlobalRect"></a>

### topic.getGlobalRect() ⇒ <code>Object</code>
Get the box of the global stage of this topic

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: <code>Object</code> - The destination rect  
<a name="Topic+getExtensionInstance"></a>

### topic.getExtensionInstance(_extensionName) ⇒ <code>TopicExtension</code>
Get an instance of the special extension element in this topic

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: <code>TopicExtension</code> - The instance of the extension element  

| Param | Type | Description |
| --- | --- | --- |
| _extensionName | <code>String</code> | The name of the extension element. such as "task-marker", "priority", and so on. |

<a name="Topic+exportImage"></a>

### topic.exportImage(_opt) ⇒ <code>Promise.&lt;{width:Number, height:Number: data:Any}&gt;</code>
Export the image of this topic

**Kind**: instance method of [<code>Topic</code>](#Topic)  
**Returns**: <code>Promise.&lt;{width:Number, height:Number: data:Any}&gt;</code> - The result  

| Param | Type | Description |
| --- | --- | --- |
| _opt | <code>Object</code> | Optional. The options |
| _opt.fill | <code>String</code> | The color of the background |
| _opt.type | <code>String</code> | Optional. The type of the destination image. Such as png, jpeg, and so on |

<a name="Topic.enumerateReferenceResource"></a>

### Topic.enumerateReferenceResource(_env, _data)
Enumerate each resource referenced by the topic

**Kind**: static method of [<code>Topic</code>](#Topic)  

| Param | Type | Description |
| --- | --- | --- |
| _env | <code>MindmapEnvironment</code> | The enviroment of the mindmap |
| _data | <code>TopicData</code> | The data of the topic |

<a name="Topic.getFirstChildTopic"></a>

### Topic.getFirstChildTopic(_nodeOrTopic) ⇒ [<code>Topic</code>](#Topic)
Get the first child topic of the given topic

**Kind**: static method of [<code>Topic</code>](#Topic)  
**Returns**: [<code>Topic</code>](#Topic) - The target child  

| Param | Type | Description |
| --- | --- | --- |
| _nodeOrTopic | <code>Node</code> \| [<code>Topic</code>](#Topic) | The parent topic or a node contains the topic |

<a name="Topic.getMindRootNode"></a>

### Topic.getMindRootNode(_node) ⇒ <code>Node</code>
Get the root node of the stage of all the topics

**Kind**: static method of [<code>Topic</code>](#Topic)  
**Returns**: <code>Node</code> - The target node  

| Param | Type | Description |
| --- | --- | --- |
| _node | <code>Node</code> | The node contains the root |

<a name="Topic.getTopicByID"></a>

### Topic.getTopicByID(_node, _id) ⇒ [<code>Topic</code>](#Topic)
Find the special topic in the given node

**Kind**: static method of [<code>Topic</code>](#Topic)  
**Returns**: [<code>Topic</code>](#Topic) - The target topic  

| Param | Type | Description |
| --- | --- | --- |
| _node | <code>Node</code> | The given node that may contain the special topic |
| _id | <code>String</code> | The ID of the special topic |

<a name="Topic.getFocusTopic"></a>

### Topic.getFocusTopic(_node) ⇒ [<code>Topic</code>](#Topic)
Find the focus topic in the given node

**Kind**: static method of [<code>Topic</code>](#Topic)  
**Returns**: [<code>Topic</code>](#Topic) - The target topic  

| Param | Type | Description |
| --- | --- | --- |
| _node | <code>Node</code> | The given node that may contain the focus topic |

<a name="Topic.convertWindowPointToGraphic"></a>

### Topic.convertWindowPointToGraphic(_node, _x, _y) ⇒ <code>Object</code>
Convert the given coordinate value into the coordinate system of the special svg node

**Kind**: static method of [<code>Topic</code>](#Topic)  
**Returns**: <code>Object</code> - The destination coordinate value  

| Param | Type | Description |
| --- | --- | --- |
| _node | <code>SVGGraphicsElement</code> \| <code>SVGSVGElement</code> | The special svg node |
| _x | <code>Number</code> | the given coordinate value |
| _y | <code>Number</code> | the given coordinate value |

<a name="Topic.showNodeInSvgView"></a>

### Topic.showNodeInSvgView(_node, _svg)
Move the node into the viewport of the special SVG node

**Kind**: static method of [<code>Topic</code>](#Topic)  

| Param | Type | Description |
| --- | --- | --- |
| _node | <code>Node</code> | The node would be moved |
| _svg | <code>SVGGradientElement</code> \| <code>SVGSVGElement</code> | The special SVG node |