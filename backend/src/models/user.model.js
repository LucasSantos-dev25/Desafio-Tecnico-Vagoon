import bcrypt from 'bcryptjs';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        user.senha = await bcrypt.hash(user.senha, 10);
      },
    },
  });

  User.prototype.checkPassword = function (senha) {
    return bcrypt.compare(senha, this.senha);
  };

  User.associate = (models) => {
    User.hasMany(models.Activity, { foreignKey: 'userId', as: 'activities' });
  };

  return User;
};