import fs from 'node:fs';
import crypto from 'node:crypto';
import { exec } from 'node:child_process';

// all folders in data/Images
const folders = fs.readdirSync('data/Images');

// for each folder, get the image files
const output: { dogBreed: string, image: string, hash: string }[] = [];
folders.forEach(folder => {
    const imageFiles = fs.readdirSync(`data/Images/${folder}`);
    const dogBreed = folder.split('-')[1].replaceAll('_', ' ');
    return imageFiles.forEach(file => {
        const filePath = `data/Images/${folder}/${file}`;
        const hash = crypto.createHash('md5').update(filePath).digest('hex');
        output.push({
            dogBreed,
            image: `${file}`,
            hash
        });
    });
});

fs.writeFileSync('src/app/index-dataset.json', JSON.stringify(output, null, 2));

// Upload files to breeds bucket using wrangler (5 at a time)
async function uploadInBatches() {
    const uploadTasks = output.map(({ image, dogBreed, hash }) => {
        const folderName = folders.find(f => f.includes(dogBreed.replaceAll(' ', '_')));
        if (!folderName) return null;
        
        const filePath = `data/Images/${folderName}/${image}`;
        const uploadPath = `${hash}`;
        
        return () => new Promise<void>((resolve) => {
            // Check if file exists at public domain first
            exec(`curl -I -s -o /dev/null -w "%{http_code}" https://images.breedguessr.com/${uploadPath}`, (error, stdout) => {
                const statusCode = stdout.trim();
                if (statusCode === '200') {
                    console.log(`Skipping ${image} - already exists as ${uploadPath}`);
                    resolve();
                    return;
                }
                
                // File doesn't exist, upload it with retry
                const uploadWithRetry = (attempt = 1) => {
                    exec(`pnpm dlx wrangler r2 object put breeds/${uploadPath} --file ${filePath}`, (error) => {
                        if (error && attempt < 4) {
                            console.error(`Error uploading ${image} (attempt ${attempt}/4):`, error);
                            console.log(`Retrying in 1 minute...`);
                            setTimeout(() => uploadWithRetry(attempt + 1), 60000);
                        } else if (error) {
                            console.error(`Failed to upload ${image} after 4 attempts:`, error);
                            resolve();
                        } else {
                            console.log(`Uploaded ${image} to ${uploadPath}`);
                            resolve();
                        }
                    });
                };
                uploadWithRetry();
            });
        });
    }).filter((task): task is () => Promise<void> => task !== null);
    
    for (let i = 1350; i < uploadTasks.length; i += 5) {
        const batch = uploadTasks.slice(i, i + 5);
        await Promise.all(batch.map(task => task()));
        console.log(`Completed batch ${Math.floor(i/5) + 1}/${Math.ceil(uploadTasks.length/5)} - ${i} of ${uploadTasks.length}`);
        // every 100 batches, wait 10 seconds
        if (i % 100 === 0) {
            console.log('Taking a break... Waiting 10 seconds...');
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
}

uploadInBatches();