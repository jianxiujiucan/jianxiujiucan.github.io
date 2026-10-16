/**
 * A4 出图尺寸换算（纯计算，不依赖 DOM，方便单测）
 */

/** A4 宽 210mm */
export const A4_WIDTH_MM = 210;
/** A4 高 297mm */
export const A4_HEIGHT_MM = 297;
/** A4 高宽比 ≈ 1.4143 */
export const A4_RATIO = A4_HEIGHT_MM / A4_WIDTH_MM;

const MM_PER_INCH = 25.4;

export interface A4LayoutOptions {
  /** 输出分辨率，默认 300dpi（即 2480 × 3508 像素，可直接印刷） */
  dpi?: number;
  /** 四周留白，取值为成品宽度的比例，默认 0.05（约 12.5mm 页边距） */
  marginRatio?: number;
}

export interface A4Layout {
  /** 成品宽（像素） */
  outputWidth: number;
  /** 成品高（像素），严格按 A4 比例 */
  outputHeight: number;
  /** 左右留白（像素） */
  padX: number;
  /** 上下留白（像素） */
  padY: number;
  /** 源内容等比缩放系数 */
  scale: number;
  /** 源内容绘制后的宽（像素） */
  drawWidth: number;
  /** 源内容绘制后的高（像素） */
  drawHeight: number;
  /** 绘制起点 X（居中） */
  offsetX: number;
  /** 绘制起点 Y（居中） */
  offsetY: number;
  /** 源内容宽（像素） */
  sourceWidth: number;
  /** 源内容高（像素） */
  sourceHeight: number;
}

/**
 * 计算“把一块 DOM 内容放进 A4 页面”的完整布局参数。
 * 内容按 contain 方式等比缩放，不拉伸变形；成品比例恒为 A4。
 */
export function computeA4Layout(
  sourceWidth: number,
  sourceHeight: number,
  options: A4LayoutOptions = {},
): A4Layout {
  const dpi = Math.min(Math.max(options.dpi ?? 300, 48), 600);
  const marginRatio = Math.min(Math.max(options.marginRatio ?? 0.05, 0), 0.3);

  const outputWidth = Math.round((A4_WIDTH_MM / MM_PER_INCH) * dpi);
  const outputHeight = Math.round((A4_HEIGHT_MM / MM_PER_INCH) * dpi);

  const padX = Math.round(outputWidth * marginRatio);
  const padY = Math.round(outputHeight * marginRatio);
  const boxWidth = outputWidth - padX * 2;
  const boxHeight = outputHeight - padY * 2;

  const scale = Math.min(boxWidth / sourceWidth, boxHeight / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;

  return {
    outputWidth,
    outputHeight,
    padX,
    padY,
    scale,
    drawWidth,
    drawHeight,
    offsetX: Math.round((outputWidth - drawWidth) / 2),
    offsetY: Math.round((outputHeight - drawHeight) / 2),
    sourceWidth,
    sourceHeight,
  };
}
