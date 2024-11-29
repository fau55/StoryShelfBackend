import { Router } from "express";
import { getAllCart, removeCartItem, createCart, updateCart, deleteAll, addItem, getCartById } from '../controllers/cart.controller.js'

const router = Router();

router.route('/get-all').get(getAllCart);
router.route('/remove/item/by/:id/:itemId').get(removeCartItem);
router.route('/create').post(createCart);
router.route('/update/:id').put(updateCart);
router.route('/delete-all').delete(deleteAll);
router.route('/add/product/:id').post(addItem);
router.route('/get/by/:id').get(getCartById);


export default router;
