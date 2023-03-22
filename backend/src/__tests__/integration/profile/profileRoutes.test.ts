import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import { mockedAdmin, mockedOng } from "../../mocks";

describe("/news", () => {
	let connection: DataSource;

	beforeAll(async () => {
		await AppDataSource.initialize()
			.then((res) => {
				connection = res;
			})
			.catch((err) => {
				console.error("Error during Data Source initialization", err);
			});

		await request(app).post("/users").send(mockedAdmin);
		await request(app).post("/ong").send(mockedOng);
	});

	afterAll(async () => {
		await connection.destroy();
	});

	test("GET /profile/user/:id - Must be able to list User profile by id", async () => {
		const adminUserResponse = await request(app)
			.post("/login")
			.send(mockedAdmin);
		const users = await request(app)
			.get("/users")
			.set("Authorization", `Bearer ${adminUserResponse.body.token}`);

		const response = await request(app).get(
			`/profile/user/${users.body[0].id}`
		);

		expect(response.body).toHaveProperty("id");
		expect(response.body).toHaveProperty("name");
		expect(response.body).toHaveProperty("email");
		expect(response.status).toEqual(200);
	});

	test("GET /profile/user/:id - Must not be able to list non-existing users", async () => {
		const response = await request(app).get(`/profile/user/1`);

		expect(response.body).toHaveProperty("message");
		expect(response.status).toEqual(404);
	});

	test("GET /profile/ong/:id - Must be able to list ONG profile by id", async () => {
		const adminUserResponse = await request(app)
			.post("/login")
			.send(mockedAdmin);
		const ongs = await request(app)
			.get("/ong")
			.set("Authorization", `Bearer ${adminUserResponse.body.token}`);

		const response = await request(app).get(
			`/profile/ong/${ongs.body[0].id}`
		);

		expect(response.body).toHaveProperty("id");
		expect(response.body).toHaveProperty("cnpj");
		expect(response.body).toHaveProperty("companyName");
		expect(response.body).toHaveProperty("email");
		expect(response.status).toEqual(200);
	});

	test("GET /profile/ong/:id - Must not be able to list non-existing ongs", async () => {
		const response = await request(app).get(`/profile/ong/1`);

		expect(response.body).toHaveProperty("message");
		expect(response.status).toEqual(404);
	});
});
