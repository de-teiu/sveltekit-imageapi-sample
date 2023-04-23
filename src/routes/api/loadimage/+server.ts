import { error } from "@sveltejs/kit";

/**
 * 画像ファイルを読み込んで返す
 * @returns png形式の画像データ
 */
export async function GET({ fetch }) {
  const image = await fetch("/dog.jpg", {
    method: "GET",
    headers: {
      "content-type": "image/jpg"
    }
  }).then(async (response) => {
    if (!response.ok) {
      throw error(500, "Internal Server Error");
    }
    return await response.blob();
  });

  const response = new Response(image);
  response.headers.set("Content-Type", "image/jpg");
  return response;
}
