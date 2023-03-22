import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import {
  mockedAdmin,
  mockedUser,
  mockedUserLogin,
  mockedAdminLogin,
  mockedOng,
  mockedOngLogin,
  mockedDeletedUser,
  mockedProjectId,
  mockedUserToProjects,
  mockedTask,
} from "../../mocks";

describe("/users", () => {
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
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /users -  Must be able to create a user", async () => {
    const response = await request(app).post("/users").send(mockedUser);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("github");
    expect(response.body).toHaveProperty("linkedin");
    expect(response.body).toHaveProperty("profilePicture");
    expect(response.body).toHaveProperty("isAdm");
    expect(response.body).toHaveProperty("isActive");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body).not.toHaveProperty("password");
    expect(response.body.name).toEqual("bruno");
    expect(response.body.email).toEqual("bruno@mail.com");
    expect(response.body.isAdm).toEqual(false);
    expect(response.body.isActive).toEqual(true);
    expect(response.status).toEqual(201);
  });

  test("POST /users -  should not be able to create a user that already exists", async () => {
    const response = await request(app).post("/users").send(mockedUser);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(409);
  });

  test("GET /users -  Must be able to list users", async () => {
    await request(app).post("/users").send(mockedAdmin);
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveLength(2);
    expect(response.body[0]).not.toHaveProperty("password");
  });

  test("GET /users -  should not be able to list users without authentication", async () => {
    const response = await request(app).get("/users");

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("GET /users -  should not be able to list users not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("DELETE /users/:id -  should not be able to delete user without authentication", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const UserTobeDeleted = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app).delete(
      `/users/${UserTobeDeleted.body[0].id}`
    );

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("DELETE /users/:id -  should not be able to delete user not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const UserTobeDeleted = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .delete(`/users/${UserTobeDeleted.body[0].id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("DELETE /users/:id -  Must be able to soft delete user", async () => {
    const deletedUser = await request(app)
      .post("/users")
      .send(mockedDeletedUser);
    mockedDeletedUser.id = deletedUser.body.id;
    await request(app).post("/users").send(mockedAdmin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const response = await request(app)
      .delete(`/users/${deletedUser.body.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);
    expect(response.status).toBe(204);
  });

  test("DELETE /users/:id -  shouldn't be able to delete user with isActive = false", async () => {
    await request(app).post("/users").send(mockedAdmin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const response = await request(app)
      .delete(`/users/${mockedDeletedUser.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("DELETE /users/:id -  should not be able to delete user with invalid id", async () => {
    await request(app).post("/users").send(mockedAdmin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const response = await request(app)
      .delete(`/users/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("PATCH /users/:id -  should be able to update user", async () => {
    const newValues = { name: "Joana Brito", email: "joanabrito@mail.com" };

    const admingLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const token = `Bearer ${admingLoginResponse.body.token}`;

    const userTobeUpdateRequest = await request(app)
      .get("/users")
      .set("Authorization", token);
    const userTobeUpdateId = userTobeUpdateRequest.body[0].id;

    const response = await request(app)
      .patch(`/users/${userTobeUpdateId}`)
      .set("Authorization", token)
      .send(newValues);

    const userUpdated = await request(app)
      .get("/users")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(userUpdated.body[0].name).toEqual("Joana Brito");
    expect(userUpdated.body[0]).not.toHaveProperty("password");
  });

  test("PATCH /users/:id -  should not be able to update user without authentication", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const userTobeUpdate = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app).patch(
      `/users/${userTobeUpdate.body[0].id}`
    );

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /users/:id - should not be able to update user with invalid id", async () => {
    const newValues = {
      name: "Teste de update",
      email: "testedeupate@mail.com",
    };

    const admingLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const token = `Bearer ${admingLoginResponse.body.token}`;

    const response = await request(app)
      .patch(`/users/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", token)
      .send(newValues);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("PATCH /users/:id - should not be able to update isAdm field value", async () => {
    const newValues = { isAdm: false };

    const admingLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const token = `Bearer ${admingLoginResponse.body.token}`;

    const userTobeUpdateRequest = await request(app)
      .get("/users")
      .set("Authorization", token);
    const userTobeUpdateId = userTobeUpdateRequest.body[0].id;

    const response = await request(app)
      .patch(`/users/${userTobeUpdateId}`)
      .set("Authorization", token)
      .send(newValues);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /users/:id - should not be able to update isActive field value", async () => {
    const newValues = { isActive: false };

    const admingLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const token = `Bearer ${admingLoginResponse.body.token}`;

    const userTobeUpdateRequest = await request(app)
      .get("/users")
      .set("Authorization", token);
    const userTobeUpdateId = userTobeUpdateRequest.body[0].id;

    const response = await request(app)
      .patch(`/users/${userTobeUpdateId}`)
      .set("Authorization", token)
      .send(newValues);
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /users/:id - should not be able to update id field value", async () => {
    const newValues = { id: false };

    const admingLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${admingLoginResponse.body.token}`;

    const userTobeUpdateRequest = await request(app)
      .get("/users")
      .set("Authorization", token);

    const userTobeUpdateId = userTobeUpdateRequest.body[0].id;

    const response = await request(app)
      .patch(`/users/${userTobeUpdateId}`)
      .set("Authorization", token)
      .send(newValues);
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /users/:id - should not be able to update another user without adm permission", async () => {
    const newValues = { isActive: false };

    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUser);

    const admingLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const userToken = `Bearer ${userLoginResponse.body.token}`;

    const adminToken = `Bearer ${admingLoginResponse.body.token}`;

    const userTobeUpdateRequest = await request(app)
      .get("/users")
      .set("Authorization", adminToken);

    const userTobeUpdateId = userTobeUpdateRequest.body[1].id;

    const response = await request(app)
      .patch(`/users/${userTobeUpdateId}`)
      .set("Authorization", userToken)
      .send(newValues);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("POST /users/projects/:id -  Must be able to apply to a project", async () => {
    await request(app).post("/users").send(mockedUser);
    const loginOng = await request(app).post("/login").send(mockedOngLogin);
    const tokenOng = `Bearer ${loginOng.body.token}`;
    const newProject = await request(app)
      .post("/projects")
      .send(mockedUserToProjects)
      .set("Authorization", tokenOng);

    mockedProjectId.id = newProject.body.id;

    const loginUser = await request(app).post("/login").send(mockedUserLogin);

    const tokenUser = `Bearer ${loginUser.body.token}`;

    const response = await request(app)
      .post(`/users/projects/${newProject.body.id}`)
      .set("Authorization", tokenUser);

    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("projectsPicture");
    expect(response.body).toHaveProperty("status");
    expect(response.body.title).toEqual("novo projeto");
    expect(response.body.description).toEqual("projeto front-end");
    expect(response.status).toEqual(201);
  });

  test("POST /users/projects/:id -  should not be able to apply a project without authentication", async () => {
    await request(app).post("/users").send(mockedUser);
    const loginOng = await request(app).post("/login").send(mockedOngLogin);
    const tokenOng = `Bearer ${loginOng.body.token}`;

    const newProject = await request(app)
      .post("/projects")
      .send(mockedUserToProjects)
      .set("Authorization", tokenOng);

    const response = await request(app).post(
      `/users/projects/${newProject.body.id}`
    );

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("DELETE /users/projects/:id -  should not be able to leave a project without authentication", async () => {
    const response = await request(app).delete(
      `/users/projects/${mockedProjectId.id}`
    );

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("POST /users/tasks/id - should be able to apply on task", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const admingLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const projects = await request(app)
      .get("/projects")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    const createdTask = await request(app)
      .post(`/tasks/projects/${projects.body[0].id}`)
      .set("Authorization", `Bearer ${admingLoginResponse.body.token}`)
      .send(mockedTask);

    const response = await request(app)
      .post(`/users/tasks/${createdTask.body.tasks[0].task.id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("user");
  });

  test("POST /users/projects/:id -  should not be able to apply a task without invalid task id", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const response = await request(app)
      .post(`/users/tasks/idtest`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toEqual(404);
  });

  test("POST /users/tasks/:id -  should not be able to apply a task without authentication", async () => {
    const response = await request(app).post(
      `/users/tasks/54ee3e32-5d8f-47ef-a4e6-a6605abaf04d`
    );

    expect(response.body).toHaveProperty("message");
    expect(response.status).toEqual(401);
  });

  test("POST /users/tasks/id - should be able to complete task", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const admingLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const projects = await request(app)
      .get("/projects")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    const tasks = await request(app)
      .get(`/tasks/projects/${projects.body[0].id}`)
      .set("Authorization", `Bearer ${admingLoginResponse.body.token}`);

    const response = await request(app)
      .post(`/users/tasks/${tasks.body.tasks[0].task.id}/concluded`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("user");
    expect(response.body.status).toEqual("concluded");
    expect(response.body).toHaveProperty("user");
    expect(response.status).toEqual(200);
  });

  test("POST /users/tasks/:id -  should not be able to conclud task without authentication", async () => {
    const response = await request(app).post(
      `/users/tasks/54ee3e32-5d8f-47ef-a4e6-a6605abaf04d/concluded`
    );

    expect(response.body).toHaveProperty("message");
    expect(response.status).toEqual(401);
  });

  test("POST /users/projects/:id -  should not be able to apply conclud a taks without invalid task id", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const response = await request(app)
      .post(`/users/tasks/idtest/concluded`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toEqual(404);
  });
});
