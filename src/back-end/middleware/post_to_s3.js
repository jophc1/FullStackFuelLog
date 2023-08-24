import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

async function postToS3 (req, res, next) {
  try {
    if (process.env.NODE_ENV === 'test'){ // this is for the testing routes so it skips middleware so it wont upload images on server during test, sorry if it breaks your stuff jordan
      req.testRoute = true
    }

    if (!req.testRoute && req.files.image) { // testRoute is for test routes so a image isnt created with a post vehicle, sorry jordan if this breaks your images
      let KEY
      req.method === 'POST' ? KEY = `${req.body.asset_id}.png` : KEY = `${req.params.asset_id}.png`

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
