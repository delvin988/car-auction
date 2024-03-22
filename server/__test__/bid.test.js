const request = require(`supertest`);
const app = require(`../app`);
const { User, Meal, Order } = require(`../models/index`);
const { signToken } = require("../helpers/jwt");

let adminToken;
let iniToken;
let aliceToken;

beforeAll(async () => {
  const admin = await User.create({
   firstname: "Jane",
   lastname: "Smith",
   email: "jane.smith@example.com",
   password: "pass123",
   role: "admin"
 });

  const ini = await User.create({
   firstname: "Ini",
   lastname: "Siapa",
   email: "ini.siapa@mail.com",
   password: "inisiapa",
   role: "bidder"
 });

  const alice = await User.create({
   firstname: "Alice",
   lastname: "Johnson",
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

describe("POST /bids/:ItemId", () => {
  it("should return new bids using params and authentication", async () => {
    const response = await request(app)
      .post(`/bids/1`)
      .set(`authorization`, `Bearer ${iniToken}`);

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("amount", expect.any(Number));
    expect(response.body).toHaveProperty("UserId", expect.any(Number));
    expect(response.body).toHaveProperty("ItemId", expect.any(Number));
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
    expect(response.body).toHaveProperty("updatedAt", expect.any(String));
  });

  it("should fail without authentication", async () => {
    const response = await request(app).post(`/bids`);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", `Invalid Token`);
  });

  it("should fail if the meal is not registered", async () => {
    const response = await request(app)
      .post(`/bids/100000`)
      .set(`authorization`, `Bearer ${iniToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", `Data not Found`);
  });
});

describe("GET /bids", () => {
  it("should return list of current users bids using authentication", async () => {
    const response = await request(app)
      .get(`/bids`)
      .set(`authorization`, `Bearer ${iniToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("orderId", expect.any(String));
    expect(response.body[0]).toHaveProperty("status", expect.any(String));
    expect(response.body[0]).toHaveProperty("UserId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("ItemId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("createdAt", expect.any(String));
    expect(response.body[0]).toHaveProperty("updatedAt", expect.any(String));
  });

  it("should fail without authentication", async () => {
    const response = await request(app).get(`/bids`);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", `Invalid Token`);
  });
});

describe("DELETE /bids/:id", () => {
  it("should return delete bids using authentication", async () => {
    const response = await request(app)
      .delete(`/bids/4`)
      .set(`authorization`, `Bearer ${iniToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", `Order canceled`);
  });

  it("should return delete bids using admin authentication", async () => {
    const response = await request(app)
      .delete(`/bids/5`)
      .set(`authorization`, `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", `Order canceled`);
  });

  it("should fail if try to delete bids from different user", async () => {
    const response = await request(app)
      .delete(`/bids/1`)
      .set(`authorization`, `Bearer ${iniToken}`);
    expect(response.status).toBe(403);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", `Forbidden Access`);
  });

  it("should fail if try to delete unregistered bids", async () => {
    const response = await request(app)
      .delete(`/bids/10000`)
      .set(`authorization`, `Bearer ${iniToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", `Data not Found`);
  });

  it("should fail without authentication", async () => {
    const response = await request(app).delete(`/bids/4`);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", `Invalid Token`);
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