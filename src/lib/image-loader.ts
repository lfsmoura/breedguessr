import { getR2ImageUrl } from './r2-client';

export interface DogBreedImage {
  dogBreed: string;
  image: string;
}

export function loadImagesFromR2(dataset: DogBreedImage[]): DogBreedImage[] {
  return dataset.map(item => ({
    ...item,
    image: getR2ImageUrl(item.image.replace('Images/', ''))
  }));
}