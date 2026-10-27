/**
 * Compress and center-crop a staff photo in the browser before upload.
 *
 * This is the deployable stand-in for ImageMagick's `-resize`/`-crop`/`-quality`
 * pipeline (ImageMagick is a server-side CLI and cannot run in the browser or in
 * the app's Deno functions). Canvas does the same work here: crop to a 4:5
 * portrait around the centre, scale to 800px wide, and encode as JPEG so every
 * team card gets a uniform, lightweight portrait — typically 60-90 KB.
 */
const TARGET_WIDTH = 800;
const ASPECT = 4 / 5; // width / height
const QUALITY = 0.82;

export async function compressPortrait(file) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Could not read that file'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not load that image'));
    image.src = dataUrl;
  });

  const sourceWidth = img.width;
  const sourceHeight = img.height;

  // Widest 4:5 window that fits inside the source, centred.
  let cropWidth = sourceWidth;
  let cropHeight = Math.round(sourceWidth / ASPECT);
  if (cropHeight > sourceHeight) {
    cropHeight = sourceHeight;
    cropWidth = Math.round(sourceHeight * ASPECT);
  }
  const cropX = Math.round((sourceWidth - cropWidth) / 2);
  const cropY = Math.round((sourceHeight - cropHeight) / 2);

  const width = Math.min(TARGET_WIDTH, cropWidth);
  const height = Math.round(width / ASPECT);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', QUALITY)
  );
  if (!blob) throw new Error('Could not compress that image');

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve({ dataUrl: e.target.result, bytes: blob.size });
    reader.onerror = () => reject(new Error('Could not prepare the compressed image'));
    reader.readAsDataURL(blob);
  });
}