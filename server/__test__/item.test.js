const request = require(`supertest`);
const app = require(`../app`);
const { User, Item, Bid } = require(`../models/index`);
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

describe("GET /items", () => {
  it("should return list of items", async () => {
    const response = await request(app)
      .get(`/items`)
      .set(`authorization`, `Bearer ${iniToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("name", expect.any(String));
    expect(response.body).toHaveProperty("description", expect.any(Text));
    expect(response.body).toHaveProperty("imageUrl", expect.any(String));
    expect(response.body).toHaveProperty("price", expect.any(Number));
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
    expect(response.body).toHaveProperty("updatedAt", expect.any(String));
  });
});

describe("GET /items/:id", () => {
  it(`should return items detail using params`, async () => {
    const response = await request(app).get(`/items/1`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("name", expect.any(String));
    expect(response.body).toHaveProperty("description", expect.any(Text));
    expect(response.body).toHaveProperty("imageUrl", expect.any(String));
    expect(response.body).toHaveProperty("price", expect.any(Number));
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
    expect(response.body).toHaveProperty("updatedAt", expect.any(String));
  });

  it(`should return be fail if items is not registered`, async () => {
    const response = await request(app).get(`/items/80000`);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", `Item not found.`);
  });
});

afterAll(async () => {
  await Bid.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await Item.destroy({
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