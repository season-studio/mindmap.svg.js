# mindmap.svg.js
**中文** | [English](./readme.md)
   
  
## 概述
**mindmap.svg.js**是一个用于在WebView中显示和操作思维导图的javascript库。在该库中，思维导图的图形化构成采用SVG技术来实现。
**mindmap.svg.js** is a javascript library for displaying and operating the mindmap in the webview. The key implementation is base on SVG.

在**mindmap.svg.js**中，思维导图主题的标题、图片、链接等都称为主题的内容元素。主题的内容元素分为内建元素和可扩展元素两类。内建元素的布局行为包含在**mindmap.svg.js**的核心布局代码中。这意味着内建元素的基本布局效果是固定不变的。这类元素包括标题和图片。其中，标题是主题的默认元素，图片是主题的可选元素。
除标题和图片外，所有其他的主题内容元素都属于可扩展元素。可扩展元素总是布局在主题标题的后方或下方。但可扩展元素的所有显示和触发行为都是外部扩展定制的，不属于**mindmap.svg.js**的核心功能。为了便于常见思维导图的显示和操作，**mindmap.svg.js**已提供了常见的可扩展元素实现，包括链接、附件、备注、标签、优先级、进度。

**mindmap.svg.js**的可视化功能采用模板驱动方式设计。使用者可以通过自定义模板的方式变更思维导图的显示效果。同时，可扩展元素也是通过新增自定义模板的方式来扩增到思维导图中的。

**mindmap.svg.js**是作为一个思维导图的核心功能库设计的。所以**mindmap.svg.js**并不带有具体思维导图文件的格式翻译，以及诸如文件加载、保存、编辑历史堆栈等外围功能。这些外围功能都可以在调用**mindmap.svg.js**的基础之上，由外部应用代码来实现。

## 基本使用
**mindmap.svg.js**的基本功能通过MindmapEnvironment、MindmapDocument、MindmapViewer、Topic四个类来实现。MindmapEnvironment负责提供诸如配置参数、事件注册等基本的运行时环境。它是所有功能运行的基础保障，所以应当首先被实例化。MindmapDocument是思维导图的数据类，用于存储思维导图的总体数据、附件数据等信息。MindmapViewer是思维导图的可视化类，负责实现所有显示和可视化操作功能。它必须与一个MindmapDocument建立关联。Topic是具体主题的核心类。一张思维导图有多少个主题节点就会有多少个Topic类的示例。它们都会由MindmapViewer在运行时生成。
以下的示例代码展示了使用**mindmap.svg.js**的基本流程：
``` javascript
// 实例化运行环境
var env = new MindmapView.MindmapEnvironment();
// 实例化思维导图文档
var doc = new MindmapView.MindmapDocument(env);
// 实例化一个思维导图视图类，并将其与页面上的id为view的DIV元素关联
var view = new MindmapView.MindmapViewer(doc, document.getElementById("view"));
// 将mindmap.svg.js提供的常见扩展元素注册到运行环境和视图中
env.extensionFactors.push(...MindmapView.DefaultTopicExtensions);
env.extensionFactors.forEach((item) => {
    item.register(view);
});
// 为思维导图文档添加具体的思维导图数据，数据格式请参考API手册中的SheetData和TopicData
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

// 通过响应事件实现默认的操作
env.addEventListener("topic-event-edit", MindmapView.MindmapViewer.dispatchTopicEventAction.bind(MindmapView.DefaultTopicEventActions));
env.addEventListener("topic-event-trigger", MindmapView.MindmapViewer.dispatchTopicEventAction.bind(MindmapView.DefaultTopicEventActions));
```
需要注意一点，Topic示例保存有思维导图每个主题节点的运行时的实时数据。它们并不是总于MindmapDocument中的数据一致。只有当MindmapDocument发起视图同步操作的时候，Topic中的最新数据才会同步到所在视图对象关联的文档对象中去。

