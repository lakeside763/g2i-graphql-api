const { hash, compare } = require('bcryptjs');
const RootDataSource = require('./root.datasource');

class AccountsDataSource extends RootDataSource {
  async createUser({ email, ...rest }) {
    const password = await hash(rest.password, 10);
    return this.context.prisma.user.create({
      data: {
        email,
        password,
      },
    });
  }

  async getLogin({ email, password }) {
    const user = await this.context.prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'Invalid credentials' };
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) return { message: 'Invalid password' };
    return { message: 'Data retrieved successfully', user };
  }
}

module.exports = AccountsDataSource;
