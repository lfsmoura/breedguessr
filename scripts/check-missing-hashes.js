#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the dataset with hashes
const datasetPath = path.join(__dirname, 'src/app/index-dataset.json');
const hashesDir = path.join(__dirname, 'data/hashes');

try {
  // Load the dataset
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  
  // Get all hash files
  const hashFiles = new Set(fs.readdirSync(hashesDir));
  
  // Extract all hashes from dataset
  const datasetHashes = dataset.map(item => item.hash);
  
  // Check if all hashes exist
  const missingHashes = datasetHashes.filter(hash => !hashFiles.has(hash));
  
  console.log(`Total hashes in dataset: ${datasetHashes.length}`);
  console.log(`Total hash files: ${hashFiles.size}`);
  console.log(`Missing hashes: ${missingHashes.length}`);
  
  if (missingHashes.length > 0) {
    console.log('\nFirst few missing hashes:');
    missingHashes.slice(0, 10).forEach((hash, index) => {
      const entry = dataset.find(item => item.hash === hash);
      console.log(`${index + 1}. ${hash} (${entry?.dogBreed} - ${entry?.image})`);
    });
  }
  
} catch (error) {
  console.error('Error:', error.message);
}