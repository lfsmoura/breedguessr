import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key') || 'n02085620_199.jpg';
  
  try {
    // Test different R2 URL patterns
    const urls = [
      `https://pub-${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.dev/breeds/${key}`,
      `https://breeds.fe06bd364145422fe5dae82814c1cdb6.r2.cloudflarestorage.com/${key}`,
      `${process.env.R2_CUSTOM_DOMAIN}/${key}`
    ];
    
    const results = [];
    
    for (const url of urls) {
      try {
        const response = await fetch(url);
        results.push({
          url,
          status: response.status,
          accessible: response.ok,
          contentType: response.headers.get('content-type')
        });
      } catch (error) {
        results.push({
          url,
          error: (error as Error)?.message,
          accessible: false
        });
      }
    }
    
    return NextResponse.json({
      testKey: key,
      results,
      envVars: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        customDomain: process.env.R2_CUSTOM_DOMAIN
      }
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 });
  }
}