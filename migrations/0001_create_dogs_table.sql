-- Create dogs table
CREATE TABLE IF NOT EXISTS dogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dog_breed TEXT NOT NULL,
  image TEXT NOT NULL,
  hash TEXT NOT NULL UNIQUE
);

-- Create index for faster breed lookups
CREATE INDEX IF NOT EXISTS idx_dogs_breed ON dogs(dog_breed);

-- Create index for hash lookups
CREATE INDEX IF NOT EXISTS idx_dogs_hash ON dogs(hash);
