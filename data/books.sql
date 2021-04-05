DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id SERIAL,
    title VARCHAR(255),
    author VARCHAR(255),
    bookDescription text,
    bookImage VARCHAR(255)
)