
CREATE TABLE IF NOT EXISTS books (
    id SERIAL,
    title VARCHAR(255),
    author VARCHAR(255),
    bookDescription text,
    bookImage VARCHAR(255)
)