## 扩展
对**mindmap.svg.js**的扩展主要包括显示风格扩展、主题元素扩展两类。
#### 扩展显示风格
显示风格的扩展通过修改MindmapEnvironment中的config成员数据，以及自定义CSS风格来实现。
MindmapEnvironment中的配置数据的定义，请参考[API手册中MindmapEnvironment的DefaultConfig](./doc/mindmapEnv.md#MindmapEnvironment+DefaultConfig)的描述。
CSS风格方面，**mindmap.svg.js**已定义的CSS选择子说明如下：
``` css
/* 主题全局元素风格的筛选子 */
[season-topic-global] { }

/* 主题内容区域的筛选子 */
[season-topic-content-group] { }

/* 第n级主题的筛选子, n为从0开始的整数 */
[d-topic-level="n"] { }

/* 主题框格的CSS风格类 */
.season-topic-box { }

/* 主题的标题的CSS风格类 */
.season-topic-title { }

/* 主题的连接线的CSS风格类 */
.season-topic-connect-line { }

/* 主题的图片元素的CSS风格类 */
.season-topic-image { }

/* 具有焦点的主题的筛选子 */
[season-topic-focus] { }

/* 被拖拽主题的总体CSS类 */
.season-topic-drag-group { }

/* 主题被拖拽时覆盖在其上的遮掩层的CSS类 */
.season-topic-drag-mask { }

/* 主题被拖拽时其连接线的CSS类 */
.season-topic-drag-line { }
```
用户可以通过上述筛选子的组合定义具体风格来变更思维导图的默认显示效果。自定义的CSS代码段可以通过向MindmapViewer中注册TopicExtensionFactor来实现，也可以通过在HTML代码中直接定义style元素来实现。不过如果在HTML中直接定义的style元素在MindmapViewer关联的元素之前，那么CSS中的风格需要用!important来修饰，以确保其生效。
#### 扩展主题元素
扩展主题元素包括扩展主题元素的显示和扩展主题元素的编辑动作两个任务。
扩展主题元素的显示通过生成一个新的TopicExtensionFactor实例，并将其注册到MindmapEnvironment和MindmapViewer中来实现。TopicExtensionFactor实例的具体行为是由传入TopicExtensionFactor构造函数的模板来决定的。模板是一段SVG代码，其基本格式如下：
``` xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <style eblock-predefined="">
        <!-- 自定义的CSS风格，该节点必须具有eblock-predefined属性。如果没有自定义风格，可以删除该节点 -->
    </style>
    <defs eblock-predefined="">
        <!-- 预定义的SVG元素，该节点必须具有eblock-predefined属性。如果没有预定义的SVG元素，可以删除该节点 -->
    </defs>
    <script eblock-script="">
        <!-- 脚本节点，该节点是所有扩展件的必备节点，必须具有eblock-script属性 -->
        <!-- 以下注释中说明脚本的基本构成 -->
        <![CDATA[
            // declarer.xxx 表示导出一个脚本元素，比如导出函数、常量等等

            // declarer.getExtensionInfo 是扩展件必须导出的函数。
            // 该函数必须返回一个对象，对象中必须包含name成员，用于表示扩展件的名称。该名称要有全局唯一性。
            declarer.getExtensionInfo = function () {
                return {
                    name: "href"
                };
            }

            // declarer.onRendering 是扩展件被渲染时的处理程序，参数1是主题的数据，参数2是主题的实例对象
            declarer.onRendering = function (_data, _, _topic) {
                
            }
        }
    ]]>
    </script>
    <g eblock-template="" season-topic-content-type="href" ebevent-rendering="onRendering">
        <!-- 扩展件的静态显示模板，是扩展件的必备节点，必须具有eblock-template属性 -->
        <!-- 该节点的season-topic-content-type属性表示的是扩展元素的类型，在触发编辑的时候会作为参数体现在消息中 -->
        <!-- 该节点的ebevent-rendering属性表示在扩展元素被渲染时要调用的导出函数 -->
        <!-- 该节点的内部成员为扩展元素的静态构成 -->
    </g>
</svg>
```
TopicExtensionFactor模板的具体实例，可以参考[常见扩展元素的实现](./src/defaultTopicExtensions/)。

扩展主题元素的编辑动作主要通过响应MindmapEnvironment中的topic-event-trigger和topic-event-edit两个消息来实现。前者是鼠标单击元素时的触发事件，后者是鼠标双击元素时的触发事件。这两个事件的具体参数说明请参考API文档。
扩展主题元素编辑动作的具体实例，可以参考[常见扩展元素的实现](./src/defaultExportActions/)。

## 发布记录

### 1.0.6
- 增加主题标题可以拆分成多行的支持
- 在Environment中增加topic-rendering-extend事件，用以支持扩展渲染处理
- 删除了suitableLineWidth参数，增加maxTopicLineWidth参数

### 1.0.4
- 修复编辑框中无法用鼠标进行内容选择的BUG
- 修复keydown事件中发生异常时的提示文字的错误
- 修改默认的主题边界值，让整体视图更加紧凑
- 修改自定义配置信息生效日志的存储位置
- 将视图背景色添加为环境配置参数之一

### 1.0.2
- 允许自定义Topic背景框的形状
- 增强对Safari浏览器的兼容性

### 1.0.0

- Initial release of mindmap.svg.js

## API说明
请参考[API文档](./doc/api.md)

----------
Copyright ©2022 [Season Studio](mailto:season-studio@outlook.com)
