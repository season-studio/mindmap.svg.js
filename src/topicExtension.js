/**
 * @author season <season-studio@outlook.com>
 * @license Apache-2.0
 */

import { EBlock, EBlockFactor } from "../thirdpart/eblock";
import { MindmapError } from "./mindmapError";
import { assert } from "../thirdpart/toolkits/src/assert";
import { readonlyMember } from "../thirdpart/toolkits/src/readonly";

export
/**
 * Class of the extension of the topic
 * @class
 * @extends EBlock
 */
class TopicExtension extends EBlock {

    /**
     * @summary Create the instance of the extension
     * You should create the instance by TopicExtensionFactor.generate instead.
     * @constructor
     * @param {TopicExtensionFactor|Node} _factorOrNode The factor or the node of the exist extension
     * @param {Any} _data The data binded to the extension
     * @param {Topic} _topic The topic the extension belong to 
     */
    constructor (_factorOrNode, _data, _topic) {
        super(...arguments);

    }

    initMetadata(_metadata, _data, _node, _topic) {

    }

    /**
     * The name of the extension
     * @type {String}
     */
    get name() {
        return this.factor.$info.name;
    }

    /**
     * The topic this extension belong to
     * @type {Topic}
     */
    get topic() {
        let node = this.$assignedNode.parentNode;
        node && (node = node.parentNode);
        node && (node = node.parentNode);
        return node && EBlock.GetInstance(node);
    }

    /**
     * Call a script function of this extension
     * @param {String} _name The name of the function
     * @param  {...any} _args The arguments passed to the function
     * @returns {Any} The result return by the destination function
     */
    callScript(_name, ..._args) {
        return this.factor.applyScript(_name, this, _args);
    }

    /**
     * Call a script function of this extension
     * @param {String} _name The name of the function
     * @param  {Array} _args The arguments passed to the function
     * @returns {Any} The result return by the destination function
     */
    applyScript(_name, _this, _args) {
        return this.factor.applyScript(_name, this, _args);
    }
}

export
/**
 * Class of the factor for extension of the topic
 * @class
 * @extends EBlockFactor
 */
class TopicExtensionFactor extends EBlockFactor {

    /**
     * Create an instance of the factor
     * @constructor
     * @param {Node} _node The node of the global template of the extension
     */
    constructor(_node) {
        super(...arguments);

        const extensionInfo = this.callScript("getExtensionInfo", this);
        assert(extensionInfo && extensionInfo.name, MindmapError, -1, "The extension do not provide it's information and name by function 'getEntensionInfo'");
        readonlyMember(this, "$info", extensionInfo);
    }
}
