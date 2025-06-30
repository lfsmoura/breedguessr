import { binding } from 'cf-bindings-proxy';

const bucket = binding<R2Bucket>('BREEDS_BUCKET');
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {

  if (!bucket) {
    return new Response("Bucket not found", { status: 500 });
  }

    const { searchParams } = new URL(request.url);
    console.log({searchParams});
    const key = searchParams.get('key') || 'n02085620_199.jpg';
    const object = await bucket.get(`breeds/${key}`);

    if (object === null) {
      return new Response("Object Not Found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);

    return new Response(object.body, {
      headers,
    })
}