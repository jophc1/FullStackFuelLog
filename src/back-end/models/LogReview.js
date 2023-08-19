import mongoose from "mongoose"

const logReviewSchema = mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  log_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Log'
  },
  date: {
    type: Date
  }
})

const LogReviewModel = mongoose.model('LogReview', logReviewSchema)

export default LogReviewModel
