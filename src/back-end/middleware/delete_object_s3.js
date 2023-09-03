import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'


// middleware for amazon s3 server to delete image
async function deleteObjectS3 (req, res, next) {
  try {
    if (process.env.NODE_ENV === 'test') { // this is for the testing routes so it skips middleware so it wont delete images on server
      req.testRoute = true
    }

    if (!req.testRoute) { // if not currenly testing a route then operate normally, otherwise go next, soz jordan if this destroys your stuff
      const client = new S3Client({
        region: process.env.AWS_REGION
      })
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${req.params.asset_id}.png`
      })
      await client.send(command)
    }
    next()
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export {
  deleteObjectS3
}
