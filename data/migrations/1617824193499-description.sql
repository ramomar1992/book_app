insert into author(name) select distinct author from books;
alter table books add COLUMN author_id int;
UPDATE books SET author_id=author.id FROM (SELECT * FROM authors) AS author WHERE books.author = author.name;
alter table books drop COLUMN  author;
alter table books add constraint fk_books_authors foreign key (author_id) REFERENCES authors(id);