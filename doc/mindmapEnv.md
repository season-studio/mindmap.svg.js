<a name="MindmapEnvironment"></a>

## MindmapEnvironment
The environment of the mindmap

**Kind**: global class  

* [MindmapEnvironment](#MindmapEnvironment)
    * [.MindmapEnvironment](#MindmapEnvironment+MindmapEnvironment)
        * [new exports.MindmapEnvironment()](#new_MindmapEnvironment+MindmapEnvironment_new)
    * [.DefaultConfig](#MindmapEnvironment+DefaultConfig)
    * [.config](#MindmapEnvironment+config)
    * [.extensionFactors](#MindmapEnvironment+extensionFactors) : <code>TopicExtensionFactor</code>
    * [.randomID](#MindmapEnvironment+randomID)
    * [.dragable](#MindmapEnvironment+dragable) : <code>Boolean</code>
    * [.editable](#MindmapEnvironment+editable) : <code>Boolean</code>
    * [.dragContext](#MindmapEnvironment+dragContext)
    * [.syncConfig()](#MindmapEnvironment+syncConfig)
    * [.fireEvent(_type, _param)](#MindmapEnvironment+fireEvent)
    * [.translateHRefToURL(_href)](#MindmapEnvironment+translateHRefToURL) ⇒ <code>String</code>
    * [.getHRefType(_href)](#MindmapEnvironment+getHRefType) ⇒ <code>String</code>
    * [.getImageDataFromElement(_element, _opt)](#MindmapEnvironment+getImageDataFromElement) ⇒ <code>Object</code>
    * [.getImageData(_url, _opt)](#MindmapEnvironment+getImageData) ⇒ <code>Promise.&lt;{width: Number, height: Number, data: Any}&gt;</code>
    * [.warn(..._args)](#MindmapEnvironment+warn)
    * [.activeLink(_url)](#MindmapEnvironment+activeLink)

<a name="MindmapEnvironment+MindmapEnvironment"></a>

### mindmapEnvironment.MindmapEnvironment
**Kind**: instance class of [<code>MindmapEnvironment</code>](#MindmapEnvironment)  
<a name="new_MindmapEnvironment+MindmapEnvironment_new"></a>

#### new exports.MindmapEnvironment()
Create an instance of the enviroment

<a name="MindmapEnvironment+DefaultConfig"></a>

### mindmapEnvironment.DefaultConfig
The default configuration of the mindmap

**Kind**: instance property of [<code>MindmapEnvironment</code>](#MindmapEnvironment)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| padding | <code>Number</code> | The padding of the topic |
| secondaryPadding | <code>Number</code> | The padding of the extensions in the topic |
| levelMargin | <code>Number</code> | The margin between the first kind topic and it's children |
| secondaryLevelMargin | <code>Number</code> | The margin between the secondary kind topic and it's children |
| siblingMargin | <code>Number</code> | The margin during the children of the first kind topic |
| secondarySiblingMargin | <code>Number</code> | The margin during the children of the secondary kind topic |
| secondaryTopicLevel | <code>Number</code> | The level to distinguish the secondary kind topic from the first kind topic |
| maxTopicLineWidth | <code>Number</code> | The max width of the topic line |
| directionPriority | <code>String</code> | Special the primary side to layout the children of the first topic. The avaliable value is "left" or "right" |
| dragStartFocusFilterTimer | <code>Number</code> | The time to wake up the drag-drop action after mousedown in the focus topic |
| dragStartNoFocusFilterTimer | <code>Number</code> | The time to wake up the drag-drop action after mousedown in the nofocus topic |
| resourceScheme | <code>String</code> | The scheme of the resource |
| defaultResourceAttachmentPrefix | <code>String</code> | The default prefix of the name of the attachment |
| placeholderImageId | <code>String</code> | The id of the predefined symbol as the placeholder of the image |

<a name="MindmapEnvironment+config"></a>

### mindmapEnvironment.config
The working configuration of the mindmap

**Kind**: instance property of [<code>MindmapEnvironment</code>](#MindmapEnvironment)  
**See**: [DefaultConfig](#module_MindmapView.MindmapEnvironment+DefaultConfig) for more information  
<a name="MindmapEnvironment+extensionFactors"></a>

### mindmapEnvironment.extensionFactors : <code>TopicExtensionFactor</code>
The list of the extensions' factor registered in the enviroment

**Kind**: instance property of [<code>MindmapEnvironment</code>](#MindmapEnvironment)  
<a name="MindmapEnvironment+randomID"></a>

### mindmapEnvironment.randomID
generation a random ID

**Kind**: instance property of [<code>MindmapEnvironment</code>](#MindmapEnvironment)  
<a name="MindmapEnvironment+dragable"></a>

### mindmapEnvironment.dragable : <code>Boolean</code>
Indicate if the topic is dragable.This option is invalid if the editable is set to false

**Kind**: instance property of [<code>MindmapEnvironment</code>](#MindmapEnvironment)  
<a name="MindmapEnvironment+editable"></a>

### mindmapEnvironment.editable : <code>Boolean</code>
Indicate if the mindmap is editable.

**Kind**: instance property of [<code>MindmapEnvironment</code>](#MindmapEnvironment)  
<a name="MindmapEnvironment+dragContext"></a>

### mindmapEnvironment.dragContext
The context for drag-drop action.This data is used by the drag-drop action processor. Don't use it without the processor.The subclass of MindmapEnvironment should keep this member writable.

**Kind**: instance property of [<code>MindmapEnvironment</code>](#MindmapEnvironment)  
<a name="MindmapEnvironment+syncConfig"></a>

### mindmapEnvironment.syncConfig()
Synchronize the configuration in the enviromentUse this method to let the components in the enviroment report their configurations, and then the configurations will be set as the global parameters.

**Kind**: instance method of [<code>MindmapEnvironment</code>](#MindmapEnvironment)  
<a name="MindmapEnvironment+fireEvent"></a>

### mindmapEnvironment.fireEvent(_type, _param)
Fire an event in the environment

**Kind**: instance method of [<code>MindmapEnvironment</code>](#MindmapEnvironment)  

| Param | Type | Description |
| --- | --- | --- |
| _type | <code>String</code> | The name of the event |
| _param | <code>Any</code> | The detail of the event |

<a name="MindmapEnvironment+translateHRefToURL"></a>

### mindmapEnvironment.translateHRefToURL(_href) ⇒ <code>String</code>
Translate a href to an URL

**Kind**: instance method of [<code>MindmapEnvironment</code>](#MindmapEnvironment)  
**Returns**: <code>String</code> - The destination URL  

| Param | Type | Description |
| --- | --- | --- |
| _href | <code>String</code> | The href need to be translating |

<a name="MindmapEnvironment+getHRefType"></a>

### mindmapEnvironment.getHRefType(_href) ⇒ <code>String</code>
get the type of the resource assigned with the href

**Kind**: instance method of [<code>MindmapEnvironment</code>](#MindmapEnvironment)  
**Returns**: <code>String</code> - The type of the resource, such as "link", "resource", or so on.  

| Param | Type | Description |
| --- | --- | --- |
| _href | <code>String</code> | The href |

<a name="MindmapEnvironment+getImageDataFromElement"></a>

### mindmapEnvironment.getImageDataFromElement(_element, _opt) ⇒ <code>Object</code>
Render a element as an image

**Kind**: instance method of [<code>MindmapEnvironment</code>](#MindmapEnvironment)  
**Returns**: <code>Object</code> - The data of the image  

| Param | Type | Description |
| --- | --- | --- |
| _element | <code>HTMLElement</code> | The element which will be rendered |
| _opt | <code>Object</code> | The option |
| _opt.width | <code>Number</code> | Optional. The width of the image |
| _opt.height | <code>Number</code> | Optional. The height of the image |
| _opt.offsetX | <code>Number</code> | Optional. The left offset when rendering the image |
| _opt.offsetY | <code>Number</code> | Optional. The top offset when rendering the image |
| _opt.type | <code>String</code> | Optional. The type of the image, such as "png", "jpeg", etc. The default type is "png". |
| _opt.fill | <code>String</code> | Optional. The color of the background. The default is rgba(255,255,255,0). |

<a name="MindmapEnvironment+getImageData"></a>

### mindmapEnvironment.getImageData(_url, _opt) ⇒ <code>Promise.&lt;{width: Number, height: Number, data: Any}&gt;</code>
Render a resource specialed by the URL as an image

**Kind**: instance method of [<code>MindmapEnvironment</code>](#MindmapEnvironment)  
**Returns**: <code>Promise.&lt;{width: Number, height: Number, data: Any}&gt;</code> - The promise resolved with the data of the image  

| Param | Type | Description |
| --- | --- | --- |
| _url | <code>String</code> | The URL |
| _opt | <code>Object</code> | The option |
| _opt.width | <code>Number</code> | Optional. The width of the image |
| _opt.height | <code>Number</code> | Optional. The height of the image |
| _opt.offsetX | <code>Number</code> | Optional. The left offset when rendering the image |
| _opt.offsetY | <code>Number</code> | Optional. The top offset when rendering the image |
| _opt.type | <code>String</code> | Optional. The type of the image, such as "png", "jpeg", etc. The default type is "png". |
| _opt.fill | <code>String</code> | Optional. The color of the background. The default is rgba(255,255,255,0). |
| _opt.crossOrigin | <code>String</code> | Optional. The cross-origin setting when loading the resource. |

<a name="MindmapEnvironment+warn"></a>

### mindmapEnvironment.warn(..._args)
Output the warning information

**Kind**: instance method of [<code>MindmapEnvironment</code>](#MindmapEnvironment)  

| Param | Type | Description |
| --- | --- | --- |
| ..._args | <code>any</code> | The warning information |

<a name="MindmapEnvironment+activeLink"></a>

### mindmapEnvironment.activeLink(_url)
active a link

**Kind**: instance method of [<code>MindmapEnvironment</code>](#MindmapEnvironment)  

| Param | Type | Description |
| --- | --- | --- |
| _url | <code>String</code> | The URL of the link |