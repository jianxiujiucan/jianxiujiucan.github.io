import { toCanvas } from "html-to-image";

export interface A4ImageOptions {
  /** 页面背景色，默认纯白 */
  backgroundColor?: string;
  /** 渲染倍率，默认 2 倍 */
  pixelRatio?: number;
}

export interface A4ImageResult {
  /** 按源节点边界渲染完成的 canvas */
  canvas: HTMLCanvasElement;
  /** 图片二进制数据（默认 PNG） */
  blob: Blob;
  /** 可直接用于 <img src> 或下载的临时地址，用完记得 revoke */
  objectUrl: string;
  /** 成品宽度（像素） */
  width: number;
  /** 成品高度（像素） */
  height: number;
}

function canvasToBlob(canvas: HTMLCanvasElement, type = "image/png"): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("图片导出失败"))),
      type,
    );
  });
}

/**
 * 严格按 DOM 节点的实际边界生成图片，不添加 A4 画布或额外页边距。
 * 默认输出尺寸为源节点的 2 倍。
 */
export async function exportElementToA4Image(
  el: HTMLElement,
  options: A4ImageOptions = {},
): Promise<A4ImageResult> {
  if (!el) {
    throw new Error("没有找到需要生成图片的内容节点");
  }

  const backgroundColor = options.backgroundColor ?? "#ffffff";
  const pixelRatio = options.pixelRatio ?? 2;

  // 只取 .page 的实际边框盒尺寸，不使用 scrollHeight，避免超出节点边界。
  const sourceWidth = el.offsetWidth || el.clientWidth;
  const sourceHeight = el.offsetHeight || el.clientHeight;
  if (!sourceWidth || !sourceHeight) {
    throw new Error("内容节点尺寸为 0，无法生成图片");
  }

  const canvas = await toCanvas(el, {
    width: sourceWidth,
    height: sourceHeight,
    // 克隆节点会被内联"已用样式"（max-width、auto 边距的具体像素值等），
    // 必须显式抵消，否则内容会被挤压缩进或整体右移，右侧被裁掉：
    // - border-box：让传入的 width/height 与 offsetWidth/offsetHeight 同义
    // - max-width: none：避免原始的 max-width 在 border-box 下二次收紧
    // - margin: 0：避免 auto 居中边距的具体像素值把内容推出画布
    style: { boxSizing: "border-box", maxWidth: "none", margin: "0" },
    pixelRatio,
    backgroundColor,
    // 页面只用系统字体，跳过字体抓取，更快也更稳定
    skipFonts: true,
  });

  const blob = await canvasToBlob(canvas);

  return {
    canvas,
    blob,
    objectUrl: URL.createObjectURL(blob),
    width: canvas.width,
    height: canvas.height,
  };
}
