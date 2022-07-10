<a name="TopicExtension"></a>

## TopicExtension ⇐ <code>EBlock</code>
Class of the extension of the topic

**Kind**: global class  
**Extends**: <code>EBlock</code>  

* [TopicExtension](#TopicExtension) ⇐ <code>EBlock</code>
    * [.TopicExtension](#TopicExtension+TopicExtension)
        * [new exports.TopicExtension(_factorOrNode, _data, _topic)](#new_TopicExtension+TopicExtension_new)
    * [.name](#TopicExtension+name) : <code>String</code>
    * [.topic](#TopicExtension+topic) : <code>Topic</code>
    * [.callScript(_name, ..._args)](#TopicExtension+callScript) ⇒ <code>Any</code>
    * [.applyScript(_name, _args)](#TopicExtension+applyScript) ⇒ <code>Any</code>

<a name="TopicExtension+TopicExtension"></a>

### topicExtension.TopicExtension
**Kind**: instance class of [<code>TopicExtension</code>](#TopicExtension)  
**Summary**: Create the instance of the extensionYou should create the instance by TopicExtensionFactor.generate instead.  
<a name="new_TopicExtension+TopicExtension_new"></a>

#### new exports.TopicExtension(_factorOrNode, _data, _topic)

| Param | Type | Description |
| --- | --- | --- |
| _factorOrNode | [<code>TopicExtensionFactor</code>](#TopicExtensionFactor) \| <code>Node</code> | The factor or the node of the exist extension |
| _data | <code>Any</code> | The data binded to the extension |
| _topic | <code>Topic</code> | The topic the extension belong to |

<a name="TopicExtension+name"></a>

### topicExtension.name : <code>String</code>
The name of the extension

**Kind**: instance property of [<code>TopicExtension</code>](#TopicExtension)  
<a name="TopicExtension+topic"></a>

### topicExtension.topic : <code>Topic</code>
The topic this extension belong to

**Kind**: instance property of [<code>TopicExtension</code>](#TopicExtension)  
<a name="TopicExtension+callScript"></a>

### topicExtension.callScript(_name, ..._args) ⇒ <code>Any</code>
Call a script function of this extension

**Kind**: instance method of [<code>TopicExtension</code>](#TopicExtension)  
**Returns**: <code>Any</code> - The result return by the destination function  

| Param | Type | Description |
| --- | --- | --- |
| _name | <code>String</code> | The name of the function |
| ..._args | <code>any</code> | The arguments passed to the function |

<a name="TopicExtension+applyScript"></a>

### topicExtension.applyScript(_name, _args) ⇒ <code>Any</code>
Call a script function of this extension

**Kind**: instance method of [<code>TopicExtension</code>](#TopicExtension)  
**Returns**: <code>Any</code> - The result return by the destination function  

| Param | Type | Description |
| --- | --- | --- |
| _name | <code>String</code> | The name of the function |
| _args | <code>Array</code> | The arguments passed to the function |

<a name="TopicExtensionFactor"></a>

## TopicExtensionFactor ⇐ <code>EBlockFactor</code>
Class of the factor for extension of the topic

**Kind**: global class  
**Extends**: <code>EBlockFactor</code>  

* [TopicExtensionFactor](#TopicExtensionFactor) ⇐ <code>EBlockFactor</code>
    * [.TopicExtensionFactor](#TopicExtensionFactor+TopicExtensionFactor)
        * [new exports.TopicExtensionFactor(_node)](#new_TopicExtensionFactor+TopicExtensionFactor_new)

<a name="TopicExtensionFactor+TopicExtensionFactor"></a>

### topicExtensionFactor.TopicExtensionFactor
**Kind**: instance class of [<code>TopicExtensionFactor</code>](#TopicExtensionFactor)  
<a name="new_TopicExtensionFactor+TopicExtensionFactor_new"></a>

#### new exports.TopicExtensionFactor(_node)
Create an instance of the factor


| Param | Type | Description |
| --- | --- | --- |
| _node | <code>Node</code> | The node of the global template of the extension |