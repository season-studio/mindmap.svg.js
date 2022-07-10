<a name="MindmapAddinPanel"></a>

## MindmapAddinPanel
Class of the addin panel in the mindmap container.The panel is implemented by SVG

**Kind**: global class  
<a name="new_MindmapAddinPanel_new"></a>

### new exports.MindmapAddinPanel(_parentNode, _content, _opt)
**Returns**: an instance of MindmapAddinPanel  

| Param | Type | Description |
| --- | --- | --- |
| _parentNode | <code>SVGGraphicsElement</code> | the parent node for containing the panel |
| _content | <code>Node</code> \| <code>String</code> | the content of the panel, it can be an instance of Node or a string of SVG |
| _opt | <code>Object</code> | the options |
| _opt.singletonStamp | <code>\*</code> | Optional. The stamp if the panel should be singleton. |
| _opt.singletonMutex | <code>\*</code> | Optional. The mutex symbol for the singleton panel. The acquiring will close the existed panel with the same singletonStamp but with the different mutex symbol. |
| _opt.rootAttrs | <code>\*</code> | Optional. The set of key-value pair which will be set as the attributes of the root node of the panel. |
| _opt.env | <code>MindmapEnvironment</code> | Optional. The enviroment of the mindmap viewer. This value must be set if the panel should be bind with the topic event. Such as the "mmap-bind-cancel-edit" or "mmap-bind-hide-in-render" is set as the attribute of the root node. |
| _opt.onInitialize | <code>function</code> | Optional. The fucntion will be call when initializing the panel. This function will be called with the _opt as the argument. |
| _opt.onBeforeLayout | <code>function</code> | Optional. The fucntion will be call before setting the layout of the panel. This function will be called with the _opt as the argument. |
| _opt.onAfterLayout | <code>function</code> | Optional. The fucntion will be call after setting the layout of the panel. This function will be called with the _opt as the argument. |
| _opt.onClose | <code>function</code> | Optional. The fucntion will be call when closing the panel. This function will be called with the _opt as the argument. |