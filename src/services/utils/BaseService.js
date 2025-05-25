const { StatusCodes } = require('http-status-codes');
const AppError = require('../../errors/AppError');

class BaseService {
    constructor(model) {
        this.model = model;
        this.uniqueFields = Object.entries(model.schema.paths)
            .filter(([_, path]) => path.options && path.options.unique)
            .map(([name]) => name);
    }

    async create(data) {
        await this.checkUnique(data);
        return this.model.create(data);
    }

    async findAll(filter = {}) {
        return this.model.find(filter).lean();
    }

    async findOne(filter) {
        const doc = await this.model.findOne(filter).lean();
        if (!doc) {
            throw new AppError(
                `${this.model.modelName} not found`,
                StatusCodes.NOT_FOUND
            );
        }
        return doc;
    }

    async updateOne(filter, data) {
        await this.checkUnique(data, filter._id);
        const updated = await this.model
            .findOneAndUpdate(filter, data, { new: true, runValidators: true })
            .lean();
        if (!updated) {
            throw new AppError(
                `${this.model.modelName} not found`,
                StatusCodes.NOT_FOUND
            );
        }
        return updated;
    }

    async deleteOne(filter) {
        const deleted = await this.model.findOneAndDelete(filter).lean();
        if (!deleted) {
            throw new AppError(
                `${this.model.modelName} not found`,
                StatusCodes.NOT_FOUND
            );
        }
    }

    async checkUnique(data, excludeId = null) {
        for (const field of this.uniqueFields) {
            if (data[field] != null) {
                const query = { [field]: data[field] };
                if (excludeId) {
                    query._id = { $ne: excludeId };
                }
                const exists = await this.model.exists(query);
                if (exists) {
                    throw new AppError(
                        `${this.model.modelName} with this ${field} already exists`,
                        StatusCodes.CONFLICT
                    );
                }
            }
        }
    }
}

module.exports = BaseService;
