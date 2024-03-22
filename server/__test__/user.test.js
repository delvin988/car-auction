const request = require(`supertest`);
const app = require(`../app`);
const { User, Item, Bid } = require(`../models/index`);
const { signToken } = require("../helpers/jwt");

let adminToken;
let iniToken;
let aliceToken;

beforeAll(async () => {
   const admin = await User.create({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      password: "pass123",
      role: "admin"
   });

   const ini = await User.create({
      firstName: "Ini",
      lastName: "Siapa",
      email: "ini.siapa@mail.com",
      password: "inisiapa",
      role: "bidder"
   });

   const alice = await User.create({
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.johnson@example.com",
      password: "testpassword",
      role: "bidder"
   });

   await Item.bulkCreate(require(`../data/car.json`));
   await Bid.bulkCreate(require(`../data/bid.json`));

   adminToken = signToken(admin);
   iniToken = signToken(ini);
   aliceToken = signToken(alice);
});

describe("POST /login", () => {
   it("should return access_code using email & password", async () => {
      const userData = {
         email: "ini.siapa@mail.com",
         password: "inisiapa",
      };
      const response = await request(app).post(`/login`).send(userData);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
   });

   it("should be fail if using null email", async () => {
      const userData = {
         password: "inisiapa",
      };
      const response = await request(app).post(`/login`).send(userData);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Email is required");
   });

   it("should be fail if using empty email", async () => {
      const userData = {
         email: "",
         password: "inisiapa",
      };
      const response = await request(app).post(`/login`).send(userData);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Email is required");
   });

   it("should be fail if using empty password", async () => {
      const userData = {
         email: "ini.siapa@mail.com",
      };
      const response = await request(app).post(`/login`).send(userData);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Password is required");
   });

   it("should be fail if using null password", async () => {
      const userData = {
         email: "ini.siapa@mail.com",
         password: "",
      };
      const response = await request(app).post(`/login`).send(userData);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Password is required");
   });

   it("should fail if using unregistered email", async () => {
      const userData = {
         email: "Ini@mail.com", 
         password: "inisiapa"
      };
   
      const response = await request(app).post(`/login`).send(userData);
      
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
         "message",
         "Email or Password is invalid"
      );
   });
   
it("should be fail if using wrong password", async () => {
   const userData = {
      email: "ini.siapa@mail.com",
      password: "321321",
   };
   const response = await request(app).post(`/login`).send(userData);
   expect(response.status).toBe(401);
   expect(response.body).toBeInstanceOf(Object);
   expect(response.body).toHaveProperty(
      "message",
      "Email or Password is invalid"
   );
});
});

describe("POST /register", () => {
   it("should return new user id and email using email and password", async () => {
      const newUserData = {
         email: "test@mail.com",
         password: "inisiapa",
      };
      const response = await request(app).post(`/register`).send(newUserData);

      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("id", expect.any(Number));
      expect(response.body).toHaveProperty("email", expect.any(String));
   });

   it("should be fail if using null email", async () => {
      const newUserData = {
         password: "inisiapa",
      };
      const response = await request(app).post(`/register`).send(newUserData);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Email is required");
   });

   it("should be fail if using empty email", async () => {
      const newUserData = {
         email: "",
         password: "inisiapa",
      };
      const response = await request(app).post(`/register`).send(newUserData);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Email is required");
   });

   it("should be fail if using already registered email", async () => {
      const newUserData = {
         email: "ini.siapa@mail.com",
         password: "inisiapa",
      };
      const response = await request(app).post(`/register`).send(newUserData);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Email already registered");
   });

   it("should be fail if using email with not email format", async () => {
      const newUserData = {
         email: "testStaff1mailcom",
         password: "inisiapa",
      };
      const response = await request(app).post(`/register`).send(newUserData);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Must be in Email format");
   });

   it("should be fail if using null password", async () => {
      const newUserData = {
         email: "test@mail.com",
      };
      const response = await request(app).post(`/register`).send(newUserData);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Password is required");
   });

   it("should be fail if using empty password", async () => {
      const newUserData = {
         email: "test@mail.com",
         password: "",
      };
      const response = await request(app).post(`/register`).send(newUserData);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Password is required");
   });
});

