import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import {
  mockedAdmin,
  mockedAdminUser,
  mockedOng,
  mockedOngLogin,
  mockedUser,
  mockedCreateProject,
  mockedToBeDeletedProject,
} from "../../mocks";

describe("/projects", () => {
  let connection: DataSource;
  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
    await request(app).post("/ong").send(mockedOng);
    await request(app).post("/users").send(mockedAdmin);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /projects - Must be able to create projects", async () => {
    const ongLoginResponse = await request(app)
      .post("/login")
      .send(mockedOngLogin);
    const response = await request(app)
      .post("/projects")
      .set("Authorization", `Bearer ${ongLoginResponse.body.token}`)
      .send(mockedCreateProject);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("projectsPicture");
    expect(response.body.title);
    expect(response.body.description);
    expect(response.body.status);
    expect(response.body.projectsPicture);
    expect(response.status).toEqual(201);
  });

  test("POST /projects - Not logged in ongs must not be able to create projects", async () => {
    const response = await request(app)
      .post("/projects")
      .send(mockedCreateProject);
    expect(response.body).toHaveProperty("message");
    expect(response.status).toEqual(401);
  });

  test("POST /projects - Not ong users must not be able to create projects", async () => {
    const ongResponse = await request(app).post("/login").send(mockedOng);
    const response = await request(app)
      .post("/projects")
      .set("Authorization", `Bearer ${ongResponse.body.token}`)
      .send(mockedCreateProject);
    expect(response.body).toHaveProperty("message");
    expect(response.status).toEqual(409);
  });

  test("GET /projects - Must be able to list projects", async () => {
    const ongResponse = await request(app).post("/login").send(mockedOng);
    const response = await request(app)
      .get("/projects")
      .set("Authorization", `Bearer ${ongResponse.body.token}`);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("title");
    expect(response.body[0]).toHaveProperty("description");
    expect(response.body[0]).toHaveProperty("status");
    expect(response.body[0]).toHaveProperty("projectsPicture");
    expect(response.status).toEqual(200);
  });

  test("GET /projects - Not logged in users must not be able to list projects", async () => {
    const response = await request(app).get("/projects");
    expect(response.body).toHaveProperty("message");
    expect(response.status).toEqual(401);
  });

  test("PATCH /projects/:id - Must be able to update projects", async () => {
    const adminResponse = await request(app).post("/login").send(mockedAdmin);
    const projects = await request(app)
      .get("/projects")
      .set("Authorization", `Bearer ${adminResponse.body.token}`);
    const projectsId = projects.body[0].id;

    const projectsValue = {
      title: "Test Edit",
      description: "oioi",
      projectsPicture: "google.com",
    };

    const response = await request(app)
      .patch(`/projects/${projectsId}`)
      .set("Authorization", `Bearer ${adminResponse.body.token}`)
      .send(projectsValue);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("projectsPicture");
    expect(response.body.title).toEqual(projectsValue.title);
    expect(response.body.description).toEqual(projectsValue.description);
    expect(response.body.projectsPicture).toEqual(
      projectsValue.projectsPicture
    );
    expect(response.status).toBe(201);
  });

  test("PATCH /projects/:id - Must not be able to update a non-existing projects", async () => {
    const projectsValue = { title: "Test Edit" };
    const adminResponse = await request(app)
      .post("/login")
      .send(mockedAdminUser);
    const response = await request(app)
      .patch("/projects/1")
      .set("Authorization", `Bearer ${adminResponse.body.token}`)
      .send(projectsValue);
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /projects/:id - Not admin users must not be able to update projects", async () => {
    const projectsValue = { title: "Test Edit" };
    const userResponse = await request(app).post("/login").send(mockedUser);
    const response = await request(app)
      .patch(`/projects/1`)
      .set("Authorization", `Bearer ${userResponse.body.token}`)
      .send(projectsValue);
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /projects/:id - Not admin users must not be able to update projects", async () => {
    const userResponse = await request(app).post("/login").send(mockedUser);
    const response = await request(app)
      .delete(`/projects/1`)
      .set("Authorization", `Bearer ${userResponse.body.token}`);
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("DELETE /projects/:id - Must be able to delete projects", async () => {
    const admResponse = await request(app).post("/login").send(mockedAdmin);

    const projectsToBedeleted = await request(app)
      .post("/projects")
      .set("Authorization", `Bearer ${admResponse.body.token}`)
      .send(mockedToBeDeletedProject);

    const projectsId = projectsToBedeleted.body.id;

    const response = await request(app)
      .delete(`/projects/${projectsId}`)
      .set("Authorization", `Bearer ${admResponse.body.token}`);
    const findProjects = await request(app)
      .get(`/projects/${projectsId}`)
      .set("Authorization", `Bearer ${admResponse.body.token}`);

    expect(response.status).toBe(204);
    expect(findProjects.body.deletedAt).not.toBe(null);
  });

  test("DELETE /projects/:id - Must not be able to delete a non-existing projects", async () => {
    const ongResponse = await request(app).post("/login").send(mockedOng);
    const response = await request(app)
      .delete(`/projects/1`)
      .set("Authorization", `Bearer ${ongResponse.body.token}`);
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });
});
