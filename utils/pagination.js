export const buildPagination = ({ cursor, limit = 10 }) => {
  const query = {};
  const options = {
    limit: Number(limit),
    sort: { _id: -1 }
  };

  if (cursor) {
    query._id = { $lt: cursor };
  }

  return { query, options };
};