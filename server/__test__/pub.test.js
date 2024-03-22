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

describe("GET /items", () => {
  it("should return Items data", async () => {
    const response = await request(app).get(`/items/bid`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("name", expect.any(String));
    expect(response.body[0]).toHaveProperty("description", expect.any(String));
    expect(response.body[0]).toHaveProperty("price", expect.any(Number));
    expect(response.body[0]).toHaveProperty("imageUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("createdAt", expect.any(String));
    expect(response.body[0]).toHaveProperty("updatedAt", expect.any(String));
  });

  it("should be able to return sorted Items data", async () => {
    const response = await request(app).get(`/items?sort=`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("name", expect.any(String));
    expect(response.body[0]).toHaveProperty("description", expect.any(String));
    expect(response.body[0]).toHaveProperty("price", expect.any(Number));
    expect(response.body[0]).toHaveProperty("imageUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("createdAt", expect.any(String));
    expect(response.body[0]).toHaveProperty("updatedAt", expect.any(String));
  });

  it("should be able to return filtered Items data", async () => {
    const response = await request(app).get(
      `/items/?filter[Bid]=1`
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("name", expect.any(String));
    expect(response.body[0]).toHaveProperty("description", expect.any(String));
    expect(response.body[0]).toHaveProperty("price", expect.any(Number));
    expect(response.body[0]).toHaveProperty("imageUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("createdAt", expect.any(String));
    expect(response.body[0]).toHaveProperty("updatedAt", expect.any(String));
  });

  it("should be able to return paginated Items data", async () => {
    const response = await request(app).get(`/items/bid/`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(10);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("name", expect.any(String));
    expect(response.body[0]).toHaveProperty("description", expect.any(String));
    expect(response.body[0]).toHaveProperty("price", expect.any(Number));
    expect(response.body[0]).toHaveProperty("imageUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("createdAt", expect.any(String));
    expect(response.body[0]).toHaveProperty("updatedAt", expect.any(String));
  });

  it("should be able to return searched Items data", async () => {
    const response = await request(app).get(`/items/?sort=asc`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(10);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("name", "Easy 2");
    expect(response.body[0]).toHaveProperty("description", expect.any(String));
    expect(response.body[0]).toHaveProperty("price", expect.any(Number));
    expect(response.body[0]).toHaveProperty("imageUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("createdAt", expect.any(String));
    expect(response.body[0]).toHaveProperty("updatedAt", expect.any(String));
  });
});

describe("GET /items/:id", () => {
  it("should return a Item searched by Id", async () => {
    const response = await request(app).get(`/items/2`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("name", expect.any(String));
    expect(response.body).toHaveProperty("description", expect.any(String));
    expect(response.body).toHaveProperty("price", expect.any(Number));
    expect(response.body).toHaveProperty("imageUrl", expect.any(String));
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
    expect(response.body).toHaveProperty("updatedAt", expect.any(String));
  });

  it("should be fail if Item id is not reqistered yet", async () => {
    const response = await request(app).get(`/items/919`);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Item not found.");
  });
});

describe("GET /items/highest/:id", () => {
  it("should return a Item searched by Id", async () => {
    const response = await request(app).get(`/items/2`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("name", expect.any(String));
    expect(response.body).toHaveProperty("description", expect.any(String));
    expect(response.body).toHaveProperty("price", expect.any(Number));
    expect(response.body).toHaveProperty("imageUrl", expect.any(String));
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
    expect(response.body).toHaveProperty("updatedAt", expect.any(String));
  });

  it("should be fail if Item id is not reqistered yet", async () => {
    const response = await request(app).get(`/items/911`);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "No bids were found for this product.");
  });
});

describe("POST /items/:id/bid", () => {
  it("should return a Item searched by Id", async () => {
    const response = await request(app).get(`/items/bid/2`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("name", expect.any(String));
    expect(response.body).toHaveProperty("description", expect.any(String));
    expect(response.body).toHaveProperty("price", expect.any(Number));
    expect(response.body).toHaveProperty("imageUrl", expect.any(String));
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
    expect(response.body).toHaveProperty("updatedAt", expect.any(String));
  });

  it("should be fail if Item id is not reqistered yet", async () => {
    const response = await request(app).get(`/items/991/bid`);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "No offers were found for this user.");
  });
});

describe("GET /items/bid/:id", () => {
  it("should return a Item searched by Id", async () => {
    const response = await request(app).get(`/items/bid/2`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("name", expect.any(String));
    expect(response.body).toHaveProperty("description", expect.any(String));
    expect(response.body).toHaveProperty("price", expect.any(Number));
    expect(response.body).toHaveProperty("imageUrl", expect.any(String));
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
    expect(response.body).toHaveProperty("updatedAt", expect.any(String));
  });

  it("should be fail if Item id is not reqistered yet", async () => {
    const response = await request(app).get(`/items/bid/999`);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "No offers were found for this user.");
  });
});

afterAll(async () => {
  await Item.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await Bid.destroy({
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