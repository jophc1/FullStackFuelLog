import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3"

async function deleteObjectS3ForUpdate (req, res, next) {
  try {
    if (req.files.image || req.method == 'DELETE' ) {
      const client = new S3Client({
        region: process.env.AWS_REGION
      })
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${req.body.asset_id}.png`
      })
      await client.send(command)
    }
    next()
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export {
  deleteObjectS3ForUpdate
}
