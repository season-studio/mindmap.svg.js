import { readonlyMember } from "../thirdpart/toolkits/src/readonly";

export function functionWithBindMap(_func) {
    const map = new WeakMap();

    return readonlyMember(_func, {
        binding(_obj) {
            if (!map.has(_obj)) {
                let fn = _func.bind(_obj);
                map.set(_obj, fn);
                return fn;
            } else {
                return map.get(_obj);
            }
        },

        deleteBinding(_obj) {
            return map.delete(_obj);
        }
    });
}

const NormalizeDialogBubbleRaiseEdgeValues = ["top", "left", "right", "bottom"];

function calcDialogBubbleRaiseDashArray(_total, _cornerRadius, _raiseOffset, _raiseBase) {
    _total -= _cornerRadius * 2;
    let middle = _total / 2;
    (_raiseBase + _raiseBase > _total) && (_raiseBase = middle);
    let dash1 = middle + _raiseOffset - _raiseBase;
    (dash1 < 0) && (dash1 = 0);
    let dash2 = _total - dash1 - _raiseBase * 2;
    if (dash2 < 0) {
        dash2 = 0;
        dash1 = _total - _raiseBase * 2;
    }
    return [dash1, dash2];
}

export function generateDialogBubblePath(_x, _y, _width, _height, _cornerRadius, _raiseHeight, _raiseBase, _raiseOffset, _raiseEbge) {
    NormalizeDialogBubbleRaiseEdgeValues.includes(_raiseEbge) || (_raiseEbge = "top");
    const path = [];
    path.push(`M${_x + _cornerRadius} ${_y}`);
    if (_raiseEbge === "top") {
        let dash = calcDialogBubbleRaiseDashArray(_width, _cornerRadius, _raiseOffset, _raiseBase);
        (dash[0] > 0) && path.push(`h${dash[0]}`);
        path.push(`l${_raiseBase} ${0 - _raiseHeight}l${_raiseBase} ${_raiseHeight}`);
        (dash[1] > 0) && path.push(`h${dash[1]}`);
    } else {
        path.push(`h${_width - _cornerRadius * 2}`);
    }
    path.push(`a${_cornerRadius} ${_cornerRadius} 0 0 1 ${_cornerRadius} ${_cornerRadius}`);
    if (_raiseEbge === "right") {
        let dash = calcDialogBubbleRaiseDashArray(_height, _cornerRadius, _raiseOffset, _raiseBase);
        (dash[0] > 0) && path.push(`v${dash[0]}`);
        path.push(`l${_raiseHeight} ${_raiseBase}l${0 - _raiseHeight} ${_raiseBase}`);
        (dash[1] > 0) && path.push(`v${dash[1]}`);
    } else {
        path.push(`v${_height - _cornerRadius * 2}`);
    }
    path.push(`a${_cornerRadius} ${_cornerRadius} 0 0 1 ${0 - _cornerRadius} ${_cornerRadius}`);
    if (_raiseEbge === "bottom") {
        let dash = calcDialogBubbleRaiseDashArray(_width, _cornerRadius, _raiseOffset, _raiseBase);
        (dash[1] > 0) && path.push(`h${0 - dash[1]}`);
        path.push(`l${0 - _raiseBase} ${_raiseHeight}l${0 - _raiseBase} ${0 - _raiseHeight}`);
        (dash[0] > 0) && path.push(`h${0 - dash[0]}`);
    } else {
        path.push(`h${0 - _width + _cornerRadius * 2}`);
    }
    path.push(`a${_cornerRadius} ${_cornerRadius} 0 0 1 ${0 - _cornerRadius} ${0 - _cornerRadius}`);
    if (_raiseEbge === "left") {
        let dash = calcDialogBubbleRaiseDashArray(_height, _cornerRadius, _raiseOffset, _raiseBase);
        (dash[1] > 0) && path.push(`v${0 - dash[1]}`);
        path.push(`l${0 - _raiseHeight} ${0 - _raiseBase}l${_raiseHeight} ${0 - _raiseBase}`);
        (dash[0] > 0) && path.push(`v${0 - dash[0]}`);
    } else {
        path.push(`v${0 - _height + _cornerRadius * 2}`);
    }
    path.push(`a${_cornerRadius} ${_cornerRadius} 0 0 1 ${_cornerRadius} ${0 - _cornerRadius}z`);
    return path.join("");
}