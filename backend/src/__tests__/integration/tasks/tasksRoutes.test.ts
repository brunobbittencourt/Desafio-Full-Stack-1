import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import {
  mockedUser,
  mockedAdmin,
  mockedAdminLogin,
  mockedTask,
  mockedOngLogin,
  mockedCreateProject,
  mockedOng,
} from "../../mocks";

describe("/tasks", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    await request(app).post("/users").send(mockedUser);
    await request(app).post("/users").send(mockedAdmin);
    await request(app).post("/ong").send(mockedOng);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /tasks/projects/:id - Must be able to create tasks", async () => {
    const adminUserResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const ongLoginResponse = await request(app)
      .post("/login")
      .send(mockedOngLogin);

    const projectCreated = await request(app)
      .post("/projects")
      .set("Authorization", `Bearer ${ongLoginResponse.body.token}`)
      .send(mockedCreateProject);

    const response = await request(app)
      .post(`/tasks/projects/${projectCreated.body.id}`)
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`)
      .send(mockedTask);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("status");
    expect(response.status).toEqual(201);
  });

  test("POST /tasks - Not logged in users must not be able to create tasks", async () => {
    const response = await request(app)
      .post("/tasks/projects/562198de-0687-44bd-9e1a-9a2516e5688d")
      .send(mockedTask);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toEqual(401);
  });

  test("POST /tasks - Not admin users must not be able to create tasks", async () => {
    const userResponse = await request(app).post("/login").send(mockedUser);

    const response = await request(app)
      .post("/tasks/projects/test")
      .set("Authorization", `Bearer ${userResponse.body.token}`)
      .send(mockedTask);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toEqual(403);
  });

  test("GET /tasks/projects/:id - Must be able to list tasks", async () => {
    const adminUserResponse = await request(app)
      .post("/login")
      .send(mockedAdmin);

    const ongLoginResponse = await request(app)
      .post("/login")
      .send(mockedOngLogin);

    const projectCreated = await request(app)
      .post("/projects")
      .set("Authorization", `Bearer ${ongLoginResponse.body.token}`)
      .send({
        title: "Todos contra o tempo",
        description: "fazendinha12345",
        projectsPicture:
          "https://s2.glbimg.com/PkAJ2BkF_dFex7M9JqMhJB8zUz4=/0x0:1920x1080/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2020/B/8/GLxRVASxmeYcMAtKACTw/nc-fazenda-itu-061220.jpg",
        status: "pending",
      });

    const tasks = await request(app)
      .post(`/tasks/projects/${projectCreated.body.id}`)
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`)
      .send({
        title: "Create session 1",
      });

    const response = await request(app)
      .get(`/tasks/projects/${projectCreated.body.id}`)
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("status");
    expect(response.status).toEqual(200);
  });

  test("GET /tasks/projects/:id - Not logged in users must not be able to list tasks", async () => {
    const response = await request(app).get(
      "/tasks/projects/8ad97a46-0f08-4443-b5e6-2edffdc9a628"
    );

    expect(response.body).toHaveProperty("message");
    expect(response.status).toEqual(401);
  });

  test("PATCH /tasks/:id - Must be able to update tasks", async () => {
    const adminUserResponse = await request(app)
      .post("/login")
      .send(mockedAdmin);
    const ongLoginResponse = await request(app)
      .post("/login")
      .send(mockedOngLogin);

    const projectCreated = await request(app)
      .post("/projects")
      .set("Authorization", `Bearer ${ongLoginResponse.body.token}`)
      .send({
        title: "Todos contra o tempo 2",
        description: "fazendinha12345",
        projectsPicture:
          "https://s2.glbimg.com/PkAJ2BkF_dFex7M9JqMhJB8zUz4=/0x0:1920x1080/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2020/B/8/GLxRVASxmeYcMAtKACTw/nc-fazenda-itu-061220.jpg",
        status: "pending",
      });

    const tasksCreated = await request(app)
      .post(`/tasks/projects/${projectCreated.body.id}`)
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`)
      .send({
        title: "Create session 120",
      });

    const tasks = await request(app)
      .get(`/tasks/projects/${projectCreated.body.id}`)
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`);

    const tasksValue = { title: "Test Edit" };

    const response = await request(app)
      .patch(`/tasks/${tasks.body.tasks[0].task.id}`)
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`)
      .send(tasksValue);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("status");
    expect(response.body.title).toEqual(tasksValue.title);
    expect(response.status).toBe(200);
  });

  test("PATCH /tasks/:id - Must not be able to update a non-existing tasks", async () => {
    const tasksValue = { title: "Test Edit" };

    const adminUserResponse = await request(app)
      .post("/login")
      .send(mockedAdmin);

    const response = await request(app)
      .patch("/tasks/1")
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`)
      .send(tasksValue);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("PATCH /tasks/:id - Not admin users must not be able to update tasks", async () => {
    const tasksValue = { title: "Test Edit" };

    const userResponse = await request(app).post("/login").send(mockedUser);

    const response = await request(app)
      .patch(`/tasks/1`)
      .set("Authorization", `Bearer ${userResponse.body.token}`)
      .send(tasksValue);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("PATCH /tasks/:id - Not admin users must not be able to update tasks", async () => {
    const userResponse = await request(app).post("/login").send(mockedUser);

    const response = await request(app)
      .delete(`/tasks/1`)
      .set("Authorization", `Bearer ${userResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("DELETE /tasks/:id - Must be able to delete tasks", async () => {
    const adminUserResponse = await request(app)
      .post("/login")
      .send(mockedAdmin);

    const projects = await request(app)
      .get("/projects")
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`);

    const tasks = await request(app)
      .get(`/tasks/projects/${projects.body[0].id}`)
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`);

    const response = await request(app)
      .delete(`/tasks/${tasks.body.tasks[0].task.id}`)
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`);

    expect(response.status).toBe(204);
  });

  test("DELETE /tasks/:id - Must not be able to delete a non-existing tasks", async () => {
    const adminUserResponse = await request(app)
      .post("/login")
      .send(mockedAdmin);

    const response = await request(app)
      .delete(`/tasks/1`)
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });
});
