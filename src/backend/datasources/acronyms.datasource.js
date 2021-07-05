const { UserInputError } = require('apollo-server-express');
const _ = require('lodash');
const RootDataSource = require('./root.datasource');

class AcronymsDataSource extends RootDataSource {
  async getAcronyms({ from, limit, search }) {
    const query = {
      where: {
        OR: [
          { acronym: { contains: search, mode: 'insensitive' } },
          { meaning: { contains: search, mode: 'insensitive' } },
        ],
      },
    };
    const count = await this.context.prisma.acronym.count(query);
    const take = parseInt((limit > 0 ? limit : 10, 10), 10);
    const skip = parseInt((from <= 1 ? 0 : (limit * (from - 1))), 10);
    const acronyms = await this.context.prisma.acronym.findMany({ ...query, skip, take });
    const pageCount = count < take ? count : take;
    const description = `showing ${skip + 1} to ${pageCount}  of ${count}`;
    return { data: acronyms, description };
  }

  async getAcronym({ acronym }) {
    const data = await this.context.prisma.acronym.findFirst({ where: { acronym } });
    if (!data) throw new UserInputError('Invalid acronym');
    return data;
  }

  async getAcronymsByCount({ count }) {
    if (count < 1) throw new UserInputError('Invalid count specified');
    const acronyms = await this.context.prisma.acronym.findMany({ take: count });
    return _.shuffle(acronyms);
  }

  async createAcronym({ ...rest }) {
    const acronym = await this.context.prisma.acronym.findFirst({ where: { acronym: rest.acronym } });
    if (acronym) throw new UserInputError('Acronym already exist');
    return this.context.prisma.acronym.create({
      data: {
        ...rest,
      },
    });
  }

  async updateAcronym({ id, meaning }) {
    const acronym = await this.context.prisma.acronym.findUnique({ where: { id } });
    if (!acronym) throw new UserInputError('Invalid ID provided');
    return this.context.prisma.acronym.update({
      where: { id },
      data: { meaning },
    });
  }
}

module.exports = AcronymsDataSource;
