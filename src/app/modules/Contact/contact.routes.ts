import { Router } from "express";
import { ContactMessageController } from "./contact.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { ContactMessageValidation } from "./contact.validation";

const router = Router();

router.get('/', ContactMessageController.getAllContactMessage);

router.post('/create-message', validateRequest(ContactMessageValidation.createContactontactMessageValidationSchema),
     ContactMessageController.createContactMessage);

export const ContactMessageRoutes = router;