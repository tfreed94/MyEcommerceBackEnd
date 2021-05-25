const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', (req, res) => {

  Product.findAll(
    {
      include: [
        {
          model: Category,
          attributes: ['category_name']
        },

        {
          model: Tag,
          attributes: ['tag_name']
        }
      ]
    }
  )

    .then(productData => res.json(productData))
    .catch(err => {
      res.status(500).json(err);
    });

});


router.get('/:id', (req, res) => {

  Product.findOne({
    where: {
      id: req.params.id
    },

    include: [{
      model: Category,
      attributes: ['category_name']
    },

    {
      model: Tag,
      attributes: ['tag_name']
    }
    ]
  })

    .then(productData => res.json(productData))
    .catch(err => {
      res.status(500).json(err);
    });

});


router.post('/', (req, res) => {
  Product.create(req.body)

    .then((product) => {
      if (req.body.tagIds.length) {
        const prodTagID = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };

        });

        return ProductTag.bulkCreate(prodTagID);
      }

      res.status(200).json(product);
    })

    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      res.status(400).json(err);
    });

});

router.put('/:id', (req, res) => {

  Product.update(req.body, {
    where: {
      id: req.params.id,
    },

  })
    .then((product) => {
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })

    .then((productTags) => {
      const prodTagIDs = productTags.map(({ tag_id }) => tag_id);
      const newprodTags = req.body.tagIds
        .filter((tag_id) => !prodTagIDs.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };

        });

      const prodTagsToRemove = prodTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);


      return Promise.all([
        ProductTag.destroy({ where: { id: prodTagsToRemove } }),
        ProductTag.bulkCreate(newprodTags),
      ]);

    })
    .then((updatedprodTags) => res.json(updatedprodTags))

    .catch((err) => {
      res.status(400).json(err);
    });

});

router.delete('/:id', (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id
    }
  })

    .then(productData => {
      if (!productData) {
        res.status(404).json({ message: 'No Product matching that ID.' });
        return;
      }

      res.json(productData);
    })

    .catch(err => {
      res.status(500).json(err);
    });

});

module.exports = router;