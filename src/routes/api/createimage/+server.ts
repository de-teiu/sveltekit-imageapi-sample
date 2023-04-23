import { error } from "@sveltejs/kit";
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { arrayBufferToBuffer } from "arraybuffer-to-buffer";

/**
 * 画像ファイルを作成して返す
 * @returns png形式の画像データ
 */
export async function GET({ fetch, url }) {
  if (!GlobalFonts.has("Noto")) {
    const font = await fetch("/NotoSansJP-Regular.ttf", {}).then(async (response: Response) => {
      if (!response.ok) {
        throw error(500, "Internal Server Error");
      }
      return await response.arrayBuffer();
    });
    GlobalFonts.register(arrayBufferToBuffer(font), "Noto");
  }
  const searchParams = url.searchParams;
  const text = searchParams.has("text") ? searchParams.get("text") : "";

  const canvas = createCanvas(600, 315);
  const context = canvas.getContext("2d");

  const background = await loadImage(url.origin + "/dog.jpg");
  context.drawImage(background, 0, 0);

  context.font = "30px Noto";
  context.fillText(text, 30, 100);
  const image = canvas.toBuffer("image/png");

  const response = new Response(image);
  response.headers.set("Content-Type", "image/png");
  return response;
}
