
declare class Images {

}

declare class UiCollection {
    size(): number;
    forEach(callBack: Function ): void;
}

declare class UiSelectore{
    findOne(): any;
    /**
     * 是否存在
     */
    exists(): boolean;
    find(): UiCollection;
    exists(): boolean;
} 

declare function  descMatches(reg: string | RegExp): UiSelectore;
/**
 * 
 * @param suffix 后缀 
 */
declare function descEndsWith(suffix: string): UiSelectore;
declare function sleep(time: number): any;

declare function toast(msg: string): any;


declare function click(x: number, y: number): void;

declare function requestScreenCapture(): any;


declare function exit(): void;

declare function auto(msg?: string): any;



declare function captureScreen(): Images;


declare function launchApp(appName: string): void;


declare function textEndsWith(msg: string): any;

declare function back(): boolean;


/**
 * 设置脚本坐标点击所适合的屏幕宽高。如果脚本运行时，屏幕宽度不一致会自动放缩坐标。
 * @param width  屏幕宽度，单位像素 
 * @param height 屏幕高度，单位像素 
 */
declare function setScreenMetrics(width: number, height: number): void;

declare function desc(content: string): UiSelectore;

declare function swipe(startX: number, startY: number, endX: number, endY: number, duration?: number): any;


declare module device {
    export const width: number;
    export const height: number;
    export function isScreenOn(): boolean;
    export function wakeUp(): boolean;
}


declare module events {
    export function emitter(): void
    export function observeKey(): void;
    export function onKeyDown(keyName: string, listener: Function): void;
    export function onKeyUp(keyName: string, listener:Function): void;
    export function onceKeyDown(keyName: string, listener:Function): void
    export function onceKeyUp(keyName:string, listener: Function): void;
    export function removeAllKeyDownListeners(keyName: string): void;
    export function removeAllKeyUpListeners(keyName: string): void;
    export function setKeyInterceptionEnabled(keys: string[],enabled: boolean): void;
    export function observeTouch(): void;
    export function setTouchEventTimeout(timeout: number): void;
    export function getTouchEventTimeout(): number;
    export function onTouch(listener: Function): void;
    export function removeAllTouchListeners(): void;
}

declare module images {
    export function findMultiColors(img, firstColor: number| string, colors: any[], optionsL?: {})
}