describe("GET /users", () => {
   it("should return user data using only identification from token", async () => {
      const response = await request(app)
         .get(`/users`)
         .set(`authorization`, `Bearer ${iniToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("id", expect.any(Number));
      expect(response.body).toHaveProperty("firstName", expect.any(String));
      expect(response.body).toHaveProperty("lastName", expect.any(String));
      expect(response.body).toHaveProperty("email", expect.any(String));
      expect(response.body).toHaveProperty("password", expect.any(String));
      expect(response.body).toHaveProperty("role", expect.any(String));
      expect(response.body).toHaveProperty("createdAt", expect.any(String));
      expect(response.body).toHaveProperty("updatedAt", expect.any(String));
   });

   it("should be fail if not using token", async () => {
      const response = await request(app)
         .get(`/users`)
         .set(`authorization`, `Bearer `);

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", `Invalid Token`);
   });

   it("should be fail if not using Bearer token", async () => {
      const response = await request(app)
         .get(`/users`)
         .set(`authorization`, `Fisher ${iniToken} `);

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", `Invalid Token`);
   });

   it("should be fail if using unsigned token", async () => {
      const response = await request(app)
         .get(`/users`)
         .set(`authorization`, `Bearer aksdmlkasmdkasmdmasm.asdaksdm.asmd `);

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", `Invalid Token`);
   });
});

describe("PUT /users", () => {
   it("should success using identification from token and email", async () => {
      const userData = {
         email: "ini.siapa@mail.com",
         firstName: "Ini",
         lastName: "Siapa",
      };
      const response = await request(app)
         .put(`/users`)
         .set(`authorization`, `Bearer ${iniToken}`)
         .send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", `Profile updated`);
   });

   it("should be fail if not using token", async () => {
      const userData = {
         email: "ini.siapa@mail.com",
         firstName: "Ini",
         lastName: "Siapa",
      };
      const response = await request(app).put(`/users`).send(userData);

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", `Invalid Token`);
   });

   it("should be fail if not using Bearer token", async () => {
      const userData = {
         email: "ini.siapa@mail.com",
         firstName: "Ini",
         lastName: "Siapa",
      };
      const response = await request(app)
         .put(`/users`)
         .set(`authorization`, `Fisher ${iniToken} `)
         .send(userData);

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", `Invalid Token`);
   });

   it("should be fail if using unsigned token", async () => {
      const userData = {
         email: "ini.siapa@mail.com",
         firstName: "Ini",
         lastName: "Siapa",
      };
      const response = await request(app)
         .put(`/users`)
         .set(`authorization`, `Bearer aksdmlkasmdkasmdmasm.asdaksdm.asmd `);

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", `Invalid Token`);
   });

   it("should be fail if using null email", async () => {
      const userData = {
         email: "",
         firstName: "Ini",
         lastName: "Siapa",
      };
      const response = await request(app)
         .put(`/users`)
         .set(`authorization`, `Bearer ${iniToken}`)
         .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", `Email is required`);
   });

   it("should be fail if using already registered email", async () => {
      const userData = {
         email: "admin@mail.com",
         firstName: "Ini",
         lastName: "Siapa",
      };
      const response = await request(app)
         .put(`/users`)
         .set(`authorization`, `Bearer ${iniToken}`)
         .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", `Email already registered`);
   });

   it("should be fail if not using email format", async () => {
      const userData = {
         email: "blalala@mail.com",
         firstName: "Ini",
         lastName: "Siapa",
      };
      const response = await request(app)
         .put(`/users`)
         .set(`authorization`, `Bearer ${iniToken}`)
         .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", `Must be in Email format`);
   });
});

afterAll(async () => {
   await Order.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
   });

   await Meal.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
   });

   await User.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
   });
});