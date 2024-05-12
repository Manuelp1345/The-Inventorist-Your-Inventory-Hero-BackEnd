import { Response } from "express";
import { CustomRequest } from "../../utils/types";
import Joi from "joi";
import { Product } from "../../entities/product.entity";
import { User } from "../../entities/user.entity";

const productSchema = Joi.object({
  handle: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  sku: Joi.string().required(),
  grams: Joi.number().required(),
  stock: Joi.number().required(),
  price: Joi.number().required(),
  comparePrice: Joi.number().required(),
  barcode: Joi.string().required(),
});

const productsSchema = Joi.array().items(productSchema);

export const createProduct = async (req: CustomRequest, res: Response) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = req.user as User;

  const createProduct = Product.create({
    barcode: req.body.barcode,
    comparePrice: req.body.comparePrice,
    description: req.body.description,
    grams: req.body.grams,
    price: req.body.price,
    SKU: req.body.sku,
    stock: req.body.stock,
    title: req.body.title,
    handle: req.body.handle,
    user: {
      id: user.id,
    },
  });
  let response;
  try {
    response = await createProduct.save();
  } catch (error) {
    return res.status(500).send("Error creating product");
  }

  return res.send({
    ...response,
    user: user.username,
  });
};

export const getProductsBySearch = async (
  req: CustomRequest,
  res: Response
) => {
  const { search } = req.params;

  const products = await Product.find({
    where: search
      ? [
          { id: String(search), state: "active" },
          { title: String(search), state: "active" },
          { description: String(search), state: "active" },
          { handle: String(search), state: "active" },
          { barcode: String(search), state: "active" },
        ]
      : { state: "active" },
    relations: ["user"],
  });

  return res.send(products);
};

export const updateProduct = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = req.user as User;

  const product = await Product.findOne({
    where: { id },
  });

  if (!product) {
    return res.status(404).send("Product not found");
  }

  product.barcode = req.body.barcode;
  product.comparePrice = req.body.comparePrice;
  product.description = req.body.description;
  product.grams = req.body.grams;
  product.price = req.body.price;
  product.SKU = req.body.sku;
  product.stock = req.body.stock;
  product.title = req.body.title;
  product.handle = req.body.handle;

  let response;
  try {
    response = await product.save();
  } catch (error) {
    return res.status(500).send("Error updating product");
  }

  return res.send({
    ...response,
    user: user.username,
  });
};

export const deleteProduct = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;

  const product = await Product.findOne({
    where: { id },
  });

  if (!product) {
    return res.status(404).send("Product not found");
  }

  product.state = "inactive";

  let response;
  try {
    response = await product.save();
  } catch (error) {
    return res.status(500).send("Error deleting product");
  }

  return res.send({
    ...response,
    user: (req.user as User).username,
  });
};

export const createProducts = async (req: CustomRequest, res: Response) => {
  const { error } = productsSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = req.user as User;

  const products = req.body.map((product: any) => {
    return Product.create({
      barcode: product.barcode,
      comparePrice: product.comparePrice,
      description: product.description,
      grams: product.grams,
      price: product.price,
      SKU: product.sku,
      stock: product.stock,
      title: product.title,
      handle: product.handle,
      user: {
        id: user.id,
      },
    });
  });

  let response;
  try {
    response = await Product.save(products);
  } catch (error) {
    return res.status(500).send("Error creating products");
  }

  return res.send({
    ...response,
    user: user.username,
  });
};
