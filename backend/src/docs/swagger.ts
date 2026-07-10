import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "LibraFlow API",
    description: "API Documentation for LibraFlow Library Management System",
    version: "1.0.0",
  },
  basePath: "/api",
  servers: [
    {
      url: "http://localhost:3555/api",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      // Auth
      LoginRequest: {
        $nis: "12345678",
        $password: "password123",
      },
      LoginResponse: {
        $token: "eyJhbG...",
        $user: {
          $id: 1,
          $name: "Ahmad",
          $email: "ahmad@example.com",
          $role: "MEMBER",
        },
      },
      ProfileResponse: {
        $id: 1,
        $name: "Ahmad",
        $email: "ahmad@example.com",
        $nis: "12345678",
        $phone: "08123456789",
        $role: "MEMBER",
        $class: "XII IPA 1",
        $createdAt: "2024-01-01T00:00:00Z",
        $updatedAt: "2024-01-01T00:00:00Z",
      },

      // Category
      Category: {
        $id: 1,
        $name: "Fiksi",
        $createdAt: "2024-01-01T00:00:00Z",
        $updatedAt: "2024-01-01T00:00:00Z",
      },
      CreateCategoryRequest: {
        $name: "Fiksi",
      },
      UpdateCategoryRequest: {
        $name: "Fiksi Modern",
      },

      // Book
      Book: {
        $id: 1,
        $title: "Laskar Pelangi",
        $author: "Andrea Hirata",
        $publisher: "Bentang Pustaka",
        $publishedYear: 2005,
        $isbn: "978-979-3062-79-2",
        $stock: 10,
        $categoryId: 1,
        coverImage: null,
        $category: {
          $name: "Fiksi",
        },
        $createdAt: "2024-01-01T00:00:00Z",
        $updatedAt: "2024-01-01T00:00:00Z",
      },
      CreateBookRequest: {
        $title: "Laskar Pelangi",
        $author: "Andrea Hirata",
        $publisher: "Bentang Pustaka",
        $publishedYear: 2005,
        $isbn: "978-979-3062-79-2",
        $stock: 10,
        $categoryId: 1,
      },
      UpdateBookRequest: {
        title: "Laskar Pelangi Baru",
        author: "Andrea Hirata",
        publisher: "Bentang Pustaka",
        publishedYear: 2005,
        isbn: "978-979-3062-79-2",
        stock: 15,
        categoryId: 1,
      },

      // Loan
      Loan: {
        $id: 1,
        $userId: 1,
        $bookId: 1,
        $loanDate: "2024-01-01T00:00:00Z",
        $dueDate: "2024-01-08T00:00:00Z",
        returnDate: null,
        $status: "PENDING",
        $user: {
          $name: "Ahmad",
          $nis: "12345678",
          $class: "XII IPA 1",
        },
        $book: {
          $title: "Laskar Pelangi",
          $author: "Andrea Hirata",
        },
        $createdAt: "2024-01-01T00:00:00Z",
        $updatedAt: "2024-01-01T00:00:00Z",
      },
      CreateLoanRequest: {
        $bookId: 1,
      },
      RejectLoanRequest: {
        $reason: "Buku sedang tidak tersedia",
      },
      ReturnLoanRequest: {
        $condition: "GOOD",
        notes: null,
      },

      // Dashboard
      AdminDashboardStats: {
        $totalBooks: 100,
        $totalCategories: 10,
        $totalMembers: 50,
        $totalPendingLoans: 5,
        $totalActiveLoans: 20,
        $totalOverdueLoans: 2,
        $totalDamagedLoans: 1,
        $totalLostLoans: 0,
        $overdueLoans: [
          {
            $id: 1,
            $dueDate: "2024-01-08T00:00:00Z",
            $user: {
              $name: "Ahmad",
              $nis: "12345678",
            },
            $book: {
              $title: "Laskar Pelangi",
            },
          },
        ],
      },
      MemberDashboardStats: {
        $activeLoans: 2,
        $activeLoansList: [
          {
            $id: 1,
            $dueDate: "2024-01-08T00:00:00Z",
            $book: {
              $title: "Laskar Pelangi",
              $author: "Andrea Hirata",
              $categoryName: "Fiksi",
            },
          },
        ],
        $pendingLoans: 1,
        $returnedLoans: 5,
        $damagedReturns: 0,
        $lostReturns: 0,
        $overdueLoans: [
          {
            $id: 1,
            $dueDate: "2024-01-08T00:00:00Z",
            $book: {
              $title: "Laskar Pelangi",
              coverImage: null,
            },
          },
        ],
      },

      // User
      User: {
        $id: 1,
        $name: "Ahmad",
        email: "ahmad@example.com",
        $nis: "12345678",
        phone: "08123456789",
        $role: "MEMBER",
        class: "XII IPA 1",
        $createdAt: "2024-01-01T00:00:00Z",
        $updatedAt: "2024-01-01T00:00:00Z",
      },
      CreateUserRequest: {
        $name: "Ahmad",
        email: "ahmad@example.com",
        $password: "password123",
        $nis: "12345678",
        phone: "08123456789",
        $role: "MEMBER",
        class: "XII IPA 1",
      },
      UpdateUserRequest: {
        name: "Ahmad",
        email: "ahmad@example.com",
        password: "password123",
        nis: "12345678",
        phone: "08123456789",
        role: "MEMBER",
        class: "XII IPA 1",
      },
      ChangePasswordRequest: {
        $oldPassword: "password123",
        $newPassword: "newpassword123",
        $confirmNewPassword: "newpassword123",
      },
      ResetPasswordResponse: {
        $message: "Password berhasil di-reset",
        $defaultPassword: "12345678",
      },
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
