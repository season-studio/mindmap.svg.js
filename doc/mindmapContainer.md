<a name="MindmapContainer"></a>

## MindmapContainer ⇐ <code>EBlockContainer</code>
Class of the container for displaying the mindmap

**Kind**: global class  
**Extends**: <code>EBlockContainer</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| env | <code>MindmapEnvironment</code> | The enviroment of the mindmap |


* [MindmapContainer](#MindmapContainer) ⇐ <code>EBlockContainer</code>
    * [.MindmapContainer](#MindmapContainer+MindmapContainer)
        * [new exports.MindmapContainer(_parentNode, _env)](#new_MindmapContainer+MindmapContainer_new)
    * [.scale](#MindmapContainer+scale) : <code>Number</code>
    * [.define(_node)](#MindmapContainer+define)
    * [.undefine(_selector)](#MindmapContainer+undefine)
    * [.move(_deltaX, _deltaY)](#MindmapContainer+move)
    * [.createDomEvent(_eventName, _detail)](#MindmapContainer+createDomEvent) ⇒ <code>Event</code>
    * [.addEventListener(..._args)](#MindmapContainer+addEventListener) ⇒ [<code>MindmapContainer</code>](#MindmapContainer)
    * [.removeEventListener(..._args)](#MindmapContainer+removeEventListener) ⇒ [<code>MindmapContainer</code>](#MindmapContainer)
    * [.dispose()](#MindmapContainer+dispose)

<a name="MindmapContainer+MindmapContainer"></a>

### mindmapContainer.MindmapContainer
**Kind**: instance class of [<code>MindmapContainer</code>](#MindmapContainer)  
<a name="new_MindmapContainer+MindmapContainer_new"></a>

#### new exports.MindmapContainer(_parentNode, _env)
Create the container


| Param | Type | Description |
| --- | --- | --- |
| _parentNode | <code>Node</code> | The node as the parent of the container |
| _env | <code>MindmapEnvironment</code> | The enviroment of the mindmap |

<a name="MindmapContainer+scale"></a>

### mindmapContainer.scale : <code>Number</code>
The scale of the viewer

**Kind**: instance property of [<code>MindmapContainer</code>](#MindmapContainer)  
<a name="MindmapContainer+define"></a>

### mindmapContainer.define(_node)
Insert a node as the predefined data of the mindmap

**Kind**: instance method of [<code>MindmapContainer</code>](#MindmapContainer)  

| Param | Type | Description |
| --- | --- | --- |
| _node | <code>Node</code> | the predefined node |

<a name="MindmapContainer+undefine"></a>

### mindmapContainer.undefine(_selector)
Remove nodes matched the selector

**Kind**: instance method of [<code>MindmapContainer</code>](#MindmapContainer)  

| Param | Type | Description |
| --- | --- | --- |
| _selector | <code>String</code> | the selector for searching the node which should be removed |

<a name="MindmapContainer+move"></a>

### mindmapContainer.move(_deltaX, _deltaY)
Move the view of the mindmap

**Kind**: instance method of [<code>MindmapContainer</code>](#MindmapContainer)  

| Param | Type | Description |
| --- | --- | --- |
| _deltaX | <code>Number</code> | the offset in the x-coordinate |
| _deltaY | <code>Number</code> | the offset in the y-coordinate |

<a name="MindmapContainer+createDomEvent"></a>

### mindmapContainer.createDomEvent(_eventName, _detail) ⇒ <code>Event</code>
Create an event as the event triggered by the DOM

**Kind**: instance method of [<code>MindmapContainer</code>](#MindmapContainer)  
**Returns**: <code>Event</code> - An instance of Event  

| Param | Type | Description |
| --- | --- | --- |
| _eventName | <code>String</code> | the name of the event |
| _detail | <code>\*</code> | the detail of the event |

<a name="MindmapContainer+addEventListener"></a>

### mindmapContainer.addEventListener(..._args) ⇒ [<code>MindmapContainer</code>](#MindmapContainer)
Add the listener of an event

**Kind**: instance method of [<code>MindmapContainer</code>](#MindmapContainer)  
**Returns**: [<code>MindmapContainer</code>](#MindmapContainer) - this object  

| Param | Type | Description |
| --- | --- | --- |
| ..._args | <code>any</code> | the arguments as the same as passed to the EventTarget.addEventListener |

<a name="MindmapContainer+removeEventListener"></a>

### mindmapContainer.removeEventListener(..._args) ⇒ [<code>MindmapContainer</code>](#MindmapContainer)
remove the listener of an event

**Kind**: instance method of [<code>MindmapContainer</code>](#MindmapContainer)  
**Returns**: [<code>MindmapContainer</code>](#MindmapContainer) - this object  

| Param | Type | Description |
| --- | --- | --- |
| ..._args | <code>any</code> | the arguments as the same as passed to the EventTarget.removeEventListener |

<a name="MindmapContainer+dispose"></a>

### mindmapContainer.dispose()
Dispose the resource of the container. This method should be called when you don't need the container any more.

**Kind**: instance method of [<code>MindmapContainer</code>](#MindmapContainer)