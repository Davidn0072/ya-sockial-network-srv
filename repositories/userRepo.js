import User from '../models/userModel.js';

// Get All
const getAllUsers = (queries) => {
    return User.find(queries).lean();
};

const getUsersPage = ({ query, options }) => {
    return User.find(query)
        .sort(options.sort)
        .limit(options.limit).lean();
};

// Get By ID
const getUserById = (id) => {
    return User.findById(id).lean();
};

// Create
const addUser = (obj) => {
    return User.create(obj);
};

// Update
const updateUser = (id, obj) => {
    return User.findByIdAndUpdate(id, obj, { returnDocument: 'after' });
};

// Delete
const deleteUser = (id) => {
    return User.findByIdAndDelete(id);
};

const getUserByEmailAndPassword = (email) => {
    return User.findOne({ email: email })
        .select('+password').lean();
};

const getUserByIdAndPassword = (id) => {
    return User.findById(id)
        .select('+password').lean();
};

const isNameExists = (name) => {
    return User.findOne({ name: name }).lean();
};
const isEmailExists = (email) => {
    return User.findOne({ email: email }).lean();
};

const findOneByField = (field) => {
    const fieldName = Object.keys(field)[0];
    const value = field[fieldName];

    return User.findOne({
        [fieldName]: {
            $regex: `^${value}$`,
            $options: "i"
        }
    }).lean();
};

const searchUsersByName = async (search, genQuery, options) => {
    const escapeRegex = (str) =>
        str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
    return User.find(finalQuery)
        .sort(options.sort)
        .limit(options.limit).lean();
};

const getUserDomainOfInterest = (userId) => {
    return User.findById(userId).select('domainofinterest -_id').lean();
}

export {
    getAllUsers, getUsersPage, getUserById, addUser, updateUser, deleteUser, getUserByEmailAndPassword, getUserByIdAndPassword, isNameExists, isEmailExists, findOneByField, searchUsersByName, getUserDomainOfInterest
};
