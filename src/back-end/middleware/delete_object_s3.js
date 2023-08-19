import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3"
import VehicleModel from "../models/Vehicle.js"
import { createWriteStream } from "fs"

async function downloadInChunks ({ bucket, key }) {

}


async function deleteObjectS3ForUpdate (req, res, next) {
  try {
    const oldVehicleData = await VehicleModel.findById(req.params.id).exec()
    if (req.files.image || req.method == 'DELETE' ) {
      const client = new S3Client({
        region: process.env.AWS_REGION
      })
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${req.body.asset_id}.png`
      })
      await client.send(command)
    } else if ((req.method == 'PUT' && oldVehicleData.asset_id != req.body.asset_id)) {

      req.files.image
    }
    next()
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export {
  deleteObjectS3ForUpdate
}
