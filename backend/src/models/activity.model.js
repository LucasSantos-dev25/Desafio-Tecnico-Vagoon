export default (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
    },
    data_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    data_fim: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pendente', 'concluida', 'cancelada'),
      defaultValue: 'pendente',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'activities',
  });

  Activity.associate = (models) => {
    Activity.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Activity;
};