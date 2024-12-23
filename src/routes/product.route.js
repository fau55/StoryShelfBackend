import { Router } from "express";
import { getAllProduct, deleteAllProduct, getProductById, addProduct, deleteProductbyId} from '../controllers/product.controller.js';

const router = Router();

router.route('/get-all').get(getAllProduct);
router.route('/delete-all').get(deleteAllProduct);
router.route('/get/by/:id').get(getProductById);
router.route('/create').post(addProduct);
router.route('/delete/by/:id').delete(deleteProductbyId);

export default router;
