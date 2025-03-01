import { pinata } from "../utils/pinata";



/**
 * @route POST /upload
 * @description Upload image to ipfs and return the image link.
 * @param {file} file - file to upload.
 * @returns {Object} JSON response with success boolean, image link .
 */
export const uploadSingleFileToIPFS = async (req: any, res: any) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const file = new File(
            [req.file.buffer],
            req.file.originalname,
            { type: req.file.mimetype }
        );

        const upload_result = await pinata.upload.file(file);

        return res.json({
            success: true,
            image_link: `https://gateway.pinata.cloud/ipfs/${upload_result.IpfsHash}`

        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            error: 'Error uploading to IPFS',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

/**
 * @route GET /ipfs/:hash
 * @description Retrieves Market metadata from Pinata using the provided IPFS hash.
 * @param {string} hash - Express request object containing the IPFS hash as a URL parameter.
 * @returns {Object} JSON response containing Market metadata.
 */
export const getIPFSData =  async (req: any, res: any) => {
    try {
      const { hash } = req.params;
      console.log("hash", hash);
      console.log("typeof hash", typeof(hash));
      
      
      const file_response = await pinata.gateways.get(hash);

      // fileResponse.data may be a string or object
      const data =
        typeof file_response.data === "string"
          ? JSON.parse(file_response.data)
          : file_response.data;
  
      return res.json({ success: true, data });
    } catch (error: any) {
      console.error("Error retrieving IPFS data:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }


  