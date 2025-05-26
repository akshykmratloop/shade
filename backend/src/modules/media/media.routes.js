import {Router} from "express";
import MediaController from "./media.controller.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import multer from "multer";
import mediaUploader from "../../helper/mediaUploader.js";
const router = Router();
const upload = multer({dest: "uploads/"}); // temporary folder

/**
 * @swagger
 * /media/upload:
 *   post:
 *     summary: Upload one or more media files
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               mediaFile:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: The files to upload
 *               mediaType:
 *                 type: string
 *                 description: Type of the media (e.g., "IMAGE", "VIDEO")
 *                 example: IMAGE
 *               resourceId:
 *                 type: string
 *                 description: ID of the resource this media is associated with
 *                 format: uuid
 *                 example: cm9tq9nco006jlqn53x2idm3we
 *             required:
 *               - mediaFile
 *               - mediaType
 *               - resourceId
 *     responses:
 *       200:
 *         description: Media uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Media uploaded successfully
 *                 media:
 *                   type: array
 *                   description: Array of uploaded media details
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: de7552f9-275c-44e6-9edf-a13070345850
 *                       url:
 *                         type: string
 *                         example: image_1747633611188
 *                       publicId:
 *                         type: string
 *                         example: image_1747633611188
 *                       type:
 *                         type: string
 *                         example: IMAGE
 *                       width:
 *                         type: integer
 *                         example: 100
 *                       height:
 *                         type: integer
 *                         example: 100
 *                       altText:
 *                         type: string
 *                         example: image_1747633611188
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-05-19T05:46:52.417Z
 *                       resourceId:
 *                         type: string
 *                         format: uuid
 *                         example: cm9tq9nco006jlqn53x2idm3we
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */

router.post(
  "/upload",
  upload.array("mediaFile"), // Changed from 'images' to 'mediaFile' to match Postman
  mediaUploader,
  tryCatchWrap(MediaController.UploadMedia)
);

/**
 * @swagger
 * /media/getMedia:
 *   get:
 *     summary: Retrieve media items with optional filters and pagination
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: resourceId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by the associated resource ID
 *       - in: query
 *         name: mediaType
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by media type (e.g., "image", "video")
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Text to search within media metadata
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Media fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Media fetched successfully
 *                 media:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: de7552f9-275c-44e6-9edf-a13070345850
 *                       url:
 *                         type: string
 *                         example: image_1747633611188
 *                       publicId:
 *                         type: string
 *                         example: image_1747633611188
 *                       type:
 *                         type: string
 *                         example: IMAGE
 *                       width:
 *                         type: integer
 *                         example: 100
 *                       height:
 *                         type: integer
 *                         example: 100
 *                       altText:
 *                         type: string
 *                         example: image_1747633611188
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-05-19T05:46:52.417Z
 *                       resourceId:
 *                         type: string
 *                         example: cm9tq9nco006jlqn53x2idm3we
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */

router.get("/getMedia", tryCatchWrap(MediaController.GetMedia));

/**
 * @swagger
 * /media/delete/{id}:
 *   delete:
 *     summary: Delete a media item by ID
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the media item to delete
 *     responses:
 *       200:
 *         description: Media deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Media deleted successfully
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Media not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Media not found
 */

router.delete("/delete/:id", tryCatchWrap(MediaController.DeleteMedia));

export default router;
