const buildPagination = ({ cursor, limit = 10, sortMerge = null }) => {
  const query = {};
  const options = {
    limit: Number(limit) + 1 || 11, // overfetch by one to detect hasMore
    sort: sortMerge ? { ...{ _id: -1 }, ...sortMerge } : { _id: -1 }
  };

  if (cursor) {
    query._id = { $lt: cursor };
  }

  return { query, options };
};

const buildCursorResponse = (obj, limit = 10, hasMore = false, idField = '_id') => {
  const key = Object.keys(obj)[0];
  const items = obj[key];
  let lastItem = null;

  if (items.length > limit) {
    hasMore = true;
    items.pop(); // del last extra record
  }
  if (hasMore) {
    lastItem = items[items.length - 1]
  }

  return {
    [key]: items,
    nextCursor: lastItem ? lastItem[idField] : null
  };
};

export { buildPagination, buildCursorResponse };