export interface Book {
    ratings_average?: number;
    id: string;
    title: string;
    author: string;
    description: string;
    coverImage: string;
    price?: number;
    year?: number;
    pages?: number;
    isbn?: string;
    isbn10?: string;
    addAt?: string;
    sebo?: string;
    comments?: string;
    rating?: number;
    publisher?: string;
}

export interface BookCategory {
    id: string;
    name: string;
    books: Book[];
}