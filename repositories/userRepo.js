import User from '../models/userModel.js';

// Get All
const getAllUsers = (queries) => {
    //console.log("getAllUsers: queries:", JSON.stringify(queries, null, 2));
    //console.log("getAllUsers: User.find(queries):", JSON.stringify(User.find(queries), null, 2));
    return User.find(queries);
};

const getUsersPage = ({ query, options }) => {
    //console.log("getUsersPage: query:", JSON.stringify(query, null, 2));
    console.log("getUsersPage: options:", JSON.stringify(options, null, 2));
    return User.find(query)
        .sort(options.sort)
        .skip(options.skip || 0)
        .limit(options.limit);
};

// Get By ID
const getUserById = (id) => {
    return User.findById(id);
};

// Create
const addUser = (obj) => {
    return User.create(obj);
};

// Update
const updateUser = (id, obj) => {
    return User.findByIdAndUpdate(id, obj);
};

// Delete
const deleteUser = (id) => {
    return User.findByIdAndDelete(id);
};

const getUserByEmailAndPassword = (email, password) => {
    return User.findOne({ email: email, password: password })
};

const isNameExists = (name) => {
    return User.findOne({ name: name });
};
const isEmailExists = (email) => {
    return User.findOne({ email: email });
};

const findOneByField = (field) => {
    const fieldName = Object.keys(field)[0];
    const value = field[fieldName];

    //console.log("fieldName:", fieldName, "value:", value);

    return User.findOne({
        [fieldName]: {
            $regex: `^${value}$`,
            $options: "i"
        }
    });
};

const searchUsersByName = async (search, genQuery, options) => {
    const escapeRegex = (str) =>
        str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    /*
        console.log('searchUsersByName-Repo: search:', JSON.stringify(search, null, 2));
        console.log('searchUsersByName-Repo: genQuery:', JSON.stringify(genQuery, null, 2));
        console.log('searchUsersByName-Repo: options:', JSON.stringify(options, null, 2));
    */
    const safeSearch = search?.trim();

    const query = safeSearch
        ? {
            name: {
                $regex: `^${escapeRegex(safeSearch)}`,
                $options: 'i',
            },
        }
        : {};


    const finalQuery = { ...genQuery, ...query };
    /*    
        console.log('searchUsersByName-Repo: safeSearch:', JSON.stringify(safeSearch, null, 2));
        console.log('searchUsersByName-Repo: query:', JSON.stringify(query, null, 2));
        console.log('searchUsersByName-Repo: finalQuery:', JSON.stringify(finalQuery, null, 2));
    */
    return User.find(finalQuery)
        .select('_id username name')
        .sort(options.sort)
        .skip(options.skip || 0)
        .limit(options.limit);
};

export { getAllUsers, getUsersPage, getUserById, addUser, updateUser, deleteUser, getUserByEmailAndPassword, isNameExists, isEmailExists, findOneByField, searchUsersByName };
