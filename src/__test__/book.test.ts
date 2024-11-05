import request from "supertest";
import express from "express";
import bookRoutes from "../routes/book";
import mongoose from "mongoose";
import Book from "../models/Book";

const app = express();
app.use(express.json());
app.use("/books", bookRoutes);

// Menghubungkan ke database MongoDB sebelum setiap pengujian
beforeAll(async () => {
  const url = "mongodb://localhost:27017/testdb"; 
  await mongoose.connect(url);
});

// Menghapus data dari database setelah setiap pengujian
afterEach(async () => {
  await Book.deleteMany({});
});

// Menutup koneksi database setelah semua pengujian selesai
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Book API", () => {
  const exampleBooks = [
    {
      title: "Legenda dari selatan",
      author: "Zulll",
      year: 2020,
      genre: "Fiksi",
    },
    {
      title: "Alam raya sekolahku",
      author: "John Smith",
      year: 2021,
      genre: "Non-Fiksi",
    },
    {
      title: "Kelinci makan timur",
      author: "Andreas",
      year: 2019,
      genre: "humor",
    },
    {
      title: "Timun mas",
      author: "Cahyo",
      year: 2018,
      genre: "Fiksi",
    },
    {
      title: "Sains untuk Semua",
      author: "Albert Einstein",
      year: 2017,
      genre: "Sains",
    },
  ];

  const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVuZ2dhcmR5YWgiLCJpYXQiOjE3MzA4MDIwMjAsImV4cCI6MTczMDgwNTYyMH0.ThI1Fr5p5aXcvZRMQ1oULboX69QlrpwC7EngCRFjOjs"; 

  test("POST /books - success", async () => {
    const newBook = exampleBooks[0];

    const response = await request(app).post("/books").send(newBook).set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Buku berhasil ditambahkan");
    expect(response.body.book).toHaveProperty("_id");
    expect(response.body.book.title).toBe(newBook.title);
  });

  test("GET /books - success", async () => {
    await Book.insertMany(exampleBooks);

    const response = await request(app).get("/books");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Daftar buku berhasil diambil");
    expect(response.body.books.length).toBe(exampleBooks.length);
  });

  test("GET /books/:id - success", async () => {
    const newBook = new Book(exampleBooks[0]);
    const savedBook = await newBook.save();

    const response = await request(app).get(`/books/${savedBook._id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buku berhasil ditemukan");
    expect(response.body.book.title).toBe(savedBook.title);
  });

  test("PUT /books/:id - success", async () => {
    const newBook = new Book(exampleBooks[0]);
    const savedBook = await newBook.save();

    const updatedBook = {
      title: "Judul Buku Diperbarui",
      author: "Nama Penulis Diperbarui",
      year: 2022,
      genre: "Non-Fiksi",
    };

    const response = await request(app).put(`/books/${savedBook._id}`).send(updatedBook).set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buku berhasil diperbarui");
    expect(response.body.book.title).toBe(updatedBook.title);
  });

  test("DELETE /books/:id - success", async () => {
    const newBook = new Book(exampleBooks[0]);
    const savedBook = await newBook.save();

    const response = await request(app).delete(`/books/${savedBook._id}`).set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buku dihapus");
  });
});
