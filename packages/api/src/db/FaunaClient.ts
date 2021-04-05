import faunadb from "faunadb";

export type FaunaRef = {id: number};

export type FaunaDocument<T = Record<string, any>> = {
  ref: FaunaRef;
  ts: number;
  data: T;
};

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

export default client;
