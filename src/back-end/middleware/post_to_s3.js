import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

async function postToS3 (req, res, next) {
  try {
    if (req.files.image) {
      let KEY
      req.method == 'POST' ? KEY = `${req.body.asset_id}.png` : KEY = `${req.params.asset_id}.png`
      
      const client = new S3Client({
        region: process.env.AWS_REGION
      })
      // binary data base64
      const uploadedImg = Buffer.from(req.files.image.data, 'binary')
      // create a new put object command
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: KEY,  
        Body: uploadedImg,
        ContentType: 'image/png'
      })
      // upload file to bucket
      await client.send(command)
    }
    next()
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export {
  postToS3
}