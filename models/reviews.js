const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        comment:String,
        rating :{
            type:Number,
            min:1,
            max:5
        },
        created:{
            type: Date,
            default: Date.now()
        },
        
        author:{
            type : Schema.Types.ObjectId,
            ref:"User"
        }
    }
);

const Review = mongoose.model("Review" , reviewSchema);
module.exports = Review;





// <form action="/listings/<%=listing.id%>/reviews" 
// method="post"
// novalidate class="needs-validation" >

// <div class="mb-3 mt-3">
//     <label for="rating" class="form-label">Rating</label>
//     <input 
//     type="range" 
//      min="1"  
//      max="5" 
//      id="rating"
//       name="review[rating]"
//       required
//       >
// </div>
// <div class="mb-3 mt-3">
//     <label for="comment"class="form-label" >Comment</label>
//     <textarea 
//      class="form-control" 
//      name="review[comment]" 
//      id="comment" cols="30" 
//      rows="4"  required
//      >
//     </textarea>

//     <div class="invalid-feedback">Please comment some Reviews</div>
// </div>