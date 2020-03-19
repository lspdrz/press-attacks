import { prisma } from "../../database/generated/client";
import datamodelInfo from "../../database/generated/nexus-prisma";
import { prismaObjectType, makePrismaSchema } from "nexus-prisma";
const path = require("path");

// @ts-ignore
const User = prismaObjectType({
  name: "User",
  definition(t) {
    t.prismaFields(["name", "id", "avatarUrl"]);
  }
});

const Country = prismaObjectType({
  name: "Country",
  description: "Country in which Journalists were Killed",
  definition(t) {
    t.prismaFields([
      "id",
      "name",
      {
        name: "journalistsKilled",
        args: []
      }
    ]);
  }
});

const Query = prismaObjectType({
  name: "Query",
  definition(t) {
    t.prismaFields([
      "*"
      // {
      //   name: "user",
      //   args: ["where"]
      // }
    ]);
    t.field("viewer", {
      type: "User",
      nullable: true,
      resolve: (_, __, ctx) =>
        ctx.viewerId ? ctx.prisma.user({ id: ctx.viewerId }) : null
    });
  }
});

const Mutation = prismaObjectType({
  name: "Mutation",
  definition: t => t.prismaFields(["*"])
});

const outputs = process.env.GENERATE
  ? {
      schema: path.join(__dirname, "../schema.generated.graphql"),
      typegen: path.join(__dirname, "../nexus-schema-types.generated.ts")
    }
  : {
      schema: false,
      typegen: false
    };

const schema = makePrismaSchema({
  types: [Query, User, Country, Mutation],
  prisma: {
    datamodelInfo,
    client: prisma
  },
  outputs,
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, "../../types/graphql.ts"),
        alias: "types"
      }
    ],
    contextType: "types.Context"
  }
});

export default schema;
