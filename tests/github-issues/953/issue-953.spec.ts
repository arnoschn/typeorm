import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
export type Role = "sa" | "user" | "admin" | "server";
import {User} from "./entity/user";

describe("github issues > #953 MySQL 5.7 JSON column parse", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should retrieve record from mysql5.7 using driver mysql2", () => Promise.all(connections.map(async connection => {
        const repo = connection.getRepository(User);
        let newUser = new User();
        newUser.username = "admin";
        newUser.password = "admin";
        newUser.roles = ["admin"];
        newUser.lastLoginAt = new Date();
        let user = repo.create(newUser);
        await repo.save(user);

        let user1 = await repo.findOne({username: "admin"});
        expect(user1).has.property("roles").with.is.an("array").and.contains("admin"); // TODO: Bakhrom
    })));

});