export function getR2ImageUrl(key: string, bucketName: string = 'breeds') {
  // Option 1: Use custom domain (recommended for production)
  if (process.env.R2_CUSTOM_DOMAIN) {
    return `${process.env.R2_CUSTOM_DOMAIN}/${key}`;
  }
  
  // Option 2: Use R2.dev public URL (requires public bucket)
  if (process.env.CLOUDFLARE_ACCOUNT_ID) {
    return `https://pub-${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.dev/${bucketName}/${key}`;
  }
  
  // Option 3: Fallback to direct bucket URL (less secure)
  return `https://${bucketName}.fe06bd364145422fe5dae82814c1cdb6.r2.cloudflarestorage.com/${key}`;
}