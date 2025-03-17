import faunadb from "faunadb";

const secret = process.env.FAUNADB_SECRET;

if (!secret) {
  throw new Error("FAUNADB_SECRET is missing");
}

const serverClient = new faunadb.Client({
  secret,
});

const q = faunadb.query;

export const getVisitCount = async () => {
  const response = await serverClient.query<number>(
    q.Count(q.Match(q.Index("all_visits")))
  );
  return response;
};

export const addVisit = async (visit: {
  remoteAddress: string | null;
  userAgent: string | null;
  time: string;
}) => {
  await serverClient.query(
    q.Create(q.Collection("visits"), {
      data: visit,
    })
  );
};
