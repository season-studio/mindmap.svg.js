# mindmap.svg.js
[中文](./readme_cn.md) | **English**
   
  
## Summary
**mindmap.svg.js** is a javascript library for displaying and operating the mindmap in the webview. The key implementation is base on SVG.

The topic of the mindmap in **mindmap.svg.js** has build-in content and external content. The build-in content is implemented by the core of this library. The title and the image of the topic is the build-in content. And the title is the default element of content in the topic.

The other element of content neither title nor image is considered as the external content of the topic. Such as link, attachment, notes, label, priority, and so on. The behavior of the external content is implemented by the TopicExtension.

All the visualization effect are driven by the templates in the **mindmap.svg.js**. So the style of the displaying can be customized by extension as the same as the external content.

The parser of the mindmap file or any other action such as the history of the editing are not the task of this library. The application should implement the external task itself base on **mindmap.svg.js**.

## Usage
The key fucntions of **mindmap.svg.js** are implemented by four classes: MindmapEnvironment,MindmapDocument, MindmapViewer, Topic. The MindmapEnvironment provides basic running time environment for all the other functions of the  **mindmap.svg.js**. The MindmapDocument is used to store the global data of the mindmap. The MindmapViewer is the endpoint class for displaying and operating the mindmap in visualization mode. The Topic is the core class for operating each topic in the mindmap. The instance of topic is genenrated by MindmapViewer in runtime.

The following sample shows how to use this library.
``` javascript
// Create the enviroment
var env = new MindmapView.MindmapEnvironment();
// Create the document
var doc = new MindmapView.MindmapDocument(env);
// Create the viewer
var view = new MindmapView.MindmapViewer(doc, document.getElementById("view"));
// Register the default extensions into the environment and the viewer
env.extensionFactors.push(...MindmapView.DefaultTopicExtensions);
env.extensionFactors.forEach((item) => {
    item.register(view);
});
// Add some data into the document. The format of the data is SheetData and TopicData
doc.newDocument(() => {
    $doc.addSheet({
        title: "Test",
        topic: {
            title: "Main Topic for Test"
        }
    }).addSheet({
        title: "Test2",
        topic: {
            title: "Hello",
            children: [{
                title: "World"
            }]
        }
    });
});

// Listen the event to provide the default actions
env.addEventListener("topic-event-edit", MindmapView.MindmapViewer.dispatchTopicEventAction.bind(MindmapView.DefaultTopicEventActions));
env.addEventListener("topic-event-trigger", MindmapView.MindmapViewer.dispatchTopicEventAction.bind(MindmapView.DefaultTopicEventActions));
```
**Note:** The data in the instance of Topic isn't keeping the same as the data in the document automatically. You should call the synchronizeWithView and saveDocument in the instance of MindmapDocument to let the viewer submit the data to the document.

## Extend
You can customize the style of the displaying and add new external content of the topic in **mindmap.svg.js**.
#### Customizing the style of the dislaying
You can change the value of the <code>MindmapEnvironment.config</code> or define a new CSS snippet to customize the style of the displaying. See the [MindmapEnvironment.DefaultConfig in API Document](./doc/mindmapEnv.md#MindmapEnvironment+DefaultConfig) for more information about <code>MindmapEnvironment.config</code>.
The predefined selectors of CSS in **mindmap.svg.js** are shown below:
``` css
/* The selector for global stye of the topic */
[season-topic-global] { }

/* The selector for the content zone of the topic */
[season-topic-content-group] { }

/* The selector for the topic in level "n". "n" is a integer number base on 0. */
[d-topic-level="n"] { }

/* The CSS class of the backgroud box of the topic */
.season-topic-box { }

/* The CSS class of the title of the topic */
.season-topic-title { }

/* The CSS class of the connection line of the topic */
.season-topic-connect-line { }

/* The CSS class of the image of the topic */
.season-topic-image { }

/* The selector for query the focus topic */
[season-topic-focus] { }

/* The CSS class of the container of the draging topic */
.season-topic-drag-group { }

/* The CSS class of the element masking the draging topic */
.season-topic-drag-mask { }

/* The CSS class of the connection line for the draging topic */
.season-topic-drag-line { }
```
You can define the custom style macthed by the selector. The code of the custom CSS can be contained in an instance of TopicExtensionFactor or written in a style element of the HTML document directly.

#### Define new external content of the topic
A new external content of the topic should define the visualization effect and the editing behavior.
A new instance of TopicExtensionFactor should be created and registered into the MindmapEnvironment and MindmapViewer for defining the visualization effect of the external content. The behavior of the TopicExtensionFactor is base on the template passed as the arguments to the constructor of the TopicExtensionFactor. The template is a snippet of SVG code. The following code shows the basic format of the template:
``` xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <style eblock-predefined="">
        <!-- The custom CSS. This element should have an attribute named "eblock-predefined". This element can be ignore if there is no custom CSS. -->
    </style>
    <defs eblock-predefined="">
        <!-- Element for define same predefined SVG element. This element should have an attribute named "eblock-predefined". This element can be ignore if there is no predefined element. -->
    </defs>
    <script eblock-script="">
        <!-- The node for the script of the extension. This is the necessarily node in the template. This node should have an attribute named "eblock-script".  -->
        <!-- The following comment describe the basic script of the extension -->
        <![CDATA[
            // "declarer.xxx" means exporting a member of the script, such as function, data, and so on.

            // "declarer.getExtensionInfo" is the necessarily exposed fucntion in an extension. 
            // This function should return an object as result. 
            // The result object should contain a member named "name" to describe the unique name of the extension. 
            declarer.getExtensionInfo = function () {
                return {
                    name: "href"
                };
            }

            // declarer.onRendering is the function invoked when the extension is rendering. The 1st argument is the data of the topic. The 2nd argument is the instance of the topic this extension belong to.
            declarer.onRendering = function (_data, _, _topic) {

            }
        }
    ]]>
    </script>
    <g eblock-template="" season-topic-content-type="href" ebevent-rendering="onRendering">
        <!-- The static template of the extension. This is the necessarily node in the template. This node should have an attribute named "eblock-template" -->
        <!-- The attribute named "season-topic-content-type" means the type of the content. This value will be set as the parameter of the editing event. -->
        <!-- The value of the attribute named "ebevent-rendering" indicates which exposed function will be invoked when the extension is rendering. -->
    </g>
</svg>
```
See [Default Topic Extensions](./src/defaultTopicExtensions/) for the example of the template.

The extension should listen the event "topic-event-trigger" and "topic-event-edit" in MindmapEnvironment for providing the editing action. See [Default Topic Actions](./src/defaultExportActions/) for the example of the implementation of the actions. See [API Document](./doc/api.md) for more information of the event.

## Release Notes

### 1.0.7
- Change getContrlMapKey for logging space key as "Space" and filter the single meta keys

### 1.0.6
- Let the title of the topic can be break into multi-line
- Add the "topic-rendering-extend" event into the environment to perform the extending rendering function
- Remove the parameter named "suitableLineWidth", add parameter named "maxTopicLineWidth"

### 1.0.4
- Fix the bug that user can not select text in editor box by mouse.
- Fix the incorrect tip when some exception raised in keydown event.
- Change the default margin value of the topics.
- Change the storage of the customer configuration's logger.
- Add the backgound color into the configuration of the environment.

### 1.0.2
- Enable customize the shape of the topic box
- Enhance compatibility in Safari

### 1.0.0

- Initial release of mindmap.svg.js

## API Reference
See [API Document](./doc/api.md) for more information.

----------
Copyright ©2022 [Season Studio](mailto:season-studio@outlook.com)
