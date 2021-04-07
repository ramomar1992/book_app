drop table if EXISTS books;
drop table if EXISTS authors;
CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description TEXT,
  bookshelf VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS AUTHORS (
  id SERIAL PRIMARY KEY, 
  name VARCHAR(255)
);
