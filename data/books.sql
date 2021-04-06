
CREATE TABLE IF NOT EXISTS books (
    id SERIAL primary key,
    title VARCHAR(255),
    author VARCHAR(255),
    bookDescription text,
    bookImage VARCHAR(255),
    ISBN VARCHAR(255),
    bookshelf VARCHAR(255)
)