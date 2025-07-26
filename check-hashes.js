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
  
  if (missingHashes.length === 0) {
    console.log('yes');
  } else {
    console.log('no');
  }
  
} catch (error) {
  console.log('no');
}