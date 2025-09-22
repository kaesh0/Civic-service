import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

/**
 * AWS S3 service for file uploads and management
 */
class S3Service {
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
    this.bucketName = process.env.AWS_BUCKET_NAME;
  }

  /**
   * Upload a file to S3
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} originalName - Original filename
   * @param {string} mimeType - File MIME type
   * @param {string} folder - S3 folder path (optional)
   * @returns {Promise<string>} Public URL of uploaded file
   */
  async uploadFile(fileBuffer, originalName, mimeType, folder = 'reports') {
    try {
      // Generate unique filename
      const fileExtension = path.extname(originalName);
      const fileName = `${folder}/${uuidv4()}${fileExtension}`;

      // Upload parameters
      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
        ACL: 'public-read', // Make file publicly accessible
        CacheControl: 'max-age=31536000', // Cache for 1 year
      };

      // Upload to S3
      const command = new PutObjectCommand(uploadParams);
      await this.s3Client.send(command);

      // Return public URL
      const publicUrl = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      return publicUrl;

    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error('Failed to upload file to S3');
    }
  }

  /**
   * Delete a file from S3
   * @param {string} fileUrl - Public URL of the file to delete
   * @returns {Promise<void>}
   */
  async deleteFile(fileUrl) {
    try {
      // Extract key from URL
      const urlParts = fileUrl.split('/');
      const key = urlParts.slice(-2).join('/'); // Get folder/filename

      const deleteParams = {
        Bucket: this.bucketName,
        Key: key
      };

      const command = new DeleteObjectCommand(deleteParams);
      await this.s3Client.send(command);

    } catch (error) {
      console.error('S3 delete error:', error);
      throw new Error('Failed to delete file from S3');
    }
  }

  /**
   * Generate a pre-signed URL for direct upload (optional feature)
   * @param {string} fileName - Desired filename
   * @param {string} contentType - File content type
   * @param {number} expiresIn - URL expiration time in seconds
   * @returns {Promise<string>} Pre-signed URL
   */
  async generatePresignedUrl(fileName, contentType, expiresIn = 3600) {
    try {
      const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
      
      const key = `reports/${uuidv4()}-${fileName}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
        ACL: 'public-read'
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
      const publicUrl = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      return {
        uploadUrl: signedUrl,
        publicUrl: publicUrl
      };

    } catch (error) {
      console.error('Pre-signed URL generation error:', error);
      throw new Error('Failed to generate pre-signed URL');
    }
  }

  /**
   * Check if S3 service is properly configured
   * @returns {boolean} Configuration status
   */
  isConfigured() {
    return !!(
      process.env.AWS_BUCKET_NAME &&
      process.env.AWS_REGION &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY
    );
  }
}

// Create and export singleton instance
const s3Service = new S3Service();
export default s3Service;

/**
 * Middleware to check S3 configuration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export function requireS3Config(req, res, next) {
  if (!s3Service.isConfigured()) {
    return res.status(500).json({
      success: false,
      message: 'File upload service is not configured'
    });
  }
  next();
}