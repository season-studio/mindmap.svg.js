<a name="MindmapDocument"></a>

## MindmapDocument
Class of document model describing the mindmap

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| env | <code>MindmapEnvironment</code> | The environment of the mindmap |


* [MindmapDocument](#MindmapDocument)
    * [.MindmapDocument](#MindmapDocument+MindmapDocument)
        * [new exports.MindmapDocument(_env)](#new_MindmapDocument+MindmapDocument_new)
    * [.DefaultSheetTemplate](#MindmapDocument+DefaultSheetTemplate)
    * [.DefaultTopicTemplate](#MindmapDocument+DefaultTopicTemplate)
    * [.sheetCount](#MindmapDocument+sheetCount) : <code>Number</code>
    * [.firstSheet](#MindmapDocument+firstSheet) : [<code>SheetData</code>](#SheetData)
    * [.dirty](#MindmapDocument+dirty)
    * [.getSheetByID(_id)](#MindmapDocument+getSheetByID) ⇒ [<code>SheetData</code>](#SheetData)
    * [.switchToSheet(_id, _syncCurrentView)](#MindmapDocument+switchToSheet) ⇒ [<code>MindmapDocument</code>](#MindmapDocument)
    * [.enumerateSheet()](#MindmapDocument+enumerateSheet)
    * [.removeSheet(_id, _syncCurrentView)](#MindmapDocument+removeSheet) ⇒ [<code>SheetData</code>](#SheetData)
    * [.addSheet(_newSheet, _index)](#MindmapDocument+addSheet) ⇒ [<code>MindmapDocument</code>](#MindmapDocument)
    * [.synchronizeSheetWithView()](#MindmapDocument+synchronizeSheetWithView) ⇒ [<code>MindmapDocument</code>](#MindmapDocument)
    * [.enumerateAttachment()](#MindmapDocument+enumerateAttachment)
    * [.removeAttachment(_name)](#MindmapDocument+removeAttachment) ⇒ [<code>MindmapDocument</code>](#MindmapDocument)
    * [.getAttachment(_name)](#MindmapDocument+getAttachment) ⇒ <code>Any</code>
    * [.setAttachment(_name, _data)](#MindmapDocument+setAttachment) ⇒ [<code>MindmapDocument</code>](#MindmapDocument)
    * [.clearAttachment()](#MindmapDocument+clearAttachment) ⇒ [<code>MindmapDocument</code>](#MindmapDocument)
    * [.hasAttachment(_name)](#MindmapDocument+hasAttachment) ⇒ <code>Boolean</code>
    * [.collectAttachments()](#MindmapDocument+collectAttachments)
    * [.newDocument(_fn, ..._args)](#MindmapDocument+newDocument) ⇒ [<code>Promise.&lt;MindmapDocument&gt;</code>](#MindmapDocument)
    * [.saveDocument(_fn, _keepWorkState)](#MindmapDocument+saveDocument) ⇒ <code>Any</code>
    * [.getThumbImage(_toBlob, _keepWorkState)](#MindmapDocument+getThumbImage) ⇒ <code>Promise.&lt;(String\|Blob)&gt;</code>
    * [.dispose()](#MindmapDocument+dispose)
    * [.clearDirtyFlag(_fn)](#MindmapDocument+clearDirtyFlag)

<a name="MindmapDocument+MindmapDocument"></a>

### mindmapDocument.MindmapDocument
**Kind**: instance class of [<code>MindmapDocument</code>](#MindmapDocument)  
<a name="new_MindmapDocument+MindmapDocument_new"></a>

#### new exports.MindmapDocument(_env)
Create the instance of the MindmapDocument


| Param | Type | Description |
| --- | --- | --- |
| _env | <code>MindmapEnvironment</code> | The environment of the mindmap |

<a name="MindmapDocument+DefaultSheetTemplate"></a>

### mindmapDocument.DefaultSheetTemplate
The template of the default sheet

**Kind**: instance property of [<code>MindmapDocument</code>](#MindmapDocument)  
<a name="MindmapDocument+DefaultTopicTemplate"></a>

### mindmapDocument.DefaultTopicTemplate
The template of the default topic

**Kind**: instance property of [<code>MindmapDocument</code>](#MindmapDocument)  
<a name="MindmapDocument+sheetCount"></a>

### mindmapDocument.sheetCount : <code>Number</code>
The count of the sheets in the mindmap document

**Kind**: instance property of [<code>MindmapDocument</code>](#MindmapDocument)  
<a name="MindmapDocument+firstSheet"></a>

### mindmapDocument.firstSheet : [<code>SheetData</code>](#SheetData)
The first sheet of the mindmap document

**Kind**: instance property of [<code>MindmapDocument</code>](#MindmapDocument)  
<a name="MindmapDocument+dirty"></a>

### mindmapDocument.dirty
Check if the document has been changed

**Kind**: instance property of [<code>MindmapDocument</code>](#MindmapDocument)  
<a name="MindmapDocument+getSheetByID"></a>

### mindmapDocument.getSheetByID(_id) ⇒ [<code>SheetData</code>](#SheetData)
Get a sheet matched the special ID

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
**Returns**: [<code>SheetData</code>](#SheetData) - The data of the sheet  

| Param | Type | Description |
| --- | --- | --- |
| _id | <code>String</code> | The id of the target sheet |

<a name="MindmapDocument+switchToSheet"></a>

### mindmapDocument.switchToSheet(_id, _syncCurrentView) ⇒ [<code>MindmapDocument</code>](#MindmapDocument)
Switch the sheet into the view assigned to this document

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
**Returns**: [<code>MindmapDocument</code>](#MindmapDocument) - This object  

| Param | Type | Description |
| --- | --- | --- |
| _id | <code>String</code> | The id of the target sheet |
| _syncCurrentView | <code>Boolean</code> | Optional. Pass true if you want to save the change in the view first |

<a name="MindmapDocument+enumerateSheet"></a>

### mindmapDocument.enumerateSheet()
Enumerate each sheet in the mindmap document

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
<a name="MindmapDocument+removeSheet"></a>

### mindmapDocument.removeSheet(_id, _syncCurrentView) ⇒ [<code>SheetData</code>](#SheetData)
Remove a special sheet.This function will switch the view to the sheet before the sheet removed.A new sheet will be inserted automatically if there is no sheet in the document after remove the special sheet.

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
**Returns**: [<code>SheetData</code>](#SheetData) - The data of the sheet which is removed  

| Param | Type | Description |
| --- | --- | --- |
| _id | <code>String</code> | The id of the sheet which will be removed |
| _syncCurrentView | <code>Boolean</code> | Optional. Pass true if you want to save the change in the view first |

<a name="MindmapDocument+addSheet"></a>

### mindmapDocument.addSheet(_newSheet, _index) ⇒ [<code>MindmapDocument</code>](#MindmapDocument)
Insert a new sheet into the document.If the id of the sheet had been contained in the document, this function will be failed.

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
**Returns**: [<code>MindmapDocument</code>](#MindmapDocument) - This object  

| Param | Type | Description |
| --- | --- | --- |
| _newSheet | [<code>SheetData</code>](#SheetData) | The data of the sheet inserted. A new id will be created if there is no special one in the data. |
| _index | <code>Number</code> | Optional. The position of the sheet will be insert to. If the argument is ignored, the sheet will be insert to the end of the document. |

<a name="MindmapDocument+synchronizeSheetWithView"></a>

### mindmapDocument.synchronizeSheetWithView() ⇒ [<code>MindmapDocument</code>](#MindmapDocument)
Save the change of the view into the document

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
**Returns**: [<code>MindmapDocument</code>](#MindmapDocument) - This object  
<a name="MindmapDocument+enumerateAttachment"></a>

### mindmapDocument.enumerateAttachment()
Enumerate the attachments in the document

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
<a name="MindmapDocument+removeAttachment"></a>

### mindmapDocument.removeAttachment(_name) ⇒ [<code>MindmapDocument</code>](#MindmapDocument)
Remove a special attachment

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
**Returns**: [<code>MindmapDocument</code>](#MindmapDocument) - This object  

| Param | Type | Description |
| --- | --- | --- |
| _name | <code>String</code> | The name of the attachment will be removed |

<a name="MindmapDocument+getAttachment"></a>

### mindmapDocument.getAttachment(_name) ⇒ <code>Any</code>
Get a special attachment

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
**Returns**: <code>Any</code> - The data of the attachment  

| Param | Type | Description |
| --- | --- | --- |
| _name | <code>String</code> | The name of the attchment |

<a name="MindmapDocument+setAttachment"></a>

### mindmapDocument.setAttachment(_name, _data) ⇒ [<code>MindmapDocument</code>](#MindmapDocument)
Set an attachment.If the name of the attachment had been contained in the document, the data of the attachment will be changed to the new one.

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
**Returns**: [<code>MindmapDocument</code>](#MindmapDocument) - This object  

| Param | Type | Description |
| --- | --- | --- |
| _name | <code>String</code> | The name of the attachment |
| _data | <code>Any</code> | The data of the attachment |

<a name="MindmapDocument+clearAttachment"></a>

### mindmapDocument.clearAttachment() ⇒ [<code>MindmapDocument</code>](#MindmapDocument)
Remove all of the attachment in the document

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
**Returns**: [<code>MindmapDocument</code>](#MindmapDocument) - This object  
<a name="MindmapDocument+hasAttachment"></a>

### mindmapDocument.hasAttachment(_name) ⇒ <code>Boolean</code>
Check if the an attachment specialed by the name is contained in the document

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
**Returns**: <code>Boolean</code> - true means the attachment is contained in the document  

| Param | Type | Description |
| --- | --- | --- |
| _name | <code>String</code> | The name of the attachment |

<a name="MindmapDocument+collectAttachments"></a>

### mindmapDocument.collectAttachments()
Collect and remove the unused attachments in this document

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
<a name="MindmapDocument+newDocument"></a>

### mindmapDocument.newDocument(_fn, ..._args) ⇒ [<code>Promise.&lt;MindmapDocument&gt;</code>](#MindmapDocument)
Reset the document as a new one.An template sheet will be inserted if the content is empty after calling the callback fucntion.The view assigned to the document will switch to the first sheet automatically after this function.

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
**Returns**: [<code>Promise.&lt;MindmapDocument&gt;</code>](#MindmapDocument) - This object  

| Param | Type | Description |
| --- | --- | --- |
| _fn | <code>function</code> | The callback function for preparing the content of the document |
| ..._args | <code>any</code> | The arguments passed to the callback function |

<a name="MindmapDocument+saveDocument"></a>

### mindmapDocument.saveDocument(_fn, _keepWorkState) ⇒ <code>Any</code>
Save the document.Almost as the same as the synchronizeSheetWithView.

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
**Returns**: <code>Any</code> - The result returned by the callback function  

| Param | Type | Description |
| --- | --- | --- |
| _fn | <code>function</code> | Optional. The callback function for saving the document |
| _keepWorkState | <code>Boolean</code> | Optional. If this argument is set to true, the working element such as editbox will keep in alive during saving |

<a name="MindmapDocument+getThumbImage"></a>

### mindmapDocument.getThumbImage(_toBlob, _keepWorkState) ⇒ <code>Promise.&lt;(String\|Blob)&gt;</code>
Generate the thumb image of the current view of the document

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
**Returns**: <code>Promise.&lt;(String\|Blob)&gt;</code> - A promise that will resolve with the thumb image.  

| Param | Type | Description |
| --- | --- | --- |
| _toBlob | <code>Boolean</code> | Optional. Set true if the thumb image is strored as a blob |
| _keepWorkState | <code>Boolean</code> | Optional. If this argument is set to true, the working element such as editbox will keep in alive during gettig the thumb |

<a name="MindmapDocument+dispose"></a>

### mindmapDocument.dispose()
Dispose the resource if you do need this document any more.

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  
<a name="MindmapDocument+clearDirtyFlag"></a>

### mindmapDocument.clearDirtyFlag(_fn)
Clear the dirty flag of the document

**Kind**: instance method of [<code>MindmapDocument</code>](#MindmapDocument)  

| Param | Type | Description |
| --- | --- | --- |
| _fn | <code>function</code> | A checker function impelement increasing action. |

<a name="TopicImageData"></a>

## .TopicImageData : <code>Object</code>
The data model of the topic's image

**Kind**: static typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| href | <code>String</code> | The href of the image |
| width | <code>Number</code> | The width when the image is displaying |
| height | <code>Number</code> | The height when the image is displaying |

<a name="TopicData"></a>

## .TopicData : <code>Object</code>
The data model of the topicThe following properties are defined by default. Any other property can be defined by custom.

**Kind**: static typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The id of the topic |
| title | <code>String</code> | The title of the topic |
| image | [<code>TopicImageData</code>](#TopicImageData) | Optional. The image of the topic |
| children | [<code>Array.&lt;TopicData&gt;</code>](#TopicData) | Optional. The list of the children topic of the topic |

<a name="SheetData"></a>

## .SheetData : <code>Object</code>
The data model of the sheet

**Kind**: static typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The id of the sheet |
| title | <code>String</code> | The title of the sheet |
| topic | [<code>TopicData</code>](#TopicData) | The root topic of the sheet |