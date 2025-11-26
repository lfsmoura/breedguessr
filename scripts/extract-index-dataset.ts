import fs from 'node:fs';
import crypto from 'node:crypto';
import { exec } from 'node:child_process';

// all folders in data/Images
const folders = fs.readdirSync('data/Images');

// for each folder, get the image files
const output: { dogBreed: string, image: string, hash: string }[] = [];
folders.forEach(folder => {
    const imageFiles = fs.readdirSync(`data/Images/${folder}`);
    const dogBreed = folder.substring(folder.indexOf('-') + 1).replaceAll('_', ' ');
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

async function copyToLocalfolderWithHashName() {
    const copyTasks = output.map(({ image, dogBreed, hash }) => {
        const folderName = folders.find(f => f.includes(dogBreed.replaceAll(' ', '_')));
        if (!folderName) return null;
        
        const filePath = `data/Images/${folderName}/${image}`;
        const uploadPath = `${hash}`;
        
        return () => new Promise<void>((resolve) => {
            // Check if file exists at public domain first
            exec(`cp ${filePath} data/hashes/${uploadPath}`, (error, stdout) => {
                resolve();
            });
        });
    }).filter((task): task is () => Promise<void> => task !== null);
    
    for (let i = 0; i < copyTasks.length; i += 5) {
        const batch = copyTasks.slice(i, i + 5);
        await Promise.all(batch.map(task => task()));
        console.log(`Completed batch ${Math.floor(i/5) + 1}/${Math.ceil(copyTasks.length/5)} - ${i} of ${copyTasks.length}`);
    }
}

copyToLocalfolderWithHashName();