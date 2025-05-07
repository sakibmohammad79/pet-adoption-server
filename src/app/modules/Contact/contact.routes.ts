import { Router } from "express";
import { ContactMessageController } from "./contact.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { ContactMessageValidation } from "./contact.validation";
import Guard from "../../middleware/guard";
import { UserRole } from "@prisma/client";

const router = Router();

router.get('/', Guard(UserRole.ADMIN),  ContactMessageController.getAllContactMessage);

router.post('/create-message', validateRequest(ContactMessageValidation.createContactontactMessageValidationSchema),
     ContactMessageController.createContactMessage);

router.delete('/delete-message/:id', Guard(UserRole.ADMIN),  ContactMessageController.deleteContactMessage);

export const ContactMessageRoutes = router;