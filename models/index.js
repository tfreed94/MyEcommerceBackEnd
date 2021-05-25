// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');


Product.belongsTo(Category, { foreignKey: 'catagory_id' });
Category.hasMany(Product, { foreignKey: 'catagory_id' });

Product.belongsToMany(Tag, {
  through: {
    model: ProductTag, foreignKey: 'product_id'
  }
})

Tag.belongsToMany(Product, {
  through: {
    model: ProductTag, foreignKey: 'tag_id'
  }
})

module.exports={
  Product,
  Category,
  Tag,
  ProductTag,
};