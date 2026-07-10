import { PrismaClient, Role, LoanStatus, BookCondition } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  // 1. Create Categories
  const catTechnology = await prisma.category.create({
    data: { name: "Technology", description: "Computer science, programming, software engineering" },
  });
  const catScience = await prisma.category.create({
    data: { name: "Science", description: "Physics, biology, chemistry" },
  });
  const catLiterature = await prisma.category.create({
    data: { name: "Literature", description: "Fiction, classics, poetry" },
  });
  const catSelfImprovement = await prisma.category.create({
    data: { name: "Self Improvement", description: "Productivity, habits, psychology" },
  });
  const catHistory = await prisma.category.create({
    data: { name: "History", description: "World history, biographies" },
  });

  // 2. Create Admin and Librarians
  await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@libraflow.dev",
      password,
      role: Role.ADMIN,
      nis: "ADMIN001",
      phone: "081234567890",
    },
  });

  for (let i = 1; i <= 5; i++) {
    await prisma.user.create({
      data: {
        name: `Librarian ${i}`,
        email: `librarian${i}@libraflow.dev`,
        password,
        role: Role.ADMIN,
        nis: `LIB00${i}`,
        phone: `0812000000${i}`,
      },
    });
  }

  // 3. Create Members
  const members = [];
  for (let i = 1; i <= 20; i++) {
    const member = await prisma.user.create({
      data: {
        name: `Member Student ${i}`,
        email: `member${i}@libraflow.dev`,
        password,
        role: Role.MEMBER,
        nis: `202610${i.toString().padStart(2, "0")}`,
        phone: `0857000000${i}`,
        class: i % 2 === 0 ? "XII IPA 1" : "X IPS 2",
      },
    });
    members.push(member);
  }

  // 4. Create Books
  const booksData = [
    { title: "Clean Code", author: "Robert C. Martin", categoryId: catTechnology.id, stock: 5 },
    { title: "The Pragmatic Programmer", author: "Andrew Hunt", categoryId: catTechnology.id, stock: 3 },
    { title: "Design Patterns", author: "Erich Gamma", categoryId: catTechnology.id, stock: 2 },
    { title: "Refactoring", author: "Martin Fowler", categoryId: catTechnology.id, stock: 4 },
    { title: "Introduction to Algorithms", author: "Thomas H. Cormen", categoryId: catTechnology.id, stock: 0 },
    { title: "Sapiens", author: "Yuval Noah Harari", categoryId: catHistory.id, stock: 7 },
    { title: "A Brief History of Time", author: "Stephen Hawking", categoryId: catScience.id, stock: 4 },
    { title: "Atomic Habits", author: "James Clear", categoryId: catSelfImprovement.id, stock: 10 },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", categoryId: catSelfImprovement.id, stock: 6 },
    { title: "To Kill a Mockingbird", author: "Harper Lee", categoryId: catLiterature.id, stock: 8 },
    { title: "1984", author: "George Orwell", categoryId: catLiterature.id, stock: 0 },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", categoryId: catLiterature.id, stock: 5 },
  ];

  const books = [];
  for (let i = 0; i < booksData.length; i++) {
    const b = await prisma.book.create({
      data: {
        ...booksData[i],
        publisher: "TechPress",
        year: 2020 - (i % 5),
        isbn: `978-0-${i}00-00000-${i}`,
      },
    });
    books.push(b);
  }

  // 5. Create Loans (Active, Returned, Overdue)
  const now = new Date();
  const pastDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
  const overdueDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago (was due then)

  // Active Loans
  for (let i = 0; i < 5; i++) {
    await prisma.loan.create({
      data: {
        userId: members[i].id,
        bookId: books[i].id,
        status: LoanStatus.APPROVED,
        loanDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),  // 5 days from now
      },
    });
  }

  // Overdue Loans
  for (let i = 5; i < 10; i++) {
    await prisma.loan.create({
      data: {
        userId: members[i].id,
        bookId: books[i].id,
        status: LoanStatus.APPROVED,
        loanDate: pastDate,
        dueDate: overdueDate,
      },
    });
  }

  // Returned Loans
  for (let i = 10; i < 15; i++) {
    await prisma.loan.create({
      data: {
        userId: members[i].id,
        bookId: books[i].id,
        status: LoanStatus.RETURNED,
        loanDate: new Date(pastDate.getTime() - 5 * 24 * 60 * 60 * 1000),
        dueDate: pastDate,
        returnDate: new Date(pastDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        bookCondition: BookCondition.GOOD,
      },
    });
  }

  console.log("Database has been seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
