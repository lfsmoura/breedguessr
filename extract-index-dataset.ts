import fs from 'node:fs';

// all folders in data/Images
const folders = fs.readdirSync('data/Images');

// for each folder, get the image files
const output = []
const images = folders.map(folder => {
    const imageFiles = fs.readdirSync(`data/Images/${folder}`);
    const dogBreed = folder.split('-')[1].replaceAll('_', ' ');
    return imageFiles.forEach(file => {
        output.push({
            dogBreed,
            image: `Images/${folder}/${file}`
        });
    });
});

fs.writeFileSync('data/index-dataset.json', JSON.stringify(output, null, 2));