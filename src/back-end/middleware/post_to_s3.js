import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

async function postToS3 (req, res, next) {
  try {
    if (process.env.NODE_ENV === 'test') { // this is for the testing routes so it skips middleware so it wont upload images on server during test, sorry if it breaks your stuff jordan
      req.testRoute = true
    }

    let checkImage
    req.files ? checkImage = req.files.image : checkImage = ''

    if (!checkImage && req.method == 'POST') {
      req.key = 'no-image.png'
    }

    if (!req.testRoute && checkImage) { // testRoute is for test routes so a image isnt created with a post vehicle, sorry jordan if this breaks your images
      const KEY = `${req.body.asset_id}.png`

      req.key = KEY
      const client = new S3Client({
        region: process.env.AWS_REGION
      })
      // binary data base64
      const uploadedImg = Buffer.from(checkImage.data, 'binary')
      // create a new put object command
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: KEY,
        Body: uploadedImg,
        ContentType: 'image/png'
      })
      // upload file to bucket
      await client.send(command)
      req.key = KEY
    }
    next()
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export {
  postToS3
}
