import User from '../models/userModel.js';

// Get All
const getAllUsers = (queries) => {
    return User.find(queries);
};

const getUsersPage = ({ query, options }) => {
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
const updateUser = async (id, obj) => {
    const user = await User.findById(id);
    if (!user) return null;
    Object.assign(user, obj);
    return user.save(); // pre-save hook will hash the password automatically
};

// Delete
const deleteUser = (id) => {
    return User.findByIdAndDelete(id);
};

const getUserByEmailAndPassword = (email) => {
    return User.findOne({ email: email })
        .select('+password');
};

const getUserByIdAndPassword = (id) => {
    return User.findById(id)
        .select('+password');
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
        .select('_id username name')
        .sort(options.sort)
        .skip(options.skip || 0)
        .limit(options.limit);
};

const getUserDomainOfInterest = (userId) => {
    return User.findById(userId).select('domainofinterest -_id').lean();
}

export {
    getAllUsers, getUsersPage, getUserById, addUser, updateUser, deleteUser, getUserByEmailAndPassword, getUserByIdAndPassword, isNameExists, isEmailExists, findOneByField, searchUsersByName, getUserDomainOfInterest
};
