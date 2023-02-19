/**
 * @author season <season-studio@outlook.com>
 * @license Apache-2.0
 */

import { EBlock, EBlockContainer, generateID } from "../thirdpart/eblock";
import { MindmapError } from "./mindmapError";
import { MindmapEnvironment } from "./mindmapEnv";
import { assert } from "../thirdpart/toolkits/src/assert";
import { readonlyMember } from "../thirdpart/toolkits/src/readonly";

const ContainerDefXml = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" tabindex="0" overflow="hidden" width="640" height="480" viewBox="0 0 640 480" style="outline:none;">
<style>
    [season-mind-map-svg] {
        --topic-ui-focus-color: #5cf;
        --topic-ui-focus-border-color: #055cff;
        --topic-ui-danger-color: #f22;
        --topic-ui-emphasize-front-color: #fff;
        --topic-ui-hover-back-color: #ccc;

        background-color: var(--background-color, transparent);
        
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Chrome/Safari/Opera */
        -khtml-user-select: none; /* Konqueror */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently not supported by any browser */
    }
    
    [season-mind-map-svg] *::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background: transparent;
        cursor: point;
    }
    [season-mind-map-svg] *::-webkit-scrollbar-corner {
        background: transparent;
    }
    [season-mind-map-svg] *::-webkit-scrollbar-track {
        background: transparent;
        cursor: point;
    }
    [season-mind-map-svg] *::-webkit-scrollbar-thumb
    {
        -webkit-border-radius: 7px;
        border-radius: 7px;
        background: rgba(57,57,57,0.1);
        cursor: point;
    }
    [season-mind-map-svg] *:hover::-webkit-scrollbar-thumb {
        -webkit-border-radius: 7px;
        border-radius: 7px;
        background: rgba(0,0,0,0.1); 
        cursor: point;
    }

    .season-topic-svg-button > rect {
        fill: rgba(255,255,255,0.05);
        stroke: none;
    }
    .season-topic-svg-button[d-svg-button-has-border] > rect {
        fill: rgba(255,255,255,0.05);
        stroke: var(--topic-ui-hover-back-color);
    }
    .season-topic-svg-button > use, .season-topic-svg-button > path {
        fill: #000;
        stroke: none;
    }
    .season-topic-svg-button:hover > rect {
        fill: var(--topic-ui-hover-back-color);
    }
    .season-topic-svg-button:hover > use, .season-topic-svg-button:hover > path {
        fill: #000;
    }
    .season-topic-svg-button[d-svg-button-danger]:hover > rect {
        fill: var(--topic-ui-danger-color);
    }
    .season-topic-svg-button[d-svg-button-danger]:hover > use, .season-topic-svg-button[d-svg-button-danger]:hover > path {
        fill: var(--topic-ui-emphasize-front-color);
    }

    .season-topic-svg-3d-button > rect {
        fill: url(#season-svg-3d-fill);
        stroke-width: 0.5px;
        stroke: #bbb;
    }
    .season-topic-svg-3d-button > use, .season-topic-svg-button > path {
        fill: #000;
        stroke: none;
    }
    .season-topic-svg-3d-button:hover > rect {
        fill: url(#season-svg-3d-fill-hover);
        stroke-width: 0.5px;
        stroke: #bbb;
    }
    .season-topic-svg-3d-button:hover > use, .season-topic-svg-button:hover > path {
        fill: #fff;
        stroke: none;
    }
    .season-topic-svg-3d-button:active > rect {
        fill: url(#season-svg-3d-fill-active);
        stroke-width: 0.5px;
        stroke: #bbb;
    }
    .season-topic-svg-3d-button:active > use, .season-topic-svg-button:active > path {
        fill: #fff;
        stroke: none;
    }
    .season-topic-svg-3d-button[d-svg-button-danger]:hover > rect {
        fill: url(#season-svg-3d-danger-fill-hover);
        stroke-width: 0.5px;
        stroke: #bbb;
    }
    .season-topic-svg-3d-button[d-svg-button-danger]:hover > use, .season-topic-svg-button[d-svg-button-danger]:hover > path {
        fill: #fff;
        stroke: none;
    }
    .season-topic-svg-3d-button[d-svg-button-danger]:active > rect {
        fill: url(#season-svg-3d-danger-fill-active);
        stroke-width: 0.5px;
        stroke: #bbb;
    }
    .season-topic-svg-3d-button[d-svg-button-danger]:active > use, .season-topic-svg-button[d-svg-button-danger]:active > path {
        fill: #fff;
        stroke: none;
    }
    
</style>
<defs season-topic-predefine-filter-and-pattern="">
    <linearGradient id="season-svg-3d-fill" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#fff" stop-opacity="1" offset="0" />
        <stop stop-color="#f0f0f0" stop-opacity="1" offset="0.3" />
        <stop stop-color="#e0e0e0" stop-opacity="1" offset="0.9" />
        <stop stop-color="#ccc" stop-opacity="1" offset="1" />
    </linearGradient>
    <linearGradient id="season-svg-3d-fill-hover" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#0af" stop-opacity="1" offset="0" />
        <stop stop-color="#009dff" stop-opacity="1" offset="0.1" />
        <stop stop-color="#07f" stop-opacity="1" offset="0.75" />
        <stop stop-color="#06f" stop-opacity="1" offset="1" />
    </linearGradient>
    <linearGradient id="season-svg-3d-fill-active" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#06f" stop-opacity="1" offset="0" />
        <stop stop-color="#07f" stop-opacity="1" offset="0.1" />
        <stop stop-color="#009dff" stop-opacity="1" offset="0.75" />
        <stop stop-color="#0af" stop-opacity="1" offset="1" />
    </linearGradient>
    <linearGradient id="season-svg-3d-danger-fill-hover" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#f55" stop-opacity="1" offset="0" />
        <stop stop-color="#f33" stop-opacity="1" offset="0.1" />
        <stop stop-color="#f00" stop-opacity="1" offset="0.75" />
        <stop stop-color="#b00" stop-opacity="1" offset="1" />
    </linearGradient>
    <linearGradient id="season-svg-3d-danger-fill-active" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#c00" stop-opacity="1" offset="0" />
        <stop stop-color="#f00" stop-opacity="1" offset="0.1" />
        <stop stop-color="#f33" stop-opacity="1" offset="0.75" />
        <stop stop-color="#f55" stop-opacity="1" offset="1" />
    </linearGradient>
</defs>
<defs season-topic-predefine-image="">
    <symbol id="season-topic-predefine-image-picture-placeholder" width="76" height="58" viewBox="0 0 76 58" preserveAspectRatio="none">
        <path d="M 0 0 L 0 58 L 76 58 L 76 0 L 0 0 z M 17 9 C 18.7 9 20 10.3 20 12 C 20 13.7 18.7 15 17 15 C 15.3 15 14 13.7 14 12 C 14 10.3 15.3 9 17 9 z M 17 11 C 16.4 11 16 11.4 16 12 C 16 12.6 16.4 13 17 13 C 17.6 13 18 12.6 18 12 C 18 11.4 17.6 11 17 11 z M 30 11 C 30.3 11 30.7 11.2 30.8 11.4 L 45.8 34.2 L 52.1 22.5 C 52.3 22.2 52.6 22 53 22 C 53.4 22 53.7 22.2 53.9 22.5 L 67.9 46.5 C 68 46.7 68 46.8 68 47 C 68 47.6 67.6 48 67 48 L 8 48 C 7.8 48 7.6 47.9 7.4 47.9 C 6.9 47.6 6.8 47 7.1 46.5 L 17 30.7 C 17.1 30.6 17.2 30.4 17.3 30.3 L 29.2 11.5 C 29.3 11.2 29.7 11 30 11 z M 30 13.9 L 20.7 28.7 L 26.6 26.1 C 27 25.9 27.4 26 27.7 26.3 L 30 28.6 L 32.8 25.8 C 33.1 25.4 33.6 25.4 34 25.6 L 40.1 29.2 L 30 13.9 z M 53 25.1 L 47 36.1 L 53.5 46 L 65.3 46 L 53 25.1 z M 33.7 27.7 L 30.7 30.7 C 30.3 31.1 29.7 31.1 29.3 30.7 L 26.8 28.2 L 18.8 31.8 L 9.801 46 L 51.1 46 L 42.5 32.8 L 33.7 27.7 z" />
    </symbol>
    <symbol id="season-topic-predefine-image-bold" width="20" height="20" viewBox="0 0 20 20" preserveAspectRatio="none">
        <path d="m 12.04,9.665 q 1.57,0.365 2.2,0.885 0.91,0.74 0.91,1.92 0,1.24 -1,2.05 -1.23,0.98 -3.57,0.98 H 5 v -0.3 q 0.762,0 1.03,-0.14 0.275,-0.14 0.381,-0.37 0.113,-0.23 0.113,-1.13 V 6.429 Q 6.524,5.537 6.411,5.311 6.305,5.075 6.03,4.938 5.755,4.8 5,4.8 V 4.5 h 5.27 q 1.9,0 2.68,0.34 0.78,0.333 1.24,1.005 0.45,0.665 0.45,1.42 0,0.795 -0.57,1.42 -0.57,0.616 -2.03,0.98 z M 9.087,9.446 q 1.153,0 1.693,-0.258 0.56,-0.261 0.85,-0.731 0.29,-0.471 0.29,-1.2 0,-0.73 -0.29,-1.192 Q 11.35,5.595 10.81,5.351 10.27,5.108 9.087,5.116 Z m 0,0.634 v 3.53 0.4 q 0,0.44 0.218,0.67 0.229,0.23 0.665,0.23 0.65,0 1.19,-0.29 0.56,-0.3 0.85,-0.84 0.29,-0.56 0.29,-1.22 0,-0.77 -0.36,-1.38 -0.37,-0.62 -0.99,-0.86 -0.62,-0.25 -1.862,-0.24 z" />
    </symbol>
    <symbol id="season-topic-predefine-image-italic" width="20" height="20" viewBox="0 0 20 20" preserveAspectRatio="none">
        <path d="m 11.27,15.2 -0.1,0.3 H 6.65 l 0.113,-0.3 q 0.682,0 0.901,-0.11 0.357,-0.14 0.528,-0.39 0.266,-0.38 0.551,-1.35 L 10.66,6.706 Q 10.9,5.878 10.9,5.457 10.9,5.246 10.8,5.1 10.69,4.954 10.48,4.882 10.26,4.797 9.635,4.797 L 9.733,4.5 h 4.257 l -0.1,0.3 q -0.52,0 -0.77,0.114 -0.36,0.161 -0.56,0.462 -0.18,0.3 -0.49,1.33 l -1.9,6.644 q -0.259,0.91 -0.259,1.16 0,0.21 0.1,0.36 0.11,0.13 0.32,0.21 0.23,0.1 0.94,0.12 z" />        
    </symbol>
    <symbol id="season-topic-predefine-image-underline" width="20" height="20" viewBox="0 0 20 20" preserveAspectRatio="none">
        <path d="m 5.4,4.5 v 0.244 c 0.379,0 0.639,0.03 0.779,0.106 0.141,0.07 0.241,0.176 0.298,0.305 0.06,0.122 0.09,0.441 0.09,0.957 V 10.5 c 0,0.74 0.119,1.33 0.356,1.77 0.239,0.44 0.646,0.81 1.223,1.09 0.423,0.21 1.022,0.31 1.798,0.31 0.926,0 1.666,-0.2 2.196,-0.59 0.53,-0.39 0.87,-0.82 1.01,-1.29 0.14,-0.46 0.21,-1.22 0.21,-2.274 V 6.112 c 0,-0.365 0,-0.618 0.1,-0.759 0.1,-0.203 0.2,-0.355 0.37,-0.456 0.16,-0.102 0.37,-0.153 0.62,-0.153 h 0.19 V 4.5 h -3.12 v 0.244 c 0.37,0 0.65,0.05 0.84,0.153 0.13,0.07 0.24,0.184 0.32,0.357 0.1,0.171 0.13,0.457 0.13,0.858 v 3.655 c 0,0.953 -0.1,1.613 -0.26,2.003 -0.16,0.38 -0.42,0.68 -0.76,0.9 -0.34,0.21 -0.76,0.32 -1.24,0.32 -0.42,0 -0.776,-0.1 -1.053,-0.25 C 9.219,12.56 9.019,12.35 8.895,12.09 8.777,11.82 8.717,11.3 8.717,10.5 V 6.112 c 0,-0.511 0.03,-0.83 0.08,-0.957 C 8.854,5.026 8.946,4.927 9.074,4.857 9.206,4.782 9.447,4.744 9.794,4.744 H 10.03 V 4.5 Z m 0,9.73 v 1.27 h 9.23 v -1.27 z" />    
    </symbol>
    <symbol id="season-topic-predefine-image-unorder-list" width="20" height="20" viewBox="0 0 20 20" preserveAspectRatio="none">
        <path d="M 5 5 L 5 6.5 L 6.5 6.5 L 6.5 5 L 5 5 z M 7.5 5 L 7.5 6.5 L 15 6.5 L 15 5 L 7.5 5 z M 5 9.5 L 5 11 L 6.5 11 L 6.5 9.5 L 5 9.5 z M 7.5 9.5 L 7.5 11 L 15 11 L 15 9.5 L 7.5 9.5 z M 5 14 L 5 15.5 L 6.5 15.5 L 6.5 14 L 5 14 z M 7.5 14 L 7.5 15.5 L 15 15.5 L 15 14 L 7.5 14 z " />    
    </symbol>
    <symbol id="season-topic-predefine-image-order-list" width="20" height="20" viewBox="0 0 20 20" preserveAspectRatio="none">
        <path d="M 6.125 5 L 4.5 5.742 L 4.559 5.859 C 4.717 5.79 4.852 5.756 4.963 5.756 C 5.032 5.756 5.093 5.774 5.145 5.811 C 5.199 5.845 5.237 5.889 5.256 5.941 C 5.276 5.991 5.285 6.116 5.285 6.32 L 5.285 8.609 C 5.285 8.887 5.27 9.065 5.242 9.141 C 5.214 9.217 5.16 9.273 5.08 9.312 C 4.999 9.359 4.864 9.383 4.676 9.383 L 4.559 9.383 L 4.559 9.504 L 6.887 9.504 L 6.887 9.383 L 6.785 9.383 C 6.618 9.383 6.498 9.359 6.422 9.312 C 6.349 9.265 6.298 9.204 6.271 9.131 C 6.245 9.055 6.232 8.881 6.232 8.609 L 6.232 5 L 6.125 5 z M 7.5 5 L 7.5 6.5 L 15 6.5 L 15 5 L 7.5 5 z M 8.314 9.5 L 8.314 11 L 15 11 L 15 9.5 L 8.314 9.5 z M 5.939 11 C 5.627 11 5.35 11.1 5.111 11.3 C 4.873 11.5 4.695 11.81 4.578 12.24 L 4.697 12.24 C 4.882 11.91 5.143 11.74 5.477 11.74 C 5.681 11.74 5.853 11.82 5.994 11.97 C 6.135 12.12 6.205 12.3 6.205 12.53 C 6.205 12.84 6.119 13.16 5.947 13.49 C 5.778 13.82 5.296 14.46 4.5 15.41 L 4.5 15.51 L 7.098 15.51 L 7.346 14.26 L 7.229 14.26 C 7.156 14.39 7.095 14.49 7.049 14.56 C 7.003 14.63 6.944 14.66 6.873 14.66 L 6.418 14.66 L 5.463 14.66 C 6.201 13.94 6.679 13.38 6.898 12.98 C 7.059 12.68 7.141 12.39 7.141 12.1 C 7.141 11.94 7.087 11.77 6.982 11.59 C 6.878 11.41 6.735 11.27 6.551 11.16 C 6.366 11.05 6.163 11 5.939 11 z M 8.314 14 L 8.314 15.5 L 15 15.5 L 15 14 L 8.314 14 z " />
    </symbol>
    <symbol id="season-topic-predefine-image-open" width="96" height="96" viewBox="0 0 96 96" preserveAspectRatio="none">
        <path d="m 11.94,75.97 c 0,0 0.1,0 0.11,0 H 74 L 87.6,46.8 C 88.57,44.77 87.71,42.34 85.69,41.37 85.28,41.18 84.85,41.05 84.4,41 H 80 v -9 c 0,-2.2 -1.79,-3.99 -4,-4 H 46.28 c -0.18,0 -0.36,0 -0.51,-0.15 L 35,20.7 C 34.34,20.27 33.58,20.03 32.8,20 H 14 c -2.21,0 -3.99,1.79 -4,4 v 49.98 c 0,1.08 0.86,1.96 1.94,1.99 z M 84.29,43 c 1.13,0.2 1.88,1.28 1.68,2.4 0,0.18 -0.1,0.35 -0.16,0.51 v 0 0 L 72.75,73.94 v 0 H 14.1 c 0,0 0,0 0,0 0,0 0,0 0,0 L 26.43,44.01 C 26.72,43.4 27.33,43.01 28,43 Z M 12,24 c 0,-1.11 0.9,-2 2,-2 h 18.8 c 0.41,0 0.81,0.17 1.15,0.4 l 10.71,7.11 C 45.14,29.83 45.7,30 46.28,30 H 76 c 1.1,0 2,0.89 2,2 v 8.99 H 29 c -0.1,0 -0.1,0 -0.16,0 H 28 c -1.47,0 -2.79,0.87 -3.4,2.2 L 12.02,73.76 z" />
    </symbol>
    <symbol id="season-topic-predefine-image-nodepad" width="96" height="96" viewBox="0 0 96 96" preserveAspectRatio="none">
        <rect width="60" height="80" x="18" y="8" />
        <path d="M 28,35 h 20 0 M 28,25 h 17 v 0 M 28,45 h 40 v 0 M 28,55 h 40 v 0 M 28,65 h 40 v 0 M 28,75 h 40 v 0" />
        <circle cx="60" cy="25" r="8" />
    </symbol>
    <symbol id="season-topic-predefine-image-picture" width="96" height="96" viewBox="0 0 96 96" preserveAspectRatio="none">
        <path d="M 10 19 L 10 77 L 86 77 L 86 19 L 10 19 z M 12 21 L 84 21 L 84 75 L 12 75 L 12 21 z M 27 28 C 25.3 28 24 29.3 24 31 C 24 32.7 25.3 34 27 34 C 28.7 34 30 32.7 30 31 C 30 29.3 28.7 28 27 28 z M 27 30 C 27.6 30 28 30.4 28 31 C 28 31.6 27.6 32 27 32 C 26.4 32 26 31.6 26 31 C 26 30.4 26.4 30 27 30 z M 40 30 C 39.7 30 39.3 30.2 39.2 30.5 L 27.3 49.3 C 27.2 49.4 27.1 49.6 27 49.7 L 17.1 65.5 C 16.8 66 16.9 66.6 17.4 66.9 C 17.6 66.9 17.8 67 18 67 L 77 67 C 77.6 67 78 66.6 78 66 C 78 65.8 78 65.7 77.9 65.5 L 63.9 41.5 C 63.7 41.2 63.4 41 63 41 C 62.6 41 62.3 41.2 62.1 41.5 L 55.8 53.2 L 40.8 30.4 C 40.7 30.2 40.3 30 40 30 z M 40 32.9 L 50.1 48.2 L 44 44.6 C 43.6 44.4 43.1 44.4 42.8 44.8 L 40 47.6 L 37.7 45.3 C 37.4 45 37 44.9 36.6 45.1 L 30.7 47.7 L 40 32.9 z M 63 44.1 L 75.3 65 L 63.5 65 L 57 55.1 L 63 44.1 z M 43.7 46.7 L 52.5 51.8 L 61.1 65 L 19.8 65 L 28.8 50.8 L 36.8 47.2 L 39.3 49.7 C 39.7 50.1 40.3 50.1 40.7 49.7 L 43.7 46.7 z" />
    </symbol>
    <symbol id="season-topic-predefine-image-pencil" width="96" height="96" viewBox="0 0 96 96" preserveAspectRatio="none">
        <path d="m 86.82,16.2 -7.03,-7 c -1.56,-1.6 -4.1,-1.6 -5.66,0 0,0 0,0 0,0 L 14.03,69.3 8,88.1 26.75,82 v 0 L 86.82,21.9 c 1.56,-1.6 1.56,-4.1 0,-5.7 z m -19.76,2.9 9.88,9.9 -2.14,2.1 -9.88,-9.9 z m -41.44,61.2 -11.13,3.6 -2.3,-2.3 3.57,-11.2 c 2.03,-1.6 5.58,-0.9 8.17,1.7 2.58,2.6 3.28,6.1 1.69,8.2 z m -0.28,-9.6 c -1.79,-1.9 -4.22,-3 -6.8,-3.1 l 44.97,-45 9.88,9.9 -44.95,45 c -0.13,-2.6 -1.24,-5 -3.1,-6.8 z m 60.06,-50.2 -7.05,7 -9.88,-9.8 7.07,-7.1 c 0.78,-0.8 2.05,-0.8 2.83,0 0,0 0,0 0,0 l 7.03,7.1 c 0.78,0.7 0.78,2 0,2.8 z" />
    </symbol>
    <symbol id="season-topic-predefine-image-delete" width="96" height="96" viewBox="0 0 96 96" preserveAspectRatio="none">
        <path d="M 42 10 C 39.24 10 37 12.2 37 15 L 37 18 L 19 18 C 16.79 18 15.01 19.8 15 22 L 15 28 L 81 28 L 81 22 C 81 19.8 79.21 18 77 18 L 59 18 L 59 15 C 59 12.2 56.76 10 54 10 L 42 10 z M 42 12 L 54 12 C 55.66 12 57 13.3 57 15 L 57 18 L 39 18 L 39 15 C 39 13.3 40.34 12 42 12 z M 19 20 L 77 20 C 78.11 20 79 20.9 79 22 L 79 26 L 17 26 L 17 22 C 17 20.9 17.89 20 19 20 z M 20.5 31 C 19.67 31 19 31.67 19 32.5 C 19 32.59 19.01 32.68 19.03 32.77 C 19.01 32.86 19 32.95 19 33.04 L 19 80.04 C 19 80.12 19.01 80.19 19.02 80.27 C 19.01 80.35 19 80.42 19 80.5 C 19 81.33 19.67 82 20.5 82 L 75.5 82 C 76.33 82 77 81.33 77 80.5 C 77 80.42 76.99 80.35 76.98 80.27 C 76.99 80.19 77 80.12 77 80.04 L 77 33.04 C 77 32.95 76.99 32.86 76.97 32.77 C 76.99 32.68 77 32.59 77 32.5 C 77 31.67 76.33 31 75.5 31 L 20.5 31 z M 22 34 L 74 34 L 74 79 L 22 79 L 22 34 z M 34 38 C 33.17 38 32.5 38.59 32.5 39.32 L 32.5 73.68 C 32.5 74.41 33.17 75 34 75 C 34.83 75 35.5 74.41 35.5 73.68 L 35.5 39.32 C 35.5 38.59 34.83 38 34 38 z M 48 38 C 47.17 38 46.5 38.59 46.5 39.32 L 46.5 73.68 C 46.5 74.41 47.17 75 48 75 C 48.83 75 49.5 74.41 49.5 73.68 L 49.5 39.32 C 49.5 38.59 48.83 38 48 38 z M 62 38 C 61.17 38 60.5 38.59 60.5 39.32 L 60.5 73.68 C 60.5 74.41 61.17 75 62 75 C 62.83 75 63.5 74.41 63.5 73.68 L 63.5 39.32 C 63.5 38.59 62.83 38 62 38 z" />
    </symbol>
    <symbol id="season-topic-predefine-image-eraser" width="96" height="96" viewBox="0 0 96 96" preserveAspectRatio="none">
        <path d="M 84.09,39.93 58.63,14.43 c -1.95,-1.9 -5.12,-1.9 -7.07,0 l -39.6,39.6 c -1.95,2 -1.95,5.1 0,7.1 l 22.22,22.19 h 43.85 v -2 h -28.3 l 34.36,-34.4 c 1.95,-1.9 1.95,-5.1 0,-6.99 z M 35.03,81.32 H 35 L 13.38,59.72 c -1.17,-1.19 -1.17,-3.09 0,-4.3 0,0 0,0 0,0 l 19.09,-19.1 29.7,29.7 -15.27,15.3 z M 82.67,45.53 63.58,64.62 33.88,34.93 52.98,15.82 c 1.17,-1.1 3.07,-1.1 4.24,0 l 25.45,25.5 c 1.17,1.2 1.17,3.1 0,4.21 z" />
    </symbol>
    <symbol id="season-topic-predefine-image-cross" width="96" height="96" viewBox="0 0 96 96" preserveAspectRatio="none">
        <path d="M 83,21.4 74.6,13 48,39.6 21.4,13 13,21.4 39.6,48 13,74.6 21.4,83 48,56.4 74.6,83 83,74.6 56.4,48 Z" />
    </symbol>
</defs>
<defs season-topic-image-storage="">
</defs>
<g season-topic-root-node=""></g>
</svg>
`;

const ResizeProc = Symbol("MindmapContainer.ResizeProc");
const ResizeObserverHandler = Symbol("MindmapContainer.ResizeObserverHandler");

export
/**
 * Class of the container for displaying the mindmap
 * @class
 * @extends EBlockContainer
 * @property {MindmapEnvironment} env The enviroment of the mindmap
 */
class MindmapContainer extends EBlockContainer {

    #resizeObServer = undefined;

    /**
     * Create the container
     * @constructor
     * @param {Node} _parentNode The node as the parent of the container
     * @param {MindmapEnvironment} _env The enviroment of the mindmap
     */
    constructor(_parentNode, _env) {
        assert(_parentNode instanceof Node, MindmapError, -1, "_parentNode must be an instance of Node");
        assert(_env instanceof MindmapEnvironment, MindmapError, -1, "_env must be an instance of MindmapEnvironment");

        super();

        _parentNode.innerHTML = ContainerDefXml;
        const svgElement = _parentNode.querySelector("svg");
        svgElement.setAttribute("season-mind-map-svg", generateID());
        svgElement.$scale = 1;
        _parentNode.style.overflow = "hidden";
        const parentNodePosition = getComputedStyle(_parentNode).position;
        if ((parentNodePosition !== "relative") && (parentNodePosition !== "absolute")) {
            _parentNode.style.position = "relative";
        }

        readonlyMember(this, {
            env: _env,
            svgElement,
            stageContainer: svgElement.querySelector("g[season-topic-root-node]"),
            eventContainer: svgElement
        });        

        (this.#resizeObServer = new ResizeObserver(this[ResizeObserverHandler].bind(this)))
            .observe(_parentNode);
        this[ResizeProc]({ width: _parentNode.clientWidth, height: _parentNode.clientHeight });
    }

    /**
     * Insert a node as the predefined data of the mindmap
     * @param {Node} _node the predefined node
     */
    define(_node) {
        this.svgElement.insertBefore(_node, this.stageContainer);
    }

    /**
     * Remove nodes matched the selector
     * @param {String} _selector the selector for searching the node which should be removed
     */
    undefine(_selector) {
        this.svgElement.querySelectorAll(_selector).forEach(item => item.remove());
    }

    /**
     * The processing when the size of the container is changed
     * @private
     * @param {*} _rect 
     */
    [ResizeProc](_rect) {
        const svgNode = this.svgElement;
        let scale = Number(svgNode.$scale); 
        (scale > 0) || (scale = 1);
        const viewBox = svgNode.viewBox.baseVal;
        svgNode.setAttribute("width", _rect.width);
        svgNode.setAttribute("height", _rect.height);
        svgNode.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${_rect.width / scale} ${_rect.height / scale}`);
    }

    /**
     * The scale of the viewer
     * @type {Number}
     */
    get scale() {
        return Number(this.svgElement.$scale) || 1;
    }

    /**
     * The scale of the viewer
     * @ignore
     */
    set scale(_val) {
        _val = Number(_val);
        (_val > 0) || (_val = 1);
        const svgNode = this.svgElement;
        svgNode.$scale = _val;
        const viewBox = svgNode.viewBox.baseVal;
        const width = Number(svgNode.width.baseVal.value);
        const height = Number(svgNode.height.baseVal.value);
        svgNode.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${width / _val} ${height / _val}`);
        this.env.fireEvent("topic-event-view-resize");
    }

    /**
     * Move the view of the mindmap
     * @param {Number} _deltaX the offset in the x-coordinate
     * @param {Number} _deltaY the offset in the y-coordinate
     */
    move(_deltaX, _deltaY) {
        const svgNode = this.svgElement;
        const viewBox = svgNode.viewBox.baseVal;
        const viewX = viewBox.x + (Number(_deltaX) || 0);
        const viewY = viewBox.y + (Number(_deltaY) || 0);
        const viewBottom = viewY + viewBox.height;
        const viewRight = viewX + viewBox.width;
        const {x, y, width, height} = this.stageContainer.getBBox();
        const right = x + width;
        const bottom = y + height;
        if (!((bottom < viewY) || (y > viewBottom) || (x > viewRight) || (right < viewX))) {
            svgNode.setAttribute("viewBox", `${viewX} ${viewY} ${viewBox.width} ${viewBox.height}`);
        }
    }

    /**
     * the callack of the resizing observer
     * @private
     * @param {*} _entries 
     */
    [ResizeObserverHandler](_entries) {
        const parentNode = this.svgElement.parentNode;
        _entries.forEach(item => {
            if (item.target === parentNode) {
                this[ResizeProc](item.contentRect);
            }
        });
        this.env.fireEvent("topic-event-view-resize");
    }

    /**
     * Create an event as the event triggered by the DOM
     * @param {String} _eventName the name of the event
     * @param {*} _detail the detail of the event
     * @returns {Event} An instance of Event
     */
    createDomEvent(_eventName, _detail) {
        return new CustomEvent(`topic-domevent-${_eventName}`, { detail: _detail });
    }

    /**
     * Add the listener of an event
     * @param  {...any} _args the arguments as the same as passed to the EventTarget.addEventListener
     * @returns {MindmapContainer} this object
     */
    addEventListener(..._args) {
        this.env.addEventListener(..._args);
        return this;
    }

    /**
     * remove the listener of an event
     * @param  {...any} _args the arguments as the same as passed to the EventTarget.removeEventListener
     * @returns {MindmapContainer} this object
     */
    removeEventListener(..._args) {
        this.env.addEventListener(..._args);
        return this;
    }

    /**
     * Dispose the resource of the container. This method should be called when you don't need the container any more.
     */
    dispose() {
        this.#resizeObServer && this.#resizeObServer.disconnect();
        this.svgElement.remove();
    }

    /**
     * Dispatch the event
     * @param {Event} _event 
     * @private
     */
    [EBlockContainer.DomEventDispatcher](_event) {
        try {
            const target = _event.target;
            if (target) {
                if (_event.type === "mousedown") {
                    target.$mousedownTimeStamp = _event.timeStamp;
                    target.$mouseEventX = _event.offsetX;
                    target.$mouseEventY = _event.offsetY;
                } else if (_event.type === "click") {
                    let deltaTime = _event.timeStamp - (Number(target.$mousedownTimeStamp) || 0);
                    let deltaX = Math.abs(_event.offsetX - (Number(target.$mouseEventX) || Number.MAX_VALUE));
                    let deltaY = Math.abs(_event.offsetY - (Number(target.$mouseEventY) || Number.MAX_VALUE));
                    target.$mousedownTimeStamp = 0;
                    target.$mouseEventX = Number.MAX_VALUE;
                    target.$mouseEventY = Number.MAX_VALUE;
                    if ((deltaTime > 1000) && ((deltaX > 10) || (deltaY > 10))) {
                        return ;
                    }
                }
            }
            const containerNode = this.eventContainer;
            let triggerContentType = undefined;
            _event.composedPath().forEach(node => {
                (triggerContentType === undefined) && node.hasAttribute("season-topic-content-type") && (triggerContentType = node.getAttribute("season-topic-content-type"));
                let eventTarget = EBlock.GetInstance(node);
                if ((eventTarget && eventTarget.handleDomEvent) || (node === containerNode)) {
                    let eventName = `topic-domevent-${_event.type}`;
                    let eventDetail = {
                        eventName,
                        triggerContentType,
                        eventTarget,
                        originEvent: _event,
                        preventDefault: false,
                        stopPropagation: false
                    };
                    eventTarget && eventTarget.fireEvent(eventName, eventDetail);
                    this.env.fireEvent(this.createDomEvent(_event.type, eventDetail));
                    eventDetail.preventDefault && _event.preventDefault();
                    eventDetail.stopPropagation && _event.stopPropagation();
                    throw null;
                }
            });
        } catch (_err) {
            (_err !== null) && this.env.warn("Exception raised when dispatch dom event", _event, _err);
        }
    }
}
