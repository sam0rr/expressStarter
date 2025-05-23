const { StatusCodes } = require('http-status-codes');
const AppError = require('../errors/AppError');

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

    async findById(id) {
        const doc = await this.model.findById(id).lean();
        if (!doc) {
            throw new AppError(
                `${this.model.modelName} not found`,
                StatusCodes.NOT_FOUND
            );
        }
        return doc;
    }

    async updateById(id, data) {
        await this.checkUnique(data);

        const updated = await this.model
            .findByIdAndUpdate(id, data, { new: true, runValidators: true })
            .lean();
        if (!updated) {
            throw new AppError(
                `${this.model.modelName} not found`,
                StatusCodes.NOT_FOUND
            );
        }
        return updated;
    }

    async deleteById(id) {
        const deleted = await this.model.findByIdAndDelete(id).lean();
        if (!deleted) {
            throw new AppError(
                `${this.model.modelName} not found`,
                StatusCodes.NOT_FOUND
            );
        }
    }

    async checkUnique(data) {
        for (const field of this.uniqueFields) {
            if (data[field] != null) {
                const exists = await this.model.exists({[field]: data[field]});
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
