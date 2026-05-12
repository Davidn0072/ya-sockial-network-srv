const buildPagination = ({ cursor, limit = 10, sortMerge = null }) => {
  const query = {};
  const options = {
    limit: Number(limit) || 10,
    sort: sortMerge ? { ...{ _id: -1 }, ...sortMerge } : { _id: -1 }
  };

  if (cursor) {
    query._id = { $lt: cursor };
  }

  return { query, options };
};

const buildCursorResponse = (obj, idField = '_id') => {
  const key = Object.keys(obj)[0];
  const items = obj[key];
  const lastItem = items[items.length - 1];

  return {
    [key]: items,
    nextCursor: lastItem ? lastItem[idField] : null
  };
};

export { buildPagination, buildCursorResponse };